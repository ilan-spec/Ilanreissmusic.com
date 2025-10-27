// Your real track names:
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

// Grab elements
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

// State
let currentIndex = 0;
let isPlaying = false;

// safe URL for file with spaces
function fileURL(name) {
  // name like "2 part shit.mp3"
  // -> "audio/2%20part%20shit.mp3"
  return "audio/" + encodeURIComponent(name);
}

// format seconds => M:SS
function formatTime(sec) {
  if (isNaN(sec)) return "0:00";
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60).toString().padStart(2, "0");
  return m + ":" + s;
}

// load a track
function loadTrack(index) {
  currentIndex = index;
  const filename = tracks[currentIndex];

  audioEl.src = fileURL(filename);
  audioEl.load(); // force browser to load new source
  currentTrackNameEl.textContent = filename.replace(/\.mp3$/i, "");

  // highlight active in sidebar
  [...trackListEl.children].forEach((li, i) => {
    li.classList.toggle("active", i === currentIndex);
  });

  // reset UI
  seekBar.value = 0;
  currentTimeEl.textContent = "0:00";
  durationEl.textContent = "0:00";
}

// play current track
function playTrack() {
  audioEl.play().then(() => {
    isPlaying = true;
    playPauseBtn.textContent = "⏸ Pause";
  }).catch(err => {
    console.log("Playback blocked (maybe no user gesture yet):", err);
  });
}

// pause current track
function pauseTrack() {
  audioEl.pause();
  isPlaying = false;
  playPauseBtn.textContent = "▶ Play";
}

// stop (pause + rewind)
function stopTrack() {
  audioEl.pause();
  audioEl.currentTime = 0;
  isPlaying = false;
  playPauseBtn.textContent = "▶ Play";
}

// next / prev
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

// build sidebar list
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

// time/progress updates
audioEl.addEventListener("timeupdate", () => {
  if (!isNaN(audioEl.duration)) {
    seekBar.value = (audioEl.currentTime / audioEl.duration) * 100;
    currentTimeEl.textContent = formatTime(audioEl.currentTime);
    durationEl.textContent = formatTime(audioEl.duration);
  }
});

// manual seek
seekBar.addEventListener("input", () => {
  if (!isNaN(audioEl.duration)) {
    const newTime = (seekBar.value / 100) * audioEl.duration;
    audioEl.currentTime = newTime;
  }
});

// volume
volumeSlider.addEventListener("input", () => {
  audioEl.volume = volumeSlider.value;
});

// autoplay next when ended
audioEl.addEventListener("ended", () => {
  nextTrack();
});

// button listeners
playPauseBtn.addEventListener("click", () => {
  if (!isPlaying) {
    playTrack();
  } else {
    pauseTrack();
  }
});

stopBtn.addEventListener("click", stopTrack);
nextBtn.addEventListener("click", nextTrack);
prevBtn.addEventListener("click", prevTrack);

// init
buildList();
loadTrack(0);
pauseTrack(); // make sure UI starts in paused state
