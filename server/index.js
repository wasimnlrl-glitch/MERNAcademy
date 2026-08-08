import express from "express";
import cors from "cors";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { MiniMongo } from "./src/mini-mongo.js";
import { course, getAllModules, getLesson, getCaseStudy } from "./data/course.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

// ---------------------------------------------------------------------------
// The "database" — a MongoDB-style in-memory store.
// In a production MERN app this is MongoDB Atlas, connected via the driver
// or Mongoose. See data/modules/m4-mongodb.js for the full lesson.
// ---------------------------------------------------------------------------
const db = new MiniMongo();
const progress = db.collection("progress");
const quizAttempts = db.collection("quizAttempts");

app.use(cors());
app.use(express.json());

// Simple request logger (see lesson m3-l3 on middleware)
app.use((req, _res, next) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.url}`);
  next();
});

// ---------------------------------------------------------------------------
// Course API
// ---------------------------------------------------------------------------
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", service: "mern-academy-api" });
});

app.get("/api/course", (_req, res) => {
  res.json(course);
});

app.get("/api/modules", (_req, res) => {
  res.json(getAllModules());
});

app.get("/api/lessons/:lessonId", (req, res) => {
  const lesson = getLesson(req.params.lessonId);
  if (!lesson) return res.status(404).json({ message: "Lesson not found" });
  res.json(lesson);
});

app.get("/api/case-studies/:moduleId", (req, res) => {
  const cs = getCaseStudy(req.params.moduleId);
  if (!cs) return res.status(404).json({ message: "Case study not found" });
  res.json(cs);
});

// ---------------------------------------------------------------------------
// Quiz checking
// ---------------------------------------------------------------------------
app.post("/api/exercises/:lessonId/check", async (req, res) => {
  const lesson = getLesson(req.params.lessonId);
  if (!lesson?.exercise) {
    return res.status(404).json({ message: "Exercise not found" });
  }
  const { answers = {} } = req.body ?? {};

  const results = lesson.exercise.questions.map((q) => {
    const chosen = answers[q.id];
    const correct = chosen === q.answerIndex;
    return { id: q.id, correct, correctIndex: q.answerIndex };
  });

  const score = results.filter((r) => r.correct).length;
  await quizAttempts.insertOne({
    lessonId: req.params.lessonId,
    answers,
    score,
    total: results.length,
    at: new Date().toISOString(),
  });

  res.json({ score, total: results.length, results });
});

// ---------------------------------------------------------------------------
// Progress tracking (persisted in the in-memory store for the session)
// ---------------------------------------------------------------------------
app.get("/api/progress", async (_req, res) => {
  const all = await progress.find({});
  res.json({
    completedLessons: all.filter((p) => p.status === "completed").map((p) => p.lessonId),
    marks: all,
  });
});

app.post("/api/progress", async (req, res) => {
  const { lessonId, status } = req.body ?? {};
  if (!lessonId || !["completed", "in-progress"].includes(status)) {
    return res.status(400).json({ message: "lessonId and a valid status are required" });
  }
  await progress.updateOne(
    { lessonId },
    { $set: { lessonId, status, updatedAt: new Date().toISOString() } },
    { upsert: true }
  );
  res.json({ ok: true, lessonId, status });
});

// ---------------------------------------------------------------------------
// Production: serve the built React client
// ---------------------------------------------------------------------------
const clientDist = path.join(__dirname, "../client/dist");
app.use(express.static(clientDist));
app.get(/^(?!\/api).*/, (req, res) => {
  res.sendFile(path.join(clientDist, "index.html"));
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`MERN Academy API running on http://localhost:${PORT}`);
  console.log(`Course: "${course.title}" — ${course.stats.lessons} lessons, ${course.stats.exercises} exercises, ${course.stats.caseStudies} case studies`);
});
