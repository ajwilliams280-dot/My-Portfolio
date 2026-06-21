const fs = require('fs');
const path = require('path');

const brainDir = "C:\\Users\\willi\\.gemini\\antigravity\\brain\\30ba125e-c62b-4839-9496-5721aa5b8b3d";
const publicImagesDir = path.join(__dirname, '..', 'public', 'images', 'uploaded_covers');

if (!fs.existsSync(publicImagesDir)) {
  fs.mkdirSync(publicImagesDir, { recursive: true });
}

const files = fs.readdirSync(brainDir)
  .filter(f => f.startsWith('media__') && f.endsWith('.jpg'))
  .map(f => ({ name: f, time: fs.statSync(path.join(brainDir, f)).mtime.getTime() }))
  .sort((a, b) => b.time - a.time)
  .slice(0, 4);

const newImages = [];
files.forEach((f, i) => {
  const src = path.join(brainDir, f.name);
  const dst = path.join(publicImagesDir, `cover_${i + 1}.jpg`);
  fs.copyFileSync(src, dst);
  newImages.push(`/images/uploaded_covers/cover_${i + 1}.jpg`);
});

console.log('Copied images:', newImages);

function updateFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let index = 0;
  content = content.replace(/image:\s*['"][^'"]+['"]/g, () => {
    const img = newImages[index % newImages.length];
    index++;
    return `image: '${img}'`;
  });
  fs.writeFileSync(filePath, content);
}

updateFile(path.join(__dirname, '..', 'src', 'data', 'musicCategories.ts'));
updateFile(path.join(__dirname, '..', 'src', 'data', 'softwareCategories.ts'));

console.log('Updated categories with new covers.');
