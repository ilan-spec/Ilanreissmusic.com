class AudioPlayer {
    constructor() {
        // Your tracks list
        this.tracks = [
            '2 part shit.mp3', '42 cent.mp3', '67.mp3', '808 beat sample.mp3',
            'a break.mp3', 'all me.mp3', 'another one.mp3', 'asher organ.mp3',
            'ass with potench.mp3', 'bad one.mp3', 'been a minu.mp3', 'beeps.mp3',
            'before my set.mp3', 'before you go.mp3', 'black airforces.mp3',
            'bubs final.mp3', 'bubs.mp3', 'buds.mp3', 'bullshittin.mp3',
            'candy shack.mp3', 'chicos.mp3', 'chilled.mp3', 'com 303 sh.mp3',
            'corp. rework.mp3', 'corp..mp3', 'cya.mp3', 'cypher chopped.mp3',
            'danklin.mp3', 'day ones.mp3', 'day today .mp3', 'delete this track.mp3',
            'dub w.mp3', 'easter.mp3', 'ff.mp3', 'flip.mp3', 'fly guy.mp3',
            'for it.mp3', 'for the car.mp3', 'fridays.mp3', 'fuckin idk.mp3',
            'funky.mp3', 'gallery lazy break.mp3', 'gallery.mp3', 'giving in.mp3',
            'go 2.mp3', 'goin crazy wit 10 racks.mp3', 'goin crazy with 10 racks.mp3',
            'golf soundscape.mp3', 'gover.mp3', 'grizzlies ART.mp3', 'grizzlies.mp3',
            'half life beat.mp3', 'hammer down.mp3', 'have it.mp3', 'have to save.mp3',
            'hit the cart.mp3', 'House on plane.mp3', 'huh.mp3', 'hyper fix.mp3',
            'i wanna.mp3', 'insanity.mp3', 'is ass.mp3', 'jungled.mp3', 'kenny.mp3',
            'kirked.mp3', 'last of day.mp3', 'lastly.mp3', 'late.mp3', 'lib beat.mp3',
            'locked.mp3', 'lost it unfinished.mp3', 'lyra demo.mp3', 'ma.mp3',
            'making progress thru.mp3', 'making progress.mp3', 'mini 808.mp3',
            'MPC iPhone beat.mp3', 'my amigo.mp3', 'my sound scape.mp3',
            'new jersey club.mp3', 'new setup.mp3', 'niko again .mp3',
            'niko again unfinished.mp3', 'niko is talking.mp3', 'not done beat.mp3',
            'not thru.mp3', 'not trash.mp3', 'null.mp3', 'number 3 shit.mp3',
            'On plane shiz.mp3', 'postd.mp3', 'practice.mp3', 'quiky.mp3',
            'rabbits.mp3', 'read up.mp3', 'recipe.mp3', 'redo.mp3', 'reggae.mp3',
            'reggetons.mp3', 'Reiss_Soundscape_edit.mp3', 'Reiss_soundscape_raw.mp3',
            'rick poppa.mp3', 'rythm.mp3', 'same goal.mp3', 'saturday morning.mp3',
            'saturn.mp3', 'save rq.mp3', 'saved it.mp3', 'serup.mp3',
            'shit is trash.mp3', 'shortest beat.mp3', 'show class.mp3',
            'show trash.mp3', 'slash slowed.mp3', 'slash.mp3', 'slow jam 2.mp3',
            'slow ride.mp3', 'snippes.mp3', 'soundbath 2.mp3', 'soundbath.mp3',
            'SP iPhone sample.mp3', 'spit it out.mp3', 'standing in the rain.mp3',
            'starterd.mp3', 'sue nami.mp3', 'surfin.mp3', 'swang.mp3',
            'swing song w eli.mp3', 'synth demo.mp3', 'take 2.mp3', 'techno.mp3',
            'that way.mp3', 'the monitor.mp3', 'the worst beat ever.mp3',
            'this again.mp3', 'threw together.mp3', 'throw it up.mp3', 'thursday.mp3',
            'trios.mp3', 'trump-pets.mp3', 'un house.mp3', 'w issy.mp3',
            'watch it go.mp3', 'week from today.mp3', 'what am i doing.mp3',
            'what is this.mp3', 'z style.mp3'
        ];
        
        this.currentTrackIndex = 0;
        this.isPlaying = false;
        this.audio = new Audio();
        
        this.initializePlayer();
        this.setupEventListeners();
    }

    initializePlayer() {
        this.renderPlaylist();
        this.setupAudioListeners();
    }

    renderPlaylist() {
        const playlist = document.getElementById('playlist');
        playlist.innerHTML = '';

        this.tracks.forEach((track, index) => {
            const trackElement = document.createElement('div');
            trackElement.className = 'track-item';
            trackElement.textContent = track.replace('.mp3', '');
            trackElement.addEventListener('click', () => this.playTrack(index));
            playlist.appendChild(trackElement);
        });
    }

    setupEventListeners() {
        // Control buttons
        document.getElementById('play-btn').addEventListener('click', () => this.togglePlay());
        document.getElementById('prev-btn').addEventListener('click', () => this.playPrevious());
        document.getElementById('next-btn').addEventListener('click', () => this.playNext());
        
        // Volume control
        document.getElementById('volume').addEventListener('input', (e) => {
            this.audio.volume = e.target.value;
        });

        // Search functionality
        document.getElementById('search').addEventListener('input', (e) => {
            this.filterTracks(e.target.value);
        });

        // Progress bar
        document.querySelector('.progress-bar').addEventListener('click', (e) => {
            const progressBar = e.currentTarget;
            const clickPosition = (e.pageX - progressBar.offsetLeft) / progressBar.offsetWidth;
            this.audio.currentTime = clickPosition * this.audio.duration;
        });
    }

    setupAudioListeners() {
        this.audio.addEventListener('timeupdate', () => {
            this.updateProgress();
            this.updateCurrentTime();
        });

        this.audio.addEventListener('ended', () => {
            this.playNext();
        });

        this.audio.addEventListener('loadedmetadata', () => {
            document.getElementById('duration').textContent = this.formatTime(this.audio.duration);
        });
    }

    playTrack(index) {
        if (index >= 0 && index < this.tracks.length) {
            this.currentTrackIndex = index;
            const track = this.tracks[index];
            this.audio.src = `audio/${encodeURIComponent(track)}`;
            this.audio.play();
            this.isPlaying = true;
            this.updatePlayButton();
            this.updateNowPlaying();
            this.highlightCurrentTrack();
        }
    }

    togglePlay() {
        if (this.audio.src) {
            if (this.isPlaying) {
                this.audio.pause();
            } else {
                this.audio.play();
            }
            this.isPlaying = !this.isPlaying;
            this.updatePlayButton();
        } else {
            this.playTrack(0);
        }
    }

    playNext() {
        this.playTrack((this.currentTrackIndex + 1) % this.tracks.length);
    }

    playPrevious() {
        this.playTrack((this.currentTrackIndex - 1 + this.tracks.length) % this.tracks.length);
    }

    updateProgress() {
        const progress = document.getElementById('progress');
        const percentage = (this.audio.currentTime / this.audio.duration) * 100;
        progress.style.width = `${percentage}%`;
    }

    updateCurrentTime() {
        document.getElementById('current-time').textContent = this.formatTime(this.audio.currentTime);
    }

    formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    }

    updatePlayButton() {
        const playBtn = document.getElementById('play-btn');
        playBtn.textContent = this.isPlaying ? 'Pause' : 'Play';
    }

    updateNowPlaying() {
        const currentTrack = document.getElementById('current-track');
        currentTrack.textContent = this.tracks[this.currentTrackIndex].replace('.mp3', '');
    }

    highlightCurrentTrack() {
        document.querySelectorAll('.track-item').forEach((item, index) => {
            item.classList.toggle('active', index === this.currentTrackIndex);
        });
    }

    filterTracks(searchTerm) {
        const playlist = document.getElementById('playlist');
        playlist.innerHTML = '';

        this.tracks.forEach((track, index) => {
            if (track.toLowerCase().includes(searchTerm.toLowerCase())) {
                const trackElement = document.createElement('div');
                trackElement.className = 'track-item';
                if (index === this.current