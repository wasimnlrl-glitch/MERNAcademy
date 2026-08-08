/**
 * Seed the demo database with sample data so the course API has
 * content to serve. Run with: npm run seed
 */
import { MiniMongo } from "../src/mini-mongo.js";

const db = new MiniMongo();

await db.collection("tasks").insertMany([
  { title: "Learn the MERN stack", done: false, priority: "high", dueDate: "2026-09-01" },
  { title: "Build the Task Manager capstone", done: false, priority: "high", dueDate: "2026-09-15" },
  { title: "Write a blog post about REST APIs", done: true, priority: "medium", dueDate: "2026-08-20" },
]);

const users = await db.collection("users").insertMany([
  { name: "Ada Lovelace", email: "ada@example.com", skills: ["JavaScript", "MongoDB", "React"] },
  { name: "Grace Hopper", email: "grace@example.com", skills: ["Node.js", "Express"] },
]);

console.log("Seeded collections:", await db.adminListDatabases());
console.log("Tasks:", (await db.collection("tasks").find({})).length);
console.log("Users:", (await db.collection("users").find({})).length);
console.log("First user:", await db.collection("users").findOne({ name: "Ada Lovelace" }));
