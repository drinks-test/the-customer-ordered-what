import { totals } from "../lib/grading.js";
import { formatTime } from "../lib/format.js";

function fmt(ing) {
  if (!ing) return "—";
  const amt = ing.amount == null ? "?" : ing.amount;
  return `${amt} ${ing.unit || ""}`.trim();
}

function RecipeCard({ recipe, grade }) {
  return (
    <div className="rounded-xl border border-stone-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <h3 className="font-serif text-xl font-bold text-stone-900">{recipe.name}</h3>
        <span
          className={`rounded-full px-3 py-1 text-sm font-semibold ${
            grade.score === 1
              ? "bg-green-100 text-green-700"
              : "bg-amber-100 text-amber-700"
          }`}
        >
          {grade.correctCount}/{grade.total} correct
        </span>
      </div>

      <table className="mt-4 w-full text-sm">
        <thead>
          <tr className="text-left text-xs uppercase tracking-wide text-stone-400">
            <th className="pb-2 font-semibold">Ingredient</th>
            <th className="pb-2 font-semibold">You entered</th>
            <th className="pb-2 font-semibold">Correct</th>
            <th className="pb-2 font-semibold text-right">Result</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-stone-100">
          {grade.results.map((r) => (
            <tr key={r.name}>
              <td className="py-2 pr-2 text-stone-800">{r.name}</td>
              <td className={`py-2 pr-2 ${r.correct ? "text-stone-600" : "text-red-600"}`}>
                {fmt(r.got)}
              </td>
              <td className="py-2 pr-2 text-stone-600">{fmt(r.expected)}</td>
              <td className="py-2 text-right">{r.correct ? "✅" : "❌"}</td>
            </tr>
          ))}
          {grade.extras.map((e, i) => (
            <tr key={`extra-${i}`} className="text-stone-400">
              <td className="py-2 pr-2 italic">{e.name}</td>
              <td className="py-2 pr-2">{fmt(e)}</td>
              <td className="py-2 pr-2 italic">not in recipe</td>
              <td className="py-2 text-right">➖</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// State 3: total time, overall score and per-cocktail side-by-side feedback.
export default function Results({ graded, totalTime, onRestart }) {
  const summary = totals(graded);
  const pct = summary.total === 0 ? 0 : Math.round((summary.correct / summary.total) * 100);

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-stone-200 bg-white p-8 text-center shadow-sm">
        <h1 className="font-serif text-3xl font-bold text-stone-900">Service complete</h1>
        <div className="mt-6 grid grid-cols-3 gap-4">
          <Stat label="Time" value={formatTime(totalTime)} />
          <Stat label="Score" value={`${pct}%`} />
          <Stat label="Perfect pours" value={`${summary.perfect}/${summary.recipes}`} />
        </div>
        <button
          type="button"
          onClick={onRestart}
          className="mt-8 rounded-xl bg-stone-900 px-6 py-3 font-semibold text-white shadow-sm transition hover:bg-stone-700"
        >
          Try again
        </button>
      </div>

      {graded.map((g) => (
        <RecipeCard key={g.recipe.id} recipe={g.recipe} grade={g.grade} />
      ))}
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div className="rounded-xl bg-stone-50 p-4">
      <div className="text-2xl font-bold text-amber-600">{value}</div>
      <div className="mt-1 text-xs uppercase tracking-wide text-stone-500">{label}</div>
    </div>
  );
}
