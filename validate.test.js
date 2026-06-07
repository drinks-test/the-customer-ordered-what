import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import Ajv from "ajv";

const schema = JSON.parse(readFileSync("./schema.json", "utf8"));
const recipes = JSON.parse(readFileSync("./recipes.json", "utf8"));

const ajv = new Ajv({ allErrors: true });
const validate = ajv.compile(schema);

// ── Test 1: recipes.json as a whole passes the schema ────────────────────────
test("recipes.json passes the data contract (schema.json)", () => {
  const valid = validate(recipes);
  if (!valid) {
    const errors = validate.errors
      .map((e) => `  • ${e.instancePath || "root"} ${e.message}`)
      .join("\n");
    assert.fail(`Schema validation failed:\n${errors}`);
  }
  assert.ok(valid);
});

// ── Test 2: each recipe is individually valid and has a unique id ─────────────
test("every recipe has a unique id", () => {
  const ids = recipes.map((r) => r.id);
  const unique = new Set(ids);
  assert.equal(unique.size, ids.length, `Duplicate ids found: ${ids}`);
});

// ── Test 3: every recipe has at least one ingredient ─────────────────────────
test("every recipe has at least one ingredient", () => {
  for (const recipe of recipes) {
    assert.ok(
      recipe.ingredients.length >= 1,
      `"${recipe.name}" has no ingredients`
    );
  }
});
