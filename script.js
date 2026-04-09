// TODO: add sliders to modify gain per frequency range, like an equalizer does.
// TODO: fix volume ramping to avoid clicking sound transition

// these are UI elements
const playButton = document.getElementById("playButton");
const volumeSlider = document.getElementById("volumeSlider");
const sliderDisplay = document.getElementById("sliderDisplay");
const gainDisplay = document.getElementById("gainDisplay");

const audioContext = new AudioContext();

const gainNode = audioContext.createGain();

// we initialize the gain here
let gainValue = Math.pow(parseFloat(volumeSlider.value), 2) * 0.1;
gainNode.gain.setValueAtTime(gainValue, audioContext.currentTime);
gainNode.connect(audioContext.destination);


// empty, 2 second long buffer with two channels (stereo)
// ? could create another buffer in mono for comparison
const buffer = audioContext.createBuffer(
  2, 
  audioContext.sampleRate*2, 
  audioContext.sampleRate
);
// filling the buffer with white noise
for (let channel = 0; channel < buffer.numberOfChannels; channel++) {
  const currentChannel = buffer.getChannelData(channel);
  for (let i = 0; i < buffer.length; i++) {
    currentChannel[i] = Math.random() * 2 - 1;
  }
}


// to control the state of the white noise playback
let source = null;

playButton.addEventListener("click", async () => {
  
  if (audioContext.state === "suspended") {
    await audioContext.resume();
  }

  if (!source) {
    source = audioContext.createBufferSource();
    source.buffer = buffer;
    source.loop = true;
    source.connect(gainNode); // Now we connect the gain node, and the gain node is already connected to dest.
    source.start();
  } else {
    source.stop();
    source = null; // once used, we get rid of the AudioBufferSourceNode for the next time we hit play.
  }

  playButton.classList.toggle("playing", source);

});

volumeSlider.addEventListener("input", (event) => {
  const sliderValue = parseFloat(event.target.value);
  gainValue = Math.pow(sliderValue, 2) * 0.1;
  gainNode.gain.setValueAtTime(gainValue, audioContext.currentTime);
  sliderDisplay.textContent = `slider: ${sliderValue.toFixed(3)}`
  gainDisplay.textContent = `gain: ${gainValue.toFixed(3)}`
});
