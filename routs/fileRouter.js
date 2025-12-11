const express = require('express');
const path = require('path');

const fileRouter = express.Router();

const fileController = require(path.resolve('controllers', 'fileController'));

const auth = require(path.resolve('middleware', 'auth'));
const multer  = require('multer')
const upload = multer({ dest: 'uploads/' })

fileRouter.route('/create')
  .get(auth.ensureAuthenticated,fileController.createfileGet)
  .post(upload.single('file'),fileController.createfile);

//fileRouter.route('/:id').get(auth.ensureAuthenticated, fileController.fileDetailsGet);


module.exports = fileRouter;