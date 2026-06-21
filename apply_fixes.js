const fs = require('fs');
let txt = fs.readFileSync('src/data/localDatabase.ts', 'utf8');

// Helper to remove category from an item
function removeCategory(txt, id, categoryToRemove) {
  const rx = new RegExp(`(id:\\s*['"]${id}['"][\\s\\S]*?photoCategories:\\s*\\[)([^\\]]*?)(\\])`, 'g');
  return txt.replace(rx, (match, p1, p2, p3) => {
    let cats = p2.split(',').map(s => s.trim()).filter(Boolean);
    cats = cats.filter(c => c.replace(/['"]/g, '') !== categoryToRemove);
    return p1 + cats.join(', ') + p3;
  });
}

// 1. Remove wildlife from photo-114
txt = removeCategory(txt, 'photo-114', 'wildlife');

// 2. Remove coastal from photo-126
txt = removeCategory(txt, 'photo-126', 'coastal');

// 3. Remove architecture from photo-242 (train)
txt = removeCategory(txt, 'photo-242', 'architecture');

// 4. Remove product from phone/black pictures
txt = removeCategory(txt, 'photo-94', 'product');
txt = removeCategory(txt, 'photo-99', 'product');
txt = removeCategory(txt, 'photo-217', 'product');

// Add new indoors images
const newImages = [
  '_MG_0001 copy.jpg',
  '_MG_0017_(2) copy.jpg',
  '_MG_0020.jpg',
  '_MG_0024 copy.jpg'
];

let nextId = 1000;
let newEntries = newImages.map(img => `  {
    id: 'photo-${nextId++}',
    title: 'Indoor Portrait',
    description: 'Indoor photography.',
    category: 'photo',
    subcategory: 'none',
    mediaUrl: '/images/photo-categories/portraits-indoors/${img}',
    uploadDate: '${new Date().toISOString()}',
    photoCategories: ['portraits-indoors']
  }`).join(',\n');

// Insert before the last `];`
txt = txt.replace(/\n\];/, ',\n' + newEntries + '\n];');

fs.writeFileSync('src/data/localDatabase.ts', txt, 'utf8');
console.log('Database updated successfully.');
