# ruflo-test

Two vanilla web apps built with zero dependencies.

## To-Do App (`src/`)

A simple to-do app with localStorage persistence.

**Features:** Add, complete, delete, inline edit, drag-and-drop reorder, due dates, filter by All/Active/Completed, clear completed.

**Architecture:** ES modules — `TodoStore.js` (data), `TodoRenderer.js` (DOM), `app.js` (controller).

**Run:**
```bash
npx serve src
```
Then open `http://localhost:3000`.

## Ephemera (`ephemera/`)

A thought journal where entries decay like memories.

**Features:** Write thoughts that visually decay over time — text scrambles, blurs, and fades. Hover to "remember" and restore clarity. Fully decayed thoughts dissolve into floating particles. Auto-detects mood from keywords (joy, sadness, anger, calm, fear, love) and colors entries accordingly.

**Run:** Open `ephemera/index.html` directly in a browser.
