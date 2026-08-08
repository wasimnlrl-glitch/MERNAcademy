import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api.js";

function ModuleCard({ mod, index, completedCount }) {
  const pct = Math.round((completedCount / mod.lessonCount) * 100);
  return (
    <Link to={`/modules/${mod.id}`} className="module-card">
      <div className="module-card__head">
        <span className="module-card__icon">{mod.icon}</span>
        <span className="module-card__num">Module {index + 1}</span>
      </div>
      <h3 className="module-card__title">{mod.title}</h3>
      <p className="module-card__tag">{mod.tagline}</p>
      <p className="module-card__sub">{mod.subtitle}</p>
      <div className="module-card__meta">
        <span>{mod.lessonCount} lessons</span>
        <span className="module-card__bar">
          <i style={{ width: `${pct}%` }} />
        </span>
        <span>{completedCount}/{mod.lessonCount}</span>
      </div>
    </Link>
  );
}

export default function Home() {
  const [modules, setModules] = useState([]);
  const [progress, setProgress] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    Promise.all([api.modules(), api.getProgress()])
      .then(([mods, prog]) => {
        setModules(mods);
        setProgress(prog.completedLessons || []);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const totalLessons = modules.reduce((n, m) => n + m.lessonCount, 0);
  const overallPct = totalLessons
    ? Math.round((progress.length / totalLessons) * 100)
    : 0;

  return (
    <div className="page home">
      <section className="hero">
        <div className="hero__inner">
          <p className="hero__kicker">Learn full-stack JavaScript</p>
          <h1 className="hero__title">
            Master the <span className="accent">MERN</span> stack, step by step
          </h1>
          <p className="hero__lead">
            MongoDB · Express · React · Node.js — one language, four technologies.
            Work through practical examples, interactive exercises and real-world
            case studies that end in a full-stack capstone project.
          </p>
          <div className="hero__stats">
            <span><b>{modules.length}</b> modules</span>
            <span><b>{totalLessons}</b> lessons</span>
            <span><b>+20</b> exercises</span>
            <span><b>{modules.filter((m) => m.caseStudy).length}</b> case studies</span>
          </div>
          {progress.length > 0 && (
            <div className="overall-progress">
              <div className="overall-progress__label">
                <span>Your progress</span><span>{overallPct}%</span>
              </div>
              <div className="overall-progress__track">
                <i style={{ width: `${overallPct}%` }} />
              </div>
            </div>
          )}
          <a href="#roadmap" className="btn btn--primary">Start learning</a>
        </div>
      </section>

      <section id="roadmap" className="container">
        <div className="section-head">
          <h2>The curriculum</h2>
          <p>Six modules take you from zero to a full-stack MERN developer.</p>
        </div>

        {loading && <p className="muted">Loading course…</p>}
        {error && <p className="error">Could not load the course: {error}</p>}

        <div className="module-grid">
          {modules.map((m, i) => (
            <ModuleCard
              key={m.id}
              mod={m}
              index={i}
              completedCount={progress.filter((id) =>
                m.lessons.some((l) => l.id === id)
              ).length}
            />
          ))}
        </div>
      </section>

      <section className="container">
        <div className="feature-strip">
          <div className="feature">
            <span className="feature__icon">📖</span>
            <h4>Step-by-step lessons</h4>
            <p>Concise theory followed by runnable code in real project structure.</p>
          </div>
          <div className="feature">
            <span className="feature__icon">✍️</span>
            <h4>Interactive exercises</h4>
            <p>Quizzes and coding challenges check your understanding as you go.</p>
          </div>
          <div className="feature">
            <span className="feature__icon">🧪</span>
            <h4>Case studies</h4>
            <p>Real architecture decisions: APIs, data models, scaling and deployment.</p>
          </div>
          <div className="feature">
            <span className="feature__icon">🏁</span>
            <h4>Capstone project</h4>
            <p>Combine every skill to ship a complete full-stack Task Manager.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
