(function () {
  "use strict";

  window.dataLayer = window.dataLayer || [];

  function getSiteLanguage() {
    return document.documentElement.lang || "uk";
  }

  function pushEvent(eventName, parameters) {
    var eventData = Object.assign(
      {
        event: eventName,
        site_language: getSiteLanguage()
      },
      parameters || {}
    );

    window.dataLayer.push(eventData);
  }

  window.prywozAnalytics = Object.freeze({ push: pushEvent });

  var audio = document.querySelector("[data-persistent-radio], .live-player__audio");
  var milestones = [
    { seconds: 60, event: "radio_listen_1m" },
    { seconds: 300, event: "radio_listen_5m" },
    { seconds: 900, event: "radio_listen_15m" }
  ];
  var sentMilestones = new Set();
  var listenedMilliseconds = 0;
  var lastTick = performance.now();
  var isListening = false;

  function getRadioParameters() {
    var mode = audio?.dataset.broadcastMode;
    return mode === "day" || mode === "night" ? { broadcast_mode: mode } : {};
  }

  function updateMilestones() {
    var listenedSeconds = listenedMilliseconds / 1000;

    milestones.forEach(function (milestone) {
      if (listenedSeconds >= milestone.seconds && !sentMilestones.has(milestone.event)) {
        sentMilestones.add(milestone.event);
        pushEvent(milestone.event, getRadioParameters());
      }
    });
  }

  if (audio) {
    audio.addEventListener("play", function () {
      pushEvent("radio_play", getRadioParameters());
    });

    audio.addEventListener("pause", function () {
      isListening = false;
      pushEvent("radio_pause", getRadioParameters());
    });

    audio.addEventListener("playing", function () {
      lastTick = performance.now();
      isListening = true;
    });

    ["waiting", "stalled", "error", "ended"].forEach(function (eventName) {
      audio.addEventListener(eventName, function () {
        isListening = false;
      });
    });

    audio.addEventListener("error", function () {
      pushEvent("radio_error", Object.assign(
        { error_code: audio.error ? audio.error.code : 0 },
        getRadioParameters()
      ));
    });

    window.setInterval(function () {
      var currentTick = performance.now();
      var elapsed = currentTick - lastTick;
      lastTick = currentTick;

      if (isListening && !audio.paused && !audio.muted && audio.volume > 0 && !audio.ended && audio.readyState >= HTMLMediaElement.HAVE_FUTURE_DATA) {
        listenedMilliseconds += elapsed;
        updateMilestones();
      }
    }, 1000);
  }

  var currentLanguage = getSiteLanguage();
  document.addEventListener("prywoz:languagechange", function (event) {
    var nextLanguage = event.detail?.language || getSiteLanguage();
    if (nextLanguage === currentLanguage) return;

    currentLanguage = nextLanguage;
    pushEvent("language_change", { site_language: nextLanguage });
  });

  document.addEventListener("click", function (event) {
    var newsLink = event.target.closest("a[data-news-source]");
    if (newsLink) {
      var source = newsLink.dataset.newsSource;
      pushEvent("news_open", source ? { news_source: source } : {});
      return;
    }

    var contactLink = event.target.closest('a[href^="mailto:"], a[href^="tel:"]');
    if (contactLink) {
      pushEvent("contact_click", {
        contact_type: contactLink.getAttribute("href").startsWith("tel:") ? "phone" : "email"
      });
    }
  });

  document.addEventListener("prywoz:registration-success", function () {
    pushEvent("card_registration_success");
  });
}());
