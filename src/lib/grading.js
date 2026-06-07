// Pure grading logic: compare a user's submitted ingredient rows against the
// actual recipe ingredients. Import-free so both the React app and node:test
// can use it.

function norm(value) {
  return typeof value === "string" ? value.trim().toLowerCase() : value;
}

// Grade an unordered set of strings (e.g. glass choices, garnish choices).
function gradeSet(got = [], expected = []) {
  const gotNorm = got.map(norm).sort();
  const expNorm = expected.map(norm).sort();
  const correct =
    gotNorm.length === expNorm.length && gotNorm.every((v, i) => v === expNorm[i]);
  return { got, expected, correct };
}

// Grade a single recipe submission.
// Accepts either:
//   - legacy array args: gradeRecipe(userIngredientArray, actualIngredientArray)
//   - full submission:   gradeRecipe({ ingredients, glass, garnish, ice, method }, recipe)
export function gradeRecipe(userSubmission = {}, recipe = {}) {
  const userIngredients = Array.isArray(userSubmission)
    ? userSubmission
    : userSubmission.ingredients ?? [];
  const actualIngredients = Array.isArray(recipe) ? recipe : recipe.ingredients ?? [];

  const used = new Array(userIngredients.length).fill(false);
  const results = actualIngredients.map((expected) => {
    const idx = userIngredients.findIndex(
      (u, i) => !used[i] && norm(u.name) === norm(expected.name)
    );
    const got = idx === -1 ? null : userIngredients[idx];
    if (idx !== -1) used[idx] = true;

    const amountOk = got != null && Number(got.amount) === Number(expected.amount);
    const unitOk = got != null && norm(got.unit) === norm(expected.unit);
    const correct = Boolean(got) && amountOk && unitOk;

    return { name: expected.name, expected, got, amountOk, unitOk, correct };
  });

  const extras = userIngredients.filter((_, i) => !used[i]);
  const ingCorrect = results.filter((r) => r.correct).length;
  const ingTotal = actualIngredients.length;

  // Legacy array-only call: return ingredient grading only.
  if (Array.isArray(userSubmission) || Array.isArray(recipe)) {
    return {
      results,
      extras,
      correctCount: ingCorrect,
      total: ingTotal,
      score: ingTotal === 0 ? 0 : ingCorrect / ingTotal,
    };
  }

  // Full submission: also grade glass, garnish, ice, method.
  const glassResult = gradeSet(userSubmission.glass ?? [], recipe.glass ?? []);
  const garnishResult = gradeSet(userSubmission.garnish ?? [], recipe.garnish ?? []);
  const iceResult = {
    got: userSubmission.ice ?? "",
    expected: recipe.ice ?? "",
    correct: norm(userSubmission.ice ?? "") === norm(recipe.ice ?? ""),
  };
  const methodResult = {
    got: userSubmission.method ?? "",
    expected: recipe.method ?? "",
    correct: norm(userSubmission.method ?? "") === norm(recipe.method ?? ""),
  };

  const fieldCorrect = [glassResult, garnishResult, iceResult, methodResult].filter(
    (f) => f.correct
  ).length;
  const correctCount = ingCorrect + fieldCorrect;
  const total = ingTotal + 4;

  return {
    results,
    extras,
    glassResult,
    garnishResult,
    iceResult,
    methodResult,
    correctCount,
    total,
    score: total === 0 ? 0 : correctCount / total,
  };
}

// Grade every submission against the matching recipe (same index/order).
export function gradeQuiz(submissions = [], recipes = []) {
  return recipes.map((recipe, i) => ({
    recipe,
    submission: submissions[i] ?? {},
    grade: gradeRecipe(submissions[i] ?? {}, recipe ?? {}),
  }));
}

// Aggregate score across an array of graded results from gradeQuiz().
export function totals(graded = []) {
  const correct = graded.reduce((s, g) => s + g.grade.correctCount, 0);
  const total = graded.reduce((s, g) => s + g.grade.total, 0);
  const perfect = graded.filter((g) => g.grade.score === 1).length;
  return { correct, total, perfect, recipes: graded.length };
}
