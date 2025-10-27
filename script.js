// --- Full list of your tracks ---
// Each file is inside /audio/
const tracks = [
  "2 part shit.mp3","42 cent.mp3","67.mp3","808 beat sample.mp3","a break.mp3",
  "all me.mp3","another one.mp3","asher organ.mp3","ass with potench.mp3","bad one.mp3",
  "been a minu.mp3","beeps.mp3","before my set.mp3","before you go.mp3","black airforces.mp3",
  "bubs final.mp3","bubs.mp3","buds.mp3","bullshittin.mp3","candy shack.mp3",
  "chicos.mp3","chilled.mp3","com 303 sh.mp3","corp. rework.mp3","corp..mp3",
  "cya.mp3","cypher chopped.mp3","danklin.mp3","day ones.mp3","day today .mp3",
  "delete this track.mp3","dub w.mp3","easter.mp3","ff.mp3","flip.mp3",
  "fly guy.mp3","for it.mp3"
];

const audioEl = document.getElementById("audioElement");
const trackListEl = document.getElementById("trackList");
const currentTrackNameEl = document.getElementById("currentTrackName");
const playPauseBtn = document.getElementById("playPauseBtn");
const stopBtn = document.getElementById("stopBtn");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const seekBar = document.getElementById("seekBar");
const currentTimeEl = document.getElementById("currentTime");
const durationEl = document.getElementById("duration");
const volumeSlider = document.getElementById("volumeSlider");

let currentIndex = 0;
let isPlaying = false;

// Helper: format time
function formatTime(sec) {
  if (isNaN(sec)) return "0:00";
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

function loadTrack(i) {
  currentIndex = i;
  audioEl.src = `audio/${tracks[i]}`;
  currentTrackNameEl.textContent = tracks[i].replace(".mp3", "");
  [...trackListEl.children].forEach((li, idx) =>
    li.classList.toggle("active", idx === i)
  );
  seekBar.value = 0;
  currentTimeEl.textContent = "0:00";
  durationEl.textContent = "0:00";
}

function playTrack() {
  audioEl.play().then(() => {
    isPlaying = true;
    playPauseBtn.textContent = "⏸";
  });
}

function pauseTrack() {
  audioEl.pause();
  isPlaying = false;
  playPauseBtn.textContent = "▶";
}

function stopTrack() {
  audioEl.pause();
  audioEl.currentTime = 0;
  isPlaying = false;
  playPauseBtn.textContent = "▶";
}

function nextTrack() {
  currentIndex = (currentIndex + 1) % tracks.length;
  loadTrack(currentIndex);
  playTrack();
}

function prevTrack() {
  currentIndex = (currentIndex - 1 + tracks.length) % tracks.length;
  loadTrack(currentIndex);
  playTrack();
}

function buildList() {
  tracks.forEach((name, i) => {
    const li = document.createElement("li");
    li.textContent = name;
    li.addEventListener("click", () => {
      loadTrack(i);
      playTrack();
    });
    trackListEl.appendChild(li);
  });
}

audioEl.addEventListener("timeupdate", () => {
  if (!isNaN(audioEl.duration)) {
    seekBar.value = (audioEl.currentTime / audioEl.duration) * 100;
    currentTimeEl.textContent = formatTime(audioEl.currentTime);
    durationEl.textContent = formatTime(audioEl.duration);
  }
});

seekBar.addEventListener("input", () => {
  if (!isNaN(audioEl.duration)) {
    audioEl.currentTime = (seekBar.value / 100) * audioEl.duration;
  }
});

volumeSlider.addEventListener("input", () => {
  audioEl.volume = volumeSlider.value;
});

audioEl.addEventListener("ended", nextTrack);
playPauseBtn.addEventListener("click", () => (isPlaying ? pauseTrack() : playTrack()));
stopBtn.addEventListener("click", stopTrack);
nextBtn.addEventListener("click", nextTrack);
prevBtn.addEventListener("click", prevTrack);

// Init
buildList();
loadTrack(0);
pauseTrack();
