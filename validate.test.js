import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import Ajv from "ajv";
import { getEnums, buildSchema } from "./src/lib/schema.js";
import { sanitizeText, isTextClean, MAX_TEXT_LENGTH } from "./src/lib/text.js";
import {
  nextRecipeId,
  blankRecipe,
  duplicateRecipe,
  findStaleValues,
} from "./src/lib/recipes.js";

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

// ── Test: schema rebuilt by the editor (buildSchema) is a usable contract ────
test("schema rebuilt from current enums compiles and validates recipes", () => {
  const rebuilt = buildSchema(schema, getEnums(schema));
  const validateRebuilt = ajv.compile(rebuilt);
  assert.ok(validateRebuilt(recipes), "rebuilt schema rejected valid recipes");
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

// ── Recipe editor: central text policy ───────────────────────────────────────
test("sanitizeText keeps allowed characters and strips everything else", () => {
  assert.equal(sanitizeText("Mojito No.1, half-sour!"), "Mojito No.1, half-sour!");
  assert.equal(sanitizeText("Piña 🍹 Colada 😀"), "Pia  Colada ");
  assert.equal(sanitizeText("drop #table; SELECT *"), "drop table SELECT ");
  assert.equal(sanitizeText(null), "");
  assert.ok(!isTextClean("café ☕"));
});

test("sanitizeText caps length at MAX_TEXT_LENGTH", () => {
  const long = "a".repeat(MAX_TEXT_LENGTH + 50);
  assert.equal(sanitizeText(long).length, MAX_TEXT_LENGTH);
});

// ── Recipe editor: id / new / duplicate helpers ──────────────────────────────
test("nextRecipeId returns a unique sequential id", () => {
  assert.equal(nextRecipeId(recipes), "cocktail_004");
  assert.equal(nextRecipeId([]), "cocktail_001");
});

test("blankRecipe is a draft with the required fields present", () => {
  const r = blankRecipe(recipes);
  assert.equal(r.id, "cocktail_004");
  assert.deepEqual(r.glass, []);
  assert.equal(r.ingredients.length, 1);
});

test("duplicateRecipe deep-copies under a fresh id without mutating the source", () => {
  const copy = duplicateRecipe(recipes[0], recipes);
  assert.notEqual(copy.id, recipes[0].id);
  copy.ingredients[0].amount = 999;
  assert.notEqual(recipes[0].ingredients[0].amount, 999);
});

// ── Recipe editor: stale (out-of-schema) value detection ─────────────────────
test("findStaleValues flags values no longer allowed by the schema", () => {
  const enums = getEnums(schema);
  assert.deepEqual(findStaleValues(recipes[0], enums), []);

  const legacy = {
    ...JSON.parse(JSON.stringify(recipes[0])),
    glass: ["Martini Glass"],
    ingredients: [{ name: "Unicorn Tears", amount: 10, unit: "cups" }],
  };
  const stale = findStaleValues(legacy, enums);
  assert.ok(stale.some((s) => s.field === "glass" && s.value === "Martini Glass"));
  assert.ok(stale.some((s) => s.field === "ingredient" && s.value === "Unicorn Tears"));
  assert.ok(stale.some((s) => s.field === "unit" && s.value === "cups"));
});

// ── Recipe editor: a completed new recipe validates against the schema ────────
test("a filled-in new recipe passes the data contract", () => {
  const enums = getEnums(schema);
  const r = blankRecipe(recipes);
  r.name = "Test Sour";
  r.glass = [enums.glass[0]];
  r.ice = enums.ice[0];
  r.method = enums.method[0];
  r.ingredients = [{ name: enums.ingredients[0], amount: 20, unit: enums.units[0] }];
  assert.ok(validate([r]), "new recipe was rejected by the schema");
});
