const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'src', 'data', 'musicCategories.ts');
let content = fs.readFileSync(filePath, 'utf8');

// We know the categories and their IDs:
// beats -> 'beats'
// instrumentals -> 'instrumentals'
// Hipop -> 'hip-hop'
// Afrobeat -> 'afrobeats'
// R and B -> 'rnb'

const updates = [
  { id: 'beats', image: '/images/uploaded_covers/cover_beat.jpg' },
  { id: 'instrumentals', image: '/images/uploaded_covers/cover_instrumentals.jpg' },
  { id: 'hip-hop', image: '/images/uploaded_covers/cover_hiphop.jpg' },
  { id: 'afrobeats', image: '/images/uploaded_covers/cover_afrobeat.jpg' },
  { id: 'rnb', image: '/images/uploaded_covers/cover_rnb.jpg' }
];

updates.forEach(update => {
  // Regex to match the object with this id and replace its image
  const regex = new RegExp(`(id:\\s*['"]${update.id}['"][\\s\\S]*?image:\\s*)['"][^'"]+['"]`);
  content = content.replace(regex, `$1'${update.image}'`);
});

fs.writeFileSync(filePath, content);
console.log('Updated musicCategories.ts with specific covers.');
