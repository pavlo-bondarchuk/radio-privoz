(function () {
  "use strict";

  var storageKey = "prywoz-analytics-consent";
  var banner = document.querySelector("[data-cookie-consent]");

  if (!banner) return;

  function getStoredChoice() {
    try {
      return localStorage.getItem(storageKey);
    } catch (error) {
      return null;
    }
  }

  function storeChoice(choice) {
    try {
      localStorage.setItem(storageKey, choice);
    } catch (error) {}
  }

  function updateConsent(choice) {
    window.gtag("consent", "update", {
      analytics_storage: choice === "accepted" ? "granted" : "denied",
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied"
    });
  }

  if (!getStoredChoice()) {
    banner.hidden = false;
  }

  banner.addEventListener("click", function (event) {
    var button = event.target.closest("[data-consent-choice]");
    if (!button) return;

    var choice = button.dataset.consentChoice;
    storeChoice(choice);
    updateConsent(choice);
    banner.hidden = true;
  });
}());
