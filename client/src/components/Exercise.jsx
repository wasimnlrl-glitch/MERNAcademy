import { useState } from "react";
import { api } from "../api.js";
import CodeBlock from "./CodeBlock.jsx";
import Markdown from "./Markdown.jsx";

function Question({ q, index, selected, onSelect }) {
  return (
    <div className={`quiz-q${selected !== undefined ? " is-answered" : ""}`}>
      <p className="quiz-q__prompt">
        <span className="quiz-q__num">{index + 1}.</span> {q.prompt}
      </p>
      <div className="quiz-q__options">
        {q.options.map((opt, i) => {
          let cls = "quiz-opt";
          if (selected !== undefined) {
            if (i === q.answerIndex) cls += " is-correct";
            else if (i === selected) cls += " is-wrong";
            else cls += " is-muted";
          }
          return (
            <button
              key={i}
              type="button"
              className={cls}
              disabled={selected !== undefined}
              onClick={() => onSelect(q.id, i)}
            >
              <span className="quiz-opt__letter">{String.fromCharCode(65 + i)}</span>
              <span>{opt}</span>
              {selected !== undefined && i === q.answerIndex && <span className="quiz-opt__mark">✓</span>}
            </button>
          );
        })}
      </div>
      {selected !== undefined && (
        <p className="quiz-q__explain">
          {selected === q.answerIndex ? "✅ Correct — " : "💡 Not quite — "}
          {q.explanation}
        </p>
      )}
    </div>
  );
}

function Challenge({ challenge }) {
  const [showSolution, setShowSolution] = useState(false);
  if (!challenge) return null;
  return (
    <div className="challenge">
      <h3 className="challenge__head">🚀 Coding challenge</h3>
      <p>{challenge.prompt}</p>
      {challenge.starterCode && (
        <CodeBlock lang="js" title="starter.js" code={challenge.starterCode} />
      )}
      <button
        className="btn btn--ghost"
        type="button"
        onClick={() => setShowSolution((s) => !s)}
      >
        {showSolution ? "Hide solution" : "Reveal solution"}
      </button>
      {showSolution && (
        <div className="challenge__solution">
          <CodeBlock lang="js" title="solution.js" code={challenge.solution} />
          <div className="callout callout--tip">
            <b>Why it works:</b> {challenge.explanation}
          </div>
        </div>
      )}
    </div>
  );
}

export default function Exercise({ exercise, lessonId }) {
  const [selected, setSelected] = useState({});
  const [score, setScore] = useState(null);
  const [checking, setChecking] = useState(false);

  const answeredCount = Object.keys(selected).length;
  const total = exercise.questions.length;

  async function submit() {
    setChecking(true);
    try {
      const result = await api.checkExercise(lessonId, selected);
      setScore(result);
    } catch {
      setScore({ error: "Could not submit. Check that the API is running." });
    } finally {
      setChecking(false);
    }
  }

  function reset() {
    setSelected({});
    setScore(null);
  }

  return (
    <div className="exercise">
      <div className="callout callout--exercise">
        <Markdown>{exercise.intro}</Markdown>
      </div>

      <div className="quiz">
        {exercise.questions.map((q, i) => (
          <Question
            key={q.id}
            q={q}
            index={i}
            selected={selected[q.id]}
            onSelect={(id, idx) => setSelected((s) => ({ ...s, [id]: idx }))}
          />
        ))}
      </div>

      <div className="exercise__actions">
        {score && score.error ? (
          <p className="error">{score.error}</p>
        ) : score ? (
          <div className={`score-card${score.score === score.total ? " is-perfect" : ""}`}>
            <p className="score-card__num">{score.score} / {score.total}</p>
            <p className="score-card__msg">
              {score.score === score.total
                ? "Perfect score! You nailed this module."
                : score.score >= total / 2
                ? "Good work! Review the explanations above and try again to max out."
                : "Review the module lessons, then retake this quiz."}
            </p>
            <button className="btn btn--ghost" type="button" onClick={reset}>
              Try again
            </button>
          </div>
        ) : (
          <button
            className="btn btn--primary"
            type="button"
            disabled={answeredCount < total || checking}
            onClick={submit}
          >
            {checking
              ? "Checking…"
              : answeredCount < total
              ? `Answer ${total - answeredCount} more`
              : "Check answers"}
          </button>
        )}
      </div>

      <Challenge challenge={exercise.challenge} />
    </div>
  );
}
