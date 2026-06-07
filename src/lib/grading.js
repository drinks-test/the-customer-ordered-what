// Pure grading logic: compare a user's submitted ingredient rows against the
// actual recipe ingredients. Import-free so both the React app and node:test
// can use it.

function norm(value) {
  return typeof value === "string" ? value.trim().toLowerCase() : value;
}

// Grade a single recipe submission against its correct ingredient list.
export function gradeRecipe(userIngredients = [], actualIngredients = []) {
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
  const correctCount = results.filter((r) => r.correct).length;
  const total = actualIngredients.length;

  return {
    results,
    extras,
    correctCount,
    total,
    score: total === 0 ? 0 : correctCount / total,
  };
}

// Grade every submission against the matching recipe (same index/order).
export function gradeQuiz(submissions = [], recipes = []) {
  return recipes.map((recipe, i) => ({
    recipe,
    submission: submissions[i] ?? [],
    grade: gradeRecipe(submissions[i] ?? [], recipe?.ingredients ?? []),
  }));
}

// Aggregate score across an array of graded results from gradeQuiz().
export function totals(graded = []) {
  const correct = graded.reduce((s, g) => s + g.grade.correctCount, 0);
  const total = graded.reduce((s, g) => s + g.grade.total, 0);
  const perfect = graded.filter((g) => g.grade.score === 1).length;
  return { correct, total, perfect, recipes: graded.length };
}
