// This function runs once the entire HTML page has loaded
document.addEventListener('DOMContentLoaded', () => {

    // THIS IS YOUR LIST OF AUDIO FILES
    // I have copied all the names you provided.
    // This list MUST match the files you put in the 'audio' folder.
    const audioFiles = [
        "2 part shit.mp3", "42 cent.mp3", "67.mp3", "808 beat sample.mp3",
        "a break.mp3", "all me.mp3", "another one.mp3", "asher organ.mp3",
        "ass with potench.mp3", "bad one.mp3", "been a minu.mp3", "beeps.mp3",
        "before my set.mp3", "before you go.mp3", "black airforces.mp3",
        "bubs final.mp3", "bubs.mp3", "buds.mp3", "bullshittin.mp3",
        "candy shack.mp3", "chicos.mp3", "chilled.mp3", "com 303 sh.mp3",
        "corp. rework.mp3", "corp..mp3", "cya.mp3", "cypher chopped.mp3",
        "danklin.mp3", "day ones.mp3", "day today .mp3", "delete this track.mp3",
        "dub w.mp3", "easter.mp3", "ff.mp3", "flip.mp3", "fly guy.mp3",
        "for it.mp3", "for the car.mp3", "fridays.mp3", "fuckin idk.mp3",
        "funky.mp3", "gallery lazy break.mp3", "gallery.mp3", "giving in.mp3",
        "go 2.mp3", "goin crazy wit 10 racks.mp3", "goin crazy with 10 racks.mp3",
        "golf soundscape.mp3", "gover.mp3", "grizzlies ART.mp3", "grizzlies.mp3",
        "half life beat.mp3", "hammer down.mp3", "have it.mp3", "have to save.mp3",
        "hit the cart.mp3", "House on plane.mp3", "huh.mp3", "hyper fix.mp3",
        "i wanna.mp3", "insanity.mp3", "is ass.mp3", "jungled.mp3", "kenny.mp3",
        "kirked.mp3", "last of day.mp3", "lastly.mp3", "late.mp3", "lib beat.mp3",
        "locked.mp3", "lost it unfinished.mp3", "lyra demo.mp3", "ma.mp3",
        "making progress thru.mp3", "making progress.mp3", "mini 808.mp3",
        "MPC iPhone beat.mp3", "my amigo.mp3", "my sound scape.mp3",
        "new jersey club.mp3", "new setup.mp3", "niko again .mp3",
        "niko again unfinished.mp3", "niko is talking.mp3", "not done beat.mp3",
        "not thru.mp3", "not trash.mp3", "null.mp3", "number 3 shit.mp3",
        "On plane shiz.mp3", "postd.mp3", "practice.mp3", "quiky.mp3",
        "rabbits.mp3", "read up.mp3", "recipe.mp3", "redo.mp3", "reggae.mp3",
        "reggetons.mp3", "Reiss_Soundscape_edit.mp3", "Reiss_soundscape_raw.mp3",
* "rick poppa.mp3", "rythm.mp3", "same goal.mp3", "saturday morning.mp3",
        "saturn.mp3", "save rq.mp3", "saved it.mp3", "serup.mp3",
        "shit is trash.mp3", "shortest beat.mp3", "show class.mp3",
        "show trash.mp3", "slash slowed.mp3", "slash.mp3", "slow jam 2.mp3",
        "slow ride.mp3", "snippes.mp3", "soundbath 2.mp3", "soundbath.mp3",
        "SP iPhone sample.mp3", "spit it out.mp3", "standing in the rain.mp3",
        "starterd.mp3", "sue nami.mp3", "surfin.mp3", "swang.mp3",
* "swing song w eli.mp3", "synth demo.mp3", "take 2.mp3", "techno.mp3",
        "that way.mp3", "the monitor.mp3", "the worst beat ever.mp3",
        "this again.mp3", "threw together.mp3", "throw it up.mp3",
        "thursday.mp3", "trios.mp3", "trump-pets.mp3", "un house.mp3",
        "w issy.mp3", "watch it go.mp3", "week from today.mp3",
        "what am i doing.mp3", "what is this.mp3", "z style.mp3"
    ];

    // Get references to the HTML elements we need to work with
    const fileListElement = document.getElementById('file-list');
    const audioPlayer = document.getElementById('audio-player');
    const nowPlayingElement = document.getElementById('now-playing');

    // Go through each file name in the 'audioFiles' list
    audioFiles.forEach(file => {
        // Create a new list item (<li>)
        const li = document.createElement('li');
        
        // Set the text of the list item to the file name (but remove the '.mp3' for a cleaner look)
        li.textContent = file.replace('.mp3', '');
        
        // Store the *full* file name in a 'data-' attribute. This is how we'll know which file to play.
        li.dataset.filename = file;
        
        // Add the new list item to the <ul> in the HTML
        fileListElement.appendChild(li);
    });

    // Add ONE click listener to the entire list.
    // This is more efficient than adding one to every single list item.
    fileListElement.addEventListener('click', (event) => {
        // Check if the thing that was clicked was actually a list item (<li>)
        if (event.target && event.target.tagName === 'LI') {
            const clickedLi = event.target;
            
            // Get the full filename we stored in the 'data-filename' attribute
            const filename = clickedLi.dataset.filename;

            // --- THIS IS THE MOST IMPORTANT PART ---
            // Set the audio player's source to the file *inside the audio folder*
            audioPlayer.src = 'audio/' + filename;
            // -------------------------------------

            // Tell the audio player to play
            audioPlayer.play();

            // Update the "Now Playing" text
            nowPlayingElement.textContent = clickedLi.textContent; // Use the clean name

            // --- Manage the 'active' class for styling ---
            
            // 1. Find the item that is *currently* active (if any)
            const currentActive = fileListElement.querySelector('.active');
            
            // 2. If one is active, remove the 'active' class from it
            if (currentActive) {
                currentActive.classList.remove('active');
            }
            
            // 3. Add the 'active' class to the item we just clicked
            clickedLi.classList.add('active');
        }
    });

});