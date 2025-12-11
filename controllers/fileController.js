const path = require('path');
const db = require('../data/queries'); 


// GET /create file
exports.createfileGet =async (req, res) => {
    const allFolders = await db.getAllFolders();
    const currentFoldeId = req.query.folder;

  res.render(path.join('file', 'create'), {
    errors: req.flash('error') || [],
    oldInput: req.body || {},
    folders: allFolders,
    folderId: currentFoldeId
  });
};

// POST /create file
exports.createfile = async (req, res, next) => {
}