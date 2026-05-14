/**
 * scripts/test-queue.mjs
 * Tests the queue.json data layer without running the dev server.
 * Run: node scripts/test-queue.mjs
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const QUEUE_PATH = path.join(__dirname, "../content/queue.json");

// ── Helpers ─────────────────────────────────────────────────────────────────

function readQueue() {
  const raw = fs.readFileSync(QUEUE_PATH, "utf8");
  return JSON.parse(raw);
}

function writeQueue(data) {
  fs.writeFileSync(QUEUE_PATH, JSON.stringify(data, null, 2) + "\n", "utf8");
}

function addEntry(data, entry) {
  const required = ["slug", "title", "primaryKeyword", "cluster", "targetWords"];
  const missing = required.filter((f) => !entry[f] && entry[f] !== 0);
  if (missing.length > 0) throw new Error(`Missing fields: ${missing.join(", ")}`);
  if (!/^[a-z0-9-]+$/.test(entry.slug)) throw new Error("Invalid slug format");
  if (data.queue.some((e) => e.slug === entry.slug)) throw new Error(`Slug "${entry.slug}" already exists`);

  const newEntry = {
    slug: entry.slug,
    title: entry.title,
    primaryKeyword: entry.primaryKeyword,
    cluster: entry.cluster,
    targetWords: Number(entry.targetWords),
    status: "pending",
    generatedDate: null,
    addedDate: new Date().toISOString(),
  };
  data.queue.push(newEntry);
  return newEntry;
}

function updateStatus(data, slug, status) {
  const idx = data.queue.findIndex((e) => e.slug === slug);
  if (idx === -1) throw new Error(`Slug "${slug}" not found`);
  data.queue[idx].status = status;
  if (status === "generated") data.queue[idx].generatedDate = new Date().toISOString();
  return data.queue[idx];
}

function removeEntry(data, slug) {
  const before = data.queue.length;
  data.queue = data.queue.filter((e) => e.slug !== slug);
  if (data.queue.length === before) throw new Error(`Slug "${slug}" not found`);
}

// ── Test runner ──────────────────────────────────────────────────────────────

let passed = 0;
let failed = 0;

function test(name, fn) {
  try {
    fn();
    console.log(`  ✅ ${name}`);
    passed++;
  } catch (err) {
    console.error(`  ❌ ${name}: ${err.message}`);
    failed++;
  }
}

// ── Snapshot & restore ───────────────────────────────────────────────────────

const snapshot = fs.readFileSync(QUEUE_PATH, "utf8");

function restore() {
  fs.writeFileSync(QUEUE_PATH, snapshot, "utf8");
}

// ── Tests ────────────────────────────────────────────────────────────────────

console.log("\n🧪  DataLatte Queue Tests\n");

// 1. Read
console.log("1. Read queue");
test("reads queue.json without error", () => {
  const data = readQueue();
  if (!Array.isArray(data.queue)) throw new Error("queue is not an array");
  console.log(`     → ${data.queue.length} items in queue`);
});

// 2. Add entry
console.log("\n2. Add entry");
const testSlug = "test-email-marketing-for-coffee-shops";

test("adds a valid entry", () => {
  const data = readQueue();
  const entry = addEntry(data, {
    slug: testSlug,
    title: "Email Marketing for Coffee Shops: Build 1,000 Loyal Regulars in 90 Days",
    primaryKeyword: "email marketing for coffee shops",
    cluster: "Cluster 7 — Email Marketing for Coffee Shops",
    targetWords: 1800,
  });
  writeQueue(data);
  if (entry.status !== "pending") throw new Error("status should be pending");
  if (entry.generatedDate !== null) throw new Error("generatedDate should be null");
});

test("rejects duplicate slug", () => {
  const data = readQueue();
  let threw = false;
  try {
    addEntry(data, {
      slug: testSlug,
      title: "Duplicate",
      primaryKeyword: "dupe",
      cluster: "test",
      targetWords: 1000,
    });
  } catch {
    threw = true;
  }
  if (!threw) throw new Error("should have thrown for duplicate slug");
});

test("rejects invalid slug format", () => {
  const data = readQueue();
  let threw = false;
  try {
    addEntry(data, {
      slug: "Invalid Slug With Spaces!",
      title: "Test",
      primaryKeyword: "test",
      cluster: "test",
      targetWords: 1000,
    });
  } catch {
    threw = true;
  }
  if (!threw) throw new Error("should have thrown for invalid slug");
});

test("rejects missing required field", () => {
  const data = readQueue();
  let threw = false;
  try {
    addEntry(data, { slug: "no-title", primaryKeyword: "x", cluster: "y", targetWords: 1000 });
  } catch {
    threw = true;
  }
  if (!threw) throw new Error("should have thrown for missing title");
});

// 3. Update status
console.log("\n3. Update status");

test("updates status to generated", () => {
  const data = readQueue();
  const updated = updateStatus(data, testSlug, "generated");
  writeQueue(data);
  if (updated.status !== "generated") throw new Error("status not updated");
  if (!updated.generatedDate) throw new Error("generatedDate should be set");
});

test("updates status to published", () => {
  const data = readQueue();
  updateStatus(data, testSlug, "published");
  writeQueue(data);
  const check = readQueue();
  const entry = check.queue.find((e) => e.slug === testSlug);
  if (!entry || entry.status !== "published") throw new Error("status not published");
});

test("throws for unknown slug", () => {
  const data = readQueue();
  let threw = false;
  try { updateStatus(data, "non-existent-slug", "generated"); } catch { threw = true; }
  if (!threw) throw new Error("should throw for unknown slug");
});

// 4. Remove entry
console.log("\n4. Remove entry");

test("removes entry by slug", () => {
  const data = readQueue();
  removeEntry(data, testSlug);
  writeQueue(data);
  const check = readQueue();
  if (check.queue.find((e) => e.slug === testSlug)) throw new Error("entry not removed");
});

test("throws for removing non-existent slug", () => {
  const data = readQueue();
  let threw = false;
  try { removeEntry(data, "does-not-exist"); } catch { threw = true; }
  if (!threw) throw new Error("should throw for non-existent slug");
});

// ── Final state ──────────────────────────────────────────────────────────────

restore();
console.log("\n5. Restore");
test("queue.json restored to original state", () => {
  const data = readQueue();
  const current = JSON.stringify(data);
  const original = JSON.parse(snapshot);
  if (JSON.stringify(original) !== current) throw new Error("restore mismatch");
});

// ── Summary ──────────────────────────────────────────────────────────────────

console.log(`\n${"─".repeat(40)}`);
console.log(`Results: ${passed} passed, ${failed} failed`);
if (failed > 0) {
  console.error("Some tests failed — check errors above.");
  process.exit(1);
} else {
  console.log("All tests passed ✅");
}
