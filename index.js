const player = require('play-sound')(opts = {});

console.log("hello world")
player.play('./a.mp3', function(err) {
  if (err) {
    console.log('Error:', err);
  } else {
    console.log('Audio played successfully');
  }
});

// const sound = require("sound-play");

// sound.play("a.mp3").then((response) => console.log("done"));
