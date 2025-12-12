const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads/'); 
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const fileExtension = path.extname(file.originalname);
    const fileName = path.parse(file.originalname).name;
    cb(null, fileName + '_' + uniqueSuffix + fileExtension);
  }
});

// Define the file filter function
const fileFilter = (req, file, cb) => {
  // Check both the MIME type (from the browser) and the extension (for a secondary check)
  const allowedMimes = ['image/jpeg', 'image/png', 'image/gif','images/svg+xml','video/mp4',
                        'application/msword', // .doc
                        'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
                        'text/plain', // .txt, .md, etc.
                        'text/markdown', // Specific MIME for .md
                        'text/x-markdown',
                        'text/pdf'
                    ];
  const allowedExts = ['.jpg', '.jpeg', '.png', '.gif','.doc','.docx','.txt','.md','.pdf','.mp4'];

  const mimeTypeIsValid = allowedMimes.includes(file.mimetype);
  const extensionIsValid = allowedExts.includes(path.extname(file.originalname).toLowerCase());

  if (mimeTypeIsValid && extensionIsValid) {
    // Accept the file
    cb(null, true);
  } else {
    // Reject the file and provide a clear error message
    cb(new Error('Invalid file type. Only images (JPG, PNG, GIF) are allowed.'), false);
  }
};

// Configure Multer with storage, limits, and the file filter
const upload = multer({
  storage: storage,
  limits: { 
    fileSize: 1 * 1024 * 1024 // 1 MB
  },
  fileFilter: fileFilter
});

// Export the middleware functions
module.exports = upload;
