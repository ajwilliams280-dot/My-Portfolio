const fs = require('fs');
const path = require('path');

const dbPath = 'src/data/localDatabase.ts';
let content = fs.readFileSync(dbPath, 'utf8');

const baseDir = 'public/images/photo-categories';
const categories = fs.readdirSync(baseDir).filter(f => fs.statSync(path.join(baseDir, f)).isDirectory());

// Parse existing projects
let lines = content.split('\n');
let existingProjects = [];
let currentProject = null;
let maxId = 0;

for (let line of lines) {
    if (line.includes('id: "photo-')) {
        let match = line.match(/id:\s*"photo-([^"]+)"/);
        if (match) {
            let idNum = parseInt(match[1]);
            if (idNum > maxId) maxId = idNum;
        }
    }
}

// Just match all mediaUrls
let mediaUrlsInDb = new Set();
let match;
const regex = /mediaUrl:\s*"([^"]+)"/g;
while ((match = regex.exec(content)) !== null) {
    mediaUrlsInDb.add(match[1]);
}

let newProjectsToAdd = [];

categories.forEach(cat => {
    const catDir = path.join(baseDir, cat);
    const files = fs.readdirSync(catDir).filter(f => f.endsWith('.jpg') || f.endsWith('.jpeg') || f.endsWith('.png') || f.endsWith('.webp'));
    
    files.forEach(file => {
        const url = `/images/photo-categories/${cat}/${file}`;
        if (!mediaUrlsInDb.has(url)) {
            maxId++;
            // Create a new project for this file
            let label = cat.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
            
            const newProj = `  {
    id: "photo-${maxId}",
    title: "${label} Photo",
    description: "Added from folder",
    category: "photo",
    subcategory: "${label}",
    mediaUrl: "${url}",
    thumbnailUrl: "${url}",
    uploadDate: new Date(),
    tags: [],
    featured: false,
    photoCategories: ["${cat}"],
    autoTags: [],
  },`;
            newProjectsToAdd.push(newProj);
        }
    });
});

console.log("Missing photos found:", newProjectsToAdd.length);

if (newProjectsToAdd.length > 0) {
    // Insert new projects before the closing bracket of localProjects
    // Find the end of the array
    const endIdx = lines.lastIndexOf('];');
    if (endIdx !== -1) {
        lines.splice(endIdx, 0, ...newProjectsToAdd);
        fs.writeFileSync(dbPath, lines.join('\n'), 'utf8');
        console.log("Added new photos to db.");
    }
}
