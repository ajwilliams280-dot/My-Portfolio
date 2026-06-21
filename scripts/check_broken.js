const fs=require('fs');
const db=fs.readFileSync('src/data/localDatabase.ts','utf8');
const matches=[...db.matchAll(/mediaUrl:\s*["']([^"']+)["']/g)];
let broken=0;
for(const m of matches){
  const url=m[1];
  if(url.startsWith('/')){
    const p='public'+url;
    if(!fs.existsSync(p)){
      console.log('Broken:', url);
      broken++;
    }
  }
}
console.log('Total broken:', broken);
