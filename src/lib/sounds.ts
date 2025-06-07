// Use Vite's glob import to automatically load all MP3 files from the sounds directory
// We need to use a relative path from src/lib
const soundModules = import.meta.glob('../../static/sounds/*.mp3', { 
  eager: true,
  query: '?url',
  import: 'default'
});

// Extract the URLs from the glob import and fix the paths
// Vite returns full paths, but we need to serve them from the root
const soundUrls: string[] = Object.values(soundModules).map(url => {
  // Extract just the filename from the full path
  const filename = url.split('/').pop();
  return `/sounds/${filename}`;
});

let audio: HTMLAudioElement | null = null;

export function playRandomSuccessSound() {
  if (soundUrls.length === 0) {
    console.log('No sound files available. Add MP3 files to /static/sounds/');
    return;
  }

  // Stop any currently playing sound
  if (audio) {
    audio.pause();
    audio.currentTime = 0;
  }

  // Select a random sound URL
  const randomIndex = Math.floor(Math.random() * soundUrls.length);
  const soundUrl = soundUrls[randomIndex];

  // Create and play the audio
  audio = new Audio(soundUrl);
  audio.volume = 0.5; // Set volume to 50% by default
  
  audio.play().catch(error => {
    console.error('Error playing sound:', error);
  });
}

// No need for manual initialization anymore - sounds are loaded automatically
export function initializeSounds() {
  console.log(`Loaded ${soundUrls.length} sound files`);
}