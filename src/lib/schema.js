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

// The six enum categories that make up the data contract, read in one go so the
// schema editor can present them all and rebuild the file from a single object.
export function getEnums(schema) {
  return {
    glass: getGlasses(schema),
    ice: getIce(schema),
    method: getMethods(schema),
    ingredients: getIngredientNames(schema),
    units: getUnits(schema),
    garnish: getGarnishes(schema),
  };
}

// Returns a copy of the base schema with every enum list replaced by the values
// in `enums`. The base is cloned so the original contract object is untouched,
// and only enum arrays are swapped — the rest of the contract stays intact.
export function buildSchema(base, enums) {
  const next = JSON.parse(JSON.stringify(base));
  const props = next.items.properties;
  props.glass.items.enum = [...enums.glass];
  props.ice.enum = [...enums.ice];
  props.method.enum = [...enums.method];
  props.ingredients.items.properties.name.enum = [...enums.ingredients];
  props.ingredients.items.properties.unit.enum = [...enums.units];
  props.garnish.items.enum = [...enums.garnish];
  return next;
}
