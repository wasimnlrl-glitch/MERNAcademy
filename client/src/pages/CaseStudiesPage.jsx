import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api.js";

export default function CaseStudiesPage() {
  const [modules, setModules] = useState([]);

  useEffect(() => {
    api.modules().then(setModules).catch(() => {});
  }, []);

  const studies = modules.filter((m) => m.caseStudy);

  return (
    <div className="page container">
      <header className="page-head">
        <h1>🧪 Case studies</h1>
        <p>
          Real-world walkthroughs that apply the module concepts to realistic
          engineering problems — requirements, architecture decisions and
          production lessons.
        </p>
      </header>

      <div className="index-grid">
        {studies.map((m) => (
          <Link
            key={m.id}
            to={`/modules/${m.id}/case-study`}
            className="index-card index-card--wide"
          >
            <div className="index-card__head">
              <span className="index-card__icon">🧪</span>
              <span className="index-card__tag">Module {m.order}</span>
            </div>
            <h3>{m.caseStudy.title}</h3>
            <p>{m.caseStudy.overview}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
