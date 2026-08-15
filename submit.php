<?php

declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');

const RECIPIENT_EMAIL = 'info@prywoz.fm';
const SENDER_EMAIL = 'info@prywoz.fm';
const MAX_PDF_SIZE = 10 * 1024 * 1024;
const LOCAL_SUBMISSIONS_DIR = __DIR__ . '/submissions';

function respond(int $status, bool $success, string $message): never
{
    http_response_code($status);
    echo json_encode(
        ['success' => $success, 'message' => $message],
        JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES
    );
    exit;
}

function clean(string $key, int $maxLength = 200): string
{
    $value = trim((string) ($_POST[$key] ?? ''));
    return function_exists('mb_substr')
        ? mb_substr($value, 0, $maxLength)
        : substr($value, 0, $maxLength);
}

function containsHeaderInjection(string $value): bool
{
    return preg_match('/[\r\n]/', $value) === 1;
}

function isPlainEmail(string $value): bool
{
    if (
        containsHeaderInjection($value) ||
        preg_match('/[^\x21-\x7E]/', $value) === 1 ||
        stripos($value, 'xn--') !== false ||
        !filter_var($value, FILTER_VALIDATE_EMAIL)
    ) {
        return false;
    }

    $parts = explode('@', $value);

    if (count($parts) !== 2) {
        return false;
    }

    [$localPart, $domain] = $parts;
    $domain = strtolower($domain);

    return (
        preg_match('/^[a-z0-9.!#$%&\'*+\/=?^_`{|}~-]+$/', $localPart) === 1 &&
        preg_match('/^(?!.*\.\.)[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)+$/', $domain) === 1 &&
        preg_match('/\.[a-z]{2,24}$/', $domain) === 1
    );
}

function isLocalRequest(): bool
{
    $address = (string) ($_SERVER['REMOTE_ADDR'] ?? '');
    return in_array($address, ['127.0.0.1', '::1'], true);
}

function safeFilePart(string $value): string
{
    $value = function_exists('mb_strtolower')
        ? mb_strtolower($value)
        : strtolower($value);
    $value = preg_replace('/[^\p{L}\p{N}]+/u', '-', $value) ?? '';
    return trim($value, '-') ?: 'questionnaire';
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    respond(405, false, 'Метод запроса не поддерживается.');
}

if (!isLocalRequest() && RECIPIENT_EMAIL === 'change-me@example.com') {
    respond(503, false, 'Email получателя не настроен на сервере.');
}

$email = strtolower(clean('email', 120));

$fields = [
    'firstName' => clean('firstName', 60),
    'lastName' => clean('lastName', 60),
    'email' => $email,
    'birthDate' => clean('birthDate', 10),
    'familySize' => clean('familySize', 40),
    'originCountry' => clean('originCountry', 60),
    'voivodeship' => clean('voivodeship', 80),
    'localityType' => clean('localityType', 20),
    'locality' => clean('locality', 100),
    'residenceType' => clean('residenceType', 80),
    'employment' => clean('employment', 80),
    'phone' => clean('phone', 24),
    'cardNumber' => clean('cardNumber', 24),
    'cardType' => clean('cardType', 40),
    'personalDataConsent' => clean('personalDataConsent', 3),
    'notificationsConsent' => clean('notificationsConsent', 3),
];

foreach ($fields as $key => $value) {
    if ($value === '') {
        respond(422, false, "Не заполнено поле: {$key}.");
    }
}

$allowedFamilySizes = ['1–2 человека', '3–4 человека', '5 и более'];
$allowedCountries = [
    'Украина',
    'Беларусь',
    'Молдова',
    'Грузия',
    'Я из Польши',
    'Армения',
    'Казахстан',
    'Другая страна',
];
$ukrainianRegions = [
    'АР КРЫМ',
    'ВИННИЦКАЯ ОБЛАСТЬ',
    'ВОЛЫНСКАЯ ОБЛАСТЬ',
    'ДНЕПРОПЕТРОВСКАЯ ОБЛАСТЬ',
    'ДОНЕЦКАЯ ОБЛАСТЬ',
    'ЖИТОМИРСКАЯ ОБЛАСТЬ',
    'ЗАКАРПАТСКАЯ ОБЛАСТЬ',
    'ЗАПОРОЖСКАЯ ОБЛАСТЬ',
    'ИВАНО-ФРАНКОВСКАЯ ОБЛАСТЬ',
    'КИЕВСКАЯ ОБЛАСТЬ',
    'КИРОВОГРАДСКАЯ ОБЛАСТЬ',
    'ЛУГАНСКАЯ ОБЛАСТЬ',
    'ЛЬВОВСКАЯ ОБЛАСТЬ',
    'НИКОЛАЕВСКАЯ ОБЛАСТЬ',
    'ОДЕССКАЯ ОБЛАСТЬ',
    'ПОЛТАВСКАЯ ОБЛАСТЬ',
    'РОВНЕНСКАЯ ОБЛАСТЬ',
    'СУМСКАЯ ОБЛАСТЬ',
    'ТЕРНОПОЛЬСКАЯ ОБЛАСТЬ',
    'ХАРЬКОВСКАЯ ОБЛАСТЬ',
    'ХЕРСОНСКАЯ ОБЛАСТЬ',
    'ХМЕЛЬНИЦКАЯ ОБЛАСТЬ',
    'ЧЕРКАССКАЯ ОБЛАСТЬ',
    'ЧЕРНОВИЦКАЯ ОБЛАСТЬ',
    'ЧЕРНИГОВСКАЯ ОБЛАСТЬ',
];
$otherCountryRegions = ['НЕ ПРИМЕНЯЕТСЯ', 'ДРУГОЕ'];
$allowedResidenceTypes = [
    'ЛОДЗЬ — БАЛУТЫ',
    'ЛОДЗЬ — ВИДЗЕВ',
    'ЛОДЗЬ — ГУРНА',
    'ЛОДЗЬ — ГУРНЯК',
    'ЛОДЗЬ — ОЛЕХОВ',
    'ЛОДЗЬ — РЕТКИНЯ',
    'ЛОДЗЬ — РУДА',
    'ЛОДЗЬ — СТАРЫЕ БАЛУТЫ',
    'ЛОДЗЬ — ФАБРИЧНА',
    'ЛОДЗЬ — ЦЕНТР',
    'ЛОДЗЬ — ЮЛЯНОВ',
    'АЛЕКСАНДРОВ',
    'АНДРЕСПОЛЬ',
    'ЖГОВ',
    'ЗГЕЖ',
    'КОНСТАНТИНОВ ЛУДСКИЙ',
    'ПАБЬЯНИЦЕ',
    'ПЕТРКУВ ТРЫБУНАЛЬСКИЙ',
    'СТРЫКУВ',
    'ТУШИН',
    'ДРУГОЕ',
];
$allowedEmployment = [
    'БЬЮТИ СФЕРА',
    'ВОДИТЕЛЬ ГРУЗОВИКА',
    'СТРОЙКА',
    'ГАСТРОНОМИЯ',
    'ВРАЧ',
    'КУРЬЕР',
    'МЕЖДУНАРОДНАЯ КОРПОРАЦИЯ',
    'ПРОИЗВОДСТВО',
    'СВОЙ БИЗНЕС',
    'СКЛАДЫ',
    'СТО',
    'УЧИТЕЛЬ',
    'УЧЕНИК / СТУДЕНТ',
    'ТАКСИ',
    'IT',
    'ДРУГОЕ',
];
$allowedCardTypes = [
    'Карта клиента',
    'Карта Premium',
    'Карта Premium+',
    'Карта VIP',
];

if (!in_array($fields['familySize'], $allowedFamilySizes, true)) {
    respond(422, false, 'Выберите количество пользователей карты.');
}

if (!in_array($fields['originCountry'], $allowedCountries, true)) {
    respond(422, false, 'Выберите страну из списка.');
}

$allowedRegions = $fields['originCountry'] === 'Украина'
    ? $ukrainianRegions
    : $otherCountryRegions;

if (!in_array($fields['voivodeship'], $allowedRegions, true)) {
    respond(422, false, 'Выберите область из доступного списка.');
}

if (!in_array($fields['localityType'], ['Город', 'Село'], true)) {
    respond(422, false, 'Выберите город или село.');
}

if (!in_array($fields['residenceType'], $allowedResidenceTypes, true)) {
    respond(422, false, 'Выберите район проживания из списка.');
}

if (!in_array($fields['employment'], $allowedEmployment, true)) {
    respond(422, false, 'Выберите профессию из списка.');
}

if (!isPlainEmail($fields['email'])) {
    respond(422, false, 'Указан некорректный email.');
}

if (preg_match('/^\+?[0-9\s()\-]{9,20}$/', $fields['phone']) !== 1) {
    respond(422, false, 'Указан некорректный номер телефона.');
}

if (preg_match('/^[0-9]{6,24}$/', $fields['cardNumber']) !== 1) {
    respond(422, false, 'Указан некорректный номер карты.');
}

if (!in_array($fields['cardType'], $allowedCardTypes, true)) {
    respond(422, false, 'Выберите тип карты из списка.');
}

$birthDate = DateTimeImmutable::createFromFormat('!Y-m-d', $fields['birthDate']);
$today = new DateTimeImmutable('today');

if (!$birthDate || $birthDate > $today) {
    respond(422, false, 'Указана некорректная дата рождения.');
}

if (
    $fields['personalDataConsent'] !== 'Да' ||
    $fields['notificationsConsent'] !== 'Да'
) {
    respond(422, false, 'Необходимо подтвердить обязательные согласия.');
}

$pdf = $_FILES['questionnairePdf'] ?? null;

if (
    !$pdf ||
    ($pdf['error'] ?? UPLOAD_ERR_NO_FILE) !== UPLOAD_ERR_OK ||
    ($pdf['size'] ?? 0) <= 0 ||
    ($pdf['size'] ?? 0) > MAX_PDF_SIZE
) {
    respond(422, false, 'PDF-файл анкеты отсутствует или превышает 10 МБ.');
}

$pdfPath = (string) $pdf['tmp_name'];
$pdfHandle = fopen($pdfPath, 'rb');
$pdfHeader = $pdfHandle ? fread($pdfHandle, 5) : false;

if ($pdfHandle) {
    fclose($pdfHandle);
}

if ($pdfHeader !== '%PDF-') {
    respond(422, false, 'Вложение не является корректным PDF-файлом.');
}

$applicant = $fields['firstName'] . ' ' . $fields['lastName'];
$subject = 'Анкета Radio Privoz - ' . $applicant;
$encodedSubject = '=?UTF-8?B?' . base64_encode($subject) . '?=';
$boundary = 'radio-privoz-' . bin2hex(random_bytes(16));
$attachmentName = 'radio-privoz-' . date('Ymd-His') . '.pdf';

$labels = [
    'firstName' => 'Имя',
    'lastName' => 'Фамилия',
    'email' => 'Email',
    'birthDate' => 'Дата рождения',
    'familySize' => 'Семья',
    'originCountry' => 'Откуда приехали',
    'voivodeship' => 'Область',
    'localityType' => 'Тип населённого пункта',
    'locality' => 'Город / село',
    'residenceType' => 'Где проживает',
    'employment' => 'Где работает',
    'phone' => 'Телефон',
    'cardNumber' => 'Номер карты',
    'cardType' => 'Тип карты',
    'personalDataConsent' => 'Согласие на обработку данных',
    'notificationsConsent' => 'Согласие на уведомления',
];

$textLines = ["Новая анкета Radio Privoz FM", ''];

foreach ($labels as $key => $label) {
    $textLines[] = $label . ': ' . $fields[$key];
}

$isLocal = isLocalRequest();

if (
    !is_dir(LOCAL_SUBMISSIONS_DIR) &&
    !mkdir(LOCAL_SUBMISSIONS_DIR, 0775, true) &&
    !is_dir(LOCAL_SUBMISSIONS_DIR)
) {
    respond(500, false, 'Не удалось создать папку анкет.');
}

$timestamp = date('Ymd-His');
$baseName = $timestamp . '-' . safeFilePart($applicant);
$savedPdfPath = LOCAL_SUBMISSIONS_DIR . '/' . $baseName . '.pdf';
$savedTextPath = LOCAL_SUBMISSIONS_DIR . '/' . $baseName . '.txt';
$localText = implode(PHP_EOL, array_merge(
    $textLines,
    [
        '',
        'PDF: ' . basename($savedPdfPath),
        'Дата сохранения: ' . date('c'),
    ]
)) . PHP_EOL;

if (
    !copy($pdfPath, $savedPdfPath) ||
    file_put_contents($savedTextPath, $localText, LOCK_EX) === false
) {
    @unlink($savedPdfPath);
    @unlink($savedTextPath);
    respond(500, false, 'Не удалось сохранить анкету.');
}

if ($isLocal) {
    respond(200, true, 'Анкета и PDF сохранены локально.');
}

$message = '--' . $boundary . "\r\n";
$message .= "Content-Type: text/plain; charset=UTF-8\r\n";
$message .= "Content-Transfer-Encoding: 8bit\r\n\r\n";
$message .= implode("\r\n", $textLines) . "\r\n\r\n";
$message .= '--' . $boundary . "\r\n";
$message .= 'Content-Type: application/pdf; name="' . $attachmentName . "\"\r\n";
$message .= "Content-Transfer-Encoding: base64\r\n";
$message .= 'Content-Disposition: attachment; filename="' . $attachmentName . "\"\r\n\r\n";
$message .= chunk_split(base64_encode((string) file_get_contents($pdfPath)));
$message .= "\r\n--" . $boundary . "--\r\n";

$headers = [
    'MIME-Version: 1.0',
    'Content-Type: multipart/mixed; boundary="' . $boundary . '"',
    'From: Radio Privoz <' . SENDER_EMAIL . '>',
    'Reply-To: ' . $fields['email'],
    'X-Mailer: PHP/' . PHP_VERSION,
];

$sent = mail(
    RECIPIENT_EMAIL,
    $encodedSubject,
    $message,
    implode("\r\n", $headers),
    '-f' . SENDER_EMAIL
);

if (!$sent) {
    respond(500, false, 'Почтовый сервер не принял сообщение.');
}

respond(200, true, 'Анкета успешно отправлена.');
