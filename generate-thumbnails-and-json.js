const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// Paths
const imagesDir = path.join(__dirname, 'images');
const thumbnailsDir = path.join(__dirname, 'thumbnails');
const outputFile = path.join(__dirname, 'images.json');

// Ensure the thumbnails directory exists
if (!fs.existsSync(thumbnailsDir)) {
  fs.mkdirSync(thumbnailsDir);
}

// Generate thumbnails and images.json
fs.readdir(imagesDir, async (err, files) => {
  if (err) throw err;

  const imageList = [];

  for (const file of files) {
    if (/\.(jpg|jpeg|png|gif)$/i.test(file)) {
      const fullImagePath = path.join(imagesDir, file);
      const thumbnailPath = path.join(thumbnailsDir, file);

      // Get image dimensions
      const metadata = await sharp(fullImagePath).metadata();
      const dataSize = `${metadata.width}x${metadata.height}`;

      // Generate thumbnail if it doesn't exist
      if (!fs.existsSync(thumbnailPath)) {
        await sharp(fullImagePath)
          .resize(300) // Set thumbnail width; adjust as needed
          .toFile(thumbnailPath);
      }

      // Add image entry to the list
      imageList.push({
        src: `images/${file}`,
        thumbnail: `thumbnails/${file}`,
        size: dataSize // Add the dimensions here
      });
    }
  }

  // Write the images.json file
  fs.writeFileSync(outputFile, JSON.stringify(imageList, null, 2));
  console.log('Thumbnails created and images.json file generated successfully.');
});
