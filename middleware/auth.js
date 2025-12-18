const passport = require('passport');
/**
 * Creates a login middleware for Passport.js
 * @param {string} strategy - The Passport strategy to use (e.g., 'local')
 */
// middleware/auth.js
function createLoginMiddleware(strategy) {
  return (req, res, next) => {
    passport.authenticate(strategy, (err, user, info) => {
      if (err) return next(err);
      if (!user) {
        req.flash('error',{ msg:  info.message});
        req.flash('oldEmail', req.body.email);
        return res.redirect('/signin'); // ← fix
      }
      req.logIn(user, (err) => {
        if (err) return next(err);
        return next();
      });
    })(req, res, next);
  };
}

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) return next();
  req.flash('error', { msg: 'Please log in to view this resource.'});
  res.redirect('/signin'); // ← fix
}
module.exports = {
  login: createLoginMiddleware('local'),
  ensureAuthenticated
};