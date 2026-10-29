# Aesthetic — Random Aesthetic Generator

A polished, responsive static website for exploring harmonious color palettes and font pairings. Preview the combination in a sample landing page, lock the parts you like, save favorites, and export reusable CSS.

## Features

- **Six-color palette generator** with curated, mood-based palette families.
- **Font pairing generator** with live Google Fonts previews and independent regeneration.
- **Live landing-page preview** that updates with the selected palette and typography.
- **Desktop, tablet, and mobile preview modes.**
- **Theme toggle** with persistent dark mode preference.
- **Controlled randomness:** lock individual colors, all colors, either font, or both fonts.
- **Seven preset directions:** Minimal, Pastel, Retro, Dark, Luxury, Nature, and Futuristic, plus Surprise Me.
- **Copy actions** for individual HEX codes, all palette values, and font names.
- **CSS export** with variables, font declarations, and basic usage rules; includes a download option.
- **Favorites** stored in browser `localStorage`, with restore, copy, and remove actions.
- **Contrast feedback** for the canvas and ink colors using a WCAG contrast ratio calculation.
- Keyboard shortcuts, visible focus styles, semantic markup, responsive layouts, and reduced-motion support.
- Graceful handling of invalid saved data and unavailable local storage.

## Technology

- HTML5
- CSS3 (custom properties, responsive grid/flex layouts, media queries)
- Vanilla JavaScript (no framework or build step)
- Google Fonts for optional typefaces

## Run locally

1. Download or clone the project.
2. Open `index.html` directly in a browser, or open the folder in VS Code.
3. For a smoother development workflow, install the **Live Server** extension in VS Code, right-click `index.html`, and select **Open with Live Server**.

The generator, preview, favorites, and CSS export work without a backend or API key. Google Fonts requires an internet connection; fallback fonts are provided.

## Usage

1. Click **Generate aesthetic** or press `Space`.
2. Choose a preset to explore a visual direction.
3. Click a color swatch to copy its HEX value. Use the lock icon to preserve a color when regenerating.
4. Regenerate colors and fonts independently using their refresh buttons.
5. Switch the preview between desktop, tablet, and mobile sizes.
6. Save a combination to Favorites, then restore it later.
7. Select **Export CSS** to copy or download the current variables.

### Keyboard shortcuts

- `Space` — generate a new aesthetic (when not typing in a form field or dialog)
- `G` — return to Generate
- `Ctrl + S` / `Cmd + S` — save or remove the current aesthetic from Favorites

## Project structure

```text
aesthetic-generator/
├── index.html
├── style.css
├── script.js
└── README.md
```

## Notes and limitations

- Palette harmony is provided by curated palettes grouped by visual direction rather than a full color-theory engine. The generator randomly selects from a palette family, then preserves locked colors.
- Contrast feedback checks the palette's canvas/ink combination. It does not audit every possible text/background combination or replace a complete accessibility review.
- Favorites are saved only in the current browser/device. Clearing site data removes them.
- The preview is a representative static landing-page composition; it is not a full website builder.
- Google Fonts may not load offline. System fallback fonts keep the application usable.
- Browser clipboard permissions can vary. If the modern Clipboard API is unavailable, the app attempts a legacy copy fallback and reports failure if neither works.
