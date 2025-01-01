//https://nwjs.readthedocs.io/en/latest/

const player = require('play-sound')(opts = {});
const fs = require('fs');
const path = require('path');

async function playSound(filePath) {
    try {
        const absolutePath = path.resolve(filePath);
        if (!fs.existsSync(absolutePath)) {
            throw new Error('File does not exist');
        }
        
        await player.play(filePath);
        console.log('Sound played successfully!');
    } catch (err) {
        console.error('Error playing sound:', err);
    }
}

playSound('./ag.mp3');
