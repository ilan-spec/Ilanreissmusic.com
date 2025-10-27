class AudioPlayer {
    constructor() {
        // Base repository URL - replace with your repository details
        this.repoBaseUrl = 'https://raw.githubusercontent.com/ilan-spec/ilan-spec/main';
        this.audioBasePath = '/audio';
        this.audioFiles = [];
        this.currentTrackIndex = 0;
        this.isPlaying = false;
        this.audio = new Audio();
        
        // Initialize the player
        this.initializeAudioContext();
        this.initializePlayer();
        this.setupEventListeners();
        this.loadAudioFiles();
        this.setupWindowDragging();
    }

    async loadAudioFiles() {
        try {
            // Fetch the list of audio files from your repository
            const response = await fetch(`${this.repoBaseUrl}/audio`);
            if (!response.ok) {
                throw new Error('Failed to load audio files');
            }
            
            // Update status while loading
            this.updateStatus('Loading audio files...');
            
            // Initialize playlist once files are loaded
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
            
            this.initializePlaylist();
            this.updateStatus('Ready');
        } catch (error) {
            console.error('Error loading audio files:', error);
            this.updateStatus('Error loading files');
        }
    }

    initializeAudioContext() {
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        this.analyser = this.audioContext.createAnalyser();
        this.analyser.fftSize = 256;
        this.bufferLength = this.analyser.frequencyBinCount;
        this.dataArray = new Uint8Array(this.bufferLength);
    }

    initializePlayer() {
        this.canvas = document.getElementById('visualizer');
        this.canvasCtx = this.canvas.getContext('2d');
        
        // Set canvas size
        this.resizeCanvas();
        
        // Initialize audio routing
        this.source = this.audioContext.createMediaElementSource(this.audio);
        this.source.connect(this.analyser);
        this.analyser.connect(this.audioContext.destination);
    }

    initializePlaylist() {
        const playlist = document.getElementById('playlist');
        playlist.innerHTML = ''; // Clear existing items
        
        this.audioFiles.forEach((file, index) => {
            const trackItem = document.createElement('div');
            trackItem.className = 'track-item';
            trackItem.innerHTML = `
                <img class="track-icon" src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath fill='%23000' d='M8 1.5a6.5 6.5 0 100 13 6.5 6.5 0 000-13zM8 0a8 8 0 110 16A8 8 0 018 0zm3.5 11.5l-6-4v8l6-4z'/%3E%3C/svg%3E">
                <span>${file}</span>
            `;
            
            trackItem.addEventListener('click', () => this.playTrack(index));
            playlist.appendChild(trackItem);
        });

        // Update track count
        document.getElementById('track-count').textContent = this.audioFiles.length;
    }

    playTrack(index) {
        if (index < 0 || index >= this.audioFiles.length) return;
        
        this.currentTrackIndex = index;
        const fileName = this.audioFiles[index];
        const fileUrl = `${this.repoBaseUrl}${this.audioBasePath}/${encodeURIComponent(fileName)}`;
        
        this.updateStatus(`Loading: ${fileName}`);
        
        // Update audio source and play
        this.audio.src = fileUrl;
        this.audio.play()
            .then(() => {
                this.isPlaying = true;
                this.updatePlayButton();
                this.updateActiveTrack();
                this.updateTrackInfo();
                this.updateStatus('Playing');
                
                if (this.audioContext.state === 'suspended') {
                    this.audioContext.resume();
                }
                this.startVisualizer();
            })
            .catch(error => {
                console.error('Error playing track:', error);
                this.updateStatus('Error playing track');
            });
    }

    updateStatus(message) {
        const statusBar = document.querySelector('.status-text');
        if (statusBar) {
            statusBar.textContent = message;
        }
    }

    updateActiveTrack() {
        document.querySelectorAll('.track-item').forEach((item, index) => {
            item.classList.toggle('active', index === this.currentTrackIndex);
        });
    }

    updateTrackInfo() {
        const trackName = document.getElementById('current-track-name');
        if (trackName) {
            trackName.textContent = this.audioFiles[this.currentTrackIndex];
        }
    }

    updatePlayButton() {
        const playBtn = document.getElementById('play-btn');
        if (playBtn) {
            playBtn.textContent = this.isPlaying ? '⏸' : '▶';
        }
    }

    togglePlay() {
        if (!this.audio.src) {
            this.playTrack(0);
            return;
        }

        if (this.isPlaying) {
            this.audio.pause();
            this.updateStatus('Paused');
        } else {
            this.audio.play();
            this.updateStatus('Playing');
        }
        
        this.isPlaying = !this.isPlaying;
        this.updatePlayButton();
    }

    startVisualizer() {
        const draw = () => {
            if (!this.isPlaying) return;
            
            requestAnimationFrame(draw);
            this.analyser.getByteFrequencyData(this.dataArray);
            
            this.canvasCtx.fillStyle = 'rgb(0, 0, 0)';
            this.canvasCtx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            
            const barWidth = (this.canvas.width / this.bufferLength) * 2.5;
            let barHeight;
            let x = 0;
            
            for (let i = 0; i < this.bufferLength; i++) {
                barHeight = this.dataArray[i] / 2;
                
                this.canvasCtx.fillStyle = `rgb(0, ${barHeight + 100}, 0)`;
                this.canvasCtx.fillRect(x, this.canvas.height - barHeight, barWidth, barHeight);
                
                x += barWidth + 1;
            }
        };
        
        draw();
    }

    resizeCanvas() {
        if (this.canvas) {
            this.canvas.width = this.canvas.offsetWidth;
            this.canvas.height = this.canvas.offsetHeight;
        }
    }

    setupEventListeners() {
        // Player controls
        document.getElementById('play-btn').addEventListener('click', () => this.togglePlay());
        document.getElementById('prev-btn').addEventListener('click', () => {
            const newIndex = (this.currentTrackIndex - 1 + this.audioFiles.length) % this.audioFiles.length;
            this.playTrack(newIndex);
        });
        document.getElementById('next-btn').addEventListener('click', () => {
            const newIndex = (this.currentTrackIndex + 1) % this.audioFiles.length;
            this.playTrack(newIndex);
        });
        document.getElementById('stop-btn').addEventListener('click', () => {
            this.audio.pause();
            this.audio.currentTime = 0;
            this.isPlaying = false;
            this.updatePlayButton();
            this.updateStatus('Stopped');
        });

        // Volume control
        const volumeControl = document.getElementById('volume');
        if (volumeControl) {
            volumeControl.addEventListener('input', (e) => {
                this.audio.volume = e.target.value;
            });
        }

        // Progress updates
        this.audio.addEventListener('timeupdate', () => {
            const progress = document.getElementById('progress');
            const currentTime = document.getElementById('current-time');
            const totalTime = document.getElementById('total-time');
            
            if (progress && this.audio.duration) {
                const percentage = (this.audio.currentTime / this.audio.duration) * 100;
                progress.style.width = percentage + '%';
            }
            
            if (currentTime) {
                currentTime.textContent = this.formatTime(this.audio.currentTime);
            }
            if (totalTime) {
                totalTime.textContent = this.formatTime(this.audio.duration);
            }
        });

        // Track ended
        this.audio.addEventListener('ended', () => {
            const newIndex = (this.currentTrackIndex + 1) % this.audioFiles.length;
            this.playTrack(newIndex);
        });

        // Window resize
        window.addEventListener('resize', () => this.resizeCanvas());
    }

    formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    }

    setupWindowDragging() {
        ['player-window', 'playlist-window'].forEach(windowId => {
            const windowElement = document.getElementById(windowId);
            const titleBar = windowElement.querySelector('.title-bar');
            let isDragging = false;
            let initialX, initialY, currentX, currentY;

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
}

// Initialize the player when the document is loaded
document.addEventListener('DOMContentLoaded', () => {
    const player = new AudioPlayer();
});