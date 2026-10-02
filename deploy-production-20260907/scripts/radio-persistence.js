(() => {
  const STREAM_URL = "https://listen1.myradio24.com/73556";
  const STATUS_URL = "https://myradio24.com/users/73556/status.json";
  const audio =
    document.querySelector("[data-persistent-radio]") ||
    document.body.appendChild(
      Object.assign(document.createElement("audio"), {
        preload: "none",
        crossOrigin: "anonymous",
      }),
    );
  audio.dataset.persistentRadio = "";

  const storedVolumeValue = localStorage.getItem("prywoz-volume");
  const storedVolume =
    storedVolumeValue === null ? null : Number(storedVolumeValue);
  audio.volume =
    storedVolume !== null &&
    Number.isFinite(storedVolume) &&
    storedVolume >= 0 &&
    storedVolume <= 1
      ? storedVolume
      : 1;

  const getControl = () => document.querySelector("[data-radio-toggle]");
  const getIcon = () => getControl()?.querySelector("use");
  const languageIndex = () =>
    ({ uk: 0, pl: 1, ru: 2 })[localStorage.getItem("prywoz-language")] ?? 0;
  const radioCopy = {
    idle: [
      ["Paused", "Радіо вимкнено"],
      ["Pauza", "Radio wyłączone"],
      ["Пауза", "Радио выключено"],
    ],
    muted: [
      ["Paused", "Без звуку"],
      ["Pauza", "Bez dźwięku"],
      ["Пауза", "Без звука"],
    ],
    loading: [
      ["Connecting", "Підключення…"],
      ["Łączenie", "Łączenie…"],
      ["Подключение", "Подключение…"],
    ],
    live: [
      ["On air", "Ефір наживо"],
      ["Na antenie", "Radio na żywo"],
      ["В эфире", "Прямой эфир"],
    ],
    error: [
      ["Offline", "Помилка ефіру"],
      ["Offline", "Błąd odtwarzania"],
      ["Офлайн", "Ошибка эфира"],
    ],
  };
  const stateCopy = (state) => {
    const values = radioCopy[state] || radioCopy.idle;
    const [badge, label] = values[languageIndex()];
    return {
      badge,
      label,
      icon:
        state === "live"
          ? "pause"
          : state === "loading"
            ? "loader-circle"
            : "play",
    };
  };

  const syncPlayer = (state) => {
    const copy = stateCopy(state);
    document.querySelectorAll(".live-player").forEach((player) => {
      player.dataset.radioState = state;
      player.classList.toggle("live-player--playing", state === "live");
      player.classList.toggle("live-player--loading", state === "loading");
      player.classList.toggle("live-player--error", state === "error");
      player.querySelector(".live-player__badge")?.replaceChildren(copy.badge);
      const button = player.querySelector(".live-player__play");
      button?.setAttribute("aria-pressed", String(state === "live"));
      button?.setAttribute("aria-label", copy.label);
      button
        ?.querySelector("use")
        ?.setAttribute("href", `./assets/icons/lucide-sprite.svg#${copy.icon}`);
      const range = player.querySelector(".live-player__volume-range");
      const level = audio.muted ? 0 : Math.round(audio.volume * 100);
      if (range) range.value = String(level);
      const value = player.querySelector(".live-player__volume-value");
      if (value) value.textContent = `${level}%`;
      player
        .querySelector(".live-player__volume use")
        ?.setAttribute(
          "href",
          `./assets/icons/lucide-sprite.svg#${level === 0 ? "volume-x" : "volume-2"}`,
        );
    });
  };

  const syncTheme = () => {
    const isDark = document.documentElement.dataset.theme === "dark";
    const labels = {
      light: [
        "Увімкнути світлу тему",
        "Włącz jasny motyw",
        "Включить светлую тему",
      ],
      dark: [
        "Увімкнути темну тему",
        "Włącz ciemny motyw",
        "Включить тёмную тему",
      ],
    };
    const label = labels[isDark ? "light" : "dark"][languageIndex()];
    document.querySelectorAll("[data-theme-toggle]").forEach((button) => {
      button.setAttribute("aria-pressed", String(isDark));
      button.setAttribute("aria-label", label);
      button.title = label;
    });
  };

  const toggleTheme = () => {
    const theme =
      document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
    localStorage.setItem("prywoz-theme", theme);
    syncTheme();
  };

  const syncSchedule = () => {
    const hour = Number(
      new Intl.DateTimeFormat("en-GB", {
        timeZone: "Europe/Warsaw",
        hour: "2-digit",
        hour12: false,
      }).format(new Date()),
    );
    const broadcastMode = hour >= 10 && hour < 20 ? "day" : "night";
    const labels = {
      day: [
        "Денний ефір · 10:00–20:00",
        "Program dzienny · 10:00–20:00",
        "Дневной эфир · 10:00–20:00",
      ],
      night: [
        "Нічний ефір · 20:00–10:00",
        "Program nocny · 20:00–10:00",
        "Ночной эфир · 20:00–10:00",
      ],
    };
    const label = labels[broadcastMode][languageIndex()];
    audio.dataset.broadcastMode = broadcastMode;
    document.querySelectorAll(".live-player__host").forEach((node) => {
      node.textContent = label;
    });
  };

  const setState = (state, label) => {
    const copy = stateCopy(state);
    const control = getControl();
    if (control) {
      control.dataset.state = state;
      control.setAttribute("aria-pressed", String(state === "live"));
      control.setAttribute("aria-label", copy.label);
      const status = control.querySelector("[data-radio-status]");
      if (status) status.textContent = label || copy.label;
      getIcon()?.setAttribute(
        "href",
        `./assets/icons/lucide-sprite.svg#${state === "live" ? "volume-2" : "play"}`,
      );
    }
    syncPlayer(state);
    document.dispatchEvent(
      new CustomEvent("prywoz:radio-state", { detail: { state } }),
    );
  };

  const start = async () => {
    if (!audio.src) {
      audio.src = STREAM_URL;
      audio.load();
    }
    if (audio.volume === 0) {
      audio.volume = 1;
      localStorage.setItem("prywoz-volume", "1");
    }
    audio.muted = false;
    setState("loading");
    try {
      await audio.play();
      sessionStorage.setItem("prywoz-radio-active", "1");
      setState("live");
    } catch {
      setState("error");
    }
  };

  const mute = () => {
    audio.muted = true;
    sessionStorage.setItem("prywoz-radio-active", "1");
    setState("muted");
  };

  const toggle = () => {
    if (!audio.paused && !audio.muted) mute();
    else start();
  };

  window.PrywozRadio = { audio, mute, start, toggle };

  document.addEventListener("click", (event) => {
    if (event.target.closest("[data-theme-toggle]")) {
      toggleTheme();
      return;
    }

    if (
      event.target.closest(
        "[data-radio-toggle], .live-player__play, [data-inner-play]",
      )
    ) {
      toggle();
      return;
    }

    const volumeButton = event.target.closest(".live-player__volume");
    if (volumeButton) {
      const panel = volumeButton
        .closest(".live-player__volume-control")
        ?.querySelector(".live-player__volume-panel");
      if (!panel) return;
      panel.hidden = !panel.hidden;
      volumeButton.setAttribute("aria-expanded", String(!panel.hidden));
      if (!panel.hidden) panel.querySelector("input")?.focus();
      return;
    }

    if (event.target.closest(".live-player__volume-panel")) return;

    document
      .querySelectorAll(".live-player__volume-panel:not([hidden])")
      .forEach((panel) => {
        panel.hidden = true;
        panel
          .closest(".live-player__volume-control")
          ?.querySelector(".live-player__volume")
          ?.setAttribute("aria-expanded", "false");
      });
  });

  document.addEventListener("input", (event) => {
    const range = event.target.closest(".live-player__volume-range");
    if (!range) return;
    audio.volume = Number(range.value) / 100;
    audio.muted = audio.volume === 0;
    localStorage.setItem("prywoz-volume", String(audio.volume));
    setState(audio.muted ? "muted" : audio.paused ? "idle" : "live");
  });

  audio.addEventListener("playing", () =>
    setState(audio.muted ? "muted" : "live"),
  );
  audio.addEventListener("waiting", () => setState("loading"));
  audio.addEventListener("error", () => setState("error"));
  document.addEventListener("prywoz:language-change", () => {
    syncSchedule();
    setState(audio.paused ? "idle" : audio.muted ? "muted" : "live");
    syncTheme();
  });

  const updateMetadata = async () => {
    try {
      const response = await fetch(STATUS_URL, { cache: "no-store" });
      if (!response.ok) return;
      const data = await response.json();
      const song =
        data.song || [data.artist, data.songtitle].filter(Boolean).join(" — ");
      document
        .querySelectorAll("[data-radio-track], .live-player__track")
        .forEach((node) => {
          node.textContent = song && song !== "-" ? song : "РАДИО ПРИВОЗ ФМ";
        });
    } catch {
      /* Keep the station name while metadata is unavailable. */
    }
  };

  const updateNavigation = (url) => {
    const path = new URL(url, location.href).pathname;
    document.querySelectorAll(".main-nav__link").forEach((link) => {
      const active = new URL(link.href, location.href).pathname === path;
      link.classList.toggle("main-nav__link--active", active);
    });
  };

  const navigate = async (url, push = true) => {
    const target = new URL(url, location.href);
    try {
      const response = await fetch(target.href);
      if (!response.ok) throw new Error("Page unavailable");
      const doc = new DOMParser().parseFromString(
        await response.text(),
        "text/html",
      );
      const nextMain = doc.querySelector("main");
      const currentMain = document.querySelector("main");
      if (!nextMain || !currentMain)
        throw new Error("Page structure unavailable");
      currentMain.replaceWith(nextMain);
      document.title = doc.title;
      document.body.dataset.page = doc.body.dataset.page || "";
      if (push) history.pushState({ portal: true }, "", target.href);
      updateNavigation(target.href);
      document
        .querySelector(".site-header")
        ?.classList.remove("site-header--menu-open");
      if (target.hash)
        requestAnimationFrame(() =>
          document.querySelector(target.hash)?.scrollIntoView(),
        );
      else scrollTo({ top: 0, behavior: "instant" });
      document.dispatchEvent(
        new CustomEvent("prywoz:navigation", { detail: { url: target.href } }),
      );
      syncTheme();
      syncSchedule();
      setState(audio.paused ? "idle" : audio.muted ? "muted" : "live");
      updateMetadata();
    } catch {
      location.href = target.href;
    }
  };

  document.addEventListener("click", (event) => {
    const link = event.target.closest("a[href]");
    if (
      !link ||
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      link.target ||
      link.hasAttribute("download")
    )
      return;
    const target = new URL(link.href, location.href);
    if (
      target.origin !== location.origin ||
      !/\.(?:html)?$|\/$/.test(target.pathname)
    )
      return;
    if (target.pathname === location.pathname && target.hash) return;
    event.preventDefault();
    navigate(target.href);
  });
  addEventListener("popstate", () => navigate(location.href, false));

  const mount = () => {
    updateNavigation(location.href);
    syncTheme();
    syncSchedule();
    setState(audio.paused ? "idle" : audio.muted ? "muted" : "live");
    updateMetadata();
  };
  if (document.readyState === "loading")
    addEventListener("DOMContentLoaded", mount, { once: true });
  else mount();
  setInterval(updateMetadata, 15000);
  setInterval(syncSchedule, 60000);
})();
