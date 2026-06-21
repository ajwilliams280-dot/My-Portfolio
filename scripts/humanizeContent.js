const fs = require('fs');
const path = require('path');

const HUMAN_TITLES = [
  "Confidence in Focus", "Golden Hour at River's Edge", "Quiet Contemplation", 
  "Urban Pulse", "Street Symphony", "Moments Between", "Through the Lens",
  "Natural Light Study", "A Glimpse of the Soul", "Raw Emotion", 
  "Character Study", "The Light Within", "Silhouettes at Dusk", 
  "Unspoken Stories", "Eyes That Speak", "Candid Frame", 
  "Shadows and Light", "Gaze", "Fading Sun", "Morning Commute",
  "Rhythm of the City", "Wandering Thoughts", "The Artisan's Craft",
  "Reflections", "Neon Nights", "Midnight Walk", "In Their Element",
  "Stolen Glances", "Echoes of Laughter", "Timeless"
];

const HUMAN_DESCRIPTIONS = [
  "A portrait capturing personality, emotion, and natural expression.",
  "The evening sunlight reflected beautifully across the water, creating a calm and timeless scene.",
  "An unguarded moment where genuine feeling takes center stage.",
  "Caught right in the middle of the city's chaotic yet beautiful rhythm.",
  "Experimenting with harsh shadows and bright highlights to build contrast.",
  "A quiet, intimate perspective on a normally busy environment.",
  "Focusing purely on the texture and raw emotion in the subject's face.",
  "Using natural window light to frame this deeply personal portrait.",
  "A fast-paced candid shot taken right as the subject looked up.",
  "Documentary-style approach to a very familiar everyday scene.",
  "A cinematic glimpse into student life, movement, and everyday moments.",
  "A collection of memorable moments celebrating love, family, and joy.",
  "The mood here is entirely driven by the overcast sky and muted tones.",
  "Highlighting the strength and vulnerability of the subject in one frame.",
  "A beautiful accident of timing, lighting, and natural expression."
];

function getRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

const dbPath = path.join(__dirname, '../src/data/localDatabase.ts');
let content = fs.readFileSync(dbPath, 'utf8');

// Regex to match the objects
// We want to replace title: "..." and description: "..."
// We will use a regex replacer

const titleRegex = /title:\s*"(.*?)",/g;
const descRegex = /description:\s*"(.*?)",/g;

// Instead of global replace, we can match block by block
let modified = content;

// Replace all titles (except the first 5 which are already human-like "Fish Market at the Shore" etc)
let titleMatches = [...modified.matchAll(titleRegex)];
titleMatches.forEach((match, index) => {
  if (index >= 5 && match[1] !== "Cinematic Reel 1" && !match[1].includes("Cinematic Reel")) { // skip the manual ones we added earlier
    const newTitle = getRandom(HUMAN_TITLES);
    modified = modified.replace(match[0], `title: "${newTitle}",`);
  }
});

let descMatches = [...modified.matchAll(descRegex)];
descMatches.forEach((match, index) => {
  if (index >= 5 && !match[1].includes("showcase of dynamic visual")) {
    const newDesc = getRandom(HUMAN_DESCRIPTIONS);
    modified = modified.replace(match[0], `description: "${newDesc}",`);
  }
});

// Write back
fs.writeFileSync(dbPath, modified, 'utf8');
console.log('Successfully humanized content in localDatabase.ts');
