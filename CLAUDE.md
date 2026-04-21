# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Frontend
```bash
npm run dev      # dev server at http://localhost:5173
npm run build    # production build to dist/
npm run preview  # preview the production build
```

### Backend (AI panel)
```bash
cd backend
python app.py    # runs on http://localhost:5000
```

The Vite dev server proxies all `/api` requests to `http://localhost:5000` automatically — no CORS config needed in dev.

Backend requires `backend/.env`:
```
ANTHROPIC_API_KEY=your_key_here
```

### Deploy
- **Frontend**: GitHub Pages via `npm run build` — `vite.config.js` sets `base: '/DSAVisualizer/'` in production.
- **Backend**: Render, configured by `render.yaml`. Start command: `gunicorn app:app --bind 0.0.0.0:$PORT --workers 2 --timeout 120`.

---

## Architecture

### State flow (App.jsx → pages → AI panel)

`App.jsx` is the single top-level controller. It owns `activeTab`, `currentAlgorithm`, and `vizStatus`, passing them down as props. Each page reports back via three callbacks:

- `onAlgorithmChange(name)` — called when the user picks a different algorithm; updates `currentAlgorithm` which is forwarded to `AIPanel`
- `onVizStatusChange(status)` — `'idle' | 'running' | 'done' | 'maze'`; drives context-aware banners in the AI panel
- `showToast(message)` — centralized toast display

`AIPanel` floats over everything as a fixed right-side drawer. It receives `currentAlgorithm`, `currentTab`, and `vizStatus` from `App`. It does **not** communicate with individual pages — pages only push state up to `App`.

### AI Panel (`src/components/AIPanel/`)

Two files: `AIPanel.jsx` + `AIPanel.module.css` (CSS Modules, not global CSS).

The panel calls `POST /api/explain` and reads the SSE stream. Each message chunk has `{ type: 'text' | 'done' | 'error', text? }`. The backend injects structured algorithm context (from `backend/algorithm_data.py`) into every request — the frontend does **not** pass raw code, only the algorithm name and viz state string.

`ALGORITHM_DATA` in `backend/algorithm_data.py` is the source of truth for all algorithm metadata (complexity, use cases, watch-for cues). Add new entries there when adding new algorithms.

### Page pattern

Every page follows the same structure:
1. Local state for the data structure / grid
2. A controls bar (`.controls` div) with inputs and action buttons
3. An `.algo-info-bar` showing time/space complexity pulled from constants defined at the top of the file
4. The visualization area
5. A `.placeholder` empty state shown before first interaction

All pages use global styles from `src/pages/Page.css` plus their own optional CSS file. No CSS Modules on pages — only `AIPanel` uses CSS Modules.

### Styling system

All design tokens are CSS custom properties in `src/styles.css`. Key tokens:
- `--accent-primary: #6366f1` — indigo, the single accent color used throughout
- `--bg-primary / secondary / tertiary / card` — layered dark backgrounds
- `--color-visited`, `--color-path`, `--color-sorting-*` — visualization-specific colors

Avoid hardcoding colors. Always use the CSS variables.

### Algorithm implementations

`src/algorithms/` contains pure JS functions that return arrays of animation frames (snapshots of state), **not** generators or async functions. Pages consume these arrays with `setInterval`-based playback, using a `speedMap` to convert speed labels (`'slow' | 'normal' | 'fast'`) to millisecond delays.

Pathfinding algorithms export `{ visitedInOrder, shortestPath }`. Sorting algorithms export arrays of `{ array, comparingIndices, swappingIndices, sortedIndices }` frames.
