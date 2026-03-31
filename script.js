const audioContext = new AudioContext();

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

// these are UI elements
const playButton = document.getElementById("playButton");
const volumeSlider = document.getElementById("volumeSlider");

// to control the state of the white noise playback
let source = null;
// set actions when the button is pressed
playButton.addEventListener("click", async () => {
  
  if (audioContext.state === "suspended") {
    await audioContext.resume();
  }

  if (!source) {
    source = audioContext.createBufferSource();
    source.buffer = buffer;
    source.loop = true;
    source.connect(audioContext.destination);
    source.start();
  } else {
    source.stop();
    source = null;
  }

});

// Slider de volumen
volumeSlider.addEventListener("input", () => {
  // TODO: add gain control using a gainNode
});
