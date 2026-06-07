import { useEffect, useMemo, useState } from "react";
import schemaData from "../schema.json";
import recipesData from "../recipes.json";
import { getIngredientNames, getUnits, getGlasses, getMethods, getGarnishes, getIce } from "./lib/schema.js";
import { gradeQuiz } from "./lib/grading.js";
import Landing from "./components/Landing.jsx";
import Quiz from "./components/Quiz.jsx";
import Results from "./components/Results.jsx";

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function App() {
  const ingredientNames = useMemo(() => getIngredientNames(schemaData), []);
  const units = useMemo(() => getUnits(schemaData), []);
  const glasses = useMemo(() => getGlasses(schemaData), []);
  const garnishes = useMemo(() => getGarnishes(schemaData), []);
  const iceOptions = useMemo(() => getIce(schemaData), []);
  const methods = useMemo(() => getMethods(schemaData), []);
  const maxQuestions = recipesData.length;

  const [phase, setPhase] = useState("landing");
  const [numQuestions, setNumQuestions] = useState(Math.min(2, maxQuestions));
  const [quizRecipes, setQuizRecipes] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [elapsed, setElapsed] = useState(0);
  const [graded, setGraded] = useState([]);

  useEffect(() => {
    if (phase !== "quiz" || startTime == null) return;
    const id = setInterval(() => {
      setElapsed(Math.floor((Date.now() - startTime) / 1000));
    }, 250);
    return () => clearInterval(id);
  }, [phase, startTime]);

  function startQuiz() {
    const n = Math.max(1, Math.min(numQuestions || 1, maxQuestions));
    setQuizRecipes(shuffle(recipesData).slice(0, n));
    setSubmissions([]);
    setCurrent(0);
    setStartTime(Date.now());
    setElapsed(0);
    setPhase("quiz");
  }

  function handleSubmit(rows) {
    const next = [...submissions];
    next[current] = rows;
    setSubmissions(next);
    if (current < quizRecipes.length - 1) {
      setCurrent(current + 1);
    } else {
      setElapsed(Math.floor((Date.now() - startTime) / 1000));
      setGraded(gradeQuiz(next, quizRecipes));
      setPhase("results");
    }
  }

  return (
    <div className="min-h-screen bg-stone-100 text-stone-900">
      <div className="mx-auto max-w-3xl px-4 py-10">
        {phase === "landing" && (
          <Landing
            numQuestions={numQuestions}
            setNumQuestions={setNumQuestions}
            maxQuestions={maxQuestions}
            onStart={startQuiz}
          />
        )}

        {phase === "quiz" && quizRecipes[current] && (
          <Quiz
            key={quizRecipes[current].id}
            recipe={quizRecipes[current]}
            index={current}
            total={quizRecipes.length}
            elapsed={elapsed}
            ingredientNames={ingredientNames}
            units={units}
            glasses={glasses}
            garnishes={garnishes}
            iceOptions={iceOptions}
            methods={methods}
            onSubmit={handleSubmit}
          />
        )}

        {phase === "results" && (
          <Results
            graded={graded}
            totalTime={elapsed}
            onRestart={() => setPhase("landing")}
          />
        )}
      </div>
    </div>
  );
}
