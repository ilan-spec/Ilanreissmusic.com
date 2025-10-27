class AudioPlayer {
    constructor() {
        this.audioFiles = [
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
        this.currentTrackIndex = 0;
        this.isPlaying = false;
        this.audio = new Audio();
        this.initializeAudioContext();
        this.initializePlayer();
        this.setupEventListeners();
        this.initializePlaylist();
        this.setupWindowDragging();
    }

    initializeAudioContext() {
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        this.analyser = this.audioContext.createAnalyser();
        this.analyser.fftSize = 256;
        this.bufferLength = this.analyser.frequencyBinCount;
        this.dataArray = new Uint8Array(this.bufferLength);
        
        this.source = this.audioContext.createMediaElementSource(this.audio);
        this.source.connect(this.analyser);
        this.analyser.connect(this.audioContext.destination);
    }

    initializePlayer() {
        this.canvas = document.getElementById('visualizer');
        this.canvasCtx = this.canvas.getContext('2d');
        this.canvas.width = this.canvas.offsetWidth;
        this.canvas.height = this.canvas.offsetHeight;
    }

    setupEventListeners() {
        // Player controls
        document.getElementById('play-btn').addEventListener('click', () => this.togglePlay());
        document.getElementById('stop-btn').addEventListener('click', () => this.stopTrack());
        document.getElementById('prev-btn').addEventListener('click', () => this.playPrevious());
        document.getElementById('next-btn').addEventListener('click', () => this.playNext());
        document.getElementById('volume').addEventListener('input', (e) => this.setVolume(e.target.value));

        // Audio events
        this.audio.addEventListener('timeupdate', () => this.updateProgress());
        this.audio.addEventListener('ended', () => this.onTrackEnd());
        this.audio.addEventListener('loadedmetadata', () => this.updateDuration());

        // Progress bar
        document.querySelector('.progress-container').addEventListener('click', (e) => this.seekTrack(e));

        // Window resize
        window.addEventListener('resize', () => this.resizeCanvas());
    }

    initializePlaylist() {
        const playlist = document.getElementById('playlist');
        this.audioFiles.forEach((file, index) => {
            const trackItem = document.createElement('div');
            trackItem.className = 'track-item';
            trackItem.innerHTML = `
                <img class="track-icon" src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath d='M8 0a8 8 0 100 16A8 8 0 008 0zm3.5 11.5l-6-4v8l6-4z'/%3E%3C/svg%3E">
                <span>${file}</span>
            `;
            trackItem.addEventListener('click', () => this.playTrack(index));
            playlist.appendChild(trackItem);
        });
        document.getElementById('track-count').textContent = this.audioFiles.length;
    }

    setupWindowDragging() {
        const windows = ['player-window', 'playlist-window'];
        windows.forEach(windowId => {
            const windowElement = document.getElementById(windowId);
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
                    e.preventDefault();
                    currentX = e.clientX - initialX;
                    currentY = e.clientY - initialY;
                    windowElement.style.left = `${currentX}px`;
                    windowElement.style.top = `${currentY}px`;
                }
            });

            document.addEventListener('mouseup', () => {
                isDragging = false;
            });
        });
    }

    playTrack(index) {
        this.currentTrackIndex = index;
        this.audio.src = `audio/${this.audioFiles[index]}`;
        this.audio.play();
        this.isPlaying = true;
        this.updatePlayButton();
        this.updateActiveTrack();
        this.updateTrackInfo();
        if (this.audioContext.state === 'suspended') {
            this.audioContext.resume();
        }
        this.drawVisualizer();
    }

    togglePlay() {
        if (this.audio.src) {
            if (this.isPlaying) {
                this.