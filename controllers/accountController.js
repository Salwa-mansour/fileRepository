// controllers/accountController.js
const path = require('path');
const db = require('../data/queries'); // <- uses findByEmail, findUserById, comparePassword, createUser
const { file } = require('../data/pool');

// get home page
exports.getHome = async (req, res) => {
console.log("is authenated:",req.isAuthenticated());
  const folders = req.isAuthenticated() ? await db.getAllFolders():await db.getPublicFolders();
  const files =req.isAuthenticated() ? await db.getRootFiles(): await db.getPublicRootFiles();
console.log("folders:",folders);
  res.render('index',{
    folders: folders || [],
    files:files || []
  });
}
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
    res.redirect('/');
  });
};

// GET /dashboard
exports.dashboardGet =async (req, res) => {
     try {
    const userId = req.user.id;
    const folders = await db.getFoldersByUserId(userId);
    const files = await db.rootFilesByUserId(userId);
   
     res.render('account/dashboard', {
      user: req.user,
      folders: folders,
      files:files
    });
   } catch (error) {
      return next(err); 
   }
  
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