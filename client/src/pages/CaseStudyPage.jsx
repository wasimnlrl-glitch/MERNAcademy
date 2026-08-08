import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { api } from "../api.js";
import Markdown from "../components/Markdown.jsx";
import CodeBlock from "../components/CodeBlock.jsx";

export default function CaseStudyPage() {
  const { moduleId } = useParams();
  const [cs, setCs] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.caseStudy(moduleId)
      .then(setCs)
      .catch((e) => setError(e.message));
  }, [moduleId]);

  if (error) return <div className="page container"><p className="error">{error}</p></div>;
  if (!cs) return <div className="page container"><p className="muted">Loading case study…</p></div>;

  return (
    <div className="page container case-page">
      <nav className="breadcrumb">
        <Link to="/">Course</Link>
        <span>/</span>
        <Link to={`/modules/${moduleId}`}>Module {moduleId.slice(1)}</Link>
        <span>/</span>
        <span className="is-current">Case study</span>
      </nav>

      <header className="case-hero">
        <p className="lesson-hero__meta">🧪 Case study</p>
        <h1>{cs.title}</h1>
        <p className="case-hero__overview">{cs.overview}</p>
      </header>

      <section className="case-section">
        <h2>Requirements</h2>
        <ul className="check-list">
          {cs.requirements.map((r, i) => <li key={i}>{r}</li>)}
        </ul>
      </section>

      <section className="case-section">
        <h2>Building it step by step</h2>
        {cs.steps.map((step, i) => (
          <div className="case-step" key={i}>
            <h3><span className="case-step__num">{i + 1}</span> {step.title}</h3>
            {step.md && <Markdown>{step.md}</Markdown>}
            {step.bulletList && (
              <ul className="check-list">
                {step.bulletList.map((b, j) => <li key={j}>{b}</li>)}
              </ul>
            )}
            {step.code && (
              <CodeBlock lang={step.code.lang} title={step.code.title} code={step.code.code} />
            )}
            {step.table && (
              <div className="table-wrap">
                <table className="data-table">
                  <thead>
                    <tr>{step.table.headers.map((h, j) => <th key={j}>{h}</th>)}</tr>
                  </thead>
                  <tbody>
                    {step.table.rows.map((row, j) => (
                      <tr key={j}>{row.map((cell, k) => <td key={k}>{cell}</td>)}</tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ))}
      </section>

      <section className="case-section">
        <div className="callout callout--tip">
          <b className="callout__title">🎓 Key takeaways</b>
          <ul className="check-list">
            {cs.takeaways.map((t, i) => <li key={i}>{t}</li>)}
          </ul>
        </div>
      </section>

      <footer className="lesson-nav">
        <Link className="lesson-nav__btn" to={`/modules/${moduleId}`}>
          ← Back to module
        </Link>
      </footer>
    </div>
  );
}
