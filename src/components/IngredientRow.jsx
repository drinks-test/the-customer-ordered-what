import SearchableSelect from "./SearchableSelect.jsx";

// One editable ingredient line: name (searchable), amount and unit.
export default function IngredientRow({
  row,
  index,
  ingredientNames,
  units,
  onChange,
  onRemove,
}) {
  function set(field, val) {
    onChange(index, { ...row, [field]: val });
  }

  return (
    <div className="grid grid-cols-12 items-center gap-2">
      <div className="col-span-6">
        <SearchableSelect
          options={ingredientNames}
          value={row.name}
          placeholder="Ingredient"
          onChange={(v) => set("name", v)}
        />
      </div>
      <div className="col-span-2">
        <input
          type="number"
          min="0"
          step="any"
          value={row.amount}
          placeholder="Amt"
          onChange={(e) => set("amount", e.target.value)}
          className="w-full rounded-md border border-stone-300 bg-white px-2 py-2 text-sm text-stone-800 shadow-sm focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
        />
      </div>
      <div className="col-span-3">
        <select
          value={row.unit}
          onChange={(e) => set("unit", e.target.value)}
          className="w-full rounded-md border border-stone-300 bg-white px-2 py-2 text-sm text-stone-800 shadow-sm focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
        >
          <option value="">Unit</option>
          {units.map((u) => (
            <option key={u} value={u}>
              {u}
            </option>
          ))}
        </select>
      </div>
      <div className="col-span-1 text-right">
        <button
          type="button"
          onClick={() => onRemove(index)}
          aria-label="Remove ingredient"
          className="rounded px-2 py-1 text-stone-400 hover:bg-red-50 hover:text-red-500"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
