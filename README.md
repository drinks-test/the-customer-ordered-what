# the-customer-ordered-what

A time-based **Bartender Cocktail Quiz** — a frontend-only React (Vite + Tailwind)
app that tests how well you can rebuild cocktail recipes from memory.

`schema.json` is the source of truth (the data contract). `recipes.json` is the
cocktail "database". The UI, the ingredient dropdowns and the automated tests all
derive their allowed values from the schema.

## Run locally

```bash
npm install
npm run dev      # start the dev server
npm run build    # production build into dist/
npm run preview  # preview the production build
```

> Note: the binaries are invoked via `node ./node_modules/vite/bin/vite.js`
> because this folder name contains a `:` which breaks PATH-based bin lookup.

## Test (validates against schema.json)

```bash
npm test
```

This runs two suites with the built-in Node test runner:

- `validate.test.js` — checks `recipes.json` satisfies `schema.json` (via Ajv).
- `src/lib/grading.test.js` — checks the schema-enum helpers and the quiz
  grading logic the website relies on.

## Deployment (GitHub Pages)

Pushing to `main` triggers `.github/workflows/deploy.yml`, which tests, builds
and publishes to GitHub Pages. Enable it once under **Settings → Pages →
Build and deployment → Source: GitHub Actions**.

Once deployed the site is served at:
`https://drinks-test.github.io/the-customer-ordered-what/`
(this is why `base` in `vite.config.js` is `/the-customer-ordered-what/`).