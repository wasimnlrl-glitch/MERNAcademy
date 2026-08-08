export default {
  id: "m5",
  order: 5,
  title: "React Fundamentals",
  subtitle: "Build interactive UIs from reusable components.",
  icon: "⚛️",
  tagline: "Thinking in components",
  lessons: [
    {
      id: "m5-l1",
      title: "Components & JSX",
      duration: "12 min",
      summary: "The building blocks of every React screen.",
      sections: [
        {
          type: "p",
          md: "React is a library for building **user interfaces out of components**. A component is a function that returns markup (via **JSX**). Components can be composed, reused and nested — just like functions.",
        },
        {
          type: "code",
          lang: "jsx",
          title: "Your first component",
          code: `function Greeting() {
  return <h1>Hello, MERN developer!</h1>;
}

function App() {
  return (
    <div>
      <Greeting />
      <Greeting />
      <Greeting />
    </div>
  );
}

export default App;`,
        },
        {
          type: "table",
          headers: ["JSX rule", "Example"],
          rows: [
            ["One root element per return", "Wrap siblings in <div> or <>...</>"],
            ["JS expressions in braces", "{user.name}"],
            ["class becomes className", "className=\"btn\""],
            ["Self-close empty tags", "<br />"],
            ["Component names start with a capital", "function TaskList()"],
          ],
        },
        {
          type: "code",
          lang: "jsx",
          title: "Conditional & dynamic content",
          code: `function Profile({ user }) {
  return (
    <section>
      <h2>{user.name}</h2>
      {user.admin ? <span>👑 Admin</span> : <span>Member</span>}
      {user.bio && <p>{user.bio}</p>}
    </section>
  );
}`,
        },
        {
          type: "tip",
          md: "**JSX is just JavaScript.** `{user.admin ? ... : ...}` is a ternary, and `{user.bio && ...}` short-circuits — the right side only renders when `user.bio` is truthy.",
        },
      ],
    },
    {
      id: "m5-l2",
      title: "Props & State",
      duration: "14 min",
      summary:
        "Pass data in with props, manage changing data with state.",
      sections: [
        {
          type: "p",
          md: "Two core ideas: **props** are read-only inputs passed from a parent to a child; **state** is data owned by a component that changes over time. When state changes, React **re-renders** the component automatically.",
        },
        {
          type: "code",
          lang: "jsx",
          title: "Props and useState",
          code: `import { useState } from "react";

function Counter({ step = 1 }) {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(c => c + step)}>+{step}</button>
    </div>
  );
}

function App() {
  return (
    <div>
      <Counter step={1} />
      <Counter step={5} />
    </div>
  );
}`,
        },
        {
          type: "warn",
          md: "**Never mutate state directly.** `count++` is a bug — call `setCount(...)` instead. And when updating from the previous value, use the function form `setCount(c => c + step)` to avoid stale closures.",
        },
        {
          type: "table",
          headers: ["Concept", "Owned by", "Can it change?", "Example"],
          rows: [
            ["props", "Parent", "No (read-only)", "step={1} passed to Counter"],
            ["state", "The component itself", "Yes, via setState", "count in Counter"],
          ],
        },
        {
          type: "tip",
          md: "**Lifting state up:** when two components need to share data, move that state to their closest common parent and pass it down via props.",
        },
      ],
    },
    {
      id: "m5-l3",
      title: "Hooks: useEffect & Custom Hooks",
      duration: "14 min",
      summary:
        "Run side effects like fetching data, and extract reusable logic.",
      sections: [
        {
          type: "p",
          md: "**Hooks** are functions that let you 'hook into' React features. `useState` and `useEffect` are the two you'll use constantly. `useEffect` runs after render — perfect for API calls, timers, and subscriptions.",
        },
        {
          type: "code",
          lang: "jsx",
          title: "useEffect for data fetching",
          code: `import { useState, useEffect } from "react";

function TaskList() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const res = await fetch("/api/tasks");
      const data = await res.json();
      setTasks(data);
      setLoading(false);
    }
    load();
  }, []); // empty deps = run once on mount

  if (loading) return <p>Loading…</p>;
  return (
    <ul>
      {tasks.map(t => <li key={t._id}>{t.title}</li>)}
    </ul>
  );
}`,
        },
        {
          type: "table",
          headers: ["Dependency array", "When the effect runs"],
          rows: [
            ["[]", "Once, after the first render (mount)"],
            ["[user]", "On mount and whenever user changes"],
            ["(nothing)", "After every render (usually avoid this)"],
          ],
        },
        {
          type: "code",
          lang: "jsx",
          title: "Extracting a custom hook",
          code: `// useFetch.js — reusable data fetching
import { useState, useEffect } from "react";

export function useFetch(url) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;
    fetch(url)
      .then(r => r.json())
      .then(json => active && setData(json))
      .catch(e => active && setError(e.message));
    return () => { active = false; }; // cleanup on unmount
  }, [url]);

  return { data, error };
}

// Use it anywhere:
const { data, error } = useFetch("/api/tasks");`,
        },
        {
          type: "tip",
          md: "Always return a **cleanup function** from effects that set up timers, subscriptions or event listeners — it prevents memory leaks and race conditions.",
        },
      ],
    },
    {
      id: "m5-l4",
      title: "Lists, Conditional Rendering & Forms",
      duration: "14 min",
      summary:
        "Render collections and collect user input the React way.",
      sections: [
        {
          type: "code",
          lang: "jsx",
          title: "Rendering a list with keys",
          code: `function TaskList({ tasks }) {
  if (tasks.length === 0) {
    return <p className="empty">No tasks yet. Add one below!</p>;
  }
  return (
    <ul>
      {tasks.map(task => (
        <li key={task._id}>
          <input type="checkbox" checked={task.done} readOnly />
          <span>{task.title}</span>
        </li>
      ))}
    </ul>
  );
}`,
        },
        {
          type: "warn",
          md: "**Keys matter.** Use the item's unique id (`task._id`), never the array index. React uses keys to track which items changed, so index keys cause subtle bugs when lists are reordered.",
        },
        {
          type: "code",
          lang: "jsx",
          title: "A controlled form",
          code: `function AddTask({ onAdd }) {
  const [title, setTitle] = useState("");

  function handleSubmit(e) {
    e.preventDefault();          // stop the page reload
    if (!title.trim()) return;
    onAdd(title.trim());
    setTitle("");                 // clear the input
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={title}
        onChange={e => setTitle(e.target.value)}
        placeholder="What needs doing?"
      />
      <button type="submit">Add</button>
    </form>
  );
}`,
        },
        {
          type: "p",
          md: "The input is **controlled** — its `value` comes from state, and every keystroke updates state. This is the idiomatic React way and makes validation and clearing trivial.",
        },
      ],
    },
    {
      id: "m5-l5",
      title: "Routing with React Router",
      duration: "10 min",
      summary: "Give your single-page app multiple views.",
      sections: [
        {
          type: "code",
          lang: "jsx",
          title: "Setting up routes",
          code: `import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/tasks">Tasks</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/tasks" element={<TaskManager />} />
        <Route path="/tasks/:id" element={<TaskDetail />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}`,
        },
        {
          type: "code",
          lang: "jsx",
          title: "Reading URL parameters",
          code: `import { useParams, useNavigate } from "react-router-dom";

function TaskDetail() {
  const { id } = useParams();       // the :id from the URL
  const navigate = useNavigate();

  return (
    <div>
      <h1>Task {id}</h1>
      <button onClick={() => navigate(-1)}>Go back</button>
    </div>
  );
}`,
        },
        {
          type: "tip",
          md: "Use `<Link to>` instead of raw `<a>` tags — Links use the router and don't reload the whole page.",
        },
      ],
    },
    {
      id: "m5-l6",
      title: "Module 5 Quiz",
      duration: "6 min",
      type: "exercise",
      summary: "Test your React knowledge.",
      exercise: {
        intro: "Six questions on components, state, hooks and forms.",
        questions: [
          {
            id: "m5-q1",
            prompt: "Which hook manages mutable data that triggers re-renders?",
            options: ["useEffect", "useState", "useParams", "useRef"],
            answerIndex: 1,
            explanation: "useState holds state; changing it re-renders the component.",
          },
          {
            id: "m5-q2",
            prompt: "With 'class' being a reserved word, what do you write in JSX?",
            options: ["class", "classname", "className", "css-class"],
            answerIndex: 2,
            explanation: "JSX uses className. This is one of the most common first bugs.",
          },
          {
            id: "m5-q3",
            prompt: "An empty dependency array [] in useEffect means the effect runs...",
            options: [
              "On every render",
              "Once, after the first render",
              "Never",
              "Only when the user clicks",
            ],
            answerIndex: 1,
            explanation: "[] = run once on mount, perfect for initial data fetching.",
          },
          {
            id: "m5-q4",
            prompt: "What should you use as the key when rendering a list of tasks?",
            options: [
              "The array index",
              "The task's unique _id",
              "The task's title",
              "A random number",
            ],
            answerIndex: 1,
            explanation:
              "Unique, stable ids like _id let React correctly track list items.",
          },
          {
            id: "m5-q5",
            prompt: "Why call e.preventDefault() in a form's submit handler?",
            options: [
              "To stop the input from focusing",
              "To stop the browser from reloading the page",
              "To clear the form",
              "To send data to the server",
            ],
            answerIndex: 1,
            explanation:
              "Without it the browser reloads and your state is lost.",
          },
          {
            id: "m5-q6",
            prompt: "Props passed to a component are...",
            options: [
              "Mutable and can be changed inside",
              "Read-only inputs from the parent",
              "Only strings",
              "Global variables",
            ],
            answerIndex: 1,
            explanation:
              "Props flow down and are read-only. Components communicate changes upward via callbacks.",
          },
        ],
        challenge: {
          prompt:
            "Build a `TodoItem` component that receives a `task` prop and a `onToggle` callback. Render a checkbox and the title; call onToggle(task) when the checkbox changes.",
          starterCode: `function TodoItem({ task, onToggle }) {
  // TODO
}

export default TodoItem;`,
          solution: `function TodoItem({ task, onToggle }) {
  return (
    <li>
      <input
        type="checkbox"
        checked={task.done}
        onChange={() => onToggle(task)}
      />
      <span style={{ textDecoration: task.done ? "line-through" : "none" }}>
        {task.title}
      </span>
    </li>
  );
}

export default TodoItem;`,
          explanation:
            "Children never mutate props — they call a parent-provided callback so the parent updates state.",
        },
      },
    },
  ],
  caseStudy: {
    title: "Case Study: Task Manager — the React UI",
    overview:
      "We build the frontend half of the Task Manager: components, state, forms and list rendering — all running against the Express API from Module 3.",
    requirements: [
      "Show the list of tasks from the API.",
      "Add a task through a controlled form.",
      "Toggle done, and delete tasks.",
      "Handle the loading and empty states.",
    ],
    steps: [
      {
        title: "Design the component tree",
        md: "Break the screen into small, single-responsibility components:",
        code: {
          lang: "text",
          title: "Component tree",
          code: `TaskManager
├── useTasks  (custom hook: data fetching + mutations)
├── AddTask   (controlled form)
├── TaskList  (renders items or the empty state)
│   └── TodoItem (checkbox + title + delete button)
└── StatusBar (counts open tasks)`,
        },
      },
      {
        title: "Put it together",
        code: {
          lang: "jsx",
          title: "TaskManager.jsx",
          code: `import { useState, useEffect } from "react";
import AddTask from "./AddTask";
import TaskList from "./TaskList";

export default function TaskManager() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/tasks")
      .then(r => r.json())
      .then(data => { setTasks(data); setLoading(false); });
  }, []);

  async function addTask(title) {
    const res = await fetch("/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, done: false }),
    });
    const created = await res.json();
    setTasks(prev => [...prev, created]);
  }

  return (
    <main>
      <h1>My Tasks</h1>
      <AddTask onAdd={addTask} />
      {loading ? <p>Loading…</p> : <TaskList tasks={tasks} />}
    </main>
  );
}`,
        },
      },
      {
        title: "Optimistic vs. after-response updates",
        md: "`setTasks(prev => [...prev, created])` waits for the server then adds the task. An **optimistic** UI would add it instantly and roll back on failure. Start with the simple version — then level up.",
      },
    ],
    takeaways: [
      "Component trees with clear responsibilities are far easier to test and reuse.",
      "Custom hooks (like useTasks) keep fetch logic out of the UI.",
      "Derive counts (open tasks) in render instead of storing them in state.",
    ],
  },
};
