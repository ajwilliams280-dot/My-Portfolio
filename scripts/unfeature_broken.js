const fs = require('fs');
const path = require('path');

let db = fs.readFileSync('src/data/localDatabase.ts', 'utf8');

const brokenUrls = [
  '/images/snaptik_7396745796223651077_2_v2.jpeg',
  '/images/snaptik_7396745796223651077_6_v2.jpeg',
  '/images/feat-photo-2.jpg',
  '/images/feat-photo-3.jpg'
];

brokenUrls.forEach(url => {
  // Find the block containing this mediaUrl and replace featured: true with featured: false
  // Since we want to make it unfeatured if the media is missing
  const regex = new RegExp(`(mediaUrl:\\s*['"]${url}['"][\\s\\S]*?featured:\\s*)true`, 'g');
  db = db.replace(regex, `$1false`);
  
  // also handle the case where featured: true comes BEFORE mediaUrl
  const regex2 = new RegExp(`(featured:\\s*)true([\\s\\S]*?mediaUrl:\\s*['"]${url}['"])`, 'g');
  db = db.replace(regex2, `$1false$2`);
});

fs.writeFileSync('src/data/localDatabase.ts', db);
console.log('Unfeatured broken images.');
