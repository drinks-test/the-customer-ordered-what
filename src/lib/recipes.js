// Pure helpers for the hidden recipe editor. Kept import-light so they can be
// unit-tested under node:test as well as used from the React UI.

// Next sequential "cocktail_NNN" id that doesn't collide with existing recipes.
export function nextRecipeId(recipes) {
  const ids = new Set((recipes ?? []).map((r) => r.id));
  let n = (recipes?.length ?? 0) + 1;
  let id = `cocktail_${String(n).padStart(3, "0")}`;
  while (ids.has(id)) {
    n += 1;
    id = `cocktail_${String(n).padStart(3, "0")}`;
  }
  return id;
}

// A new empty recipe shell carrying every schema-required field as a draft.
export function blankRecipe(recipes) {
  return {
    id: nextRecipeId(recipes),
    name: "",
    glass: [],
    ice: "",
    method: "",
    ingredients: [{ name: "", amount: null, unit: "" }],
    garnish: [],
    optionalNotes: null,
    tastingNotes: null,
  };
}

// Deep-copy a recipe under a fresh id (the "Duplicate" action).
export function duplicateRecipe(recipe, recipes) {
  const copy = JSON.parse(JSON.stringify(recipe));
  copy.id = nextRecipeId(recipes);
  copy.name = recipe.name ? `${recipe.name} COPY` : "";
  return copy;
}

// Find values a recipe uses that are no longer allowed by the schema enums, so
// the UI can flag legacy data instead of silently dropping it.
export function findStaleValues(recipe, enums) {
  const stale = [];
  const check = (field, values, allowed) => {
    for (const v of values) {
      if (v && !allowed.includes(v)) stale.push({ field, value: v });
    }
  };
  check("glass", recipe.glass ?? [], enums.glass);
  check("ice", recipe.ice ? [recipe.ice] : [], enums.ice);
  check("method", recipe.method ? [recipe.method] : [], enums.method);
  check("garnish", recipe.garnish ?? [], enums.garnish);
  for (const ing of recipe.ingredients ?? []) {
    check("ingredient", ing.name ? [ing.name] : [], enums.ingredients);
    check("unit", ing.unit ? [ing.unit] : [], enums.units);
  }
  return stale;
}
