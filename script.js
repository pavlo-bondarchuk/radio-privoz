const player = new Plyr("#player", {
  controls: [
    "play",
    "current-time",
    "progress",
    "duration",
    "mute",
    "volume",
  ],
  invertTime: false,
  keyboard: {
    focused: true,
    global: true,
  },
});

window.radioPlayer = player;
