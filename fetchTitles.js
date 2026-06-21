const fs = require('fs');
const { execSync } = require('child_process');
const path = require('path');

const targetFile = path.join(__dirname, 'src', 'data', 'techTips.ts');

function fetchTitle(url) {
  try {
    const cmd = `powershell -Command "$ErrorActionPreference='Stop'; try { $r = Invoke-WebRequest -Uri '${url}' -UseBasicParsing -TimeoutSec 10; $r.Content } catch { '' }"`;
    const data = execSync(cmd, { encoding: 'utf8', stdio: ['pipe', 'pipe', 'ignore'] });
    const match = data.match(/<title[^>]*>([^<]+)<\/title>/i);
    if (match && match[1]) {
      let title = match[1].replace(' | TikTok', '').replace(/&quot;/g, '"').replace(/&#x27;/g, "'").replace(/&amp;/g, '&');
      return title.trim();
    }
  } catch (e) {
  }
  return 'TikTok Tip';
}

function run() {
  const content = fs.readFileSync(targetFile, 'utf8');
  const match = content.match(/export const TECH_TIPS = (\[.*\]);/s);
  if (!match) return console.error('Could not parse TECH_TIPS array');
  
  const techTips = JSON.parse(match[1]);
  let updated = 0;
  
  for (let i = 0; i < techTips.length; i++) {
    if (techTips[i].platform === 'tiktok' && techTips[i].title === 'TikTok Tip') {
      process.stdout.write(`Fetching ${i+1}/${techTips.length}... `);
      const title = fetchTitle(techTips[i].externalUrl);
      techTips[i].title = title;
      console.log(title);
      updated++;
    }
  }
  
  if (updated > 0) {
    const newContent = `export const TECH_TIPS = ${JSON.stringify(techTips, null, 2)};\n`;
    fs.writeFileSync(targetFile, newContent);
    console.log(`Updated ${updated} titles.`);
  } else {
    console.log('No titles needed updating.');
  }
}

run();
