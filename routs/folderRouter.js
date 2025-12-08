const express = require('express');
const path = require('path');

const folderRouter = express.Router();

const folderController = require(path.resolve('controllers', 'folderController'));
//const validationMiddleware = require(path.resolve('middleware', 'validation'));
const auth = require(path.resolve('middleware', 'auth'));

folderRouter.route('/create')
  .get(auth.ensureAuthenticated,folderController.createFolderGet)
  .post(folderController.createFolder);
 // .post( folderController.signupfolder,);
folderRouter.route('/:id').get(auth.ensureAuthenticated, folderController.folderDetailsGet);


//folderRouter.post('/setMember', auth.ensureAuthenticated, folderController.setMember);

module.exports = folderRouter;