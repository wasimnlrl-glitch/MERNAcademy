# MERN Academy

Learn the **MERN stack** (MongoDB, Express, React, Node.js) step by step with practical examples, interactive exercises and real-world case studies. The course app itself is built with MERN — you learn the stack while using it.

## Features

- **Step-by-step curriculum** — 6 modules and 28 lessons, from stack fundamentals to a full-stack capstone
- **Practical examples** — every concept shown with runnable code in a real project structure
- **Interactive exercises** — server-graded quizzes and coding challenges with revealable solutions
- **Case studies** — architecture walkthroughs covering REST API design, data modeling, the event loop, and scaling
- **Progress tracking** — per-lesson completion synced through the API
- **No database required** — the backend ships a MongoDB-style in-memory document store, so it runs anywhere with zero setup

## Tech stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18, React Router, Vite, Prism.js, marked |
| Backend | Node.js, Express 4 |
| Data | MongoDB-style in-memory store (mini-mongo) |

## Requirements

- Node.js 18 or newer
- npm 10 or newer
- MongoDB is optional — the app runs without it

## Getting started

```bash
# Clone the repository
git clone https://github.com/wasimnlrl-glitch/MERNAcademy.git

# Enter the project directory
cd MERNAcademy

# Install all dependencies (root + server + client workspaces)
npm install

# Start both servers in development mode
npm run dev
```

Open http://localhost:5173 in your browser. The API runs on http://localhost:3001.

The Vite dev server proxies `/api` requests to the backend, so no CORS configuration is needed during development.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start the API and the React app together |
| `npm run dev --workspace server` | Start only the API (watch mode) |
| `npm run dev --workspace client` | Start only the React app |
| `npm run build` | Build the client for production (outputs `client/dist`) |
| `npm run start` | Run the server in production mode; it serves the built React app |
| `npm run seed` | Seed the in-memory store with sample data |

## Project structure

```
mern-academy/
├── client/                     React + Vite frontend
│   ├── src/
│   │   ├── components/         CodeBlock, Markdown, Exercise
│   │   ├── pages/              Home, Module, Lesson, CaseStudy, ...
│   │   ├── api.js              fetch helpers
│   │   └── styles/             global CSS
│   ├── index.html
│   └── vite.config.js          dev proxy: /api -> http://localhost:3001
├── server/                     Express backend
│   ├── data/
│   │   ├── course.js           course metadata and helpers
│   │   └── modules/            course content (one file per module)
│   ├── src/
│   │   └── mini-mongo.js       MongoDB-style in-memory document store
│   ├── scripts/
│   │   └── seed.js             demo data seeder
│   └── index.js                API routes and static file serving
└── package.json                npm workspaces (monorepo root)
```

## Curriculum

| Module | Title | What you learn | Lessons |
|--------|-------|----------------|---------|
| 1 | Foundations | MERN overview, client-server architecture, REST, environment setup | 4 |
| 2 | Node.js & npm | Modules, the event loop, async patterns, package management | 4 |
| 3 | Express & REST APIs | Routing, middleware, CORS, error handling, status codes | 5 |
| 4 | MongoDB & Mongoose | Documents, CRUD, schemas, validation, relations and populate | 5 |
| 5 | React Fundamentals | Components, JSX, props, state, hooks, forms, routing | 6 |
| 6 | Connecting the Full Stack | Fetching data, env variables, deployment, capstone project | 4 |

Every module ends with an interactive exercise (quiz plus a coding challenge) and a case study. Module 6 finishes with the capstone: a full-stack Task Manager.

## API reference

The backend exposes a REST API that powers the course.

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Service health check |
| GET | `/api/course` | Full course content |
| GET | `/api/modules` | Module and lesson index |
| GET | `/api/lessons/:lessonId` | A single lesson (e.g. `m3-l1`) |
| GET | `/api/case-studies/:moduleId` | Case study for a module (e.g. `m3`) |
| POST | `/api/exercises/:lessonId/check` | Grade quiz answers; body: `{ "answers": { "m1-q1": 1 } }` |
| GET | `/api/progress` | Completed lessons for the session |
| POST | `/api/progress` | Mark a lesson complete; body: `{ "lessonId": "m1-l1", "status": "completed" }` |

Example:

```bash
# Check the API is up
curl http://localhost:3001/api/health

# Grade a quiz
curl -X POST http://localhost:3001/api/exercises/m1-l4/check \
  -H "Content-Type: application/json" \
  -d '{"answers":{"m1-q1":1,"m1-q2":3,"m1-q3":1,"m1-q4":1,"m1-q5":0}}'
```

## Using a real MongoDB

The app runs out of the box with an in-memory store that mimics the MongoDB driver API. To connect a real database:

1. Create `server/.env` with your connection string:

   ```env
   PORT=3001
   MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/mern_academy
   ```

2. Install the driver: `npm install mongodb --workspace server`
3. Replace the `MiniMongo` import in `server/index.js` with a `MongoClient` connection.

The route code already uses standard driver methods (`find`, `insertOne`, `updateOne`, `$set`), so the swap is straightforward. Module 4 walks through this in detail.

## Production deployment

```bash
# Build the React app
npm run build

# Run in production mode (Express serves the built app)
NODE_ENV=production npm run start
```

In production the Express server serves `client/dist` as static files and falls back to `index.html` for client-side routes, so the whole app runs on a single port. Typical hosting options:

- API: Render, Railway, Fly.io, or a VPS
- Database: MongoDB Atlas
- Alternative: host the frontend on Vercel/Netlify and the API separately (requires CORS configuration)

## Contributing

Contributions are welcome. Open an issue to report a bug or suggest a lesson, and feel free to open a pull request.

## License

This project is open source and available under the MIT License.
