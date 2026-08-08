/**
 * mini-mongo.js
 * ----------------------------------------------------------------------
 * A tiny in-memory document database that mimics the MongoDB API surface
 * so this course can run without a real MongoDB server.
 *
 * In a real MERN project you would use `mongodb` / `mongoose` and connect
 * to MongoDB Atlas or a local instance. Every method here mirrors the
 * equivalent MongoDB driver call so the concepts you learn transfer 1:1.
 *
 * Learn more in lesson "MongoDB & Mongoose" in the client.
 */
import { randomUUID } from "node:crypto";

class MiniCollection {
  constructor(name, db) {
    this.name = name;
    this._db = db;
    this._docs = new Map();
    this._seq = 0;
  }

  async insertOne(doc) {
    const copy = { ...doc };
    copy._id = doc._id ?? randomUUID();
    this._seq += 1;
    copy.__seq = this._seq;
    this._docs.set(copy._id, copy);
    return { acknowledged: true, insertedId: copy._id };
  }

  async insertMany(docs) {
    for (const d of docs) await this.insertOne(d);
    return { acknowledged: true, insertedCount: docs.length };
  }

  async findOne(query = {}) {
    for (const doc of this._docs.values()) {
      if (matches(doc, query)) return { ...doc };
    }
    return null;
  }

  async find(query = {}) {
    const out = [];
    for (const doc of this._docs.values()) {
      if (matches(doc, query)) out.push({ ...doc });
    }
    return out;
  }

  async countDocuments(query = {}) {
    return (await this.find(query)).length;
  }

  async findById(id) {
    return this._docs.has(id) ? { ...this._docs.get(id) } : null;
  }

  async updateOne(query, update, options = {}) {
    let matched = null;
    for (const doc of this._docs.values()) {
      if (matches(doc, query)) {
        matched = doc;
        break;
      }
    }
    if (!matched) {
      if (options.upsert) {
        const base = { ...query };
        applyUpdate(base, update);
        await this.insertOne(base);
        return { matchedCount: 0, modifiedCount: 0, upsertedId: base._id };
      }
      return { matchedCount: 0, modifiedCount: 0, upsertedId: null };
    }
    applyUpdate(matched, update);
    return { matchedCount: 1, modifiedCount: 1, upsertedId: null };
  }

  async replaceOne(query, replacement) {
    let matched = null;
    for (const doc of this._docs.values()) {
      if (matches(doc, query)) {
        matched = doc;
        break;
      }
    }
    if (!matched) return { matchedCount: 0, modifiedCount: 0 };
    const id = matched._id;
    const copy = { ...replacement, _id: id, __seq: matched.__seq };
    this._docs.set(id, copy);
    return { matchedCount: 1, modifiedCount: 1 };
  }

  async deleteOne(query) {
    for (const [id, doc] of this._docs.entries()) {
      if (matches(doc, query)) {
        this._docs.delete(id);
        return { acknowledged: true, deletedCount: 1 };
      }
    }
    return { acknowledged: true, deletedCount: 0 };
  }

  async deleteMany(query = {}) {
    let count = 0;
    for (const [id, doc] of this._docs.entries()) {
      if (matches(doc, query)) {
        this._docs.delete(id);
        count += 1;
      }
    }
    return { acknowledged: true, deletedCount: count };
  }

  async distinct(field, query = {}) {
    const set = new Set();
    for (const doc of this._docs.values()) {
      if (matches(doc, query) && doc[field] !== undefined) set.add(doc[field]);
    }
    return [...set];
  }
}

function matches(doc, query) {
  return Object.entries(query).every(([key, expected]) => {
    if (expected && typeof expected === "object" && !Array.isArray(expected)) {
      if ("$gt" in expected) return doc[key] > expected.$gt;
      if ("$gte" in expected) return doc[key] >= expected.$gte;
      if ("$lt" in expected) return doc[key] < expected.$lt;
      if ("$lte" in expected) return doc[key] <= expected.$lte;
      if ("$ne" in expected) return doc[key] !== expected.$ne;
      if ("$in" in expected) return expected.$in.includes(doc[key]);
      if ("$nin" in expected) return !expected.$nin.includes(doc[key]);
      if ("$regex" in expected) {
        return new RegExp(expected.$regex, expected.$options ?? "").test(
          String(doc[key] ?? "")
        );
      }
    }
    return doc[key] === expected;
  });
}

function applyUpdate(doc, update) {
  if (update.$set) Object.assign(doc, update.$set);
  if (update.$inc) {
    for (const [k, v] of Object.entries(update.$inc)) {
      doc[k] = (doc[k] ?? 0) + v;
    }
  }
  if (update.$push) {
    for (const [k, v] of Object.entries(update.$push)) {
      if (!Array.isArray(doc[k])) doc[k] = [];
      doc[k].push(v);
    }
  }
  if (update.$pull) {
    for (const [k, v] of Object.entries(update.$pull)) {
      if (Array.isArray(doc[k])) doc[k] = doc[k].filter((x) => x !== v);
    }
  }
}

export class MiniMongo {
  constructor() {
    this._collections = new Map();
  }

  collection(name) {
    if (!this._collections.has(name)) {
      this._collections.set(name, new MiniCollection(name, this));
    }
    return this._collections.get(name);
  }

  /** Educational: return a "show dbs"-style listing. */
  async adminListDatabases() {
    return [...this._collections.keys()];
  }
}
