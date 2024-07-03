const fs = require('fs');
const path = require('path');
const directory_path = path.join(__dirname, '../public');

module.exports = function create_images_directory() {
    // Check if the directory exists
    if (!fs.existsSync(directory_path)) {
        // If it doesn't exist, create /public and /public/images
        fs.mkdirSync(directory_path);
        fs.mkdirSync(directory_path + '/images');
    }
}