const fs = require('fs');
const txt = fs.readFileSync('src/data/localDatabase.ts', 'utf8');

const regex = /\{\s*id:\s*"([^"]+)",[\s\S]*?mediaUrl:\s*"([^"]+)",[\s\S]*?photoCategories:\s*\[([^\]]*)\]/g;
let match;
let results = [];

// Since there are mixed quotes, let's just parse it using a more resilient regex or split by '{'
const items = txt.split('id: "photo-');
items.shift(); // remove the first part before the first item

for (const item of items) {
  try {
    const id = 'photo-' + item.split('",')[0].trim();
    const mediaUrlMatch = item.match(/mediaUrl:\s*"([^"]+)"/);
    const photoCategoriesMatch = item.match(/photoCategories:\s*\[([^\]]*)\]/);
    
    if (mediaUrlMatch && photoCategoriesMatch) {
      const mediaUrl = mediaUrlMatch[1];
      const photoCategories = photoCategoriesMatch[1]
        .split(',')
        .map(s => s.replace(/["']/g, '').trim())
        .filter(Boolean);
      
      results.push({ id, mediaUrl, photoCategories });
    }
  } catch(e) {}
}

const relevantCats = ['wildlife', 'product', 'coastal', 'architecture', 'nature'];
const filtered = results.filter(r => r.photoCategories.some(c => relevantCats.includes(c)));

filtered.forEach(f => console.log(f.id, f.photoCategories.join(','), f.mediaUrl));
