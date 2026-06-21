const fs = require('fs');
const path = require('path');

const localDbPath = path.join(__dirname, 'src', 'data', 'localDatabase.ts');
const photoCatPath = path.join(__dirname, 'src', 'data', 'photoCategories.ts');
const videoCatPath = path.join(__dirname, 'src', 'data', 'videoCategories.ts');
const musicCatPath = path.join(__dirname, 'src', 'data', 'musicCategories.ts');

function replaceUnsplashLinks(filePath, imagesArr) {
  let content = fs.readFileSync(filePath, 'utf-8');
  let imgIndex = 0;
  content = content.replace(/image:\s*'https:\/\/images\.unsplash\.com[^']+'/g, () => {
    const img = imagesArr[imgIndex % imagesArr.length];
    imgIndex++;
    return `image: '/images/${img}'`;
  });
  fs.writeFileSync(filePath, content);
}

// Available images from public/images
const generalImages = [
  '_DSC3599.jpg', '_DSC6328.jpg', '_DSC6411.jpg', '_DSC6456.jpg', '_DSC6608.jpg', 
  '_DSC8144.jpg', '_DSC8245.jpg', '_DSC8278.jpg', '_DSC8310.jpg', '_DSC8313.jpg',
  '_MG_0006.jpg', '_MG_0020.jpg', '_MG_0026.jpg', '_MG_0046.jpg', '_MG_0058.jpg'
];

replaceUnsplashLinks(photoCatPath, generalImages);
replaceUnsplashLinks(videoCatPath, generalImages);
replaceUnsplashLinks(musicCatPath, generalImages);

// Recategorize localDatabase.ts
let dbContent = fs.readFileSync(localDbPath, 'utf-8');

const streetKeywords = ["street symphony", "morning commute", "midnight walk", "urban pulse", "rhythm of the city", "shadows and light", "fading sun", "moments between", "stolen glances", "unspoken stories"];
const landscapeKeywords = ["golden hour", "river's edge", "silhouettes at dusk", "timeless", "wandering thoughts", "reflections"];

dbContent = dbContent.replace(/\{\s*id:\s*"([^"]+)",[\s\S]*?\}/g, (match) => {
  if (match.includes('category: "photo"')) {
    let titleMatch = match.match(/title:\s*"([^"]+)"/);
    if (titleMatch) {
      let title = titleMatch[1].toLowerCase();
      let newSubcat = null;
      let newCatSlug = null;
      
      if (streetKeywords.some(kw => title.includes(kw))) {
        newSubcat = "Street Photography";
        newCatSlug = "street";
      } else if (landscapeKeywords.some(kw => title.includes(kw))) {
        newSubcat = "Landscape Photography";
        newCatSlug = "landscape";
      }

      if (newSubcat) {
        match = match.replace(/subcategory:\s*"[^"]+"/, `subcategory: "${newSubcat}"`);
        match = match.replace(/photoCategories:\s*\[[^\]]+\]/, `photoCategories: ["${newCatSlug}"]`);
        match = match.replace(/tags:\s*\[[^\]]+\]/, `tags: ["${newCatSlug}", "photography"]`);
      }
    }
  }
  return match;
});

fs.writeFileSync(localDbPath, dbContent);
console.log('Done updating Unsplash images and recategorizing local database.');
