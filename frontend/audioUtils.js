// audioUtils.js (or any appropriate name)
const audioPool = [];
const maxPoolSize = 10;

// Initialize the audio pool
export function initializeAudioPool() {
  for (let i = 0; i < maxPoolSize; i++) {
    const audio = new Audio();
    audioPool.push(audio);
  }
}

// Play a sound from the audio pool
export function playSound(src) {
  const audio = audioPool.find(audio => audio.paused);

  if (audio) {
    audio.src = src;
    audio.play();
  } else {
    console.warn('Audio pool exhausted. Cannot play sound.');
  }
}
