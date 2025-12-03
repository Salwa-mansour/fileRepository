// controllers/accountController.js
const path = require('path');
const db = require('../data/queries'); // <- uses findByEmail, findUserById, comparePassword, createUser

// GET /signup
exports.signupGet = (req, res) => {
  const [oldInput] = req.flash('oldInput');
  const [validationErrorsRaw] = req.flash('validationErrors');
  const validationErrors = validationErrorsRaw ? JSON.parse(validationErrorsRaw) : [];

  const flashedErrors = req.flash('error') || [];
  const errors = [...flashedErrors, ...validationErrors];

  res.render(path.join('account', 'signup'), {
    errors,
    oldInput: oldInput || {},
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
      req.flash('oldInput', { userName, email });
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
  const [oldInput] = req.flash('oldInput');
  const [validationErrorsRaw] = req.flash('validationErrors');
  const validationErrors = validationErrorsRaw ? JSON.parse(validationErrorsRaw) : [];

  const flashedErrors = req.flash('error') || [];
  const errors = [...flashedErrors, ...validationErrors];

  const email =
    (oldInput && oldInput.email) ||
    req.flash('oldEmail')[0] ||
    '';

  res.render(path.join('account', 'signin'), {
    errors,
    oldInput: { email },
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
  res.render(path.join('account', 'dashboard'), {
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