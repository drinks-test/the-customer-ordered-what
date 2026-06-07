import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { gradeRecipe, gradeQuiz, totals } from "./grading.js";
import {
  getIngredientNames,
  getUnits,
  getGlasses,
  getMethods,
  getGarnishes,
  getIce,
} from "./schema.js";

const schema = JSON.parse(readFileSync("./schema.json", "utf8"));
const recipes = JSON.parse(readFileSync("./recipes.json", "utf8"));

// ── schema.js helpers read the enums straight from the data contract ─────────
test("schema helpers expose the contract enums", () => {
  assert.ok(getIngredientNames(schema).includes("Vodka"));
  assert.deepEqual(getUnits(schema), ["ml", "dash"]);
  assert.ok(getGlasses(schema).includes("Highball"));
  assert.ok(getMethods(schema).includes("Shake & Strain"));
  assert.ok(getGarnishes(schema).includes("Mint Sprig"));
  assert.ok(getIce(schema).includes("Crushed"));
});

// ── every ingredient in recipes.json is a valid schema enum value ────────────
test("recipes only use ingredient names allowed by the schema", () => {
  const allowed = new Set(getIngredientNames(schema));
  const units = new Set(getUnits(schema));
  for (const recipe of recipes) {
    for (const ing of recipe.ingredients) {
      assert.ok(allowed.has(ing.name), `bad ingredient: ${ing.name}`);
      assert.ok(units.has(ing.unit), `bad unit: ${ing.unit}`);
    }
  }
});

// ── a perfect copy of the real recipe scores 100% ────────────────────────────
test("an exact recipe submission scores a perfect 1.0", () => {
  const recipe = recipes[0];
  const grade = gradeRecipe(recipe.ingredients, recipe.ingredients);
  assert.equal(grade.score, 1);
  assert.equal(grade.correctCount, recipe.ingredients.length);
  assert.equal(grade.extras.length, 0);
});

// ── wrong amount / unit / missing rows are caught ────────────────────────────
test("gradeRecipe flags wrong amount, wrong unit and missing items", () => {
  const actual = [
    { name: "Vodka", amount: 20, unit: "ml" },
    { name: "Sugar Syrup", amount: 10, unit: "ml" },
  ];
  const user = [
    { name: "Vodka", amount: 25, unit: "ml" }, // wrong amount
    { name: "Sugar Syrup", amount: 10, unit: "dash" }, // wrong unit
  ];
  const grade = gradeRecipe(user, actual);
  assert.equal(grade.correctCount, 0);
  assert.equal(grade.results[0].amountOk, false);
  assert.equal(grade.results[1].unitOk, false);

  const empty = gradeRecipe([], actual);
  assert.equal(empty.correctCount, 0);
  assert.equal(empty.results[0].got, null);
});

// ── extra (unexpected) ingredients are reported but not counted ──────────────
test("gradeRecipe reports extra ingredients", () => {
  const actual = [{ name: "Vodka", amount: 20, unit: "ml" }];
  const user = [
    { name: "Vodka", amount: 20, unit: "ml" },
    { name: "Absinthe", amount: 2, unit: "dash" },
  ];
  const grade = gradeRecipe(user, actual);
  assert.equal(grade.score, 1);
  assert.equal(grade.extras.length, 1);
  assert.equal(grade.extras[0].name, "Absinthe");
});

// ── gradeQuiz + totals aggregate across the whole quiz ───────────────────────
test("gradeQuiz and totals aggregate every recipe", () => {
  const submissions = recipes.map((r) => r.ingredients);
  const graded = gradeQuiz(submissions, recipes);
  const summary = totals(graded);
  assert.equal(summary.recipes, recipes.length);
  assert.equal(summary.perfect, recipes.length);
  assert.equal(summary.correct, summary.total);
});

// ── full submission (ingredients + glass + garnish + ice + method) ────────────
test("full submission with all fields correct scores 1.0", () => {
  const recipe = recipes[0]; // ZOMBIE
  const submission = {
    ingredients: recipe.ingredients,
    glass: recipe.glass,
    garnish: recipe.garnish ?? [],
    ice: recipe.ice,
    method: recipe.method,
  };
  const grade = gradeRecipe(submission, recipe);
  assert.equal(grade.score, 1);
  assert.equal(grade.correctCount, grade.total);
  assert.equal(grade.glassResult.correct, true);
  assert.equal(grade.garnishResult.correct, true);
  assert.equal(grade.iceResult.correct, true);
  assert.equal(grade.methodResult.correct, true);
});

test("wrong glass selection fails glassResult", () => {
  const recipe = recipes[0]; // ZOMBIE — glass: ["Highball", "Tiki Mug"]
  const submission = {
    ingredients: recipe.ingredients,
    glass: ["Highball"], // missing Tiki Mug
    garnish: recipe.garnish ?? [],
    ice: recipe.ice,
    method: recipe.method,
  };
  const grade = gradeRecipe(submission, recipe);
  assert.equal(grade.glassResult.correct, false);
});

test("wrong garnish selection fails garnishResult", () => {
  const recipe = recipes[0]; // ZOMBIE — garnish: ["Mint Sprig"]
  const submission = {
    ingredients: recipe.ingredients,
    glass: recipe.glass,
    garnish: ["Cherry"], // wrong garnish
    ice: recipe.ice,
    method: recipe.method,
  };
  const grade = gradeRecipe(submission, recipe);
  assert.equal(grade.garnishResult.correct, false);
});

test("wrong ice fails iceResult", () => {
  const recipe = recipes[0]; // ZOMBIE — ice: "Crushed"
  const submission = {
    ingredients: recipe.ingredients,
    glass: recipe.glass,
    garnish: recipe.garnish ?? [],
    ice: "Cubed", // wrong
    method: recipe.method,
  };
  const grade = gradeRecipe(submission, recipe);
  assert.equal(grade.iceResult.correct, false);
});

test("wrong method fails methodResult", () => {
  const recipe = recipes[2]; // LEMON DROP — method: "Shake & Fine Strain"
  const submission = {
    ingredients: recipe.ingredients,
    glass: recipe.glass,
    garnish: recipe.garnish ?? [],
    ice: recipe.ice,
    method: "Shake & Strain", // wrong
  };
  const grade = gradeRecipe(submission, recipe);
  assert.equal(grade.methodResult.correct, false);
});

test("full gradeQuiz with full submissions scores perfectly", () => {
  const submissions = recipes.map((r) => ({
    ingredients: r.ingredients,
    glass: r.glass,
    garnish: r.garnish ?? [],
    ice: r.ice,
    method: r.method,
  }));
  const graded = gradeQuiz(submissions, recipes);
  const summary = totals(graded);
  assert.equal(summary.perfect, recipes.length);
  assert.equal(summary.correct, summary.total);
});
