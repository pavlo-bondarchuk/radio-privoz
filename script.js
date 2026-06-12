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

const audio = document.querySelector("#player");

async function startPlayback() {
  try {
    await player.play();
  } catch {
    player.muted = true;

    try {
      await player.play();
    } catch {
      // Some browsers require a user interaction before any playback.
    }
  }
}

window.addEventListener(
  "load",
  () => {
    if (audio.readyState >= HTMLMediaElement.HAVE_FUTURE_DATA) {
      startPlayback();
      return;
    }

    audio.addEventListener("canplay", startPlayback, { once: true });
  },
  { once: true },
);

window.radioPlayer = player;
