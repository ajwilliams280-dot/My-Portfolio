const fs = require('fs');
const path = require('path');

const dbFile = 'src/data/localDatabase.ts';
let content = fs.readFileSync(dbFile, 'utf8');

const baseDir = path.join(__dirname, 'public', 'images', 'photo-categories');
const folders = fs.readdirSync(baseDir);

folders.forEach(folder => {
  const folderPath = path.join(baseDir, folder);
  if (fs.statSync(folderPath).isDirectory()) {
    const files = fs.readdirSync(folderPath);
    files.forEach(file => {
      // Escape dots in filename for regex
      const escapedFile = file.replace(/\./g, '\\.');
      
      // Replace mediaUrl
      const mediaRegex = new RegExp(`mediaUrl:\\s*["']/[^"']*/${escapedFile}["']`, 'g');
      content = content.replace(mediaRegex, `mediaUrl: "/images/photo-categories/${folder}/${file}"`);

      // Replace thumbnailUrl
      const thumbRegex = new RegExp(`thumbnailUrl:\\s*["']/[^"']*/${escapedFile}["']`, 'g');
      content = content.replace(thumbRegex, `thumbnailUrl: "/images/photo-categories/${folder}/${file}"`);
      
      // Update the main category image if it uses it
      const categoryRegex = new RegExp(`image:\\s*["']/[^"']*/${escapedFile}["']`, 'g');
      content = content.replace(categoryRegex, `image: "/images/photo-categories/${folder}/${file}"`);
    });
  }
});

fs.writeFileSync(dbFile, content, 'utf8');
console.log('Database URLs synced with folders.');
