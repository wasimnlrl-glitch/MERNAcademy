import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { marked } from "marked";
import { api } from "../api.js";
import Markdown from "../components/Markdown.jsx";
import CodeBlock from "../components/CodeBlock.jsx";
import Exercise from "../components/Exercise.jsx";

function renderInline(md) {
  return marked.parseInline(md || "", { async: false });
}

function calloutClass(type) {
  switch (type) {
    case "tip": return "callout--tip";
    case "warn": return "callout--warn";
    case "exercise-note": return "callout--exercise";
    default: return "callout--tip";
  }
}

function calloutTitle(type) {
  switch (type) {
    case "tip": return "💡 Pro tip";
    case "warn": return "⚠️ Watch out";
    case "exercise-note": return "🧭 Checkpoint";
    default: return "Note";
  }
}

function Section({ section }) {
  switch (section.type) {
    case "code":
      return <CodeBlock lang={section.lang} title={section.title} code={section.code} />;
    case "table":
      return (
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>{section.headers.map((h, i) => <th key={i} dangerouslySetInnerHTML={{ __html: renderInline(h) }} />)}</tr>
            </thead>
            <tbody>
              {section.rows.map((row, i) => (
                <tr key={i}>{row.map((cell, j) => <td key={j} dangerouslySetInnerHTML={{ __html: renderInline(cell) }} />)}</tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    case "tip":
    case "warn":
    case "exercise-note":
      return (
        <div className={`callout ${calloutClass(section.type)}`}>
          <b className="callout__title">{calloutTitle(section.type)}</b>
          <Markdown>{section.md}</Markdown>
        </div>
      );
    case "p":
    default:
      return <Markdown>{section.md || section.content}</Markdown>;
  }
}

export default function LessonPage() {
  const { moduleId, lessonId } = useParams();
  const [modules, setModules] = useState([]);
  const [lesson, setLesson] = useState(null);
  const [progress, setProgress] = useState([]);
  const [error, setError] = useState(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    Promise.all([api.modules(), api.lesson(lessonId), api.getProgress()])
      .then(([mods, l, prog]) => {
        setModules(mods);
        setLesson(l);
        setProgress(prog.completedLessons || []);
        setDone((prog.completedLessons || []).includes(lessonId));
      })
      .catch((e) => setError(e.message));
    setDone(false);
  }, [lessonId]);

  const nav = useMemo(() => {
    if (!lesson || modules.length === 0) return null;
    const all = modules.flatMap((m) =>
      m.lessons.map((l) => ({ ...l, moduleId: m.id }))
    );
    const idx = all.findIndex((l) => l.id === lesson.id);
    return {
      prev: idx > 0 ? all[idx - 1] : null,
      next: idx < all.length - 1 ? all[idx + 1] : null,
    };
  }, [lesson, modules]);

  async function toggleDone() {
    const next = !done;
    await api.setProgress(lessonId, next ? "completed" : "in-progress");
    setDone(next);
    setProgress((p) =>
      next ? (p.includes(lessonId) ? p : [...p, lessonId]) : p.filter((id) => id !== lessonId)
    );
  }

  if (error) return <div className="page container"><p className="error">{error}</p></div>;
  if (!lesson) return <div className="page container"><p className="muted">Loading lesson…</p></div>;

  const modIndex = modules.findIndex((m) => m.id === moduleId);
  const isExercise = lesson.type === "exercise";

  return (
    <div className="page lesson-page container">
      <div className="lesson-layout">
        <aside className="side-nav side-nav--lesson">
          <p className="side-nav__label">Lessons</p>
          {modules.map((m, mi) => (
            <div key={m.id} className="side-nav__group">
              <Link to={`/modules/${m.id}`} className="side-nav__group-title">
                {mi + 1}. {m.title}
              </Link>
              {m.lessons.map((l) => (
                <Link
                  key={l.id}
                  to={`/modules/${m.id}/lessons/${l.id}`}
                  className={
                    l.id === lesson.id
                      ? "side-nav__lesson is-active"
                      : "side-nav__lesson"
                  }
                >
                  <span className={`side-nav__dot${progress.includes(l.id) ? " is-done" : ""}`}>
                    {progress.includes(l.id) ? "✓" : ""}
                  </span>
                  <span>{l.title}</span>
                </Link>
              ))}
            </div>
          ))}
        </aside>

        <main className="lesson-main">
          <nav className="breadcrumb">
            <Link to="/">Course</Link>
            <span>/</span>
            <Link to={`/modules/${moduleId}`}>
              Module {modIndex + 1}: {lesson.moduleTitle}
            </Link>
            <span>/</span>
            <span className="is-current">{lesson.title}</span>
          </nav>

          <header className="lesson-hero">
            <p className="lesson-hero__meta">
              {isExercise ? "✍️ Exercise" : "📖 Lesson"} · {lesson.duration}
            </p>
            <h1>{lesson.title}</h1>
            <p className="lesson-hero__summary">{lesson.summary}</p>
            <button
              className={`btn ${done ? "btn--success" : "btn--ghost"}`}
              type="button"
              onClick={toggleDone}
            >
              {done ? "✓ Completed" : "Mark as complete"}
            </button>
          </header>

          {isExercise ? (
            <Exercise exercise={{ ...lesson.exercise, lessonId }} lessonId={lessonId} />
          ) : (
            <div className="lesson-body">
              {lesson.sections.map((s, i) => (
                <Section key={i} section={s} />
              ))}
            </div>
          )}

          <footer className="lesson-nav">
            {nav?.prev ? (
              <Link
                className="lesson-nav__btn"
                to={`/modules/${nav.prev.moduleId}/lessons/${nav.prev.id}`}
              >
                ← {nav.prev.title}
              </Link>
            ) : <span />}
            {nav?.next ? (
              <Link
                className="lesson-nav__btn lesson-nav__btn--next"
                to={`/modules/${nav.next.moduleId}/lessons/${nav.next.id}`}
              >
                {nav.next.title} →
              </Link>
            ) : <span />}
          </footer>
        </main>
      </div>
    </div>
  );
}
