// Audio files array
const audioFiles = [
    '2 part shit.mp3', '42 cent.mp3', '67.mp3', '808 beat sample.mp3',
    'a break.mp3', 'all me.mp3', 'another one.mp3', 'asher organ.mp3',
    'ass with potench.mp3', 'bad one.mp3', 'been a minµ.mp3', 'beeps.mp3',
    'before my set.mp3', 'before you go.mp3', 'black airforces.mp3',
    'bubs final.mp3', 'bubs.mp3', 'buds.mp3', 'bullshittin.mp3',
    'candy shack.mp3', 'chicos.mp3', 'chilled.mp3', 'com 303 sh.mp3',
    'corp. rework.mp3', 'corp..mp3', 'cya.mp3', 'cypher chopped.mp3',
    'darklin.mp3', 'day ones.mp3', 'day today .mp3', 'delete this track.mp3',
    'dub w.mp3', 'easter.mp3', 'ff.mp3'
];

let currentTrackIndex = 0;
let isPlaying = false;
const audio = new Audio();

// Window dragging functionality
function makeWindowDraggable(windowElement) {
    const titleBar = windowElement.querySelector('.title-bar');
    let isDragging = false;
    let currentX;
    let currentY;
    let initialX;
    let initialY;

    titleBar.addEventListener('mousedown', (e) => {
        isDragging = true;
        initialX = e.clientX - windowElement.offsetLeft;
        initialY = e.clientY - windowElement.offsetTop;
    });

    document.addEventListener('mousemove', (e) => {
        if (isDragging) {
            currentX = e.clientX - initialX;
            currentY = e.clientY - initialY;
            windowElement.style.left = `${currentX}px`;
            windowElement.style.top = `${currentY}px`;
        }
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
    });
}

// Initialize windows
const playerWindow = document.getElementById('player-window');
const playlistWindow = document.getElementById('playlist-window');
makeWindowDraggable(playerWindow);
makeWindowDraggable(playlistWindow);

// Visualizer animation
function updateVisualizer() {
    if (isPlaying) {
        document.querySelectorAll('.bar').forEach(bar => {
            const height = Math.random() * 100;
            bar.style.height = `${height}%`;
        });
    }
    requestAnimationFrame(updateVisualizer);
}

// Initialize playlist
function initializePlaylist() {
    const playlist = document.getElementById('playlist');
    const trackCount = document.getElementById('track-count');
    
    audioFiles.forEach((file, index) => {
        const trackItem = document.createElement('div');
        trackItem.className = 'track-item';
        trackItem.innerHTML = `
            <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath d='M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z'/%3E%3C/svg%3E" 
                 width="16" height="16">
            <span>${file}</span>
        `;
        trackItem.addEventListener('click', () => playTrack(index));
        playlist.appendChild(trackItem);
    });
    
    trackCount.textContent = audioFiles.length;
}

// Play track function
function playTrack(index) {
    currentTrackIndex = index;
    const trackPath = `audio/${audioFiles[index]}`;
    audio.src = trackPath;
    audio.play();
    isPlaying = true;
    updatePlayButton();
    updateActiveTrack();
    updateTrackInfo();
}

// Update play button appearance
function updatePlayButton() {
    const playBtn = document.getElementById('play-btn');
    playBtn.textContent = isPlaying ? '⏸' : '▶';
}

// Update active track in playlist
function updateActiveTrack() {
    document.querySelectorAll('.track-item').forEach((item, index) => {
        item.classList.toggle('active', index === currentTrackIndex);
    });
}

// Update track information
function updateTrackInfo() {
    const currentTrackName = document.getElementById('current-track-name');
    currentTrackName.textContent = audioFiles[currentTrackIndex];
}

// Event Listeners
document.getElementById('play-btn').addEventListener('click', () => {
    if (audio.src) {
        if (isPlaying) {
            audio.pause();
        } else {
            audio.play();
        }
        isPlaying = !isPlaying;