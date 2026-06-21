const fs = require('fs');
const path = require('path');

const basePath = path.join(__dirname, '..', 'public', 'images', 'photo-categories');
const fileMap = {};

function walk(dir) {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir);
  for (const f of files) {
    const full = path.join(dir, f);
    if (fs.statSync(full).isDirectory()) {
      walk(full);
    } else {
      let relativePath = full.replace(path.join(__dirname, '..', 'public'), '');
      relativePath = relativePath.replace(/\\/g, '/');
      fileMap[f] = relativePath;
    }
  }
}

walk(basePath);

let db = fs.readFileSync(path.join(__dirname, '..', 'src', 'data', 'localDatabase.ts'), 'utf8');

db = db.replace(/mediaUrl:\s*['"]([^'"]+)['"]/g, (match, url) => {
  const base = path.basename(url);
  return fileMap[base] ? `mediaUrl: "${fileMap[base]}"` : match;
});

db = db.replace(/thumbnailUrl:\s*['"]([^'"]+)['"]/g, (match, url) => {
  const base = path.basename(url);
  return fileMap[base] ? `thumbnailUrl: "${fileMap[base]}"` : match;
});

fs.writeFileSync(path.join(__dirname, '..', 'src', 'data', 'localDatabase.ts'), db);

// Now update photoCategories.ts
let cat = fs.readFileSync(path.join(__dirname, '..', 'src', 'data', 'photoCategories.ts'), 'utf8');

// For each category, we want to set its image to the first file in its respective folder
const catDirs = fs.readdirSync(basePath);
for (const cDir of catDirs) {
  const dirPath = path.join(basePath, cDir);
  if (fs.statSync(dirPath).isDirectory()) {
    const files = fs.readdirSync(dirPath);
    if (files.length > 0) {
      const firstFile = files[0];
      const relPath = `/images/photo-categories/${cDir}/${firstFile}`;
      // replace the image for this category id
      const regex = new RegExp(`(id:\\s*['"]${cDir}['"][\\s\\S]*?image:\\s*['"])[^'"]+(['"])`, 'g');
      cat = cat.replace(regex, `$1${relPath}$2`);
    }
  }
}

fs.writeFileSync(path.join(__dirname, '..', 'src', 'data', 'photoCategories.ts'), cat);

console.log('Update complete');
