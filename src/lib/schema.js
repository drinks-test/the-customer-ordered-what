// Pure helpers for reading the allowed enum values out of the data contract
// (schema.json). The schema object is always passed in so this module stays
// import-free and usable from both the React app and the node:test suite.

function ingredientProps(schema) {
  return schema?.items?.properties?.ingredients?.items?.properties ?? {};
}

export function getIngredientNames(schema) {
  return ingredientProps(schema).name?.enum ?? [];
}

export function getUnits(schema) {
  return ingredientProps(schema).unit?.enum ?? [];
}

export function getGlasses(schema) {
  return schema?.items?.properties?.glass?.items?.enum ?? [];
}

export function getMethods(schema) {
  return schema?.items?.properties?.method?.enum ?? [];
}

export function getGarnishes(schema) {
  return schema?.items?.properties?.garnish?.items?.enum ?? [];
}

export function getIce(schema) {
  return schema?.items?.properties?.ice?.enum ?? [];
}
