/* ========== 1. YOUR TRACK LIST ==========
Update this list to match your real files in /audio and /covers.
For now you can point all cover: to "covers/default-cover.jpg".
*/
const TRACKS = [
  {
    title: "2 part shit",
    file: "audio/2 part shit.mp3",
    cover: "covers/default-cover.jpg"
  },
  {
    title: "42 cent",
    file: "audio/42 cent.mp3",
    cover: "covers/default-cover.jpg"
  }
  // Add more tracks here...
];

/* ========== 2. GET PAGE ELEMENTS ========== */
const audioEl        = document.getElementById("audioEl");
const playlistEl     = document.getElementById("playlist");
const trackCountEl   = document.getElementById("trackCount");

const nowCoverEl     = document.getElementById("nowCover");
const nowTitleEl     = document.getElementById("nowTitle");

const playPauseBtn   = document.getElementById("playPauseBtn");
const prevBtn        = document.getElementById("prevBtn");
const nextBtn        = document.getElementById("nextBtn");

const currentTimeEl  = document.getElementById("currentTime");
const durationTimeEl = document.getElementById("durationTime");

const progressWrapEl = document.getElementById("progressWrap");
const progressBarEl  = document.getElementById("progressBar");

const vizCanvas      = document.getElementById("vizCanvas");
const ctx            = vizCanvas.getContext("2d");

/* output device UI */
const outputSelect   = document.getElementById("outputSelect");
const refreshOutputs = document.getElementById("refreshOutputs");

/* playback state */
let currentIndex = 0;
let isPlaying = false;

/* visualizer state */
let analyser;
let dataArray;
let rafId;

/* ========== 3. PLAYLIST BUILDING / CLICK HANDLERS ========== */
function buildPlaylist() {
  playlistEl.innerHTML = "";
  trackCountEl.textContent = `${TRACKS.length} tracks`;

  TRACKS.forEach((track, i) => {
    const li = document.createElement("li");
    li.className = "track-row";
    li.dataset.index = i;

    const img = document.createElement("img");
    img.className = "track-cover";
    img.src = track.cover || "covers/default-cover.jpg";

    const textWrap = document.createElement("div");
    textWrap.className = "track-text";

    const title = document.createElement("div");
    title.className = "track-title";
    title.textContent = track.title;

    const fileName = document.createElement("div");
    fileName.className = "track-file";
    fileName.textContent = track.file;

    textWrap.appendChild(title);
    textWrap.appendChild(fileName);

    li.appendChild(img);
    li.appendChild(textWrap);

    li.addEventListener("click", () => {
      setTrack(i);
      playAudio();
    });

    playlistEl.appendChild(li);
  });

  highlightActiveRow();
}

function highlightActiveRow() {
  [...playlistEl.children].forEach((row, i) => {
    row.classList.toggle("active", i === currentIndex);
  });
}

/* ========== 4. AUDIO CONTROL LOGIC ========== */
function setTrack(index) {
  currentIndex = index;
  const track = TRACKS[currentIndex];

  audioEl.src = track.file;
  nowTitleEl.textContent = track.title;
  nowCoverEl.src = track.cover || "covers/default-cover.jpg";

  highlightActiveRow();
}

function playAudio() {
  audioEl.play().then(() => {
    isPlaying = true;
    playPauseBtn.textContent = "⏸";
  }).catch(() => {
    // if autoplay is blocked, user needs to tap play
  });
}

function pauseAudio() {
  audioEl.pause();
  isPlaying = false;
  playPauseBtn.textContent = "▶";
}

function togglePlayPause() {
  if (audioEl.paused) {
    playAudio();
  } else {
    pauseAudio();
  }
}

function nextTrack() {
  currentIndex = (currentIndex + 1) % TRACKS.length;
  setTrack(currentIndex);
  playAudio();
}

function prevTrack() {
  currentIndex = (currentIndex - 1 + TRACKS.length) % TRACKS.length;
  setTrack(currentIndex);
  playAudio();
}

/* helper: convert seconds -> mm:ss */
function fmt(sec) {
  if (!sec || isNaN(sec)) return "0:00";
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return m + ":" + (s < 10 ? "0" + s : s);
}

/* time + progress bar updates */
audioEl.addEventListener("loadedmetadata", () => {
  durationTimeEl.textContent = fmt(audioEl.duration);
});
audioEl.addEventListener("timeupdate", () => {
  currentTimeEl.textContent = fmt(audioEl.currentTime);

  if (audioEl.duration) {
    const pct = (audioEl.currentTime / audioEl.duration) * 100;
    progressBarEl.style.width = pct + "%";
  }
});
audioEl.addEventListener("ended", () => {
  nextTrack();
});

/* seek on click */
progressWrapEl.addEventListener("click", (e) => {
  const rect = progressWrapEl.getBoundingClientRect();
  const clickX = e.clientX - rect.left;
  const pct = clickX / rect.width;
  if (audioEl.duration) {
    audioEl.currentTime = pct * audioEl.duration;
  }
});

/* control buttons */
playPauseBtn.addEventListener("click", togglePlayPause);
nextBtn.addEventListener("click", nextTrack);
prevBtn.addEventListener("click", prevTrack);

/* ========== 5. AUDIO OUTPUT SELECTION ========== */
/*
How this works:
- We ask for permission to access audio devices.
- We list available output devices (like speakers, headphones).
- When user picks one, we call audioEl.setSinkId(deviceId) if the browser supports it.
*/

async function getAudioOutputs() {
  // Ask for permission by requesting any audio stream once.
  // (We won't actually use the stream audio; we just need permissions
  // so the browser will reveal devices.)
  try {
    await navigator.mediaDevices.getUserMedia({ audio: true });
  } catch (err) {
    console.warn("Could not get mic permission (needed to list devices).", err);
  }

  if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
    console.warn("enumerateDevices() not supported");
    return;
  }

  const devices = await navigator.mediaDevices.enumerateDevices();

  // Clear current options except first "(default device)"
  const firstOption = outputSelect.querySelector("option[value='']");
  outputSelect.innerHTML = "";
  if (firstOption) {
    outputSelect.appendChild(firstOption);
  } else {
    const opt = document.createElement("option");
    opt.value = "";
    opt.textContent = "(default device)";
    outputSelect.appendChild(opt);
  }

  // Add output devices (audiooutput kind)
  devices
    .filter(d => d.kind === "audiooutput")
    .forEach(d => {
      const opt = document.createElement("option");
      opt.value = d.deviceId;
      opt.textContent = d.label || `Device ${d.deviceId}`;
      outputSelect.appendChild(opt);
    });
}

// When refresh button is clicked, repopulate device list
refreshOutputs.addEventListener("click", async () => {
  await getAudioOutputs();
});

// When dropdown changes, try to set new sink
outputSelect.addEventListener("change", async () => {
  const sinkId = outputSelect.value;

  // Some browsers (like Safari iOS) don't support setSinkId at all.
  if (typeof audioEl.setSinkId !== "function") {
    alert("Your browser doesn't allow selecting output devices.");
    return;
  }

  try {
    // If empty value, go back to default device
    if (!sinkId) {
      // Can't 'unset' in all browsers, but we can just ignore
      console.log("Using default output device.");
    } else {
      await audioEl.setSinkId(sinkId);
      console.log("Audio output set to device:", sinkId);
    }
  } catch (err) {
    console.error("Error setting output device:", err);
    alert("Couldn't switch output. Browser or permissions blocked it.");
  }
});

/* ========== 6. VISUALIZER BACKGROUND ========== */
function setupVisualizer() {
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  const audioCtx = new AudioContext();

  const srcNode = audioCtx.createMediaElementSource(audioEl);
  analyser = audioCtx.createAnalyser();
  analyser.fftSize = 256;

  srcNode.connect(analyser);
  analyser.connect(audioCtx.destination);

  dataArray = new Uint8Array(analyser.frequencyBinCount);

  function resize() {
    vizCanvas.width = window.innerWidth;
    vizCanvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener("resize", resize);

  function draw() {
    analyser.getByteFrequencyData(dataArray);

    const w = vizCanvas.width;
    const h = vizCanvas.height;

    // dark overlay with slight transparency so bg.jpg shows through
    ctx.fillStyle = "rgba(0,0,0,0.25)";
    ctx.fillRect(0, 0, w, h);

    // center glow pulse
    const maxV = Math.max(...dataArray);
    const radius = (maxV / 255) * (Math.min(w, h) / 2);

    const grad = ctx.createRadialGradient(
      w / 2, h / 2, 0,
      w / 2, h / 2, radius + 60
    );
    grad.addColorStop(0, "rgba(0,255,200,0.4)");
    grad.addColorStop(0.5, "rgba(120,0,255,0.2)");
    grad.addColorStop(1, "rgba(0,0,0,0)");

    ctx.beginPath();
    ctx.fillStyle = grad;
    ctx.arc(w / 2, h / 2, radius + 90, 0, Math.PI * 2);
    ctx.fill();

    // bottom bars
    const barWidth = w / dataArray.length;
    for (let i = 0; i < dataArray.length; i++) {
      const v = dataArray[i];
      const barHeight = (v / 255) * (h * 0.4);
      const x = i * barWidth;
      const y = h - barHeight - 20;

      ctx.fillStyle = `rgba(${50 + v}, ${200 - i}, 255, 0.6)`;
      ctx.shadowColor = "#00f5ff";
      ctx.shadowBlur = 20;
      ctx.fillRect(x, y, barWidth * 0.8, barHeight);
    }

    rafId = requestAnimationFrame(draw);
  }

  draw();
}

/* ========== 7. INIT EVERYTHING ========== */
function init() {
  buildPlaylist();
  setTrack(0);

  // prepare device list once on load
  // (will ask for mic permission so we get labels on devices)
  getAudioOutputs();

  // mobile/desktop audio contexts need user interaction before allowed
  document.body.addEventListener(
    "click",
    function firstClick() {
      if (!analyser) {
        setupVisualizer();
      }
      document.body.removeEventListener("click", firstClick);
    },
    { once: true }
  );
}

init();
