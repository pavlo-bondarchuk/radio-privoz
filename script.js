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
const registrationButton = document.querySelector(".registration-button");
const questionnaire = document.querySelector("#questionnaire");
const questionnaireForm = document.querySelector("#questionnaire-form");
const successCard = document.querySelector("#success-card");
const submitButton = questionnaireForm.querySelector(".questionnaire__submit");
const formStatus = questionnaireForm.querySelector(".questionnaire__status");
const birthDateInput = questionnaireForm.elements.birthDate;
const phoneInput = questionnaireForm.elements.phone;

birthDateInput.max = new Date().toISOString().split("T")[0];

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

registrationButton.addEventListener("click", () => {
  const isOpening = questionnaire.hidden && successCard.hidden;

  if (!isOpening) {
    return;
  }

  questionnaire.hidden = false;
  registrationButton.setAttribute("aria-expanded", "true");

  requestAnimationFrame(() => {
    questionnaire.scrollIntoView({ behavior: "smooth", block: "start" });
    questionnaireForm.elements.firstName.focus({ preventScroll: true });
  });
});

questionnaireForm.addEventListener("input", (event) => {
  if (event.target === phoneInput) {
    event.target.value = sanitizePhone(event.target.value);
  }

  if (event.target.matches("input, select")) {
    validateField(event.target);
  }
});

phoneInput.addEventListener("focus", () => {
  if (!phoneInput.value) {
    phoneInput.value = "+";
  }
});

phoneInput.addEventListener("blur", () => {
  if (phoneInput.value === "+") {
    phoneInput.value = "";
  }
});

questionnaireForm.addEventListener("change", (event) => {
  if (event.target.matches("input, select")) {
    validateField(event.target);
  }
});

questionnaireForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  formStatus.textContent = "";

  const fields = [...questionnaireForm.querySelectorAll("input, select")];
  const fieldResults = fields.map((field) => ({
    field,
    isValid: validateField(field),
  }));
  const invalidField = fieldResults.find(({ isValid }) => !isValid)?.field;

  if (invalidField) {
    invalidField.focus();
    invalidField.scrollIntoView({ behavior: "smooth", block: "center" });
    return;
  }

  setSubmitting(true);

  try {
    const values = getFormValues();
    const pdfBlob = await createQuestionnairePdf(values);
    await submitQuestionnaire(values, pdfBlob);

    questionnaire.hidden = true;
    successCard.hidden = false;
    registrationButton.setAttribute("aria-expanded", "false");
    successCard.scrollIntoView({ behavior: "smooth", block: "center" });
  } catch (error) {
    console.error(error);
    formStatus.textContent =
      "Не удалось отправить анкету. Проверьте соединение и попробуйте ещё раз.";
  } finally {
    setSubmitting(false);
  }
});

function validateField(field) {
  if (field.type === "radio") {
    return true;
  }

  if (field === birthDateInput) {
    const birthDate = field.value ? new Date(`${field.value}T00:00:00`) : null;
    const today = new Date();

    field.setCustomValidity(
      birthDate && birthDate > today ? "Дата рождения не может быть в будущем." : "",
    );
  }

  const isValid = field.checkValidity();
  field.setAttribute("aria-invalid", String(!isValid));

  const fieldContainer = field.closest(".form-field");
  const errorElement =
    fieldContainer?.querySelector(".form-field__error") || null;

  if (errorElement) {
    errorElement.textContent = isValid ? "" : getValidationMessage(field);
  }

  return isValid;
}

function getValidationMessage(field) {
  if (field.validity.valueMissing) {
    return "Заполните это поле.";
  }

  if (field.validity.typeMismatch) {
    return "Введите корректный адрес электронной почты.";
  }

  if (field.validity.patternMismatch) {
    return field.title || "Проверьте формат значения.";
  }

  if (field.validity.tooShort) {
    return `Минимум ${field.minLength} символа.`;
  }

  if (field.validity.customError) {
    return field.validationMessage;
  }

  return "Проверьте введённое значение.";
}

function getFormValues() {
  const data = new FormData(questionnaireForm);

  return {
    firstName: data.get("firstName"),
    lastName: data.get("lastName"),
    email: data.get("email"),
    birthDate: data.get("birthDate"),
    familySize: data.get("familySize"),
    originCountry: data.get("originCountry"),
    voivodeship: data.get("voivodeship"),
    localityType: data.get("localityType"),
    locality: data.get("locality"),
    residenceType: data.get("residenceType"),
    employment: data.get("employment"),
    phone: data.get("phone"),
    cardNumber: data.get("cardNumber"),
    personalDataConsent: data.has("personalDataConsent") ? "Да" : "Нет",
    notificationsConsent: data.has("notificationsConsent") ? "Да" : "Нет",
  };
}

function setSubmitting(isSubmitting) {
  submitButton.disabled = isSubmitting;
  submitButton.querySelector("span").textContent = isSubmitting
    ? "Отправляем..."
    : "Отправить анкету";
}

async function createQuestionnairePdf(values) {
  const canvas = document.createElement("canvas");
  canvas.width = 1240;
  canvas.height = 1754;

  const context = canvas.getContext("2d");
  const gradient = context.createLinearGradient(0, 0, canvas.width, canvas.height);
  gradient.addColorStop(0, "#090018");
  gradient.addColorStop(0.5, "#210249");
  gradient.addColorStop(1, "#120130");
  context.fillStyle = gradient;
  context.fillRect(0, 0, canvas.width, canvas.height);

  context.strokeStyle = "#e961f1";
  context.lineWidth = 4;
  roundRect(context, 70, 60, 1100, 1630, 28);
  context.stroke();

  const logo = await loadImage("./logo.png");
  context.drawImage(logo, 440, 80, 360, 360);

  context.textAlign = "center";
  context.fillStyle = "#e961f1";
  context.font = "72px Arial";
  context.fillText("АНКЕТА РАДИО ПРИВОЗ FM", canvas.width / 2, 480);

  context.textAlign = "left";
  context.font = "30px Arial";

  const entries = [
    ["Имя", values.firstName],
    ["Фамилия", values.lastName],
    ["Email", values.email],
    ["Дата рождения", formatDate(values.birthDate)],
    ["Семья", values.familySize],
    ["Откуда приехали", values.originCountry],
    ["Область", values.voivodeship],
    ["Город / село", `${values.localityType}: ${values.locality}`],
    ["Где проживает", values.residenceType],
    ["Где работает", values.employment],
    ["Телефон", values.phone],
    ["Номер карты", values.cardNumber],
    ["Обработка персональных данных", values.personalDataConsent],
    ["Получение уведомлений", values.notificationsConsent],
  ];

  let y = 550;

  for (const [label, value] of entries) {
    context.fillStyle = "#e961f1";
    context.font = "bold 29px Arial";
    context.fillText(`${label}:`, 120, y);

    context.fillStyle = "#ffffff";
    context.font = "29px Arial";
    const lines = wrapCanvasText(context, String(value), 720);

    lines.forEach((line, index) => {
      context.fillText(line, 450, y + index * 38);
    });

    y += Math.max(72, lines.length * 38 + 30);
  }

  context.fillStyle = "rgba(255, 255, 255, 0.65)";
  context.font = "24px Arial";
  context.fillText(
    `Сформировано: ${new Date().toLocaleString("ru-RU")}`,
    120,
    1640,
  );

  return canvasToPdfBlob(canvas);
}

async function submitQuestionnaire(values, pdfBlob) {
  const payload = new FormData();
  const applicant = `${values.firstName} ${values.lastName}`.trim();

  Object.entries(values).forEach(([key, value]) => {
    payload.append(key, value);
  });
  payload.append(
    "questionnairePdf",
    pdfBlob,
    `radio-privoz-${safeFileName(applicant)}.pdf`,
  );

  if (isPreviewEnvironment()) {
    await new Promise((resolve) => window.setTimeout(resolve, 700));
    console.info("Questionnaire preview submission", {
      values,
      pdfSize: pdfBlob.size,
      pdfType: pdfBlob.type,
    });
    return;
  }

  const response = await fetch("./submit.php", {
    method: "POST",
    body: payload,
    headers: {
      Accept: "application/json",
    },
  });

  const result = await response.json().catch(() => null);

  if (!response.ok || result?.success !== true) {
    throw new Error(result?.message || "Questionnaire submission failed.");
  }
}

function isPreviewEnvironment() {
  return (
    window.location.protocol === "file:" ||
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1" ||
    window.location.hostname.endsWith(".github.io")
  );
}

function sanitizePhone(value) {
  const digits = value.replace(/\D/g, "").slice(0, 15);

  return `+${digits}`;
}

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = src;
  });
}

async function canvasToPdfBlob(canvas) {
  const jpegBlob = await new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error("Unable to create PDF image."));
        }
      },
      "image/jpeg",
      0.92,
    );
  });
  const jpegBytes = new Uint8Array(await jpegBlob.arrayBuffer());
  const encoder = new TextEncoder();
  const pageWidth = 595.28;
  const pageHeight = 841.89;
  const content = `q\n${pageWidth} 0 0 ${pageHeight} 0 0 cm\n/Im0 Do\nQ\n`;
  const objects = [
    encoder.encode("<< /Type /Catalog /Pages 2 0 R >>"),
    encoder.encode("<< /Type /Pages /Kids [3 0 R] /Count 1 >>"),
    encoder.encode(
      `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${pageWidth} ${pageHeight}] /Resources << /XObject << /Im0 4 0 R >> >> /Contents 5 0 R >>`,
    ),
    concatBytes(
      encoder.encode(
        `<< /Type /XObject /Subtype /Image /Width ${canvas.width} /Height ${canvas.height} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${jpegBytes.length} >>\nstream\n`,
      ),
      jpegBytes,
      encoder.encode("\nendstream"),
    ),
    encoder.encode(
      `<< /Length ${encoder.encode(content).length} >>\nstream\n${content}endstream`,
    ),
  ];

  const chunks = [encoder.encode("%PDF-1.4\n%\xFF\xFF\xFF\xFF\n")];
  const offsets = [0];
  let byteLength = chunks[0].length;

  objects.forEach((object, index) => {
    offsets.push(byteLength);
    const objectBytes = concatBytes(
      encoder.encode(`${index + 1} 0 obj\n`),
      object,
      encoder.encode("\nendobj\n"),
    );
    chunks.push(objectBytes);
    byteLength += objectBytes.length;
  });

  const xrefOffset = byteLength;
  const xrefRows = offsets
    .slice(1)
    .map((offset) => `${String(offset).padStart(10, "0")} 00000 n \n`)
    .join("");
  const trailer = encoder.encode(
    `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n${xrefRows}trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`,
  );
  chunks.push(trailer);

  return new Blob(chunks, { type: "application/pdf" });
}

function concatBytes(...arrays) {
  const length = arrays.reduce((total, array) => total + array.length, 0);
  const result = new Uint8Array(length);
  let offset = 0;

  arrays.forEach((array) => {
    result.set(array, offset);
    offset += array.length;
  });

  return result;
}

function roundRect(context, x, y, width, height, radius) {
  context.beginPath();
  context.roundRect(x, y, width, height, radius);
}

function wrapCanvasText(context, text, maxWidth) {
  const words = text.split(/\s+/);
  const lines = [];
  let line = "";

  for (const word of words) {
    const candidate = line ? `${line} ${word}` : word;

    if (context.measureText(candidate).width > maxWidth && line) {
      lines.push(line);
      line = word;
    } else {
      line = candidate;
    }
  }

  if (line) {
    lines.push(line);
  }

  return lines;
}

function formatDate(value) {
  if (!value) {
    return "";
  }

  return new Intl.DateTimeFormat("ru-RU").format(
    new Date(`${value}T00:00:00`),
  );
}

function safeFileName(value) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-zа-яё0-9]+/gi, "-")
    .replace(/^-|-$/g, "");
}

window.radioPlayer = player;
