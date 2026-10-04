# Radio Prywoz Home Layout

Окрема верстка головної сторінки Radio Prywoz.

## Структура

- `index.html` — головна сторінка.
- `listen.html`, `news.html`, `services.html`, `business.html`, `programs.html`, `about.html`, `contacts.html` — внутрішні сторінки порталу.
- `privacy.html` — політика приватності.
- `styles/main.css` — змінні, базові стилі, контейнер, сітки, утиліти.
- `styles/pages/home.css` — стилі блоків головної сторінки.
- `scripts/pages/home.js` — скрипти головної сторінки.
- `scripts/pages/inner.js` — спільна навігація, тема, локальний час і логіка внутрішніх сторінок.
- `assets/data/broadcast-schedule.json` — налаштування потоку ефіру.
- `assets/` — локальні зображення та аудіо.

## Ефір

Сайт відтворює власний потік Radio Prywoz з MyRadio24:

`https://listen1.myradio24.com/73556`

Плейлисти, джингли та розклад керуються в кабінеті MyRadio24. На сайті не потрібно окремо завантажувати MP3 або редагувати розклад після змін у кабінеті.

## Запуск

Відкрити `index.html` у браузері або запустити локальний сервер:

```bash
python3 -m http.server 8080
```
