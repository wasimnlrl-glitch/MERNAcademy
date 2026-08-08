export default {
  id: "m1",
  order: 1,
  title: "Foundations",
  subtitle: "Understand the MERN stack, client-server architecture and REST APIs.",
  icon: "🧭",
  tagline: "The big picture before the code",
  lessons: [
    {
      id: "m1-l1",
      title: "What is the MERN Stack?",
      duration: "8 min",
      summary:
        "MERN is a collection of four JavaScript technologies used to build full-stack web applications.",
      sections: [
        {
          type: "p",
          md: "**MERN** stands for **MongoDB**, **Express.js**, **React** and **Node.js**. It is one of the most popular technology stacks because **every layer uses JavaScript** — you learn one language and can build both the frontend and the backend.",
        },
        {
          type: "p",
          md: "Here is what each piece does:",
        },
        {
          type: "table",
          headers: ["Technology", "Layer", "What it does"],
          rows: [
            ["**M**ongoDB", "Database", "Stores your data as flexible JSON-like documents"],
            ["**E**xpress.js", "Backend framework", "Handles HTTP requests and defines your API routes"],
            ["**R**eact", "Frontend library", "Builds interactive user interfaces from components"],
            ["**N**ode.js", "Runtime", "Runs JavaScript on the server"],
          ],
        },
        {
          type: "p",
          md: "A typical request flows through all four layers:",
        },
        {
          type: "code",
          lang: "text",
          title: "Request flow",
          code: `Browser (React UI)
   │  fetch('/api/todos')
   ▼
Express server (Node.js)
   │  app.get('/api/todos', ...)
   ▼
MongoDB (document database)
   │  find() query
   ▼
JSON response  →  back to React  →  UI updates`,
        },
        {
          type: "tip",
          md: "**Why learn MERN?** You use a single language (JavaScript/TypeScript) everywhere, and all four technologies are in extremely high demand in the job market.",
        },
      ],
    },
    {
      id: "m1-l2",
      title: "Client-Server Architecture & REST",
      duration: "10 min",
      summary: "Learn how the browser and the server talk to each other over HTTP.",
      sections: [
        {
          type: "p",
          md: "A web app is split into two roles:\n\n- **Client** — the React app running in the browser. It renders UI and sends requests.\n- **Server** — the Node/Express backend. It reads and writes data, then returns JSON.",
        },
        {
          type: "p",
          md: "The two sides communicate using **HTTP**. Each request has a **method** (the verb) and a **URL** (the noun). This convention is called **REST** (Representational State Transfer).",
        },
        {
          type: "table",
          headers: ["HTTP Method", "Purpose", "Example"],
          rows: [
            ["GET", "Read data", "GET /api/todos — list all todos"],
            ["POST", "Create data", "POST /api/todos — add a todo"],
            ["PUT / PATCH", "Update data", "PATCH /api/todos/5 — update one todo"],
            ["DELETE", "Remove data", "DELETE /api/todos/5 — delete a todo"],
          ],
        },
        {
          type: "p",
          md: "The server replies with a **status code** and usually a JSON body:",
        },
        {
          type: "table",
          headers: ["Status", "Meaning", "Typical use"],
          rows: [
            ["200", "OK", "Successful GET / POST"],
            ["201", "Created", "Resource created via POST"],
            ["400", "Bad Request", "Invalid input from the client"],
            ["404", "Not Found", "URL or resource does not exist"],
            ["500", "Server Error", "Something crashed on the server"],
          ],
        },
        {
          type: "code",
          lang: "js",
          title: "A REST request in plain terms",
          code: `// Request the client sends
GET /api/todos

// Response the server returns
HTTP/1.1 200 OK
Content-Type: application/json

[
  { "_id": "1", "title": "Learn Express", "done": true },
  { "_id": "2", "title": "Build a project", "done": false }
]`,
        },
        {
          type: "exercise-note",
          md: "At the end of this module there is a quiz to check your understanding.",
        },
      ],
    },
    {
      id: "m1-l3",
      title: "Setting Up Your Development Environment",
      duration: "12 min",
      summary: "Install the tools you need and scaffold your first MERN project.",
      sections: [
        {
          type: "p",
          md: "You need four tools installed before building anything:\n\n1. **Node.js** (LTS) — includes `npm`. Download from nodejs.org.\n2. **MongoDB** — either the free **MongoDB Atlas** cloud database, or a local install.\n3. **VS Code** (or any editor).\n4. **Git** — for version control.",
        },
        {
          type: "p",
          md: "Verify everything is installed by opening a terminal:",
        },
        {
          type: "code",
          lang: "bash",
          title: "Check your installs",
          code: `node --version   # v22.x.x
npm --version    # 10.x.x
git --version    # git version 2.x.x
mongosh --version  # MongoDB shell (if installed locally)`,
        },
        {
          type: "p",
          md: "Next, create a project folder and initialize it. A modern approach is to use a monorepo with two folders: `server` and `client`. Run this to start:",
        },
        {
          type: "code",
          lang: "bash",
          title: "Scaffold the project",
          code: `# Create and enter the project
mkdir mern-todos && cd mern-todos

# Create the server folder
mkdir server && cd server
npm init -y

# Go back and scaffold the React client with Vite
cd ..
npm create vite@latest client -- --template react

# Enter the client and install dependencies
cd client
npm install`,
        },
        {
          type: "p",
          md: "This course project uses the exact same structure — a `server/` workspace and a `client/` workspace managed from the root `package.json`.",
        },
        {
          type: "tip",
          md: "**Vite** is the recommended build tool for new React projects. It gives you hot module replacement, meaning your page updates instantly when you save a file.",
        },
      ],
    },
    {
      id: "m1-l4",
      title: "Module 1 Quiz",
      duration: "5 min",
      type: "exercise",
      summary: "Check your understanding of the stack, REST and environment setup.",
      exercise: {
        intro:
          "Answer these five questions to lock in the fundamentals before moving on.",
        questions: [
          {
            id: "m1-q1",
            prompt: "What does the 'M' in MERN stand for?",
            options: ["MySQL", "MongoDB", "MariaDB", "Mongoose"],
            answerIndex: 1,
            explanation:
              "M = MongoDB, a NoSQL document database. Mongoose is an ODM (object data modelling) library used with MongoDB.",
          },
          {
            id: "m1-q2",
            prompt: "Which layer of the MERN stack runs in the browser?",
            options: ["Node.js", "Express", "MongoDB", "React"],
            answerIndex: 3,
            explanation:
              "React runs in the browser as the client. Node.js, Express and MongoDB all run on the server side.",
          },
          {
            id: "m1-q3",
            prompt: "Which HTTP method should you use to create a new resource?",
            options: ["GET", "POST", "PUT", "DELETE"],
            answerIndex: 1,
            explanation:
              "POST creates a new resource. GET reads, PUT/PATCH update, DELETE removes.",
          },
          {
            id: "m1-q4",
            prompt: "A server returning '404' means...",
            options: [
              "The request was malformed",
              "The resource was not found",
              "An internal error occurred",
              "The resource was created",
            ],
            answerIndex: 1,
            explanation:
              "404 Not Found means the URL or resource the client asked for doesn't exist. 400 is bad input, 500 is a server error, 201 is created.",
          },
          {
            id: "m1-q5",
            prompt: "Which tool scaffolds a new React project with Vite?",
            options: [
              "npm create vite@latest",
              "npx mongoose init",
              "npm start",
              "mongosh",
            ],
            answerIndex: 0,
            explanation:
              "`npm create vite@latest` scaffolds a new Vite project. The other options are unrelated.",
          },
        ],
        challenge: {
          prompt:
            "Optional challenge: Using only a terminal, create a folder called `mern-practice`, initialize it with npm, and print the Node and npm versions. Type the commands below in order:",
          starterCode: "",
          solution: `mkdir mern-practice && cd mern-practice
npm init -y
node --version
npm --version`,
          explanation:
            "This mirrors the real setup workflow you'll repeat on every project.",
        },
      },
    },
  ],
  caseStudy: {
    title: "Case Study: Requirements for a Task Manager",
    overview:
      "Before writing code, professional developers turn vague ideas into clear requirements. In this case study we define exactly what our course capstone project — a Task Manager — must do. Every later module builds toward this app.",
    requirements: [
      "Users can create a task with a title and an optional due date.",
      "Users can mark a task as done or not done.",
      "Users can edit and delete tasks.",
      "Tasks persist in a database, so they survive a page refresh.",
      "The API must follow REST conventions and use proper status codes.",
      "The UI must update instantly when data changes.",
    ],
    steps: [
      {
        title: "Turn ideas into user stories",
        md: "A user story follows the pattern: *As a user, I can ... so that ...*. For the Task Manager:",
        bulletList: [
          "As a user, I can add a task so that I remember what to do.",
          "As a user, I can complete a task so that I know it's finished.",
          "As a user, I can delete a task so that I can remove mistakes.",
        ],
      },
      {
        title: "Define the data model",
        md: "Every task needs a shape. We call this a **schema** in MongoDB terms:",
        code: {
          lang: "js",
          title: "A Task document",
          code: `{
  _id: "a-unique-id",
  title: "Write my first MERN app",
  done: false,
  dueDate: "2026-09-01",
  createdAt: "2026-08-08T10:00:00Z"
}`,
        },
      },
      {
        title: "Design the API surface",
        md: "Each requirement maps to one REST endpoint. This table is your blueprint:",
        table: {
          headers: ["Method", "Endpoint", "Purpose"],
          rows: [
            ["GET", "/api/tasks", "List all tasks"],
            ["POST", "/api/tasks", "Create a task"],
            ["GET", "/api/tasks/:id", "Get a single task"],
            ["PATCH", "/api/tasks/:id", "Update a task (e.g. mark done)"],
            ["DELETE", "/api/tasks/:id", "Delete a task"],
          ],
        },
      },
    ],
    takeaways: [
      "Start with requirements and user stories before writing code.",
      "Design the data model early — the schema drives the API and the UI.",
      "A REST blueprint makes backend and frontend work easier to parallelize.",
    ],
  },
};
