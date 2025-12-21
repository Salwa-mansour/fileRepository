const path = require('path');
const db = require('../data/queries'); 


// GET /create file
exports.createfileGet =async (req, res) => {
    const allFolders = await db.getFoldersByUserId(req.user.id);
    const currentFoldeId = req.query.folder;

 const data = {
    errors: req.flash('error') || [],
    oldInput: req.body || {},
    folders: allFolders,
    folderId: currentFoldeId
  }
 
  res.render(path.join('file', 'create'), data);
};

// POST /create file
exports.saveFileData =async (req, res) => {
    // Prepare file data for database insertion
  const adjustedFilePath = req.file.path.replace(/^public[\\\/]/, '/') // Remove 'public/' or 'public\' at start
                                        .replace(/\\/g, '/');         // Convert any remaining '\' to '/',  
    const fileDataForDb = {
        fileName: req.body.fileName,
        path: adjustedFilePath,       // From middleware filename function
        mimetype: req.file.mimetype,              // From req.file object
        extension: path.extname(req.file.originalname).toLowerCase(), // Using path module here
        ispublic: req.body.ispublic === "on" ?  true : false,
        folderId: req.body.folderId,
        userId: req.user.id  
                          // From req.file object
    };
  console.log('Received file data:', fileDataForDb);
    // **YOUR DATABASE LOGIC GOES HERE:**
    try {
        const newFile =await db.saveFileMetadata(fileDataForDb); // Hypothetical function
        console.log('Saving to DB:', newFile.fileName);
        // Set success flash message and redirect
        req.flash('success_msg', `Successfully processed and saved metadata for ${fileDataForDb.fileName}.`);
        res.redirect('/dashboard');
    } catch (error) {
      console.log( error);
        req.flash('error', 'An error occurred while saving file metadata.');
        res.redirect('/file/create');
    }
 
};
// GET /file/:id
exports.getFileDetails = async (req, res) => {
    const fileId = req.params.id;
    try {
        const file = await db.getFileById(fileId) || {};
        res.render(path.join('file', 'details'),
         { file });

      } catch (error) {
        console.log(error);
        req.flash('error', 'An error occurred while retrieving file details.');
        return res.redirect('/dashboard');
    }
   
}