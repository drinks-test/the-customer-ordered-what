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

## Adding & editing cocktails (non-technical workflow)

No code needed. Use the two hidden editor pages, then update the two data files in GitHub.

**Step 1 — Edit the schema (optional)**
Open [`/#schema-editor`](https://drinks-test.github.io/the-customer-ordered-what/#schema-editor) to add or remove allowed values (glasses, ice types, ingredients, etc.). Click **Copy**, then paste the result over [`schema.json`](https://github.com/drinks-test/the-customer-ordered-what/blob/main/schema.json) in GitHub (pencil icon → paste → commit).

**Step 2 — Build your recipes**
Open [`/#recipe-editor`](https://drinks-test.github.io/the-customer-ordered-what/#recipe-editor) to create, duplicate or edit cocktails. All dropdowns are constrained to the current schema. Click **Copy**, then paste the result over [`recipes.json`](https://github.com/drinks-test/the-customer-ordered-what/blob/main/recipes.json) in GitHub (pencil icon → paste → commit).

**Step 3 — Done**
GitHub Actions tests, builds and redeploys the site automatically within ~60 seconds.

## Deployment (GitHub Pages)

Pushing to `main` triggers `.github/workflows/deploy.yml`, which tests, builds
and publishes to GitHub Pages. Enable it once under **Settings → Pages →
Build and deployment → Source: GitHub Actions**.

Once deployed the site is served at:
`https://drinks-test.github.io/the-customer-ordered-what/`
(this is why `base` in `vite.config.js` is `/the-customer-ordered-what/`).