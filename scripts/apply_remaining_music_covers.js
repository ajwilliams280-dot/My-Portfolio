const fs = require('fs');
const path = require('path');

const brainDir = "C:\\Users\\willi\\.gemini\\antigravity\\brain\\30ba125e-c62b-4839-9496-5721aa5b8b3d";
const destDir = path.join(__dirname, '..', 'public', 'images', 'uploaded_covers');

if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

// These are the 5 newest files based on the last run, in chronological order
const fileMapping = [
  { src: "media__1781976476612.jpg", dest: "cover_pop.jpg", id: "pop" },
  { src: "media__1781976649326.jpg", dest: "cover_soundtracks.jpg", id: "soundtracks" },
  { src: "media__1781976657347.jpg", dest: "cover_audioprojects.jpg", id: "audio-projects" },
  { src: "media__1781976661314.jpg", dest: "cover_collaborations.jpg", id: "collaborations" },
  { src: "media__1781976668908.jpg", dest: "cover_experimental.jpg", id: "experimental" }
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

// Now update musicCategories.ts
const filePath = path.join(__dirname, '..', 'src', 'data', 'musicCategories.ts');
let content = fs.readFileSync(filePath, 'utf8');

fileMapping.forEach(update => {
  const image = `/images/uploaded_covers/${update.dest}`;
  const regex = new RegExp(`(id:\\s*['"]${update.id}['"][\\s\\S]*?image:\\s*)['"][^'"]+['"]`);
  content = content.replace(regex, `$1'${image}'`);
});

fs.writeFileSync(filePath, content);
console.log('Updated musicCategories.ts with the remaining covers.');
