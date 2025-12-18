const multer = require('multer');
const path = require('path');
const fs = require('fs'); // Import the file system module

// Define the absolute path to the uploads folder
// process.cwd() ensures we get the project root, regardless of where the script is run from
const uploadDir = path.join(process.cwd(), 'public/uploads');

// Ensure the directory exists before configuring storage
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true }); // 'recursive: true' creates parent folders if needed
    console.log(`Created uploads directory at ${uploadDir}`);
}

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
  const allowedMimes = ['image/jpeg', 'image/png', 'image/gif','images/svg+xml','video/mp4','audio/mp3',
                        'application/msword', // .doc
                        'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
                        'text/plain', // .txt, .md, etc.
                        'text/markdown', // Specific MIME for .md
                        'text/x-markdown',
                        'text/pdf'
                    ];
  const allowedExts = ['.jpg', '.jpeg', '.png', '.gif','.doc','.docx','.txt','.md','.pdf','.mp4','.mp3'];

  const mimeTypeIsValid = allowedMimes.includes(file.mimetype);
  const extensionIsValid = allowedExts.includes(path.extname(file.originalname).toLowerCase());

  if (mimeTypeIsValid && extensionIsValid) {
    // Accept the file
    cb(null, true);
  } else {
    // Reject the file and provide a clear error message
    cb(new Error('Invalid file type.'), false);
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

// --- Exported Helper Middleware Function (fileUpload) ---
exports.fileUpload = function(req, res, next) {
    upload.single('file')(req, res, function (err) {
        if (err) {
            // Error handling logic: set flash message and redirect immediately
            let errorMessage = 'An error occurred during upload.';
             if (err instanceof multer.MulterError) { 
                if (err.code === 'LIMIT_FILE_SIZE') {
                    errorMessage = 'File size limit exceeded. Max size is 1MB.'; // <--- Specific message here
                } else {
                    // Catches other Multer errors if any
                    errorMessage = err.message; 
                }
            } 
            else if (err) { 
                // This catches the 'Invalid file type.' message from the fileFilter
                errorMessage = err.message; 
            }


            req.flash('error',{ msg:  errorMessage});
            req.flash('oldInput', req.body); 

            return res.redirect('/file/create'); // Stops the chain here
        }

        // // Success Path: Prepare data for the controller and call next()
         if (req.file) {
       
            next(); // Passes control to the next function in the router chain
        } else {
             req.flash('error',{ msg:  'No file was provided.'});
               req.flash('oldInput', req.body); 
             return res.redirect('/file/create');
        }
    });
};

