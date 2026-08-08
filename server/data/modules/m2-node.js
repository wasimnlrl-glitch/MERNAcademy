export default {
  id: "m2",
  order: 2,
  title: "Node.js & npm",
  subtitle: "The JavaScript runtime that powers your backend.",
  icon: "🟢",
  tagline: "JavaScript on the server",
  lessons: [
    {
      id: "m2-l1",
      title: "Node.js Basics: Modules & the Global Scope",
      duration: "12 min",
      summary:
        "Learn how Node runs JavaScript outside the browser and how modules keep code organized.",
      sections: [
        {
          type: "p",
          md: "Node.js is a runtime that executes JavaScript **outside the browser** using Chrome's V8 engine. It shines at handling many concurrent connections because of its **non-blocking, event-driven** model.",
        },
        {
          type: "p",
          md: "Unlike the browser, Node has no DOM. Instead it gives you APIs for the file system, networking, streams and more. Code is split into **modules** — one file per concern.",
        },
        {
          type: "code",
          lang: "js",
          title: "Exporting and importing a module",
          code: `// math.js
export function add(a, b) {
  return a + b;
}
export const PI = 3.14159;

// main.js
import { add, PI } from "./math.js";
console.log(add(2, 3));   // 5
console.log(PI);          // 3.14159`,
        },
        {
          type: "p",
          md: "There are two module systems in Node: **ES Modules** (`import`/`export`, used here) and **CommonJS** (`require`/`module.exports`). The MERN ecosystem is moving to ES Modules — set `\"type\": \"module\"` in your `package.json` to use them.",
        },
        {
          type: "code",
          lang: "js",
          title: "Working with built-in Node modules",
          code: `import fs from "node:fs/promises";
import path from "node:path";
import os from "node:os";

// Read a file asynchronously
const data = await fs.readFile("config.json", "utf8");

// Resolve paths safely across operating systems
const configPath = path.join(process.cwd(), "config.json");

// Ask the OS questions
console.log(os.platform());   // 'linux', 'darwin', 'win32'...
console.log(os.cpus().length); // number of CPU cores`,
        },
        {
          type: "tip",
          md: "**Global `process` object.** `process.env` holds environment variables and `process.cwd()` is the current working directory. You'll use both constantly in a backend.",
        },
      ],
    },
    {
      id: "m2-l2",
      title: "Async JavaScript: Callbacks, Promises & Async/Await",
      duration: "15 min",
      summary:
        "The single most important concept for Node developers — handling operations that take time.",
      sections: [
        {
          type: "p",
          md: "Reading files, querying a database and calling APIs all take time. Node never blocks: while it waits, it keeps serving other requests. You handle this with **asynchronous** code.",
        },
        {
          type: "code",
          lang: "js",
          title: "The three generations of async code",
          code: `// 1. Callbacks (old style)
fs.readFile("a.txt", (err, data) => {
  if (err) return console.error(err);
  console.log(data);
});

// 2. Promises (better)
fs.promises.readFile("a.txt")
  .then(data => console.log(data))
  .catch(err => console.error(err));

// 3. async/await (modern — cleaner)
try {
  const data = await fs.promises.readFile("a.txt");
  console.log(data);
} catch (err) {
  console.error(err);
}`,
        },
        {
          type: "p",
          md: "`await` can only be used inside a function marked `async`, or at the top level of an ES module. Promise chains and `async/await` are equivalent — `async/await` is just easier to read.",
        },
        {
          type: "code",
          lang: "js",
          title: "Running work in parallel with Promise.all",
          code: `// Two database queries that don't depend on each other
const [users, posts] = await Promise.all([
  db.collection("users").find({}).toArray(),
  db.collection("posts").find({}).toArray(),
]);

// Without Promise.all they would run one after another (slower).`,
        },
        {
          type: "warn",
          md: "**Common bug:** forgetting `await`. A missing `await` on a Promise returns the Promise object itself, not its value. You'll see `Promise { <pending> }` in logs — that's the clue.",
        },
      ],
    },
    {
      id: "m2-l3",
      title: "npm & package.json",
      duration: "12 min",
      summary:
        "Manage dependencies, scripts and versions like a professional.",
      sections: [
        {
          type: "p",
          md: "**npm** is the Node package manager. It downloads third-party libraries (packages) and keeps them in `node_modules`. Every Node project has a `package.json` that describes it.",
        },
        {
          type: "code",
          lang: "json",
          title: "Anatomy of package.json",
          code: `{
  "name": "mern-todos",
  "version": "1.0.0",
  "description": "Our course project",
  "type": "module",
  "main": "index.js",
  "scripts": {
    "start": "node index.js",
    "dev": "node --watch index.js"
  },
  "dependencies": {
    "express": "^4.21.0"
  },
  "devDependencies": {
    "nodemon": "^3.1.0"
  }
}`,
        },
        {
          type: "table",
          headers: ["Field", "Purpose"],
          rows: [
            ["scripts", "Aliases for commands — `npm run dev` runs `node --watch index.js`"],
            ["dependencies", "Packages the app needs in production"],
            ["devDependencies", "Packages only needed for development (testers, linters, etc.)"],
            ["^4.21.0", "The caret allows minor updates: any 4.x.x version at or above 4.21"],
          ],
        },
        {
          type: "code",
          lang: "bash",
          title: "npm commands you'll use daily",
          code: `npm install express            # add a runtime dependency
npm install -D nodemon        # add a dev dependency
npm install                   # install everything from package.json
npm uninstall express         # remove a package
npm run dev                   # run the "dev" script
npm outdated                  # see which packages are behind`,
        },
        {
          type: "tip",
          md: "**`package-lock.json`** pins the exact version of every dependency. Commit it — it makes builds reproducible across machines.",
        },
      ],
    },
    {
      id: "m2-l4",
      title: "Module 2 Quiz",
      duration: "5 min",
      type: "exercise",
      summary: "Test your Node and npm knowledge.",
      exercise: {
        intro:
          "Five questions on modules, async and package management.",
        questions: [
          {
            id: "m2-q1",
            prompt: "Which of these is an ES Modules import?",
            options: [
              "const fs = require('fs');",
              "import fs from 'node:fs';",
              "include('fs');",
              "use fs;",
            ],
            answerIndex: 1,
            explanation:
              "`import ... from ...` is ES Modules syntax. `require` is CommonJS.",
          },
          {
            id: "m2-q2",
            prompt: "What does the missing 'await' bug typically produce in logs?",
            options: [
              "undefined",
              "A crash",
              "Promise { <pending> }",
              "null",
            ],
            answerIndex: 2,
            explanation:
              "A missing await returns the Promise object itself, which logs as `Promise { <pending> }`.",
          },
          {
            id: "m2-q3",
            prompt: "Which command installs a package as a dev dependency?",
            options: [
              "npm install express",
              "npm install -D express",
              "npm get express",
              "npm add express --save",
            ],
            answerIndex: 1,
            explanation: "The `-D` (or `--save-dev`) flag marks a dev dependency.",
          },
          {
            id: "m2-q4",
            prompt: "To run two independent async tasks at the same time, use:",
            options: [
              "Promise.all([...])",
              "A for loop",
              "setTimeout",
              "await one by one",
            ],
            answerIndex: 0,
            explanation:
              "Promise.all runs promises concurrently and resolves with an array of results.",
          },
          {
            id: "m2-q5",
            prompt: "The version range '^4.21.0' means...",
            options: [
              "Exactly 4.21.0",
              "Any 4.x version from 4.21 upward",
              "Any version above 4",
              "Version 4 only",
            ],
            answerIndex: 1,
            explanation:
              "The caret allows minor/patch updates, so any 4.x >= 4.21 is allowed.",
          },
        ],
        challenge: {
          prompt:
            "Write an async function `getUser(id)` that returns a fake user object after 300ms using `await new Promise(...)`, then log the result.",
          starterCode: `async function getUser(id) {
  // TODO: await a Promise that resolves after 300ms
  // then return { id, name: "Ada" }
}

// await getUser(1) and log it (top-level await is allowed)`,
          solution: `async function getUser(id) {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return { id, name: "Ada" };
}

const user = await getUser(1);
console.log(user); // { id: 1, name: 'Ada' }`,
          explanation:
            "The key skill is wrapping `setTimeout` in a Promise and awaiting it — this is the foundation of every API call you'll write.",
        },
      },
    },
  ],
  caseStudy: {
    title: "Case Study: The Event Loop Under the Hood",
    overview:
      "Why can Node serve thousands of users with one thread? Because of the event loop. Understanding it explains a huge class of 'why is my app slow?' questions.",
    requirements: [
      "Serve many concurrent connections on a single thread.",
      "Never block the event loop with CPU-heavy work.",
      "Offload slow I/O (files, network, database) to libuv's thread pool.",
      "Use the queue (microtasks) correctly to avoid starvation.",
    ],
    steps: [
      {
        title: "The one-thread model",
        md: "Node runs your JavaScript on **one thread**. While the event loop iterates, it checks for pending work (timers, I/O callbacks, network). Anything synchronous — like a huge `for` loop — **blocks** the whole server.",
      },
      {
        title: "What blocking looks like",
        code: {
          lang: "js",
          title: "This blocks every user",
          code: `app.get("/heavy", (req, res) => {
  // 2 seconds of pure CPU work — blocks ALL users
  const end = Date.now() + 2000;
  while (Date.now() < end) { /* spin */ }
  res.json({ ok: true });
});

// Better: hand the work off
app.get("/heavy", async (req, res) => {
  const result = await runInWorkerThread(heavyWork);
  res.json(result);
});`,
        },
      },
      {
        title: "The phases in a nutshell",
        table: {
          headers: ["Phase", "What runs there"],
          rows: [
            ["Timers", "setTimeout / setInterval callbacks"],
            ["I/O callbacks", "Finished network / file operations"],
            ["Poll", "Retrieves new I/O events (most real work happens here)"],
            ["setImmediate", "Immediate callbacks"],
            ["Microtasks", "Promise .then / await continuations (run after every phase)"],
          ],
        },
      },
    ],
    takeaways: [
      "Keep CPU-heavy work out of the request handler — use a worker thread or an external service.",
      "Prefer async APIs for I/O so the event loop stays free.",
      "Microtasks (Promises) run before the next phase, so a runaway Promise chain can starve timers.",
    ],
  },
};
