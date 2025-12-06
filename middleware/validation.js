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

// Creates a validation chain for a new author, including multiple fields.
const signupValidation = [
  ...createRequiredStringValidation('userName', 'user name is required'),
  ...createRequiredStringValidation('email', ' email is required'),
  body('email').isEmail().withMessage('Invalid email format'),
  ...passwordValidationChain,
  ...confirmPassword
];

const handleValidationSignupErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.render('account/signup', {           // ← fix
      errors: errors.array(),
      oldInput: req.body,                           // ← match what views expect
    });
  }
  return next();
};

const signInValidation = [
  ...createRequiredStringValidation('email', ' email is required'),
      body('email').isEmail().withMessage('Invalid email format'),
  ...createRequiredStringValidation('password', 'password is required'),
];
const handleValidationSignInErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.render('account/signin', {           // ← fix
      errors: errors.array(),
      oldInput: req.body,                           // ← match what views expect
    });
  }
  return next();
};
  module.exports = {
    signupValidation,
    handleValidationSignupErrors,
    signInValidation,
    handleValidationSignInErrors
}