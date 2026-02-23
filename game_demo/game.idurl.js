const fs = require('fs');
const path = require('path');


function getImageUrlById(imageId) {
    const exts = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
    const publicDir = path.join(__dirname, '../src/public/images');
    for (const ext of exts) {
        const filePath = path.join(publicDir, `${imageId}.${ext}`);
        if (fs.existsSync(filePath)) {
            return `/public/images/${imageId}.${ext}`;
        }
    }
    return null; 
}

module.exports = { getImageUrlById };
