// Manual list of sound files in /static/sounds/
// Add your sound filenames here when you add MP3 files to the sounds folder
const soundFiles = [
  'bonus.mp3',
  'bright.mp3',
  'chime.mp3',
  'complete.mp3',
  'game-bonus.mp3',
  'success.mp3',
  'yay.mp3'
  // Add more filenames here as needed
];

let audio: HTMLAudioElement | null = null;
let chimeAudio: HTMLAudioElement | null = null;

export function playChimeSound() {
  // Create a new audio instance each time to allow overlapping sounds
  const chime = new Audio('/sounds/chime.mp3');
  chime.volume = 0.3; // Lower volume for typing sounds
  
  chime.play().catch(error => {
    console.error('Error playing chime sound:', error);
  });
}

export function playRandomSuccessSound() {
  if (soundFiles.length === 0) {
    console.log('No sound files available. Add MP3 files to /static/sounds/');
    return;
  }

  // Stop any currently playing sound
  if (audio) {
    audio.pause();
    audio.currentTime = 0;
  }

  // Select a random sound file
  const randomIndex = Math.floor(Math.random() * soundFiles.length);
  const soundFile = soundFiles[randomIndex];

  // Create and play the audio
  audio = new Audio(`/sounds/${soundFile}`);
  audio.volume = 0.5; // Set volume to 50% by default
  
  audio.play().catch(error => {
    console.error('Error playing sound:', error);
  });
}

export function initializeSounds() {
  console.log(`Loaded ${soundFiles.length} sound files`);
}
