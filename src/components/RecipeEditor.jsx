import { useMemo, useState } from "react";
import { getEnums } from "../lib/schema.js";
import { blankRecipe, duplicateRecipe, findStaleValues } from "../lib/recipes.js";
import RecipeForm from "./RecipeForm.jsx";

// Hidden page (#recipe-editor): build recipes.json with selections constrained
// to schema.json. Not linked from the quiz UI — reachable only via the hash.
export default function RecipeEditor({ schema, recipes: initial }) {
  const enums = useMemo(() => getEnums(schema), [schema]);
  const [recipes, setRecipes] = useState(() => JSON.parse(JSON.stringify(initial)));
  const [index, setIndex] = useState(0);
  const [copied, setCopied] = useState(false);

  const current = recipes[index];
  const stale = current ? findStaleValues(current, enums) : [];
  const json = useMemo(() => JSON.stringify(recipes, null, 2), [recipes]);

  function updateCurrent(next) {
    setRecipes(recipes.map((r, i) => (i === index ? next : r)));
  }
  function addNew() {
    const next = [...recipes, blankRecipe(recipes)];
    setRecipes(next);
    setIndex(next.length - 1);
  }
  function duplicate() {
    if (!current) return;
    const next = [...recipes, duplicateRecipe(current, recipes)];
    setRecipes(next);
    setIndex(next.length - 1);
  }
  function remove() {
    if (!current) return;
    const next = recipes.filter((_, i) => i !== index);
    setRecipes(next);
    setIndex(Math.max(0, Math.min(index, next.length - 1)));
  }
  async function copy() {
    try {
      await navigator.clipboard.writeText(json);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  const btn =
    "rounded-lg border border-stone-300 px-3 py-2 text-sm font-medium text-stone-600 hover:border-amber-400 hover:text-amber-700";

  return (
    <div className="min-h-screen bg-stone-100 text-stone-900">
      <div className="mx-auto max-w-5xl px-4 py-10">
        <p className="text-sm font-semibold uppercase tracking-widest text-amber-600">
          Hidden · Recipe Builder
        </p>
        <h1 className="mt-2 font-serif text-4xl font-bold text-stone-900">
          Edit recipes.json
        </h1>
        <p className="mt-3 text-stone-600">
          All selections are constrained to the current schema.json. The output
          below updates live — copy it to share.
        </p>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm">
            <div className="flex flex-wrap gap-2">
              <button type="button" onClick={addNew} className={btn}>+ New</button>
              <button type="button" onClick={duplicate} className={btn}>Duplicate</button>
              <button
                type="button"
                onClick={remove}
                className="rounded-lg border border-stone-200 px-3 py-2 text-sm font-medium text-stone-500 hover:border-red-300 hover:text-red-600"
              >
                Delete
              </button>
            </div>
            <ul className="mt-4 space-y-1">
              {recipes.map((r, i) => (
                <li key={r.id ?? i}>
                  <button
                    type="button"
                    onClick={() => setIndex(i)}
                    className={`block w-full truncate rounded-md px-3 py-2 text-left text-sm ${
                      i === index ? "bg-amber-100 font-medium text-amber-800" : "text-stone-700 hover:bg-stone-50"
                    }`}
                  >
                    {r.name || r.id || "(untitled)"}
                  </button>
                </li>
              ))}
              {recipes.length === 0 && (
                <li className="px-3 py-2 text-sm italic text-stone-400">No recipes — add one.</li>
              )}
            </ul>
          </div>

          <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm md:col-span-2">
            {current ? (
              <>
                {stale.length > 0 && (
                  <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                    <p className="font-semibold">Values no longer in schema.json:</p>
                    <ul className="mt-1 list-disc pl-5">
                      {stale.map((s, i) => (
                        <li key={i}>
                          <span className="font-medium">{s.field}:</span> {s.value}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                <RecipeForm recipe={current} enums={enums} onChange={updateCurrent} />
              </>
            ) : (
              <p className="text-sm italic text-stone-400">Select or add a recipe to edit.</p>
            )}
          </div>
        </div>

        <div className="mt-8 rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between border-b border-stone-200 pb-4">
            <h2 className="font-serif text-xl font-bold text-stone-900">Live recipes.json</h2>
            <button
              type="button"
              onClick={copy}
              className="rounded-xl bg-amber-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
            >
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
          <pre className="mt-4 max-h-[28rem] overflow-auto rounded-xl bg-stone-900 p-4 font-mono text-xs leading-relaxed text-amber-100">
{json}
          </pre>
        </div>
      </div>
    </div>
  );
}
