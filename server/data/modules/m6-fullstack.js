export default {
  id: "m6",
  order: 6,
  title: "Connecting the Full Stack",
  subtitle: "Wire React to Express to MongoDB into one complete app.",
  icon: "🔗",
  tagline: "The full picture, end to end",
  lessons: [
    {
      id: "m6-l1",
      title: "Fetching Data: The Frontend-to-Backend Bridge",
      duration: "14 min",
      summary:
        "How React talks to your Express API, including the dev proxy.",
      sections: [
        {
          type: "p",
          md: "Your React app talks to Express using the browser's `fetch` API. The big decision is **where the API lives** during development — different ports cause CORS, so the standard solution is a **Vite proxy**.",
        },
        {
          type: "code",
          lang: "js",
          title: "Vite proxy — /api → backend",
          code: `// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:3001",
        changeOrigin: true,
      },
    },
  },
});`,
        },
        {
          type: "p",
          md: "Now your frontend can call relative URLs like `fetch('/api/tasks')`. The dev server forwards them to Express, no CORS needed. In production the backend serves the built React app on the same origin.",
        },
        {
          type: "code",
          lang: "jsx",
          title: "A complete data flow in React",
          code: `function TaskManager() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    fetch("/api/tasks")
      .then(r => r.json())
      .then(setTasks);
  }, []);

  async function toggle(task) {
    const res = await fetch(\`/api/tasks/\${task._id}\`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ done: !task.done }),
    });
    if (res.ok) {
      setTasks(prev =>
        prev.map(t => t._id === task._id ? { ...t, done: !task.done } : t)
      );
    }
  }

  return (
    <ul>
      {tasks.map(t => (
        <li key={t._id}>
          <label>
            <input type="checkbox" checked={t.done}
                   onChange={() => toggle(t)} />
            {t.title}
          </label>
        </li>
      ))}
    </ul>
  );
}`,
        },
        {
          type: "tip",
          md: "After a mutation, update local state with the server's response (or a re-fetch). Keeping the UI in sync with the API is the core of full-stack work.",
        },
      ],
    },
    {
      id: "m6-l2",
      title: "Environment Variables & Configuration",
      duration: "10 min",
      summary:
        "Keep secrets out of code and configure the app per environment.",
      sections: [
        {
          type: "p",
          md: "Database URIs, API keys and ports are **environment-specific**. Store them in a `.env` file, load them with `dotenv`, and reference them via `process.env`. Never commit real secrets.",
        },
        {
          type: "code",
          lang: "js",
          title: "Server .env",
          code: `# server/.env
PORT=3001
MONGO_URI=mongodb+srv://user:password@cluster.mongodb.net/taskmanager
JWT_SECRET=change-me-in-production`,
        },
        {
          type: "code",
          lang: "js",
          title: "Loading .env in Node",
          code: `import "dotenv/config";

const PORT = process.env.PORT || 3001;
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error("MONGO_URI is missing. Copy .env.example to .env");
  process.exit(1);
}`,
        },
        {
          type: "code",
          lang: "jsx",
          title: "Exposing values to the browser (Vite)",
          code: `// Client env vars must be prefixed with VITE_
// client/.env
VITE_API_URL=/api

// Usage in React
const api = import.meta.env.VITE_API_URL || "/api";
fetch(\`\${api}/tasks\`)`,
        },
        {
          type: "warn",
          md: "Anything in the browser bundle is **visible to users**. Never put database passwords or JWT secrets in `VITE_` variables — only non-secret config belongs on the client.",
        },
      ],
    },
    {
      id: "m6-l3",
      title: "Deployment Basics",
      duration: "12 min",
      summary: "Ship your MERN app: frontend, backend and database.",
      sections: [
        {
          type: "table",
          headers: ["Piece", "Where it runs", "Common hosts"],
          rows: [
            ["React frontend (static build)", "CDN / static host", "Vercel, Netlify, S3 + CloudFront"],
            ["Express API", "Node server", "Render, Railway, Fly.io, EC2"],
            ["MongoDB", "Managed cloud DB", "MongoDB Atlas"],
          ],
        },
        {
          type: "p",
          md: "Two deployment shapes: **(1) separate services** — frontend on a static host, API on a Node host, CORS configured; **(2) single server** — Express serves the built React files itself.",
        },
        {
          type: "code",
          lang: "js",
          title: "Single-server deploy: Express serves React",
          code: `import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// In production, serve the built client
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../client/dist")));

  // Everything that isn't /api → the SPA (React Router handles the rest)
  app.get(/^(?!\\/api).*/, (req, res) => {
    res.sendFile(path.join(__dirname, "../client/dist/index.html"));
  });
}`,
        },
        {
          type: "tip",
          md: "Always set `NODE_ENV=production` on the server. Express enables caching and disables verbose stack traces, and many libraries switch to their production behavior.",
        },
      ],
    },
    {
      id: "m6-l4",
      title: "Capstone: Full-Stack Task Manager",
      duration: "25 min",
      type: "exercise",
      summary:
        "Build the complete app — this is where everything comes together.",
      exercise: {
        intro:
          "This capstone combines every module. Build the full Task Manager: Express API + React UI, wired through the proxy. A checklist is below — work through it, then run the self-check.",
        questions: [
          {
            id: "m6-q1",
            prompt: "Which step correctly turns a completed feature into a commit?",
            options: [
              "git add . && git commit && git push",
              "npm commit",
              "git push directly",
              "git init every time",
            ],
            answerIndex: 0,
            explanation: "Stage with git add, record with git commit, share with git push.",
          },
        ],
        challenge: {
          prompt:
            "Build the full Task Manager. Complete each checklist item in order:",
          starterCode: "",
          solution: `# Backend checklist
1. Express server with express.json() + cors()
2. GET /api/tasks  → list all tasks
3. POST /api/tasks → create (400 if no title)
4. PATCH /api/tasks/:id → update done/title (404 if missing)
5. DELETE /api/tasks/:id → 204 on success
6. Test every route with curl

# Frontend checklist
7. Vite proxy: /api → http://localhost:3001
8. TaskManager: loads tasks with useEffect + fetch
9. AddTask: controlled form → POST → update list
10. Toggle done → PATCH → update state immutably
11. Delete → DELETE → filter the list
12. Empty state + loading state

# Self-check
13. Add → appears in list
14. Refresh page → task persists
15. Toggle → checkbox + server both update
16. Delete → gone after refresh`,
          explanation:
            "Build the backend first and prove it with curl, then wire the frontend. The persistence (step 14) only works if your API really stores data.",
        },
      },
    },
  ],
  caseStudy: {
    title: "Case Study: Scaling a MERN Blog Platform",
    overview:
      "A real-world walkthrough: a MERN blog grows from a demo to thousands of users. We examine the architectural decisions — schema design, authentication, caching and performance — that separate toy apps from production apps.",
    requirements: [
      "Users can register, log in and publish posts.",
      "Posts have categories, tags and an author.",
      "The homepage must load fast for thousands of concurrent readers.",
      "Admin can moderate content and see analytics.",
    ],
    steps: [
      {
        title: "Authentication with JWT",
        md: "Use **JSON Web Tokens**: on login the server signs a token with a secret; the client sends it in the `Authorization` header; middleware verifies it on protected routes.",
        code: {
          lang: "js",
          title: "Protected-route middleware",
          code: `import jwt from "jsonwebtoken";

export function requireAuth(req, res, next) {
  const header = req.headers.authorization ?? "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) return res.status(401).json({ message: "Not logged in" });

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ message: "Invalid token" });
  }
}`,
        },
      },
      {
        title: "Schema design with references",
        code: {
          lang: "js",
          title: "Post schema",
          code: `const postSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, unique: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    body: String,
    tags: [String],
    published: { type: Boolean, default: false },
    views: { type: Number, default: 0 },
  },
  { timestamps: true }
);

postSchema.index({ published: 1, createdAt: -1 });
postSchema.index({ tags: 1 });`,
        },
      },
      {
        title: "Performance: read-heavy workloads",
        md: "A blog is read-heavy. Production tricks used here:",
        bulletList: [
          "Cache the homepage JSON in an in-memory or Redis cache with a 60s TTL — hundreds of reads become one database query.",
          "Paginate lists (`?page=1&limit=10`) instead of loading everything.",
          "Index every field you filter or sort by.",
          "Move expensive aggregation (analytics) to a scheduled job instead of running it on page load.",
        ],
      },
      {
        title: "Key lessons from production",
        bulletList: [
          "Validate everything on the server — never trust the client.",
          "Rate-limit login and POST endpoints to stop abuse.",
          "Keep your JWT secret and MONGO_URI out of version control.",
          "Load-test before launch; a 1x-cached query can still fall over under 10x traffic.",
        ],
      },
    ],
    takeaways: [
      "Plan for read-heavy scale with caching, pagination and indexes.",
      "Auth = stateless JWT + protected-route middleware.",
      "Production hardening (validation, rate limits, secrets) is part of the job.",
    ],
  },
};
