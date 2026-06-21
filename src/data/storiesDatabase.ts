import { ClientStory } from '@/types';

export const storiesDatabase: ClientStory[] = [
  {
    id: "story-1",
    clientName: "Fatu Kamara",
    serviceType: "Photography",
    projectName: "Beach Wedding",
    story: "I honestly couldn't be happier with our wedding photos! They managed to capture all the little moments I didn't even know were happening. The lighting was gorgeous, and every time I look at the pictures I feel like I'm right back there on the beach.",
    rating: 5,
    reactions: ["Memorable", "Beautifully Captured", "Exceptional"],
    isVideo: false,
    date: new Date("2026-05-12T10:00:00Z"),
    verified: true,
  },
  {
    id: "story-2",
    clientName: "Ibrahim Bangura",
    serviceType: "Videography",
    projectName: "Brand Documentary",
    story: "The video they put together for my brand was insane. I gave them a rough idea of what I wanted, and they turned it into a full cinematic experience. It genuinely looks like a movie trailer. I've gotten so many compliments on it already.",
    rating: 5,
    reactions: ["Cinematic", "Outstanding"],
    isVideo: true,
    mediaUrl: "/video/snaptik_7484371429643898167_v3.mp4",
    date: new Date("2026-06-01T14:30:00Z"),
    verified: true,
  },
  {
    id: "story-3",
    clientName: "Aminata Sesay",
    serviceType: "Music Production",
    projectName: "Debut EP",
    story: "Working in the studio with them was such a vibe. They really listened to what I was trying to do and brought my sound to a whole new level. The final mix sounds so clean and professional. I can't wait to work with them again.",
    rating: 5,
    reactions: ["Amazing", "Exceptional"],
    isVideo: false,
    date: new Date("2026-04-20T09:15:00Z"),
    verified: true,
  },
  {
    id: "story-4",
    clientName: "Sorie Mansaray",
    serviceType: "Photography",
    projectName: "Urban Street Fashion",
    story: "Bro, the photos came out crazy good. They really captured the gritty street vibe I wanted for my new clothing drop. They made the whole shoot super relaxed and knew exactly how to direct me to get the best shots.",
    rating: 5,
    reactions: ["Beautifully Captured", "Memorable"],
    isVideo: false,
    date: new Date("2026-03-15T16:45:00Z"),
    verified: true,
  },
  {
    id: "story-5",
    clientName: "Kadiatu Jalloh",
    serviceType: "Videography",
    projectName: "Music Video Shoot",
    story: "The energy on set was unmatched! They brought my song to life exactly how I pictured it in my head. The edits, the color grading, everything was just perfect. Highly recommend them if you need a music video done right.",
    rating: 5,
    reactions: ["Cinematic", "Amazing", "Outstanding"],
    isVideo: true,
    mediaUrl: "/video/snaptik_7517811990551727365_v3.mp4",
    date: new Date("2026-06-10T11:20:00Z"),
    verified: true,
  }
];

export function getStories(): ClientStory[] {
  return [...storiesDatabase].sort((a, b) => b.date.getTime() - a.date.getTime());
}

export function getFeaturedStories(): ClientStory[] {
  return getStories().slice(0, 3);
}

// Mock add function for the UI form
export function addStory(story: Omit<ClientStory, 'id' | 'date' | 'verified'>): ClientStory {
  const newStory: ClientStory = {
    ...story,
    id: `story-${Date.now()}`,
    date: new Date(),
    verified: false, // Pending verification
  };
  storiesDatabase.unshift(newStory);
  return newStory;
}
