const LocalStrategy = require('passport-local').Strategy;
const db = require('../data/queries');


module.exports = function(passport) {
  // Local strategy for handling username/password login 
  passport.use(new LocalStrategy({ usernameField: 'email'  }
    , async (email, password, done) => {
    try {
      const user = await db.findByEmail(email);
   
      if (!user) {
      
         // Just return the result via done(). Do not use req.flash() here.
        return done(null, false, { message: 'Incorrect email ' });
      }
      const isMatch = await db.comparePassword(password, user.password);
      if (!isMatch) {
        return done(null, false, { message: 'Incorrect password.' });
      }
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }));

  // Store user ID in the session
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  // Retrieve user object from the session using the ID
passport.deserializeUser(async (id, done) => {
  try {
    // Assume you have a function to find a user by their ID in your database
    const user = await db.findUserById(id); // Your DB function should return null/undefined if not found

    if (user) {
      // User found, proceed with the session
      return done(null, user);
    } else {
      // !!! IMPORTANT !!!
      // User not found in DB (because they were deleted).
      // Pass 'false' to 'done' to invalidate the current session gracefully.
      return done(null, false); 
    }
    
  } catch (err) {
    // Handle any database connectivity errors
    return done(err);
  }
});
};
