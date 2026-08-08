import { NavLink, Route, Routes } from "react-router-dom";
import Home from "./pages/Home.jsx";
import ModulePage from "./pages/ModulePage.jsx";
import LessonPage from "./pages/LessonPage.jsx";
import CaseStudyPage from "./pages/CaseStudyPage.jsx";
import ExercisesPage from "./pages/ExercisesPage.jsx";
import CaseStudiesPage from "./pages/CaseStudiesPage.jsx";

function Header() {
  return (
    <header className="site-header">
      <div className="site-header__inner">
        <NavLink to="/" className="brand">
          <span className="brand__logo">🌱</span>
          <span className="brand__name">MERN Academy</span>
        </NavLink>
        <nav className="site-nav">
          <NavLink to="/" end className={({ isActive }) => isActive ? "site-nav__link is-active" : "site-nav__link"}>
            Course
          </NavLink>
          <NavLink to="/exercises" className={({ isActive }) => isActive ? "site-nav__link is-active" : "site-nav__link"}>
            Exercises
          </NavLink>
          <NavLink to="/case-studies" className={({ isActive }) => isActive ? "site-nav__link is-active" : "site-nav__link"}>
            Case Studies
          </NavLink>
        </nav>
      </div>
    </header>
  );
}

export default function App() {
  return (
    <div className="app">
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/modules/:moduleId" element={<ModulePage />} />
        <Route path="/modules/:moduleId/lessons/:lessonId" element={<LessonPage />} />
        <Route path="/modules/:moduleId/case-study" element={<CaseStudyPage />} />
        <Route path="/exercises" element={<ExercisesPage />} />
        <Route path="/case-studies" element={<CaseStudiesPage />} />
      </Routes>
    </div>
  );
}
