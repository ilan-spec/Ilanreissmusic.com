class AudioPlayer {
    constructor() {
        // Update to use GitHub Pages URL instead of raw.githubusercontent.com
        this.repoBaseUrl = 'https://ilan-spec.github.io/audio-player';
        this.audioBasePath = '/audio';
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
        
        this.initializePlayer();
        this.initializeAudioContext();
        this.setupEventListeners();
        this.initializePlaylist(); // Call this immediately instead of waiting
        this.setupWindowDragging();
    }

    playTrack(index) {
        if (index < 0 || index >= this.audioFiles.length) return;
        
        this.currentTrackIndex = index;
        const fileName = this.audioFiles[index];
        // Use relative path since we're serving from GitHub Pages
        const fileUrl = `audio/${encodeURIComponent(fileName)}`;
        
        console.log('Attempting to play:', fileUrl); // Debug log
        this.updateStatus(`Loading: ${fileName}`);
        
        this.audio.src = fileUrl;
        this.audio.load();
        
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
                this.updateStatus('Error: Cannot play file');
            });
    }

    // ... [rest of the code stays the same] ...
}