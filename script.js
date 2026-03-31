// these are UI elements
const playButton = document.getElementById("playButton");
const volumeSlider = document.getElementById("volumeSlider");

const audioContext = new AudioContext();

// TODO: create and initialize a gainNode
const gainNode = audioContext.createGain();
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

});

volumeSlider.addEventListener("input", (event) => {
  const value = parseFloat(event.target.value);
  gainNode.gain.setValueAtTime(Math.pow(value, 2), audioContext.currentTime);
});
