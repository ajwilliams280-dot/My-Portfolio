const fs = require('fs');
const path = require('path');

const brainDir = "C:\\Users\\willi\\.gemini\\antigravity\\brain\\30ba125e-c62b-4839-9496-5721aa5b8b3d";
const destDir = path.join(__dirname, '..', 'public', 'images', 'uploaded_covers');

if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

// These are the 5 newest files based on the last run, in chronological order
const fileMapping = [
  { src: "media__1781975680447.jpg", dest: "cover_beat.jpg" },          // First cover -> beat
  { src: "media__1781975854509.jpg", dest: "cover_instrumentals.jpg" }, // Second cover -> instrumentals
  { src: "media__1781975931992.jpg", dest: "cover_hiphop.jpg" },        // Third cover -> Hipop
  { src: "media__1781975972198.jpg", dest: "cover_afrobeat.jpg" },      // Fourth cover -> Afrobeat
  { src: "media__1781976012840.jpg", dest: "cover_rnb.jpg" }            // Fifth cover -> R&B
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
