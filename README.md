# ruflo-test

Three vanilla web apps built with zero dependencies.

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

## OIC Drill (`oic-drill/`)

A timed, branching data breach tabletop simulator for Jamaican organisations.

**Scenarios:** Kingston General Hospital (ransomware), Parish Savings Credit Union (insider threat), National Water Commission (cloud misconfiguration).

**Features:** Countdown clock, budget counter, branching decision trees (10 nodes per scenario), scoring on legal compliance, containment, and reputation. Decision log with export. End screen with grade, after action summary, and a generated OIC breach notification letter per Section 22 of the Data Protection Act, 2020.

**Run:**
```bash
npx serve oic-drill
```
Then open `http://localhost:3000`.
