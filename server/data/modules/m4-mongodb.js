export default {
  id: "m4",
  order: 4,
  title: "MongoDB & Mongoose",
  subtitle: "Store and query data as flexible JSON documents.",
  icon: "🍃",
  tagline: "Your data, documents, and queries",
  lessons: [
    {
      id: "m4-l1",
      title: "Documents, Collections & Databases",
      duration: "10 min",
      summary:
        "MongoDB stores data in documents instead of tables and rows.",
      sections: [
        {
          type: "p",
          md: "MongoDB is a **NoSQL document database**. Instead of tables with fixed columns, data lives in **documents** (JSON-like objects) grouped into **collections**, which live in a **database**.",
        },
        {
          type: "table",
          headers: ["SQL (relational)", "MongoDB"],
          rows: [
            ["database", "database"],
            ["table", "collection"],
            ["row", "document"],
            ["column", "field"],
            ["primary key", "_id"],
            ["JOIN", "references + populate"],
          ],
        },
        {
          type: "code",
          lang: "js",
          title: "A user document",
          code: `{
  "_id": "6653f0c1a1b2c3d4e5f6a7b8",
  "name": "Ada Lovelace",
  "email": "ada@example.com",
  "age": 36,
  "skills": ["JavaScript", "MongoDB", "React"],
  "address": { "city": "London", "country": "UK" },
  "createdAt": "2026-08-08T10:00:00.000Z"
}`,
        },
        {
          type: "p",
          md: "Every document gets a unique **`_id`** field — MongoDB creates an ObjectId automatically if you don't provide one.",
        },
        {
          type: "tip",
          md: "**Flexibility is the superpower.** Two documents in the same collection can have different fields. That makes MongoDB a great fit for agile projects where the schema evolves quickly.",
        },
      ],
    },
    {
      id: "m4-l2",
      title: "CRUD Operations",
      duration: "14 min",
      summary: "Create, read, update and delete documents with the driver.",
      sections: [
        {
          type: "p",
          md: "The MongoDB Node.js driver lets you query the database from Express. The course backend ships a **mini in-memory clone** with the exact same method names, so every example below runs in this project's API.",
        },
        {
          type: "code",
          lang: "js",
          title: "CRUD with the driver",
          code: `import { MongoClient } from "mongodb";

const client = new MongoClient(process.env.MONGO_URI);
await client.connect();
const db = client.db("taskmanager");
const tasks = db.collection("tasks");

// CREATE
await tasks.insertOne({ title: "Learn MongoDB", done: false });

// READ all (toArray converts the cursor to an array)
const all = await tasks.find({}).toArray();

// READ with a filter + sort
const openTasks = await tasks
  .find({ done: false })
  .sort({ createdAt: -1 })
  .toArray();

// UPDATE (set fields on matching document)
await tasks.updateOne(
  { _id: someId },
  { $set: { done: true } }
);

// DELETE
await tasks.deleteOne({ _id: someId });`,
        },
        {
          type: "table",
          headers: ["Operator", "Purpose", "Example"],
          rows: [
            ["$set", "Set fields", "{ $set: { done: true } }"],
            ["$inc", "Increment a number", "{ $inc: { count: 1 } }"],
            ["$push", "Add to an array", "{ $push: { tags: 'urgent' } }"],
            ["$gt / $lt", "Greater than / less than", "{ age: { $gt: 21 } }"],
            ["$in", "Match any of a list", "{ status: { $in: ['open','pending'] } }"],
            ["$regex", "Pattern match", "{ title: { $regex: /mongo/i } }"],
          ],
        },
        {
          type: "tip",
          md: "The `_id` in MongoDB is an **ObjectId**, not a plain string. When you receive an id from the URL, convert it with `new ObjectId(id)` before querying.",
        },
      ],
    },
    {
      id: "m4-l3",
      title: "Mongoose Schemas & Models",
      duration: "14 min",
      summary:
        "Mongoose adds structure, validation and typing on top of the raw driver.",
      sections: [
        {
          type: "p",
          md: "**Mongoose** is an ODM (Object Document Mapper). It defines the shape of documents with a **Schema**, adds **validation**, and gives you a **Model** — a constructor with built-in methods like `.find()`, `.save()`, `.remove()`.",
        },
        {
          type: "code",
          lang: "js",
          title: "Define a Schema and Model",
          code: `import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    done: { type: Boolean, default: false },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
    dueDate: { type: Date, default: null },
  },
  { timestamps: true } // adds createdAt & updatedAt automatically
);

const Task = mongoose.model("Task", taskSchema);

export default Task;`,
        },
        {
          type: "code",
          lang: "js",
          title: "Using the Model in a route",
          code: `import Task from "./models/Task.js";

// CREATE — validation happens automatically
const task = await Task.create({ title: "Finish course", priority: "high" });

// READ with a filter
const openTasks = await Task.find({ done: false }).sort({ createdAt: -1 });

// UPDATE by id
await Task.findByIdAndUpdate(id, { done: true }, { new: true });

// DELETE
await Task.findByIdAndDelete(id);

// Validation errors look like this:
// { errors: { title: { message: 'Path \`title\` is required.' } } }`,
        },
        {
          type: "table",
          headers: ["Schema type", "Validates", "Example"],
          rows: [
            ["String", "Text values", "type: String, required: true"],
            ["Number", "Numbers", "type: Number, min: 0"],
            ["Boolean", "true/false", "type: Boolean, default: false"],
            ["Date", "Dates", "type: Date"],
            ["[String]", "Array of strings", "type: [String]"],
            ["ObjectId", "Reference to another doc", "type: Schema.Types.ObjectId"],
          ],
        },
        {
          type: "tip",
          md: "Mongoose runs validation on `save()` and the `create()` helper. Invalid documents are **rejected with useful error objects** — catch them in your route and return 400.",
        },
      ],
    },
    {
      id: "m4-l4",
      title: "Relations & Populate",
      duration: "12 min",
      summary: "Model relationships between documents and join them at query time.",
      sections: [
        {
          type: "p",
          md: "MongoDB documents can nest data directly, but for data that grows (posts on a blog, tasks on a project) you usually store a **reference** — the id of the related document — and join it with Mongoose `populate()`.",
        },
        {
          type: "code",
          lang: "js",
          title: "One-to-many with references",
          code: `const userSchema = new mongoose.Schema({ name: String });

const postSchema = new mongoose.Schema({
  title: String,
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

const Post = mongoose.model("Post", postSchema);

// Save a post referencing a user
const post = await Post.create({
  title: "Hello MERN",
  author: user._id,          // reference, not a nested object
});

// Fetch the post WITH the author filled in
const withAuthor = await Post.findById(post._id).populate("author");
// => { title: 'Hello MERN', author: { _id: ..., name: 'Ada' } }`,
        },
        {
          type: "p",
          md: "`populate()` performs a lookup across collections — MongoDB's answer to a SQL `JOIN`. It keeps data normalized (no duplication) while still letting you query it in one call.",
        },
        {
          type: "warn",
          md: "**No cascade deletes by default.** If you delete a user, their posts still reference a missing id and `populate` returns `null`. Decide how to handle orphans in your design.",
        },
      ],
    },
    {
      id: "m4-l5",
      title: "Module 4 Quiz",
      duration: "5 min",
      type: "exercise",
      summary: "Test your MongoDB and Mongoose knowledge.",
      exercise: {
        intro: "Five questions on documents, CRUD and Mongoose.",
        questions: [
          {
            id: "m4-q1",
            prompt: "In MongoDB, a 'collection' is closest to which SQL concept?",
            options: ["A row", "A table", "A database", "A foreign key"],
            answerIndex: 1,
            explanation: "Collections group documents the way tables group rows.",
          },
          {
            id: "m4-q2",
            prompt: "Which MongoDB operator sets specific fields on a document?",
            options: ["$push", "$set", "$inc", "$gt"],
            answerIndex: 1,
            explanation: "$set updates chosen fields. $push adds to an array, $inc increments, $gt is a comparison.",
          },
          {
            id: "m4-q3",
            prompt: "What does mongoose's populate() do?",
            options: [
              "Copies a database",
              "Joins related documents by their references",
              "Deletes empty documents",
              "Creates indexes automatically",
            ],
            answerIndex: 1,
            explanation:
              "populate() replaces a stored ObjectId reference with the full related document.",
          },
          {
            id: "m4-q4",
            prompt: "A schema field defined as { type: String, required: true } will...",
            options: [
              "Always be trimmed",
              "Reject documents without a title on save",
              "Create a unique index",
              "Convert the value to lowercase",
            ],
            answerIndex: 1,
            explanation: "required: true makes validation fail if the field is missing.",
          },
          {
            id: "m4-q5",
            prompt: "Mongoose timestamps: true adds which fields automatically?",
            options: [
              "createdAt and updatedAt",
              "id and version",
              "createdBy and editedBy",
              "start and end",
            ],
            answerIndex: 0,
            explanation: "timestamps: true manages createdAt and updatedAt for you.",
          },
        ],
        challenge: {
          prompt:
            "Write a Mongoose schema for a `Product` with: a required name (string), a price (number, min 0), a tags array of strings, and timestamps enabled. Then create one product with name 'Course' and price 29.",
          starterCode: `import mongoose from "mongoose";

// TODO: define productSchema, then model, then create one product
`,
          solution: `const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, min: 0, required: true },
    tags: { type: [String], default: [] },
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);

const product = await Product.create({ name: "Course", price: 29 });
console.log(product);`,
          explanation:
            "Schemas define shape + validation; Models turn schemas into usable constructors; create() validates and saves in one step.",
        },
      },
    },
  ],
  caseStudy: {
    title: "Case Study: Designing the Task Manager Data Model",
    overview:
      "We design the MongoDB data model for the Task Manager and apply Mongoose-style schemas, plus look at how the course backend's mini store keeps the API testable without a database.",
    requirements: [
      "Tasks must validate a title and a priority level.",
      "Track when each task was created and updated.",
      "Support filtering open vs. completed tasks efficiently.",
      "Keep the course demo runnable without installing MongoDB.",
    ],
    steps: [
      {
        title: "Design the Task schema",
        code: {
          lang: "js",
          title: "Task schema",
          code: `const taskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    done: { type: Boolean, default: false },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
    dueDate: { type: Date, default: null },
  },
  { timestamps: true }
);

// Index for the common "open tasks" query
taskSchema.index({ done: 1, createdAt: -1 });`,
        },
      },
      {
        title: "Why an in-memory store for a course?",
        md: "Real MERN projects connect to MongoDB Atlas. But a course needs every example to run instantly with zero setup. That's why the backend includes **mini-mongo.js** — it replicates the driver API (`find`, `insertOne`, `updateOne`, `$set`...) so the skills transfer directly to the real thing.",
      },
      {
        title: "Swap in the real database later",
        md: "Because the route layer only depends on a collection-like interface, upgrading to a real MongoDB is a one-line change:",
        code: {
          lang: "js",
          title: "The swap",
          code: `// Course: in-memory store
import { db } from "./mini-store.js";
const tasks = db.collection("tasks");

// Production: MongoDB Atlas
import { MongoClient } from "mongodb";
const client = new MongoClient(process.env.MONGO_URI);
const tasks = client.db("app").collection("tasks");

// Both expose find / insertOne / updateOne / deleteOne — routes don't change.`,
        },
      },
    ],
    takeaways: [
      "Schema design comes before code — enum constraints prevent bad data.",
      "Indexes make the most common queries fast.",
      "Abstract your data layer behind a stable interface so it's swappable.",
    ],
  },
};
