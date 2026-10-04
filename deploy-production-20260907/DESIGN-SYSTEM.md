# Radio Prywoz Design System

Редизайн зібраний шарами, щоб дизайн-схему можна було міняти без переписування сторінок.

## CSS Layers

1. `styles/tokens.css` — головні дизайн-токени: кольори, типографіка, spacing, radius, shadows, motion.
2. `styles/main.css` — базова сітка, header/footer і старі глобальні правила.
3. `styles/pages/*.css` — локальна верстка конкретних сторінок.
4. `styles/components.css` — повторювані компоненти: кнопки, фільтри, пагінація, форми, focus state.
5. `styles/open-fm-redesign.css` — тема редизайну поверх існуючих БЕМ-класів.

## What To Change First

- Palette: `--ds-color-*` in `styles/tokens.css`.
- Typography: `--ds-font-*`, `--ds-line-*`, `--ds-weight-*`.
- Spacing: `--ds-space-*` and `--gutter`.
- Radius: `--ds-radius-*`.
- Shadows and glow: `--ds-shadow-*`.
- Interaction speed: `--ds-motion-*`.

## Component Rules

- Keep page markup in BEM classes.
- Use existing component classes before adding new ones: `.button`, `.news-card`, `.gallery-card`, `.listen-player`, `.contact-form-card`.
- New pages should include CSS in the same order:

```html
<link rel="stylesheet" href="./styles/tokens.css">
<link rel="stylesheet" href="./styles/main.css">
<link rel="stylesheet" href="./styles/pages/page-name.css">
<link rel="stylesheet" href="./styles/components.css">
<link rel="stylesheet" href="./styles/open-fm-redesign.css">
```

## Current Theme

The active visual direction keeps the Open FM-like structure, but returns Radio Prywoz to a lighter, warmer mood:

- light ivory/sand base `#fff7ea`;
- system-ui typography;
- compact 4px card/button radius;
- open accent plaques: pink `#ff4fa3`, green `#18b95f`, yellow `#ffd233`, blue `#1463ff`;
- pink/purple primary CTA gradient;
- subtle hover elevation;
- high-contrast dark text on light surfaces.
