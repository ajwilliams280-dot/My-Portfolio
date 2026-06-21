const fs = require('fs');

const file = 'src/data/localDatabase.ts';
let content = fs.readFileSync(file, 'utf8');

const categoriesMap = {
  'portraits-indoors': 'Portraits Indoors',
  'outdoors': 'Outdoors',
  'drone-shot': 'Drone Shot',
  'travel': 'Travel',
  'night-life': 'Night Life',
  'street': 'Street Photography',
  'wildlife': 'Wild Life',
  'product': 'Product',
  'architecture': 'Architecture',
  'coastal': 'Coastal',
  'nature': 'Nature',
  'landscape': 'Landscape'
};

// Regex to match a photo object
// We will replace subcategory and photoCategories based on mediaUrl
const photoBlockRegex = /id:\s*["']photo-\d+["'],[\s\S]*?category:\s*["']photo["'],[\s\S]*?mediaUrl:\s*["']\/images\/photo-categories\/([^/]+)\/[^"']+["']/g;

content = content.replace(/{[\s\S]*?category:\s*["']photo["'][\s\S]*?}/g, (match) => {
  // Extract folder name from mediaUrl
  const urlMatch = match.match(/mediaUrl:\s*["']\/images\/photo-categories\/([^/]+)\/[^"']+["']/);
  if (urlMatch) {
    const folder = urlMatch[1];
    const newSubcategory = categoriesMap[folder] || folder;
    
    // Replace subcategory
    let newMatch = match.replace(/subcategory:\s*["'][^"']+["']/, `subcategory: "${newSubcategory}"`);
    
    // Replace photoCategories
    newMatch = newMatch.replace(/photoCategories:\s*\[[^\]]*\]/, `photoCategories: ["${folder}"]`);
    
    return newMatch;
  }
  return match;
});

fs.writeFileSync(file, content, 'utf8');
console.log('Categories updated successfully.');
