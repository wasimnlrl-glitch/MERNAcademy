import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { api } from "../api.js";

const typeIcon = { exercise: "✍️", lesson: "📖" };

export default function ModulePage() {
  const { moduleId } = useParams();
  const [modules, setModules] = useState([]);
  const [mod, setMod] = useState(null);
  const [progress, setProgress] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    Promise.all([api.modules(), api.getProgress()])
      .then(([mods, prog]) => {
        const found = mods.find((m) => m.id === moduleId);
        setModules(mods);
        setMod(found);
        setProgress(prog.completedLessons || []);
        if (!found) setError("Module not found.");
      })
      .catch((e) => setError(e.message));
  }, [moduleId]);

  if (error) return <div className="page container"><p className="error">{error}</p></div>;
  if (!mod) return <div className="page container"><p className="muted">Loading module…</p></div>;

  const completedHere = mod.lessons.filter((l) => progress.includes(l.id)).length;
  const pct = Math.round((completedHere / mod.lessonCount) * 100);

  return (
    <div className="page module-page container">
      <div className="module-layout">
        <aside className="side-nav">
          <p className="side-nav__label">Course</p>
          {modules.map((m, i) => (
            <Link
              key={m.id}
              to={`/modules/${m.id}`}
              className={m.id === mod.id ? "side-nav__item is-active" : "side-nav__item"}
            >
              <span className="side-nav__icon">{m.icon}</span>
              <span>
                <b>{i + 1}. {m.title}</b>
                <small>{m.lessonCount} lessons</small>
              </span>
            </Link>
          ))}
        </aside>

        <main className="module-main">
          <div className="module-hero">
            <div className="module-hero__head">
              <span className="module-hero__icon">{mod.icon}</span>
              <span className="module-hero__num">Module {mod.order}</span>
            </div>
            <h1>{mod.title}</h1>
            <p className="module-hero__tag">{mod.tagline}</p>
            <p className="module-hero__sub">{mod.subtitle}</p>

            <div className="module-progress">
              <div className="module-progress__label">
                <span>Progress</span><span>{completedHere}/{mod.lessonCount} lessons · {pct}%</span>
              </div>
              <div className="module-progress__track">
                <i style={{ width: `${pct}%` }} />
              </div>
            </div>
          </div>

          <ul className="lesson-list">
            {mod.lessons.map((l) => {
              const done = progress.includes(l.id);
              return (
                <li key={l.id}>
                  <Link to={`/modules/${mod.id}/lessons/${l.id}`} className="lesson-item">
                    <span className={`lesson-item__check${done ? " is-done" : ""}`}>
                      {done ? "✓" : typeIcon[l.type] || "📖"}
                    </span>
                    <span className="lesson-item__body">
                      <span className="lesson-item__title">{l.title}</span>
                      <span className="lesson-item__summary">{l.summary}</span>
                    </span>
                    <span className="lesson-item__duration">{l.duration}</span>
                    <span className="lesson-item__arrow">→</span>
                  </Link>
                </li>
              );
            })}
          </ul>

          {mod.caseStudy && (
            <Link to={`/modules/${mod.id}/case-study`} className="case-link">
              <span className="case-link__icon">🧪</span>
              <span>
                <b>Module case study — {mod.caseStudy.title}</b>
                <small>{mod.caseStudy.overview}</small>
              </span>
              <span className="case-link__arrow">→</span>
            </Link>
          )}

          <div className="module-nav">
            <span />
            {mod.lessons.length > 0 && (
              <Link
                className="btn btn--primary"
                to={`/modules/${mod.id}/lessons/${mod.lessons[0].id}`}
              >
                Start module →
              </Link>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
