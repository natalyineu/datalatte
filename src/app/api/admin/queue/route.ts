import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const QUEUE_PATH = path.join(process.cwd(), "content/queue.json");

interface QueueEntry {
  slug: string;
  title: string;
  primaryKeyword: string;
  cluster: string;
  targetWords: number;
  status: "pending" | "generating" | "generated" | "published";
  generatedDate: string | null;
  addedDate: string;
}

interface QueueFile {
  _schema: Record<string, string>;
  queue: QueueEntry[];
}

function readQueue(): QueueFile {
  const raw = fs.readFileSync(QUEUE_PATH, "utf8");
  return JSON.parse(raw) as QueueFile;
}

function writeQueue(data: QueueFile): void {
  fs.writeFileSync(QUEUE_PATH, JSON.stringify(data, null, 2) + "\n", "utf8");
}

// ── GET /api/admin/queue ─────────────────────────────────────────────────────
export async function GET(): Promise<NextResponse> {
  try {
    const data = readQueue();
    return NextResponse.json(
      { queue: data.queue, total: data.queue.length },
      { status: 200 }
    );
  } catch (err) {
    console.error("Queue read error:", err);
    return NextResponse.json({ error: "Failed to read queue" }, { status: 500 });
  }
}

// ── POST /api/admin/queue ────────────────────────────────────────────────────
export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const body = await req.json();

    // Validate required fields
    const required = ["slug", "title", "primaryKeyword", "cluster", "targetWords"] as const;
    const missing = required.filter((f) => body[f] === undefined || body[f] === "");
    if (missing.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missing.join(", ")}` },
        { status: 400 }
      );
    }

    // Validate slug format
    if (!/^[a-z0-9-]+$/.test(body.slug)) {
      return NextResponse.json(
        { error: "slug must be lowercase letters, numbers, and hyphens only" },
        { status: 400 }
      );
    }

    // Validate targetWords
    const targetWords = Number(body.targetWords);
    if (isNaN(targetWords) || targetWords < 100 || targetWords > 10000) {
      return NextResponse.json(
        { error: "targetWords must be a number between 100 and 10000" },
        { status: 400 }
      );
    }

    const data = readQueue();

    // Check for duplicate slug
    const exists = data.queue.some((entry) => entry.slug === body.slug);
    if (exists) {
      return NextResponse.json(
        { error: `Entry with slug "${body.slug}" already exists in queue` },
        { status: 409 }
      );
    }

    const newEntry: QueueEntry = {
      slug: body.slug,
      title: body.title,
      primaryKeyword: body.primaryKeyword,
      cluster: body.cluster,
      targetWords,
      status: "pending",
      generatedDate: null,
      addedDate: new Date().toISOString(),
    };

    data.queue.push(newEntry);
    writeQueue(data);

    return NextResponse.json(
      { entry: newEntry, queue: data.queue, total: data.queue.length },
      { status: 201 }
    );
  } catch (err) {
    console.error("Queue write error:", err);
    return NextResponse.json({ error: "Failed to update queue" }, { status: 500 });
  }
}

// ── PATCH /api/admin/queue ───────────────────────────────────────────────────
// Update status of an existing entry (e.g. pending → generated → published)
export async function PATCH(req: NextRequest): Promise<NextResponse> {
  try {
    const body = await req.json();

    if (!body.slug) {
      return NextResponse.json({ error: "slug is required" }, { status: 400 });
    }

    const validStatuses = ["pending", "generating", "generated", "published"];
    if (body.status && !validStatuses.includes(body.status)) {
      return NextResponse.json(
        { error: `status must be one of: ${validStatuses.join(", ")}` },
        { status: 400 }
      );
    }

    const data = readQueue();
    const index = data.queue.findIndex((e) => e.slug === body.slug);

    if (index === -1) {
      return NextResponse.json(
        { error: `Entry with slug "${body.slug}" not found` },
        { status: 404 }
      );
    }

    const entry = data.queue[index];
    if (body.status) entry.status = body.status;
    if (body.status === "generated" && !entry.generatedDate) {
      entry.generatedDate = new Date().toISOString();
    }

    // Field editing support
    if (body.title !== undefined) entry.title = body.title;
    if (body.primaryKeyword !== undefined) entry.primaryKeyword = body.primaryKeyword;
    if (body.cluster !== undefined) entry.cluster = body.cluster;
    if (body.targetWords !== undefined) entry.targetWords = Number(body.targetWords);

    // Reorder: move entry before first pending item
    if (body.moveToTop === true) {
      data.queue.splice(index, 1);
      const firstPendingIdx = data.queue.findIndex((e) => e.status === "pending");
      if (firstPendingIdx === -1) data.queue.push(entry);
      else data.queue.splice(firstPendingIdx, 0, entry);
      writeQueue(data);
      return NextResponse.json({ entry, queue: data.queue }, { status: 200 });
    }

    data.queue[index] = entry;
    writeQueue(data);

    return NextResponse.json({ entry, queue: data.queue }, { status: 200 });
  } catch (err) {
    console.error("Queue patch error:", err);
    return NextResponse.json({ error: "Failed to update entry" }, { status: 500 });
  }
}

// ── DELETE /api/admin/queue ──────────────────────────────────────────────────
// Remove an entry from the queue by slug
export async function DELETE(req: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get("slug");

    if (!slug) {
      return NextResponse.json({ error: "slug query param is required" }, { status: 400 });
    }

    const data = readQueue();
    const before = data.queue.length;
    data.queue = data.queue.filter((e) => e.slug !== slug);

    if (data.queue.length === before) {
      return NextResponse.json({ error: `Entry "${slug}" not found` }, { status: 404 });
    }

    writeQueue(data);
    return NextResponse.json(
      { removed: slug, queue: data.queue, total: data.queue.length },
      { status: 200 }
    );
  } catch (err) {
    console.error("Queue delete error:", err);
    return NextResponse.json({ error: "Failed to delete entry" }, { status: 500 });
  }
}
