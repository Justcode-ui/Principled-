# Principled
### A personal AI policy builder

Define where you stand — build your own AI policy with clear standards, privacy boundaries, quality controls, and disclosure templates.

---

## Getting Started

```bash
# Install dependencies
npm install

# Run locally
npm run dev

# Build for production
npm run build
```

The production build outputs to the `dist/` folder.

---

## Deploying

### Vercel (recommended — one command)
```bash
npm install -g vercel
vercel
```
Vercel auto-detects Vite. Just follow the prompts.

### Netlify
1. Run `npm run build`
2. Drag and drop the `dist/` folder to [netlify.com/drop](https://app.netlify.com/drop)

### Netlify CLI
```bash
npm install -g netlify-cli
npm run build
netlify deploy --prod --dir=dist
```

---

## Project Structure

```
principled/
├── index.html          # Entry HTML
├── package.json        # Dependencies & scripts
├── vite.config.js      # Vite configuration
└── src/
    ├── main.jsx        # React entry point
    └── App.jsx         # Full application (single file)
```

## Notes
- No backend required — fully static
- The `docx` library loads from CDN on first download click
- Save progress using the **↓ Save .json** button; reload with **↑ Load saved policy**
