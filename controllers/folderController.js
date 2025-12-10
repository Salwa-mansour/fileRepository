const path = require('path');
const db = require('../data/queries'); 


 // get all public folders
 exports.getPublicFolders = async () => {
   try {
    const folders = await db.getPublicFolders();
    return folders;
   }catch (error) {
      return next(err); 
   }
}
// get all folders 
exports.getAllFolders = async () => {
  try {
   const folders = await db.getAllFolders();        
    return folders;
   } catch (error) {
      return next(err); 
   } 
}   
// GET /create folder
exports.createFolderGet = (req, res) => {
  res.render(path.join('folder', 'create'), {
    errors: req.flash('error') || [],
    oldInput: req.body || {},
  });
};
// POST /create folder
exports.createFolder = async (req, res, next) => {
   const newFolder ={folderName:req.body.folderName,
                     ispublic:req.body.isPublic,
                     userId:req.user.id};
  
    try {
      // use queries.js
      const existingFolder = await db.findFolderByName(newFolder.folderName);
  
      if (existingFolder) {
        req.flash('error', 'folder name is repeated');
        return res.redirect('/folder/create');
      }
    } catch (err) {
    return next(err); 
     }
  
      // create user via queries.js (you implement createUser there)
    const folder = await db.createFolder(newFolder);
     req.flash('info', `folder ${folder.foldername} is created successfully`);
    return res.redirect('/dashboard');
  
  }
// GET /folder/:id details
exports.folderDetailsGet = async (req, res, next) => {
   try { 
      const folderId = req.params.id;
      const folder = await db.getFolderById(folderId);
      const files = await db.getFilesByFolderId(folderId);
      res.render(path.join('folder', 'details'), {
        folder: folder,
        files: files
      });
    }catch (error) {
      return next(err); 
   } 
   }