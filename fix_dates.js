const fs = require('fs');
let txt = fs.readFileSync('src/data/localDatabase.ts', 'utf8');

// Fix string dates: uploadDate: '2026-06-20T...'
txt = txt.replace(/uploadDate:\s*(['"][^'"]+['"])/g, 'uploadDate: new Date($1)');

// Fix toISOString(): uploadDate: new Date().toISOString()
txt = txt.replace(/uploadDate:\s*new Date\(\)\.toISOString\(\)/g, 'uploadDate: new Date()');

fs.writeFileSync('src/data/localDatabase.ts', txt, 'utf8');
console.log('Fixed dates.');
