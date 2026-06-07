// State 1: welcome message and quiz settings.
export default function Landing({
  numQuestions,
  setNumQuestions,
  maxQuestions,
  onStart,
}) {
  return (
    <div className="rounded-2xl border border-stone-200 bg-white p-8 shadow-sm">
      <p className="text-sm font-semibold uppercase tracking-widest text-amber-600">
        The Bartender's Manual
      </p>
      <h1 className="mt-2 font-serif text-4xl font-bold text-stone-900">
        Do you know how to make these cocktails?
      </h1>
      <p className="mt-3 text-stone-600">
        Build each recipe from memory against the clock. Pick how many cocktails
        you want to be quizzed on, then pour.
      </p>

      <div className="mt-8 rounded-xl bg-stone-50 p-5">
        <label
          htmlFor="numQuestions"
          className="block text-sm font-medium text-stone-700"
        >
          Number of cocktails
        </label>
        <div className="mt-2 flex items-center gap-3">
          <input
            id="numQuestions"
            type="number"
            min="1"
            max={maxQuestions}
            value={numQuestions}
            onChange={(e) => setNumQuestions(Number(e.target.value))}
            className="w-24 rounded-md border border-stone-300 bg-white px-3 py-2 text-stone-800 shadow-sm focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
          />
          <span className="text-sm text-stone-500">of {maxQuestions} available</span>
        </div>
      </div>

      <button
        type="button"
        onClick={onStart}
        className="mt-8 w-full rounded-xl bg-amber-600 px-6 py-3 text-lg font-semibold text-white shadow-sm transition hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
      >
        Yes — Start Quiz
      </button>
    </div>
  );
}
