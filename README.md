# De Tafelaar – Menu maker

Edit the dinner menu and the drinks menu yourself and save them as PDF, always in the same house style.

## Use it on your own Mac (the full version)

1. Double-click **Start Menu Maker.command**. The editor opens in your browser.
2. Click anything on the menu to change it. Changes save automatically.
3. Pick the paper size (**A4** or **A5**) and click **Make PDF**. The PDF lands in the `PDF` folder.
   Every page has a 5 mm white margin on all four sides.
4. Click **Publish online** to put the menu on the website for everyone.

## The website (Vercel)

The website shows the published menu to everyone and lets anybody try changes.

- Changes made on the website stay on that person's own device; they do not change what others see.
- **Make PDF** opens the browser's print window: choose *Save as PDF*, the same paper size, and
  switch *Background graphics* on. Use Google Chrome.
- To publish from the website instead of the Mac: *Download menu file* (bottom of the left column) and
  replace `public/menu-data.json` on GitHub with it.

Vercel setup: import this repository, framework preset **Other**, no build command. It serves the `public` folder.

## What is where

| | |
|---|---|
| `public/menu-data.json` | the published menu (all dishes, drinks, prices, texts) |
| `public/defaults.js` | the original menus, used by "Reset to original" |
| `public/render.js`, `theme.css` | the page layouts and house style |
| `public/index.html` | the editor |
| `server.py` | small helper for your Mac: saving, PDF, publish |

## Fonts

The dinner menu uses Bevan and Sorts Mill Goudy (free, Google Fonts). The original drinks card uses
Bernard MT Condensed and Goudy Old Style, which come with Microsoft Office and may not be put online.
On a Mac that has them in `public/assets/fonts/`, PDFs use the original fonts; the website uses the
free dinner-menu fonts in the same shapes instead.
