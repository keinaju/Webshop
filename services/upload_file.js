const multer = require('multer');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, process.env.PUBLIC_DIRECTORY_PATH);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload_file = multer({
    storage: storage,
    limits: { fileSize: 1_000_000 }, //Limit files to 1MB,
    fileFilter: (req, file, cb) => {
        if (file.mimetype.match(/^image/)) cb(null, true);
        else cb(new Error('File type not valid.'));
    }
});

module.exports = upload_file;