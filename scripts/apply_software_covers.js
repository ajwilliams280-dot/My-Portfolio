const fs = require('fs');
const path = require('path');

const brainDir = "C:\\Users\\willi\\.gemini\\antigravity\\brain\\30ba125e-c62b-4839-9496-5721aa5b8b3d";
const destDir = path.join(__dirname, '..', 'public', 'images', 'uploaded_covers');

if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

// These are the 4 newest files based on the last run, in chronological order
const fileMapping = [
  { src: "media__1781977096941.jpg", dest: "cover_webdev.jpg", id: "web-development" },
  { src: "media__1781977641294.jpg", dest: "cover_mobileapps.jpg", id: "mobile-apps" },
  { src: "media__1781977644761.jpg", dest: "cover_uiux.jpg", id: "ui-ux-design" },
  { src: "media__1781977687872.jpg", dest: "cover_opensource.jpg", id: "open-source" }
];

fileMapping.forEach(mapping => {
  const srcPath = path.join(brainDir, mapping.src);
  const destPath = path.join(destDir, mapping.dest);
  if (fs.existsSync(srcPath)) {
    fs.copyFileSync(srcPath, destPath);
    console.log(`Copied ${mapping.src} to ${mapping.dest}`);
  } else {
    console.error(`Source file not found: ${srcPath}`);
  }
});

// Now update softwareCategories.ts
const filePath = path.join(__dirname, '..', 'src', 'data', 'softwareCategories.ts');
let content = fs.readFileSync(filePath, 'utf8');

fileMapping.forEach(update => {
  const image = `/images/uploaded_covers/${update.dest}`;
  const regex = new RegExp(`(id:\\s*['"]${update.id}['"][\\s\\S]*?image:\\s*)['"][^'"]+['"]`);
  content = content.replace(regex, `$1'${image}'`);
});

fs.writeFileSync(filePath, content);
console.log('Updated softwareCategories.ts with the new covers.');
