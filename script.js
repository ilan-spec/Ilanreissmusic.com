class AudioPlayer {
    constructor() {
        // Update the repository URL to point to your actual repository
        this.repoBaseUrl = 'https://raw.githubusercontent.com/ilan-spec/audio-player/main';
        // Since files are in the audio folder
        this.audioBasePath = '/audio';
        
        // Initialize audio files array
        this.audioFiles = [];
        this.currentTrackIndex = 0;
        this.isPlaying = false;
        this.audio = new Audio();
        
        // Initialize everything
        this.initializeAudioContext();
        this.initializePlayer();
        this.setupEventListeners();
        this.loadAudioFiles();
        this.setupWindowDragging();
    }

    async loadAudioFiles() {
        try {
            this.updateStatus('Loading audio files list...');
            
            // Set the audio files manually since we know they're in the repository
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

            // Initialize the playlist with the files
            this.initializePlaylist();
            this.updateStatus('Ready to play');
        } catch (error) {
            console.error('Error loading audio files:', error);
            this.updateStatus('Error loading files');
        }
    }

    playTrack(index) {
        if (index < 0 || index >= this.audioFiles.length) return;
        
        this.currentTrackIndex = index;
        const fileName = this.audioFiles[index];
        // Construct the full URL to the audio file
        const fileUrl = `${this.repoBaseUrl}${this.audioBasePath}/${encodeURIComponent(fileName)}`;
        
        console.log('Playing file:', fileUrl); // Debug log
        this.updateStatus(`Loading: ${fileName}`);
        
        // Set the audio source and play
        this.audio.src = fileUrl;
        this.audio.load(); // Important: load the audio before playing
        
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
                this.updateStatus('Error playing track: ' + error.message);
            });
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
            
            trackItem.addEventListener('click', () => {
                console.log('Track clicked:', file); // Debug log
                this.playTrack(index);
            });
            playlist.appendChild(trackItem);
        });

        // Update track count
        const trackCount = document.getElementById('track-count');
        if (trackCount) {
            trackCount.textContent = this.audioFiles.length;
        }
    }

    // ... [rest of the AudioPlayer class remains the same] ...
}

// Initialize the player when the document is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('Initializing audio player...'); // Debug log
    const player = new AudioPlayer();
});