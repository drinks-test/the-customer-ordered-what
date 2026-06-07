import { useState } from "react";
import IngredientRow from "./IngredientRow.jsx";
import { formatTime } from "../lib/format.js";

const emptyRow = () => ({ name: "", amount: "", unit: "" });

// State 2: build the recipe for one cocktail. Remounted per cocktail (via key),
// so the row state resets automatically between questions.
export default function Quiz({
  recipe,
  index,
  total,
  elapsed,
  ingredientNames,
  units,
  glasses,
  garnishes,
  iceOptions,
  methods,
  onSubmit,
}) {
  const [rows, setRows] = useState([emptyRow(), emptyRow()]);
  const [selectedGlass, setSelectedGlass] = useState([]);
  const [selectedGarnish, setSelectedGarnish] = useState([]);
  const [selectedIce, setSelectedIce] = useState("");
  const [selectedMethod, setSelectedMethod] = useState("");
  const isLast = index === total - 1;

  function updateRow(i, next) {
    setRows(rows.map((r, idx) => (idx === i ? next : r)));
  }
  function addRow() {
    setRows([...rows, emptyRow()]);
  }
  function removeRow(i) {
    setRows(rows.length === 1 ? [emptyRow()] : rows.filter((_, idx) => idx !== i));
  }
  function toggleSet(current, value) {
    return current.includes(value) ? current.filter((v) => v !== value) : [...current, value];
  }
  function submit() {
    const ingredients = rows
      .filter((r) => r.name)
      .map((r) => ({
        name: r.name,
        amount: r.amount === "" ? null : Number(r.amount),
        unit: r.unit,
      }));
    onSubmit({ ingredients, glass: selectedGlass, garnish: selectedGarnish, ice: selectedIce, method: selectedMethod });
  }

  return (
    <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
      <div className="flex items-center justify-between border-b border-stone-200 pb-4">
        <span className="text-sm font-medium text-stone-500">
          Cocktail {index + 1} of {total}
        </span>
        <span className="rounded-full bg-stone-900 px-3 py-1 font-mono text-sm text-amber-300">
          ⏱ {formatTime(elapsed)}
        </span>
      </div>

      <h2 className="mt-6 font-serif text-3xl font-bold tracking-wide text-stone-900">
        {recipe.name}
      </h2>
      <p className="mt-1 text-sm text-stone-500">
        Recreate the recipe — ingredients, glass, garnish, ice and method.
      </p>

      <div className="mt-6 grid grid-cols-12 gap-2 px-1 text-xs font-semibold uppercase tracking-wide text-stone-400">
        <div className="col-span-6">Ingredient</div>
        <div className="col-span-2">Amount</div>
        <div className="col-span-3">Unit</div>
        <div className="col-span-1" />
      </div>

      <div className="mt-2 space-y-2">
        {rows.map((row, i) => (
          <IngredientRow
            key={i}
            row={row}
            index={i}
            ingredientNames={ingredientNames}
            units={units}
            onChange={updateRow}
            onRemove={removeRow}
          />
        ))}
      </div>

      <button
        type="button"
        onClick={addRow}
        className="mt-4 rounded-lg border border-dashed border-stone-300 px-4 py-2 text-sm font-medium text-stone-600 hover:border-amber-400 hover:text-amber-700"
      >
        + Add Ingredient
      </button>

      {/* ── Glass ── */}
      <div className="mt-6 border-t border-stone-100 pt-5">
        <p className="text-xs font-semibold uppercase tracking-wide text-stone-400">Glass</p>
        <div className="mt-2 flex flex-wrap gap-4">
          {glasses.map((g) => (
            <label key={g} className="flex cursor-pointer items-center gap-2 text-sm text-stone-700">
              <input
                type="checkbox"
                checked={selectedGlass.includes(g)}
                onChange={() => setSelectedGlass(toggleSet(selectedGlass, g))}
                className="accent-amber-600"
              />
              {g}
            </label>
          ))}
        </div>
      </div>

      {/* ── Garnish ── */}
      <div className="mt-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-stone-400">Garnish</p>
        <div className="mt-2 flex flex-wrap gap-4">
          {garnishes.map((g) => (
            <label key={g} className="flex cursor-pointer items-center gap-2 text-sm text-stone-700">
              <input
                type="checkbox"
                checked={selectedGarnish.includes(g)}
                onChange={() => setSelectedGarnish(toggleSet(selectedGarnish, g))}
                className="accent-amber-600"
              />
              {g}
            </label>
          ))}
        </div>
      </div>

      {/* ── Ice + Method ── */}
      <div className="mt-4 grid grid-cols-2 gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-stone-400">Ice</p>
          <select
            value={selectedIce}
            onChange={(e) => setSelectedIce(e.target.value)}
            className="mt-2 w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-sm text-stone-800 shadow-sm focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
          >
            <option value="">Select…</option>
            {iceOptions.map((o) => (
              <option key={o} value={o}>{o}</option>
            ))}
          </select>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-stone-400">Method</p>
          <select
            value={selectedMethod}
            onChange={(e) => setSelectedMethod(e.target.value)}
            className="mt-2 w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-sm text-stone-800 shadow-sm focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
          >
            <option value="">Select…</option>
            {methods.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-8 flex justify-end">
        <button
          type="button"
          onClick={submit}
          className="rounded-xl bg-amber-600 px-6 py-3 font-semibold text-white shadow-sm transition hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
        >
          {isLast ? "Finish" : "Next Cocktail →"}
        </button>
      </div>
    </div>
  );
}
