import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api.js";

export default function ExercisesPage() {
  const [modules, setModules] = useState([]);
  const [progress, setProgress] = useState([]);

  useEffect(() => {
    Promise.all([api.modules(), api.getProgress()])
      .then(([mods, prog]) => {
        setModules(mods);
        setProgress(prog.completedLessons || []);
      })
      .catch(() => {});
  }, []);

  const exercises = modules.flatMap((m) =>
    m.lessons.filter((l) => l.type === "exercise").map((l) => ({ ...l, module: m }))
  );

  return (
    <div className="page container">
      <header className="page-head">
        <h1>✍️ Exercises</h1>
        <p>
          Interactive quizzes and coding challenges for every module. Each one
          checks your answers against the server and explains the reasoning.
        </p>
      </header>

      <div className="index-grid">
        {exercises.map((ex) => {
          const done = progress.includes(ex.id);
          return (
            <Link
              key={ex.id}
              to={`/modules/${ex.module.id}/lessons/${ex.id}`}
              className="index-card"
            >
              <div className="index-card__head">
                <span className="index-card__icon">{done ? "✅" : "✍️"}</span>
                <span className="index-card__tag">
                  Module {ex.module.order} · {ex.duration}
                </span>
              </div>
              <h3>{ex.title}</h3>
              <p>{ex.summary}</p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
