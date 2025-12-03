const { body, validationResult } = require("express-validator");


// Creates a basic validation chain for a required string field.
const createRequiredStringValidation = (fieldName, message) => [
  body(fieldName)
    .isLength({ min: 3 })
    .withMessage(message || `${fieldName}  must be at least 3 characters long.`)
    .trim()
];

const passwordValidationChain =  [
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long.')
    .matches('[a-z]')
    .withMessage('Password must contain at least one lowercase letter.')
];
const confirmPassword = [
    body('confirmPassword')
    .custom((value, { req }) => {
      if (value !== req.body.password) {
     
        throw new Error('Password confirmation does not match password.');
      }
      return true;
    })
  ];

// Helper to handle validation errors with redirect-after-POST (PRG pattern).
const handleValidationErrorsWithRedirect = (viewPath) => (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    req.flash('validationErrors', JSON.stringify(errors.array()));
    req.flash('oldInput', req.body);
    return res.redirect(viewPath);
  }
  return next();
};

// Creates a validation chain for signup, including multiple fields.
const signupValidation = [
  ...createRequiredStringValidation('userName', 'user name is required'),
  ...createRequiredStringValidation('email', 'email is required'),
  body('email').isEmail().withMessage('Invalid email format'),
  ...passwordValidationChain,
  ...confirmPassword
];

const handleValidationSignupErrors = handleValidationErrorsWithRedirect('/signup');

const signInValidation = [
  ...createRequiredStringValidation('email', 'email is required'),
  body('email').isEmail().withMessage('Invalid email format'),
  ...createRequiredStringValidation('password', 'password is required'),
];

const handleValidationSignInErrors = handleValidationErrorsWithRedirect('/signin');

module.exports = {
  signupValidation,
  handleValidationSignupErrors,
  signInValidation,
  handleValidationSignInErrors,
};