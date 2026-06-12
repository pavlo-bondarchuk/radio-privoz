# Radio Privoz FM

Static landing page with a Plyr audio player and card activation questionnaire.

## Questionnaire delivery

- On `file://`, localhost, `127.0.0.1`, and GitHub Pages, submission runs in preview mode: validation and PDF creation work, but no email is sent.
- On a regular PHP hosting, the browser submits the questionnaire and generated PDF to `submit.php`.
- Before production, replace `change-me@example.com` in `submit.php` with the recipient address.
- The hosting must support PHP `mail()` and allow PDF attachments up to 10 MB.
