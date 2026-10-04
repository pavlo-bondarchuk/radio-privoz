const registrationButton = document.querySelector(".registration-button");
const rulesButton = document.querySelector(".rules-button");
const rulesModal = document.querySelector("#rules-modal");
const rulesModalClose = rulesModal?.querySelector(".rules-modal__close");
const rulesPoster = rulesModal?.querySelector(".rules-modal__poster");
const zoomValue = rulesModal?.querySelector(".rules-modal__zoom-value");
const questionnaire = document.querySelector("#anketa");
const questionnaireForm = document.querySelector("#questionnaire-form");
const successCard = document.querySelector("#success-card");

if (registrationButton && rulesButton && rulesModal && questionnaire && questionnaireForm && successCard) {
  const submitButton = questionnaireForm.querySelector(".questionnaire__submit");
  const formStatus = questionnaireForm.querySelector(".questionnaire__status");
  const birthDateInput = questionnaireForm.elements.birthDate;
  const emailInput = questionnaireForm.elements.email;
  const phoneInput = questionnaireForm.elements.phone;
  const cardNumberInput = questionnaireForm.elements.cardNumber;
  const originCountrySelect = questionnaireForm.elements.originCountry;
  const regionSelect = questionnaireForm.elements.voivodeship;
  const endpoint = questionnaireForm.dataset.endpoint;

  const ukrainianRegions = [
    "АР КРЫМ", "ВИННИЦКАЯ ОБЛАСТЬ", "ВОЛЫНСКАЯ ОБЛАСТЬ",
    "ДНЕПРОПЕТРОВСКАЯ ОБЛАСТЬ", "ДОНЕЦКАЯ ОБЛАСТЬ", "ЖИТОМИРСКАЯ ОБЛАСТЬ",
    "ЗАКАРПАТСКАЯ ОБЛАСТЬ", "ЗАПОРОЖСКАЯ ОБЛАСТЬ", "ИВАНО-ФРАНКОВСКАЯ ОБЛАСТЬ",
    "КИЕВСКАЯ ОБЛАСТЬ", "КИРОВОГРАДСКАЯ ОБЛАСТЬ", "ЛУГАНСКАЯ ОБЛАСТЬ",
    "ЛЬВОВСКАЯ ОБЛАСТЬ", "НИКОЛАЕВСКАЯ ОБЛАСТЬ", "ОДЕССКАЯ ОБЛАСТЬ",
    "ПОЛТАВСКАЯ ОБЛАСТЬ", "РОВНЕНСКАЯ ОБЛАСТЬ", "СУМСКАЯ ОБЛАСТЬ",
    "ТЕРНОПОЛЬСКАЯ ОБЛАСТЬ", "ХАРЬКОВСКАЯ ОБЛАСТЬ", "ХЕРСОНСКАЯ ОБЛАСТЬ",
    "ХМЕЛЬНИЦКАЯ ОБЛАСТЬ", "ЧЕРКАССКАЯ ОБЛАСТЬ", "ЧЕРНОВИЦКАЯ ОБЛАСТЬ",
    "ЧЕРНИГОВСКАЯ ОБЛАСТЬ",
  ];
  const otherCountryRegions = ["НЕ ПРИМЕНЯЕТСЯ", "ДРУГОЕ"];
  let lastFocusedElement = null;
  let rulesZoom = 1;

  birthDateInput.max = new Date().toISOString().split("T")[0];

  const openQuestionnaire = ({ scroll = true, focus = true } = {}) => {
    if (!successCard.hidden) return;
    questionnaire.hidden = false;
    registrationButton.setAttribute("aria-expanded", "true");
    if (window.location.hash !== "#anketa") window.history.replaceState(null, "", "#anketa");
    requestAnimationFrame(() => {
      if (scroll) questionnaire.scrollIntoView({ behavior: "smooth", block: "start" });
      if (focus) questionnaireForm.elements.firstName.focus({ preventScroll: true });
    });
  };

  const setRulesZoom = (value) => {
    rulesZoom = Math.min(3, Math.max(0.5, value));
    rulesPoster.style.width = `${rulesZoom * 100}%`;
    zoomValue.textContent = `${Math.round(rulesZoom * 100)}%`;
  };

  const openRulesModal = () => {
    lastFocusedElement = document.activeElement;
    rulesModal.hidden = false;
    document.body.classList.add("page--modal-open");
    setRulesZoom(1);
    rulesModalClose.focus();
  };

  const closeRulesModal = () => {
    rulesModal.hidden = true;
    document.body.classList.remove("page--modal-open");
    lastFocusedElement?.focus();
  };

  registrationButton.addEventListener("click", () => openQuestionnaire());
  rulesButton.addEventListener("click", openRulesModal);
  rulesModalClose.addEventListener("click", closeRulesModal);
  rulesModal.addEventListener("click", (event) => {
    if (event.target === rulesModal) closeRulesModal();
    const action = event.target.closest("[data-rules-action]")?.dataset.rulesAction;
    if (action === "zoom-in") setRulesZoom(rulesZoom + 0.25);
    if (action === "zoom-out") setRulesZoom(rulesZoom - 0.25);
    if (action === "reset") setRulesZoom(1);
  });

  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !rulesModal.hidden) closeRulesModal();
  });

  if (window.location.hash.toLowerCase() === "#anketa") {
    openQuestionnaire({ focus: false });
  }
  window.addEventListener("hashchange", () => {
    if (window.location.hash.toLowerCase() === "#anketa") openQuestionnaire({ focus: false });
  });

  questionnaireForm.addEventListener("input", (event) => {
    if (event.target === phoneInput) event.target.value = sanitizePhone(event.target.value);
    if (event.target === cardNumberInput) event.target.value = event.target.value.replace(/\D/g, "").slice(0, 24);
    if (event.target.matches("input, select")) validateField(event.target);
  });

  questionnaireForm.addEventListener("change", (event) => {
    if (event.target === originCountrySelect) updateRegionOptions();
    if (event.target.matches("input, select")) validateField(event.target);
  });

  phoneInput.addEventListener("focus", () => {
    if (!phoneInput.value) phoneInput.value = "+";
  });
  phoneInput.addEventListener("blur", () => {
    if (phoneInput.value === "+") phoneInput.value = "";
  });
  emailInput.addEventListener("blur", () => {
    emailInput.value = normalizeEmail(emailInput.value);
    validateField(emailInput);
  });

  questionnaireForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    formStatus.textContent = "";
    const fields = [...questionnaireForm.querySelectorAll("input, select")];
    const invalidField = fields.find((field) => !validateField(field));
    if (invalidField) {
      invalidField.focus();
      invalidField.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    setSubmitting(true);
    try {
      const values = getFormValues();
      const pdfBlob = await createQuestionnairePdf(values);
      const serverConfirmed = await submitQuestionnaire(values, pdfBlob);
      questionnaire.hidden = true;
      successCard.hidden = false;
      registrationButton.setAttribute("aria-expanded", "false");
      successCard.scrollIntoView({ behavior: "smooth", block: "center" });
      if (serverConfirmed) {
        document.dispatchEvent(new CustomEvent("prywoz:registration-success"));
      }
    } catch (error) {
      console.error(error);
      formStatus.textContent = "Не удалось отправить анкету. Проверьте соединение и попробуйте ещё раз.";
    } finally {
      setSubmitting(false);
    }
  });

  function validateField(field) {
    if (field.type === "radio") {
      const radios = [...questionnaireForm.querySelectorAll(`input[type="radio"][name="${field.name}"]`)];
      const valid = !radios.some((radio) => radio.required) || radios.some((radio) => radio.checked);
      radios.forEach((radio) => radio.setAttribute("aria-invalid", String(!valid)));
      const error = field.closest(".form-field")?.querySelector(".form-field__error");
      if (error) error.textContent = valid ? "" : "Выберите один тип карты.";
      return valid;
    }
    if (field === birthDateInput) {
      const date = field.value ? new Date(`${field.value}T00:00:00`) : null;
      field.setCustomValidity(date && date > new Date() ? "Дата рождения не может быть в будущем." : "");
    }
    if (field === emailInput) {
      const email = normalizeEmail(field.value);
      field.setCustomValidity(email && !isPlainEmail(email) ? "Введите email латиницей без кириллических символов в домене." : "");
    }
    const valid = field.checkValidity();
    field.setAttribute("aria-invalid", String(!valid));
    const error = field.closest(".form-field")?.querySelector(".form-field__error");
    if (error) error.textContent = valid ? "" : validationMessage(field);
    return valid;
  }

  function validationMessage(field) {
    if (field.validity.valueMissing) return "Заполните это поле.";
    if (field.validity.typeMismatch) return "Введите корректный адрес электронной почты.";
    if (field.validity.patternMismatch) return field.title || "Проверьте формат значения.";
    if (field.validity.tooShort) return `Минимум ${field.minLength} символа.`;
    return field.validationMessage || "Проверьте введённое значение.";
  }

  function updateRegionOptions() {
    const regions = originCountrySelect.value === "Украина" ? ukrainianRegions : originCountrySelect.value ? otherCountryRegions : [];
    regionSelect.replaceChildren(new Option(originCountrySelect.value ? "Выберите область" : "Сначала выберите страну", ""));
    regions.forEach((region) => regionSelect.add(new Option(region, region)));
    regionSelect.value = "";
  }

  function getFormValues() {
    const data = new FormData(questionnaireForm);
    return {
      firstName: data.get("firstName"), lastName: data.get("lastName"), email: normalizeEmail(data.get("email")),
      birthDate: data.get("birthDate"), familySize: data.get("familySize"), originCountry: data.get("originCountry"),
      voivodeship: data.get("voivodeship"), localityType: data.get("localityType"), locality: data.get("locality"),
      residenceType: data.get("residenceType"), employment: data.get("employment"), phone: data.get("phone"),
      cardNumber: data.get("cardNumber"), cardType: data.get("cardType"),
      personalDataConsent: data.has("personalDataConsent") ? "Да" : "Нет",
      notificationsConsent: data.has("notificationsConsent") ? "Да" : "Нет",
    };
  }

  function setSubmitting(submitting) {
    submitButton.disabled = submitting;
    submitButton.querySelector("span").textContent = submitting ? "Отправляем..." : "Отправить анкету";
  }

  async function submitQuestionnaire(values, pdfBlob) {
    if (isLocalPreview()) {
      await new Promise((resolve) => window.setTimeout(resolve, 500));
      console.info("Questionnaire preview", { values, pdfSize: pdfBlob.size });
      return false;
    }
    const payload = new FormData();
    Object.entries(values).forEach(([key, value]) => payload.append(key, value));
    payload.append("questionnairePdf", pdfBlob, `radio-privoz-${safeFileName(`${values.firstName}-${values.lastName}`)}.pdf`);
    const response = await fetch(endpoint, { method: "POST", body: payload, headers: { Accept: "application/json" } });
    const result = await response.json().catch(() => null);
    if (!response.ok || result?.success !== true) throw new Error(result?.message || "Questionnaire submission failed.");
    return true;
  }

  function isLocalPreview() {
    return window.location.protocol === "file:" || ["localhost", "127.0.0.1"].includes(window.location.hostname);
  }

  async function createQuestionnairePdf(values) {
    const canvas = document.createElement("canvas");
    canvas.width = 1240;
    canvas.height = 1754;
    const context = canvas.getContext("2d");
    context.fillStyle = "#fffaf1";
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.strokeStyle = "#1769ff";
    context.lineWidth = 4;
    context.strokeRect(70, 60, 1100, 1630);
    const logo = await loadImage("./assets/images/logo.png");
    context.drawImage(logo, 490, 80, 260, 260);
    context.textAlign = "center";
    context.fillStyle = "#171023";
    context.font = "bold 58px Arial";
    context.fillText("АНКЕТА РАДИО ПРИВОЗ ФМ", canvas.width / 2, 405);
    context.textAlign = "left";
    const entries = [
      ["Имя", values.firstName], ["Фамилия", values.lastName], ["Email", values.email],
      ["Дата рождения", formatDate(values.birthDate)], ["Семья", values.familySize],
      ["Откуда приехали", values.originCountry], ["Область", values.voivodeship],
      ["Город / село", `${values.localityType}: ${values.locality}`], ["Где проживает", values.residenceType],
      ["Где работает", values.employment], ["Телефон", values.phone], ["Номер карты", values.cardNumber],
      ["Тип карты", values.cardType], ["Обработка данных", values.personalDataConsent],
      ["Получение уведомлений", values.notificationsConsent],
    ];
    let y = 490;
    entries.forEach(([label, value]) => {
      context.fillStyle = "#1769ff";
      context.font = "bold 27px Arial";
      context.fillText(`${label}:`, 120, y);
      context.fillStyle = "#171023";
      context.font = "27px Arial";
      const lines = wrapCanvasText(context, String(value), 650);
      lines.forEach((line, index) => context.fillText(line, 470, y + index * 35));
      y += Math.max(68, lines.length * 35 + 26);
    });
    context.fillStyle = "#776b63";
    context.font = "22px Arial";
    context.fillText(`Сформировано: ${new Date().toLocaleString("ru-RU")}`, 120, 1640);
    return canvasToPdfBlob(canvas);
  }

  function sanitizePhone(value) { return `+${value.replace(/\D/g, "").slice(0, 15)}`; }
  function normalizeEmail(value) { return String(value).trim().toLowerCase(); }
  function isPlainEmail(value) {
    const email = normalizeEmail(value);
    const parts = email.split("@");
    if (parts.length !== 2 || !/^[\x21-\x7E]+$/.test(email) || email.includes("xn--")) return false;
    return /^[a-z0-9.!#$%&'*+/=?^_`{|}~-]+$/.test(parts[0]) && /^(?!.*\.\.)[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)+$/.test(parts[1]) && /\.[a-z]{2,24}$/.test(parts[1]);
  }
  function loadImage(src) { return new Promise((resolve, reject) => { const image = new Image(); image.onload = () => resolve(image); image.onerror = reject; image.src = src; }); }
  function formatDate(value) { return value ? new Intl.DateTimeFormat("ru-RU").format(new Date(`${value}T00:00:00`)) : ""; }
  function safeFileName(value) { return value.toLowerCase().trim().replace(/[^a-zа-яё0-9]+/gi, "-").replace(/^-|-$/g, ""); }
  function wrapCanvasText(context, text, maxWidth) {
    const lines = [];
    let line = "";
    text.split(/\s+/).forEach((word) => {
      const candidate = line ? `${line} ${word}` : word;
      if (context.measureText(candidate).width > maxWidth && line) { lines.push(line); line = word; } else { line = candidate; }
    });
    if (line) lines.push(line);
    return lines;
  }

  async function canvasToPdfBlob(canvas) {
    const jpegBlob = await new Promise((resolve, reject) => canvas.toBlob((blob) => blob ? resolve(blob) : reject(new Error("Unable to create PDF image.")), "image/jpeg", 0.92));
    const jpegBytes = new Uint8Array(await jpegBlob.arrayBuffer());
    const encoder = new TextEncoder();
    const pageWidth = 595.28;
    const pageHeight = 841.89;
    const content = `q\n${pageWidth} 0 0 ${pageHeight} 0 0 cm\n/Im0 Do\nQ\n`;
    const objects = [
      encoder.encode("<< /Type /Catalog /Pages 2 0 R >>"),
      encoder.encode("<< /Type /Pages /Kids [3 0 R] /Count 1 >>"),
      encoder.encode(`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${pageWidth} ${pageHeight}] /Resources << /XObject << /Im0 4 0 R >> >> /Contents 5 0 R >>`),
      concatBytes(encoder.encode(`<< /Type /XObject /Subtype /Image /Width ${canvas.width} /Height ${canvas.height} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${jpegBytes.length} >>\nstream\n`), jpegBytes, encoder.encode("\nendstream")),
      encoder.encode(`<< /Length ${encoder.encode(content).length} >>\nstream\n${content}endstream`),
    ];
    const chunks = [encoder.encode("%PDF-1.4\n%\xFF\xFF\xFF\xFF\n")];
    const offsets = [0];
    let byteLength = chunks[0].length;
    objects.forEach((object, index) => { offsets.push(byteLength); const bytes = concatBytes(encoder.encode(`${index + 1} 0 obj\n`), object, encoder.encode("\nendobj\n")); chunks.push(bytes); byteLength += bytes.length; });
    const rows = offsets.slice(1).map((offset) => `${String(offset).padStart(10, "0")} 00000 n \n`).join("");
    chunks.push(encoder.encode(`xref\n0 ${objects.length + 1}\n0000000000 65535 f \n${rows}trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${byteLength}\n%%EOF`));
    return new Blob(chunks, { type: "application/pdf" });
  }

  function concatBytes(...arrays) {
    const result = new Uint8Array(arrays.reduce((total, array) => total + array.length, 0));
    let offset = 0;
    arrays.forEach((array) => { result.set(array, offset); offset += array.length; });
    return result;
  }
}
