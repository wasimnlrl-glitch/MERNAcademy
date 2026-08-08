import m1 from "./modules/m1-foundations.js";
import m2 from "./modules/m2-node.js";
import m3 from "./modules/m3-express.js";
import m4 from "./modules/m4-mongodb.js";
import m5 from "./modules/m5-react.js";
import m6 from "./modules/m6-fullstack.js";

export const course = {
  id: "mern-academy",
  title: "MERN Academy",
  subtitle:
    "Master the MERN stack step by step — MongoDB, Express, React, Node.js — with practical examples, exercises and real-world case studies.",
  version: "1.0.0",
  stats: {
    modules: 6,
    lessons: null,
    exercises: null,
    caseStudies: null,
  },
  modules: [m1, m2, m3, m4, m5, m6],
};

const allLessons = course.modules.flatMap((m) =>
  m.lessons.map((l) => ({ ...l, moduleId: m.id, moduleTitle: m.title }))
);
const exercises = allLessons.filter((l) => l.type === "exercise");
const caseStudies = course.modules.filter((m) => m.caseStudy);

course.stats.lessons = allLessons.length;
course.stats.exercises = exercises.length;
course.stats.caseStudies = caseStudies.length;

export function getAllModules() {
  return course.modules.map((m) => ({
    id: m.id,
    order: m.order,
    title: m.title,
    subtitle: m.subtitle,
    icon: m.icon,
    tagline: m.tagline,
    lessonCount: m.lessons.length,
    lessons: m.lessons.map((l) => ({
      id: l.id,
      title: l.title,
      duration: l.duration,
      summary: l.summary,
      type: l.type ?? "lesson",
    })),
    caseStudy: m.caseStudy
      ? { title: m.caseStudy.title, overview: m.caseStudy.overview }
      : null,
  }));
}

export function getLesson(lessonId) {
  for (const m of course.modules) {
    for (const l of m.lessons) {
      if (l.id === lessonId) {
        return { ...l, moduleId: m.id, moduleTitle: m.title };
      }
    }
  }
  return null;
}

export function getCaseStudy(moduleId) {
  const m = course.modules.find((mod) => mod.id === moduleId);
  return m?.caseStudy ?? null;
}
