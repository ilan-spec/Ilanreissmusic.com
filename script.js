// Array of audio tracks with exact filenames
const audioTracks = [
    "2 part shit.mp3", "42 cent.mp3", "67.mp3", "808 beat sample.mp3", "a break.mp3",
    "all me.mp3", "another one.mp3", "asher organ.mp3", "ass with potench.mp3", "bad one.mp3",
    "been a minu.mp3", "beeps.mp3", "before my set.mp3", "before you go.mp3", "black airforces.mp3",
    "bubs final.mp3", "bubs.mp3", "buds.mp3", "bullshittin.mp3", "candy shack.mp3",
    "chicos.mp3", "chilled.mp3", "com 303 sh.mp3", "corp. rework.mp3", "corp..mp3",
    "cya.mp3", "cypher chopped.mp3", "danklin.mp3", "day ones.mp3", "day today .mp3",
    "delete this track.mp3", "dub w.mp3", "easter.mp3", "ff.mp3", "flip.mp3",
    "fly guy.mp3", "for it.mp3", "for the car.mp3", "fridays.mp3", "fuckin idk.mp3",
    "funky.mp3", "gallery lazy break.mp3", "gallery.mp3", "giving in.mp3", "go 2.mp3",
    "goin crazy wit 10 racks.mp3", "goin crazy with 10 racks.mp3", "golf soundscape.mp3",
    "gover.mp3", "grizzlies ART.mp3", "grizzlies.mp3", "half life beat.mp3", "hammer down.mp3",
    "have it.mp3", "have to save.mp3", "hit the cart.mp3", "House on plane.mp3", "huh.mp3",
    "hyper fix.mp3", "i wanna.mp3", "insanity.mp3", "is ass.mp3", "jungled.mp3",
    "kenny.mp3", "kirked.mp3", "last of day.mp3", "lastly.mp3", "late.mp3",
    "lib beat.mp3", "locked.mp3", "lost it unfinished.mp3", "lyra demo.mp3", "ma.mp3",
    "making progress thru.mp3", "making progress.mp3", "mini 808.mp3", "MPC iPhone beat.mp3",
    "my amigo.mp3", "my sound scape.mp3", "new jersey club.mp3", "new setup.mp3",
    "niko again .mp3", "niko again unfinished.mp3", "niko is talking.mp3", "not done beat.mp3",
    "not thru.mp3", "not trash.mp3", "null.mp3", "number 3 shit.mp3", "On plane shiz.mp3",
    "postd.mp3", "practice.mp3", "quiky.mp3", "rabbits.mp3", "read up.mp3",
    "recipe.mp3", "redo.mp3", "reggae.mp3", "reggetons.mp3", "Reiss_Soundscape_edit.mp3",
    "Reiss_soundscape_raw.mp3", "rick poppa.mp3", "rythm.mp3", "same goal.mp3",
    "saturday morning.mp3", "saturn.mp3", "save rq.mp3", "saved it.mp3", "serup.mp3",
    "shit is trash.mp3", "shortest beat.mp3", "show class.mp3", "show trash.mp3",
    "slash slowed.mp3", "slash.mp3", "slow jam 2.mp3", "slow ride.mp3", "snippes.mp3",
    "soundbath 2.mp3", "soundbath.mp3", "SP iPhone sample.mp3", "spit it out.mp3",
    "standing in the rain.mp3", "starterd.mp3", "sue nami.mp3", "surfin.mp3", "swang.mp3",
    "swing song w eli.mp3", "synth demo.mp3", "take 2.mp3", "techno.mp3", "that way.mp3",
    "the monitor.mp3", "the worst beat ever.mp3", "this again.mp3", "threw together.mp3",
    "throw it up.mp3", "thursday.mp3", "trios.mp3", "trump-pets.mp3", "un house.mp3",
    "w issy.mp3", "watch it go.mp3", "week from today.mp3", "what am i doing.mp3",
    "what is this.mp3", "z style.mp3"
];

// DOM Elements
const audioPlayer = document.getElementById('audio-player');
const trackList = document.getElementById('track-list');
const currentTrackDisplay = document.getElementById('current-track');
const searchInput = document.getElementById('search-input');
const clock = document.getElementById('clock');

let currentPlayingItem = null;

// Make windows draggable and resizable
$(function() {
    $('.window').draggable({
        handle: '.window-header',
        containment: 'parent'
    }).resizable({
        minWidth: 600,
        minHeight: 400,
        containment: 'parent'
    });

    // Window controls
    $('.window .close').click(function() {
        $(this).closest('.window').hide();
    });

    $('.window .minimize').click(function() {
        $(this).closest('.window').toggleClass('minimized');
    });

    $('.window .maximize').click(function() {
        const $window = $(this).closest('.window');
        $window.toggleClass('maximized');
        
        if ($window.hasClass('maximized')) {
            $window.css({
                top: 0,
                left: 0,
                width: '100%',
                height: `calc(100% - ${document.querySelector('.taskbar').offsetHeight}px)`
            });
        } else {
            $window.css({
                top: '50px',
                left: '50px',
                width: '800px',
                height: '600px'
            });
        }
    });

    // Desktop icons
    $('#music-player-icon').click(function() {
        const $window = $('#music-player-window');
        $window.show().removeClass('minimized');
        $('.window').css('z-index', 1);
        $window.css('z-index', 2);
    });
});

// Update clock
function updateClock() {
    const now = new Date();
    clock.textContent = now.toLocaleTimeString();
}
setInterval(updateClock, 1000);
updateClock();

// Check if audio file exists
async function checkAudioFileExists(url) {
    try {
        const response = await fetch(url, { method: 'HEAD' });
        return response.ok;
    } catch (error) {
        return false;
    }
}

// Create track list
function createTrackList(tracks) {
    trackList.innerHTML = '';
    tracks.forEach(track => {
        const trackItem = document.createElement('div');
        trackItem.className = 'track-item';
        
        const icon = document.createElement('img');
        icon.src = 'https://win7simu.vilejujo.com/img/music-file.png';
        icon.alt = 'Music';
        trackItem.appendChild(icon);
        
        const trackName = document.createElement('span');
        trackName.textContent = track.replace('.mp3', '');
        trackItem.appendChild(trackName);
        
        trackItem.addEventListener('click', async () => {
            try {
                const audioPath = `Audio/${track}`;
                
                // Check if file exists
                const fileExists = await checkAudioFileExists(audioPath);
                if (!fileExists) {
                    throw new Error(`Audio file "${track}" not found in the Audio folder`);
                }
                
                if (currentPlayingItem) {
                    currentPlayingItem.classList.remove('playing');
                }
                
                trackItem.classList.add('playing');
                currentPlayingItem = trackItem;
                
                audioPlayer.src = audioPath;
                currentTrackDisplay.textContent = track.replace('.mp3', '');
                document.querySelector('.playing-icon').style.display = 'block';
                
                await audioPlayer.play();
            } catch (error) {
                console.error('Error playing audio:', error);
                alert(`Unable to play "${track}". Please ensure the audio file exists in the Audio folder.`);
            }
        });
        
        trackList.appendChild(trackItem);
    });
}

// Search functionality
searchInput.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const filteredTracks = audioTracks.filter(track => 
        track.toLowerCase().includes(searchTerm)
    );
    createTrackList(filteredTracks);
});

// Initialize track list
createTrackList(audioTracks);

// Show music player window by default
$('#music-player-window').show();