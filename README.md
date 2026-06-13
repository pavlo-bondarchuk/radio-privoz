# Radio Privoz FM

Static landing page with a Plyr audio player and card activation questionnaire.

## Questionnaire delivery

- On `file://` and GitHub Pages, submission runs in preview mode: validation and PDF creation work, but no email is sent.
- For a full local submission test, run `php -S 127.0.0.1:4173` and open `http://127.0.0.1:4173`. Each successful submission creates matching `.txt` and `.pdf` files in `submissions/`.
- The local `submissions/` folder is ignored by Git because it contains personal data.
- On a regular PHP hosting, the browser submits the questionnaire and generated PDF to `submit.php`.
- Before production, replace `change-me@example.com` in `submit.php` with the recipient address.
- The hosting must support PHP `mail()` and allow PDF attachments up to 10 MB.
