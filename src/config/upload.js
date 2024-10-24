const multer = require('multer');
const fs = require('fs'); // Import fs để sử dụng các chức năng liên quan đến file hệ thống

function createUploader(destinationPath) {
    if (!fs.existsSync(destinationPath)) {
        fs.mkdirSync(destinationPath, { recursive: true });
    }

    const storage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, destinationPath);
        },
        filename: (req, file, cb) => {
            cb(null, file.originalname); 
        }
    });

    return multer({ storage: storage });
}

module.exports = createUploader;
