export default {
  id: "m3",
  order: 3,
  title: "Express & REST APIs",
  subtitle: "Build the backend that your React app will talk to.",
  icon: "🚂",
  tagline: "Your first real API",
  lessons: [
    {
      id: "m3-l1",
      title: "Express Hello World",
      duration: "8 min",
      summary: "Create a server that responds to HTTP requests in five lines.",
      sections: [
        {
          type: "p",
          md: "**Express** is a minimal and flexible Node.js web framework. It gives you routing, middleware and request handling without boilerplate.",
        },
        {
          type: "code",
          lang: "js",
          title: "The smallest Express server",
          code: `import express from "express";

const app = express();
const PORT = process.env.PORT || 3001;

app.get("/", (req, res) => {
  res.send("Hello from the server!");
});

app.listen(PORT, () => {
  console.log(\`Server running on http://localhost:\${PORT}\`);
});`,
        },
        {
          type: "p",
          md: "Run it with `node index.js`, open `http://localhost:3001` and you'll see the message. `req` is the incoming request, `res` is the response you build.",
        },
        {
          type: "tip",
          md: "**`app.listen`** binds the server to a port. In this course project the backend runs on port **3001** and the React dev server on **5173**.",
        },
      ],
    },
    {
      id: "m3-l2",
      title: "Routing & HTTP Methods",
      duration: "12 min",
      summary: "Map URLs to handlers for every REST operation.",
      sections: [
        {
          type: "p",
          md: "A **route** is a combination of a method and a path. Express matches the request to the right handler. Path parameters like `:id` capture dynamic values.",
        },
        {
          type: "code",
          lang: "js",
          title: "REST routes for a tasks API",
          code: `// READ all
app.get("/api/tasks", async (req, res) => {
  const tasks = await db.collection("tasks").find({});
  res.json(tasks);
});

// CREATE one
app.post("/api/tasks", async (req, res) => {
  const task = await db.collection("tasks").insertOne(req.body);
  res.status(201).json(task);
});

// READ one
app.get("/api/tasks/:id", async (req, res) => {
  const task = await db.collection("tasks").findById(req.params.id);
  if (!task) return res.status(404).json({ message: "Task not found" });
  res.json(task);
});

// UPDATE one
app.patch("/api/tasks/:id", async (req, res) => {
  const updated = await db.collection("tasks")
    .updateOne({ _id: req.params.id }, { $set: req.body });
  res.json(updated);
});

// DELETE one
app.delete("/api/tasks/:id", async (req, res) => {
  await db.collection("tasks").deleteOne({ _id: req.params.id });
  res.status(204).send();
});`,
        },
        {
          type: "table",
          headers: ["Route", "Purpose"],
          rows: [
            ["req.params.id", "Value from the URL — /api/tasks/abc gives 'abc'"],
            ["req.query", "Query string — /api/tasks?done=true gives { done: 'true' }"],
            ["req.body", "JSON body sent by the client (needs express.json())"],
          ],
        },
        {
          type: "warn",
          md: "**Order matters!** Express checks routes top to bottom. Put a specific route like `GET /api/tasks/:id` after more general ones when they could overlap, and always define `/:id` routes with the collection they target.",
        },
      ],
    },
    {
      id: "m3-l3",
      title: "Middleware & CORS",
      duration: "12 min",
      summary: "Process requests in a pipeline and fix browser cross-origin errors.",
      sections: [
        {
          type: "p",
          md: "**Middleware** is a function that runs between receiving a request and sending a response. It can log, authenticate, parse bodies, or short-circuit with an error.",
        },
        {
          type: "code",
          lang: "js",
          title: "Middleware in action",
          code: `// Built-in: parse JSON bodies
app.use(express.json());

// Custom: request logger
app.use((req, res, next) => {
  console.log(\`\${req.method} \${req.url} - \${new Date().toISOString()}\`);
  next(); // pass control to the next middleware/route
});

// Custom: simple API key guard
app.use("/api/admin", (req, res, next) => {
  if (req.headers["x-api-key"] !== process.env.ADMIN_KEY) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  next();
});`,
        },
        {
          type: "p",
          md: "**CORS** (Cross-Origin Resource Sharing) is the browser's security rule that stops a page from one origin fetching data from another. During development your React app (localhost:5173) calls your API (localhost:3001) — two different origins — so the browser would block it without CORS headers.",
        },
        {
          type: "code",
          lang: "js",
          title: "Enable CORS",
          code: `import cors from "cors";

app.use(cors()); // allow all origins (fine for development)

// For production, restrict it:
app.use(cors({ origin: "https://myapp.com" }));`,
        },
        {
          type: "tip",
          md: "This course project also configures a **Vite proxy** so the frontend can call `/api` without CORS at all — the dev server forwards requests to the backend. You'll see that pattern in module 6.",
        },
      ],
    },
    {
      id: "m3-l4",
      title: "Error Handling & Status Codes",
      duration: "10 min",
      summary: "Fail gracefully with meaningful responses.",
      sections: [
        {
          type: "p",
          md: "A good API never crashes silently. Wrap risky work in `try/catch` and send structured errors. A centralized **error-handling middleware** keeps your routes clean.",
        },
        {
          type: "code",
          lang: "js",
          title: "Centralized error handling",
          code: `// Route that can fail
app.post("/api/tasks", async (req, res, next) => {
  try {
    if (!req.body.title) {
      return res.status(400).json({ message: "title is required" });
    }
    const task = await db.collection("tasks").insertOne(req.body);
    res.status(201).json(task);
  } catch (err) {
    next(err); // hand off to the error middleware
  }
});

// Error-handling middleware (4 args = it's the error handler)
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: "Something went wrong" });
});`,
        },
        {
          type: "table",
          headers: ["Situation", "Status", "Body"],
          rows: [
            ["Missing required field", "400 Bad Request", "{ message: 'title is required' }"],
            ["Unknown ID", "404 Not Found", "{ message: 'Task not found' }"],
            ["Invalid auth", "401 Unauthorized", "{ message: 'Unauthorized' }"],
            ["Unexpected crash", "500", "{ message: 'Something went wrong' }"],
          ],
        },
        {
          type: "tip",
          md: "An Express error handler must have **four** parameters (`err, req, res, next`) — Express detects the signature and treats it as an error handler.",
        },
      ],
    },
    {
      id: "m3-l5",
      title: "Module 3 Quiz",
      duration: "5 min",
      type: "exercise",
      summary: "Check your Express and REST knowledge.",
      exercise: {
        intro: "Five questions on routes, middleware and error handling.",
        questions: [
          {
            id: "m3-q1",
            prompt: "Which request object property holds the value of :id in '/api/tasks/:id'?",
            options: ["req.body", "req.params", "req.query", "req.url"],
            answerIndex: 1,
            explanation:
              "URL path parameters live in req.params. req.body is the JSON body, req.query is the query string.",
          },
          {
            id: "m3-q2",
            prompt: "Why does the browser block API calls to a different port during development?",
            options: [
              "The server is down",
              "CORS — cross-origin policy",
              "JSON isn't allowed",
              "npm cached the request",
            ],
            answerIndex: 1,
            explanation:
              "The browser enforces the same-origin policy. CORS headers tell it the API allows the request.",
          },
          {
            id: "m3-q3",
            prompt: "What does next() do in a middleware function?",
            options: [
              "Sends the response",
              "Restarts the server",
              "Passes control to the next middleware or route",
              "Clears the request body",
            ],
            answerIndex: 2,
            explanation:
              "next() hands control down the pipeline. Without it, the request hangs.",
          },
          {
            id: "m3-q4",
            prompt: "What status code should you return when a resource is created?",
            options: ["200", "201", "204", "301"],
            answerIndex: 1,
            explanation: "201 Created signals successful creation. 204 is used for successful deletes with no body.",
          },
          {
            id: "m3-q5",
            prompt: "How many parameters does an Express error-handling middleware take?",
            options: ["1", "2", "3", "4"],
            answerIndex: 3,
            explanation:
              "Four: (err, req, res, next). The signature is how Express recognizes error handlers.",
          },
        ],
        challenge: {
          prompt:
            "Write an Express route `POST /api/items` that: returns 400 if `req.body.name` is missing, otherwise inserts the item and returns 201 with the created item.",
          starterCode: `import express from "express";
const app = express();
app.use(express.json());

// TODO: write the POST /api/items route
`,
          solution: `app.post("/api/items", async (req, res) => {
  if (!req.body.name) {
    return res.status(400).json({ message: "name is required" });
  }
  const item = await db.collection("items").insertOne(req.body);
  res.status(201).json(item);
});`,
          explanation:
            "Validate input, create the resource, and always return a meaningful status code.",
        },
      },
    },
  ],
  caseStudy: {
    title: "Case Study: Building the Task Manager API",
    overview:
      "We now implement the API blueprint from Module 1. This is a complete, runnable Express server for our Task Manager — the backend half of the capstone project.",
    requirements: [
      "GET /api/tasks — return every task.",
      "POST /api/tasks — create a task; 400 when title is missing.",
      "PATCH /api/tasks/:id — update fields like done; 404 when missing.",
      "DELETE /api/tasks/:id — delete; 204 on success.",
      "Use the in-memory MongoDB-style store so no external DB is required.",
    ],
    steps: [
      {
        title: "Create the server entry point",
        code: {
          lang: "js",
          title: "server/index.js",
          code: `import express from "express";
import cors from "cors";
import { createTasksRouter } from "./routes/tasks.js";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => res.json({ status: "ok" }));

app.use("/api/tasks", createTasksRouter());

// Error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: "Something went wrong" });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(\`API on :\${PORT}\`));`,
        },
      },
      {
        title: "Create the router",
        code: {
          lang: "js",
          title: "server/routes/tasks.js",
          code: `import { Router } from "express";

export function createTasksRouter(db) {
  const router = Router();
  const tasks = db.collection("tasks");

  router.get("/", async (req, res) => {
    res.json(await tasks.find({}));
  });

  router.post("/", async (req, res) => {
    const { title } = req.body ?? {};
    if (!title) return res.status(400).json({ message: "title is required" });
    const created = await tasks.insertOne({ title, done: false });
    res.status(201).json(created);
  });

  router.patch("/:id", async (req, res) => {
    const existing = await tasks.findById(req.params.id);
    if (!existing) return res.status(404).json({ message: "Task not found" });
    const { done, title } = req.body ?? {};
    await tasks.updateOne({ _id: req.params.id }, { $set: { done, title } });
    res.json(await tasks.findById(req.params.id));
  });

  router.delete("/:id", async (req, res) => {
    await tasks.deleteOne({ _id: req.params.id });
    res.status(204).send();
  });

  return router;
}`,
        },
      },
      {
        title: "Test it like a professional",
        md: "Test every endpoint with curl before touching the frontend:",
        code: {
          lang: "bash",
          title: "Curl smoke tests",
          code: `curl -X POST localhost:3001/api/tasks \\
  -H "Content-Type: application/json" \\
  -d '{"title":"Learn Express"}'

curl localhost:3001/api/tasks

curl -X PATCH localhost:3001/api/tasks/<id> \\
  -H "Content-Type: application/json" \\
  -d '{"done":true}'

curl -X DELETE localhost:3001/api/tasks/<id>`,
        },
      },
    ],
    takeaways: [
      "Separating routes into their own module keeps index.js tiny.",
      "Validate input before writing to the store.",
      "Test the API with curl before building the UI — it isolates bugs.",
    ],
  },
};
