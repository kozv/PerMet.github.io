const bpmArray = [41, 44, 46, 48, 51, 54, 56, 59, 63, 66, 69, 73, 77, 81, 85, 90, 95, 100, 105, 110, 115, 121, 127, 133, 139, 146, 153, 160, 168, 176, 184, 193, 202, 212, 222, 233, 244, 256, 268, 281, 295, 309, 324, 340, 357, 375, 394];
let currentBPMIndex = 17; // Start with 100 BPM (index 17 in the array)
let metronomeInterval = null;
let audioContext = null;
let gainNode = null;
let isPlaying = false;

function initAudio() {
  audioContext = new (window.AudioContext || window.webkitAudioContext)();
  gainNode = audioContext.createGain();
  gainNode.connect(audioContext.destination);
}

function startMetronome() {
  if (isPlaying) return;
  isPlaying = true;
  if (!audioContext) {
    initAudio();
  }
  playClick();
  const bpm = bpmArray[currentBPMIndex];
  const interval = 60000 / bpm; // Convert BPM to milliseconds per beat
  metronomeInterval = setInterval(playClick, interval);
}

function stopMetronome() {
  if (!isPlaying) return;
  isPlaying = false;
  clearInterval(metronomeInterval);
}

function increaseBPM() {
  if (currentBPMIndex < bpmArray.length - 1) {
    currentBPMIndex++;
    updateBPMDisplay();
  }
}

function decreaseBPM() {
  if (currentBPMIndex > 0) {
    currentBPMIndex--;
    updateBPMDisplay();
  }
}

function updateBPMDisplay() {
  const bpmDisplay = document.getElementById("bpm");
  bpmDisplay.textContent = bpmArray[currentBPMIndex];
}

function changeVolume(volume) {
  if (gainNode) {
    gainNode.gain.value = volume;
  }
}

function playClick() {
  const soundFilePath = "sounds/metronome-sound.wav"; // Replace with the actual path to the sound file
  const request = new XMLHttpRequest();
  request.open("GET", soundFilePath, true);
  request.responseType = "arraybuffer";

  request.onload = function () {
    audioContext.decodeAudioData(request.response, function (buffer) {
      const source = audioContext.createBufferSource();
      source.buffer = buffer;
      source.connect(gainNode);
      source.start(0);
    });
  };

  request.send();
}
