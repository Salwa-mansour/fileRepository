const express = require('express');

const accountRouter = express.Router();

const accountController = require('../controllers/accountController');
const validationMiddleware = require('../middleware/validation');
const auth = require('../middleware/auth');

accountRouter.route('/signup')
  .get(accountController.signupGet)
  .post(
    validationMiddleware.signupValidation,
    validationMiddleware.handleValidationSignupErrors,
    accountController.signupAccount,
  );

accountRouter.route('/signin')
  .get(accountController.signinGet)
  .post(
    validationMiddleware.signInValidation,
    validationMiddleware.handleValidationSignInErrors,
    auth.login,
    (req, res) => res.redirect('/dashboard'),
  );

accountRouter.post('/logout', accountController.logout);

accountRouter.get('/dashboard', auth.ensureAuthenticated, accountController.dashboardGet);

accountRouter.post('/setMember', auth.ensureAuthenticated, accountController.setMember);

module.exports = accountRouter;