const express = require('express');
const path = require('path');

const folderRouter = express.Router();

const folderController = require(path.resolve('controllers', 'folderController'));

const auth = require(path.resolve('middleware', 'auth'));

folderRouter.route('/create')
  .get(auth.ensureAuthenticated,folderController.createFolderGet)
  .post(folderController.createFolder);

folderRouter.route('/:id').get(auth.ensureAuthenticated, folderController.folderDetailsGet);


module.exports = folderRouter;