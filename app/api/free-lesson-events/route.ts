import { NextRequest, NextResponse } from "next/server";
import { Client } from "basic-ftp";
import { Readable, Writable } from "node:stream";
import { isCoursesAdmin } from "@/lib/courses-admin-auth";
import { visitorCountry } from "@/lib/visitor-country";
import { isTrackingPath, lessonPaths, summarizeLessonEvents, type LessonEvent } from "@/lib/free-lesson-analytics";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
const directory = "free-lesson-events";
const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const reportBatchSize = 10;

async function withFtp<T>(callback: (client: Client) => Promise<T>) {
  if (!process.env.FTP_HOST || !process.env.FTP_USER || !process.env.FTP_PASSWORD) throw new Error("FTP configuration missing");
  const client = new Client(15000);
  try {
    await client.access({
      host: process.env.FTP_HOST, user: process.env.FTP_USER, password: process.env.FTP_PASSWORD,
      port: Number(process.env.FTP_PORT || 21), secure: true,
      secureOptions: { rejectUnauthorized: false }, // Matches the existing FTP service configuration.
    });
    await client.ensureDir(directory);
    return await callback(client);
  } finally { client.close(); }
}

export async function POST(request: NextRequest) {
  if (request.headers.get("origin") !== request.nextUrl.origin) {
    return NextResponse.json({ error: "Invalid origin" }, { status: 403 });
  }
  let body;
  try {
    const raw = await request.text();
    if (raw.length > 1024) return NextResponse.json({ error: "Too large" }, { status: 413 });
    body = JSON.parse(raw);
  } catch { return NextResponse.json({ error: "Invalid JSON" }, { status: 400 }); }
  if (!body || !uuid.test(body.id ?? "") || !uuid.test(body.sessionId ?? "") ||
      !isTrackingPath(body.path) || !["visit", "whatsapp"].includes(body.kind) ||
      (body.campaignId !== undefined && body.campaignId !== "cht" && body.campaignId !== "tr") ||
      (body.campaignId !== "tr" && (!lessonPaths.includes(body.path) || (body.kind === "visit" && body.path !== "/en/free-lesson")))) {
    return NextResponse.json({ error: "Invalid event" }, { status: 400 });
  }
  const location = visitorCountry(request.headers);
  const event: LessonEvent = { id: body.id, sessionId: body.sessionId, kind: body.kind, path: body.path, ...location, time: new Date().toISOString(), ...(body.campaignId === "cht" || body.campaignId === "tr" ? { campaignId: body.campaignId } : {}) };
  try {
    await withFtp(async (client) => {
      // Independent files avoid read/modify/write races between visitors.
      const temporary = `${event.id}.pending`;
      await client.uploadFrom(Readable.from([JSON.stringify(event)]), temporary);
      await client.rename(temporary, `${event.id}.json`);
    });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Free lesson event storage failed", error);
    return NextResponse.json({ error: "Unable to save event" }, { status: 503 });
  }
}

export async function GET(request: NextRequest) {
  if (!isCoursesAdmin(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const cursor = request.nextUrl.searchParams.get("cursor");
  if (cursor && !uuid.test(cursor)) {
    return NextResponse.json({ error: "Invalid cursor" }, { status: 400 });
  }
  try {
    const result = await withFtp(async (client) => {
      const files = (await client.list())
        .filter((file) => file.name.endsWith(".json") && uuid.test(file.name.slice(0, -5)))
        .sort((a, b) => a.name < b.name ? -1 : a.name > b.name ? 1 : 0)
        .filter(file => !cursor || file.name > `${cursor}.json`);
      const batch = files.slice(0, reportBatchSize);
      const rows: LessonEvent[] = [];
      for (const file of batch) {
        const chunks: Buffer[] = [];
        await client.downloadTo(new Writable({ write(chunk, _encoding, done) { chunks.push(Buffer.from(chunk)); done(); } }), file.name);
        rows.push(JSON.parse(Buffer.concat(chunks).toString("utf8")) as LessonEvent);
      }
      return { events: rows, nextCursor: files.length > batch.length ? batch[batch.length - 1].name.slice(0, -5) : null };
    });
    return NextResponse.json({ ...summarizeLessonEvents(result.events), nextCursor: result.nextCursor }, { headers: { "Cache-Control": "private, no-store" } });
  } catch (error) {
    console.error("Free lesson report failed", error);
    return NextResponse.json({ error: "Unable to load Free Lesson logs" }, { status: 503 });
  }
}
