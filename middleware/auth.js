const passport = require('passport');

/**
 * Creates a login middleware for Passport.js
 * @param {string} strategy - The Passport strategy to use (e.g., 'local')
 */
function createLoginMiddleware(strategy) {
  return (req, res, next) => {
    passport.authenticate(strategy, (err, user, info) => {
      if (err) return next(err);
      if (!user) {
        req.flash('error', info?.message || 'Invalid credentials');
        req.flash('oldEmail', req.body.email);
        return res.redirect('/signin');
      }
      req.logIn(user, (err) => {
        if (err) return next(err);
        next();
      });
    })(req, res, next);
  };
}

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) return next();
  req.flash('error', 'Please log in to view this resource.');
  res.redirect('/signin');
}

module.exports = {
  login: createLoginMiddleware('local'),
  ensureAuthenticated,
};