Scent Game — Data via CSV (GitHub Pages)

Overview

This folder contains a small web app (HTML/CSS/JS) for a scent-guessing tabletop game. The app's game data (categories and scent pairs) is now read from two CSV files so non-developers can edit content easily.

Files of interest

- index.html — main page (already links to styles.css and script.js)
- styles.css — styling
- script.js — app logic; loads data from the `data/` folder
- data/categories.csv — category list (id,name,description)
- data/pairs.csv — pairs list (category_id,pair_id,answer,jars,scentLabels)

CSV format

1) categories.csv
Header: id,name,description
Example:
locations,Places / Buildings,Spaces you can stand in or move through.

- id: unique identifier (no spaces, used as key)
- name: human-friendly label shown in the UI
- description: short help text shown when the category is selected

2) pairs.csv
Header: category_id,pair_id,answer,jars,scentLabels
Example:
locations,bakery,Bakery,2|3,Caramel|Vanilla

- category_id: must match one of the ids from categories.csv
- pair_id: unique id for the pair
- answer: shown when the answer is revealed
- jars: pipe-separated jar numbers (e.g. 2|3)
- scentLabels: pipe-separated labels for each jar (e.g. Caramel|Vanilla)

Notes and tips

- GitHub Pages: Place this repo (or the W3_Scent folder) on GitHub and enable GitHub Pages for the branch — the app will be served over HTTPS and the built-in fetch() calls will work.

- Local testing: Modern browsers block fetch() from file://. To test locally, run a simple HTTP server from this folder (examples):
  - Python 3: python -m http.server 8000
  - Node (http-server): npx http-server -p 8000

- Fallback: The app attempts to load the CSV files from `data/` and will fall back to a tiny embedded dataset if fetch fails. This lets the page run without a server but you won't get the full game content.

- Editing arrays: The `jars` and `scentLabels` columns use a pipe character (|) to separate items. Keep the order aligned (first label belongs to first jar).

- Robust parsing: The simple CSV parser in `script.js` expects no quoted commas. If you need richer CSV features, consider using PapaParse and include it via CDN.

Customizing content

1. Edit `data/categories.csv` to add/rename categories.
2. Edit `data/pairs.csv` and ensure `category_id` matches categories.
3. Commit and push the changes to GitHub (if using GitHub Pages) — the site will pick up the new data automatically.

If you want, I can:
- Add sample images or per-pair notes (extra CSV columns).
- Switch to a single JSON file for easier nested data editing.
- Integrate PapaParse for robust CSV parsing and better error messages.
