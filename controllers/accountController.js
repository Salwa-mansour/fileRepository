// controllers/accountController.js
const path = require('path');
const db = require('../data/queries'); // <- uses findByEmail, findUserById, comparePassword, createUser

// GET /signup
exports.signupGet = (req, res) => {
  res.render(path.join('account', 'signup'), {
    errors: req.flash('error') || [],
    oldInput: req.body || {},
  });
};

// POST /signup
exports.signupAccount = async (req, res, next) => {
  const { userName, email, password } = req.body;

  try {
    // use queries.js
    const existingUser = await db.findByEmail(email);

    if (existingUser) {
      req.flash('error', 'Email is already registered');
      return res.redirect('/signup');
    }

    // create user via queries.js (you implement createUser there)
    const user = await db.createUser({ userName, email, password });

    req.login(user, (err) => {
      if (err) return next(err);
      return res.redirect('/dashboard');
    });
  } catch (err) {
    return next(err);
  }
};

// GET /signin
exports.signinGet = (req, res) => {
    res.render(path.join('account', 'signin'), {
      errors: req.flash('error') || [],
      oldInput: { email: req.flash('oldEmail')[0] || '' },
    });
  };

// GET /account/logout
exports.logout = (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    res.redirect('/signin');
  });
};

// GET /dashboard
exports.dashboardGet = (req, res) => {
  res.render('account/dashboard', {
    user: req.user,
  });
};

// POST /account/setMember
exports.setMember = async (req, res, next) => {
  try {
    // for now, just redirect; you can add a db.setMember(userId) in queries.js later
    res.redirect('/dashboard');
  } catch (err) {
    next(err);
  }
};