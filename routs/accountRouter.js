const express = require('express');
const path = require('path');

const accountRouter = express.Router();

const accountController = require(path.resolve('controllers', 'accountController'));
const validationMiddleware = require(path.resolve('middleware', 'validation'));
const auth = require(path.resolve('middleware', 'auth'));

accountRouter.get('/', (req, res) => {
  accountController.getHome(req, res);
});
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