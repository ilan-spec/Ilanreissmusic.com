/* ========== 1. YOUR PLAYLIST ==========
Edit this part when you add songs.
Each item is:
{
  title: "Name people see",
  file: "audio/your-file-name.mp3",
  cover: "covers/your-cover-file.jpg"
}
Make sure the file names exist in the folders.
*/

const TRACKS = [
  {
    title: "Night Drive (Demo 042)",
    file: "audio/ilan-nightdrive.mp3",
    cover: "covers/ilan-nightdrive.jpg"
  },
  {
    title: "Vinyl Warmup Loop",
    file: "audio/ilan-vinylwarmup.wav",
    cover: "covers/ilan-vinylwarmup.png"
  }
];

/* ========== grab elements ========== */

const audioEl = document.getElementById("audioEl");
const playlistEl = document.getElementById("playlist");
const trackCountEl = document.getElementById("trackCount");

const nowCoverEl = document.getElementById("nowCover");
const nowTitleEl = document.getElementById("nowTitle");

const playPauseBtn = document.getElementById("playPauseBtn");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");

const currentTimeEl = document.getElementById("currentTime");
const durationTimeEl = document.getElementById("durationTime");

const progressWrapEl = document.getElementById("progressWrap");
const progressBarEl = document.getElementById("progressBar");

const vizCanvas = document.getElementById("vizCanvas");
const ctx = vizCanvas.getContext("2d");

/* state */
let currentIndex = 0;
let isPlaying = false;

/* ========== build playlist UI ========== */
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

/* ========== audio logic ========== */

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
    /* browser might block autoplay until user interacts */
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

function fmt(sec) {
  if (!sec || isNaN(sec)) return "0:00";
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return m + ":" + (s < 10 ? "0" + s : s);
}

/* ========== sync time + progress bar ========== */

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

progressWrapEl.addEventListener("click", (e) => {
  const rect = progressWrapEl.getBoundingClientRect();
  const clickX = e.clientX - rect.left;
  const pct = clickX / rect.width;
  if (audioEl.duration) {
    audioEl.currentTime = pct * audioEl.duration;
  }
});

/* button events */
playPauseBtn.addEventListener("click", togglePlayPause);
nextBtn.addEventListener("click", nextTrack);
prevBtn.addEventListener("click", prevTrack);

/* ========== visualizer background ========== */

let analyser;
let dataArray;
let rafId;

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

    // black overlay w/ trails
    ctx.fillStyle = "rgba(0,0,0,0.2)";
    ctx.fillRect(0, 0, w, h);

    // glow pulse in center
    const maxV = Math.max(...dataArray);
    const radius = (maxV / 255) * (Math.min(w, h) / 2);

    const grad = ctx.createRadialGradient(
      w / 2,
      h / 2,
      0,
      w / 2,
      h / 2,
      radius + 50
    );
    grad.addColorStop(0, "rgba(0,255,200,0.4)");
    grad.addColorStop(0.5, "rgba(120,0,255,0.2)");
    grad.addColorStop(1, "rgba(0,0,0,0)");

    ctx.beginPath();
    ctx.fillStyle = grad;
    ctx.arc(w / 2, h / 2, radius + 80, 0, Math.PI * 2);
    ctx.fill();

    // equalizer bars bottom
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

/* ========== init ========== */

function init() {
  buildPlaylist();
  setTrack(0);

  // browsers block audio context until user clicks somewhere
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
