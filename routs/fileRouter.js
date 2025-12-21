const express = require('express');
const path = require('path');

const fileRouter = express.Router();

const fileController = require(path.resolve('controllers', 'fileController'));

const auth = require(path.resolve('middleware', 'auth'));
const upload = require('../middleware/multerConfig'); // Multer configuration for file uploads

fileRouter.route('/create')
  .get(auth.ensureAuthenticated,fileController.createfileGet)
  .post(upload.fileUpload, fileController.saveFileData); 

fileRouter.route('/:id').get(fileController.getFileDetails);


module.exports = fileRouter;