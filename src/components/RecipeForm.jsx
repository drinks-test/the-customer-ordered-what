import SearchableSelect from "./SearchableSelect.jsx";
import { CleanInput, MultiSelect, SingleSelect, Label } from "./RecipeFields.jsx";

const emptyIngredient = () => ({ name: "", amount: null, unit: "" });

// Edits a single recipe. Every enum field is constrained to the schema, free
// text runs through the central sanitiser, and amounts are kept numeric/null.
export default function RecipeForm({ recipe, enums, onChange }) {
  function set(field, val) {
    onChange({ ...recipe, [field]: val });
  }
  function setIngredient(i, next) {
    set("ingredients", recipe.ingredients.map((r, idx) => (idx === i ? next : r)));
  }
  function setIngField(i, field, val) {
    setIngredient(i, { ...recipe.ingredients[i], [field]: val });
  }
  function addIngredient() {
    set("ingredients", [...recipe.ingredients, emptyIngredient()]);
  }
  function removeIngredient(i) {
    const next = recipe.ingredients.filter((_, idx) => idx !== i);
    set("ingredients", next.length ? next : [emptyIngredient()]);
  }

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Id</Label>
          <div className="mt-2">
            <CleanInput value={recipe.id} onChange={(v) => set("id", v)} placeholder="cocktail_004" />
          </div>
        </div>
        <div>
          <Label>Name</Label>
          <div className="mt-2">
            <CleanInput value={recipe.name} onChange={(v) => set("name", v)} placeholder="Recipe name" />
          </div>
        </div>
      </div>

      <div>
        <Label>Glass</Label>
        <MultiSelect options={enums.glass} selected={recipe.glass} onChange={(v) => set("glass", v)} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Ice</Label>
          <SingleSelect options={enums.ice} value={recipe.ice} onChange={(v) => set("ice", v)} />
        </div>
        <div>
          <Label>Method</Label>
          <SingleSelect options={enums.method} value={recipe.method} onChange={(v) => set("method", v)} />
        </div>
      </div>

      <div>
        <Label>Ingredients</Label>
        <div className="mt-2 space-y-2">
          {recipe.ingredients.map((ing, i) => (
            <div key={i} className="grid grid-cols-12 items-center gap-2">
              <div className="col-span-6">
                <SearchableSelect
                  options={enums.ingredients}
                  value={ing.name}
                  placeholder="Ingredient"
                  onChange={(v) => setIngField(i, "name", v)}
                />
              </div>
              <div className="col-span-2">
                <input
                  type="number"
                  min="0"
                  step="any"
                  value={ing.amount ?? ""}
                  placeholder="Amt"
                  onChange={(e) =>
                    setIngField(i, "amount", e.target.value === "" ? null : Number(e.target.value))
                  }
                  className="w-full rounded-md border border-stone-300 bg-white px-2 py-2 text-sm text-stone-800 shadow-sm focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>
              <div className="col-span-3">
                <SingleSelect
                  options={enums.units}
                  value={ing.unit}
                  onChange={(v) => setIngField(i, "unit", v)}
                />
              </div>
              <div className="col-span-1 text-right">
                <button
                  type="button"
                  onClick={() => removeIngredient(i)}
                  aria-label="Remove ingredient"
                  className="rounded px-2 py-1 text-stone-400 hover:bg-red-50 hover:text-red-500"
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={addIngredient}
          className="mt-3 rounded-lg border border-dashed border-stone-300 px-4 py-2 text-sm font-medium text-stone-600 hover:border-amber-400 hover:text-amber-700"
        >
          + Add Ingredient
        </button>
      </div>

      <div>
        <Label>Garnish</Label>
        <MultiSelect options={enums.garnish} selected={recipe.garnish} onChange={(v) => set("garnish", v)} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Optional notes</Label>
          <div className="mt-2">
            <CleanInput
              value={recipe.optionalNotes ?? ""}
              onChange={(v) => set("optionalNotes", v === "" ? null : v)}
              placeholder="Optional"
            />
          </div>
        </div>
        <div>
          <Label>Tasting notes</Label>
          <div className="mt-2">
            <CleanInput
              value={recipe.tastingNotes ?? ""}
              onChange={(v) => set("tastingNotes", v === "" ? null : v)}
              placeholder="Optional"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
