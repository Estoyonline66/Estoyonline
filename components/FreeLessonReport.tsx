"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { summarizeLessonEvents, type CampaignFilter, type LessonEvent } from "@/lib/free-lesson-analytics";
import { Button } from "@/components/ui/button";

type Report = ReturnType<typeof summarizeLessonEvents>;
const countryNames = new Intl.DisplayNames(["en"], { type: "region" });
const countryName = (code: string) => code === "Unknown" ? "Unknown" : countryNames.of(code) || code;
const dateFormat = new Intl.DateTimeFormat("en-GB", { timeZone: "Europe/Paris", dateStyle: "medium", timeStyle: "medium" });

export default function FreeLessonReport({ password }: { password: string }) {
  const [loadedReport, setReport] = useState<Report | null>(null);
  const [campaignFilter, setCampaignFilter] = useState<CampaignFilter>("all");
  const report = loadedReport ? summarizeLessonEvents(loadedReport.events, campaignFilter) : null;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [loadedCount, setLoadedCount] = useState(0);
  const activeRequest = useRef<AbortController | null>(null);
  const load = useCallback(async () => {
    activeRequest.current?.abort();
    const controller = new AbortController();
    activeRequest.current = controller;
    setLoading(true);
    setLoadedCount(0);
    setError("");
    try {
      const events: LessonEvent[] = [];
      let cursor: string | null = null;
      const cursors = new Set<string>();
      do {
        const url: string = `/api/free-lesson-events${cursor ? `?cursor=${encodeURIComponent(cursor)}` : ""}`;
        const response = await fetch(url, { cache: "no-store", signal: controller.signal, headers: { Authorization: `Bearer ${password}` } });
        if (!response.ok) throw new Error(response.status === 401 ? "Please sign in again to view this report." : `Unable to load logs (HTTP ${response.status}). Please try again.`);
        const page: Report & { nextCursor?: string | null } = await response.json();
        events.push(...page.events);
        setLoadedCount(events.length);
        cursor = page.nextCursor ?? null;
        if (cursor && cursors.has(cursor)) throw new Error("Unable to continue loading logs. Please refresh.");
        if (cursor) cursors.add(cursor);
      } while (cursor);
      setReport(summarizeLessonEvents(events));
    } catch (err) { if (!controller.signal.aborted) setError(err instanceof Error ? err.message : "Unable to load logs."); }
    finally { if (activeRequest.current === controller) setLoading(false); }
  }, [password]);
  useEffect(() => { void load(); return () => activeRequest.current?.abort(); }, [load]);

  return <section className="mb-8 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
    <div className="mb-4 flex items-center justify-between gap-4 border-b pb-3">
      <h2 className="text-xl font-bold">Campaigns &amp; Free Lesson — visits &amp; WhatsApp clicks</h2>
      <Button size="sm" variant="outline" onClick={() => void load()} disabled={loading}>{loading ? "Loading…" : "Refresh"}</Button>
    </div>
    <p className="mb-4 text-sm text-gray-600">Counts include Free Lesson views and arrivals on any page with campaign_id=tr, including reloads. TR campaign visitors’ WhatsApp clicks are tracked on any page in the same browser-tab session. The latest explicit campaign landing determines subsequent click attribution. Times: Europe/Paris. Country is approximate; unavailable locations appear as Unknown. Clicks do not confirm a message was sent.</p>
    {error && <p role="alert" className="mb-4 text-red-600">{error}</p>}
    {loading && <p role="status" className="mb-4 text-sm">Loading logs… {loadedCount} records received. Totals update when loading finishes.</p>}
    <label className="mb-4 flex flex-wrap items-center gap-3 text-sm font-semibold">
      Campaign
      <select className="rounded-md border border-gray-300 bg-white p-2" value={campaignFilter} onChange={event => setCampaignFilter(event.target.value as CampaignFilter)}>
        <option value="all">All visits</option>
        <option value="cht">campaign_id=cht</option>
        <option value="tr">campaign_id=tr</option>
        <option value="other">No campaign / older records</option>
      </select>
    </label>
    {report && <>
      <p className="mb-4 font-semibold">Page views: {report.events.filter(e => e.kind === "visit").length} · Sessions: {new Set(report.events.filter(e => e.kind === "visit").map(e => e.sessionId)).size} · WhatsApp clicks: {report.events.filter(e => e.kind === "whatsapp").length}</p>
      {report.events.length === 0 ? <p>No records match this filter.</p> : <>
        <div className="mb-6 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <caption className="mb-2 text-left font-semibold">Visits by country</caption>
            <thead><tr className="border-b"><th className="p-2">Country</th><th className="p-2">Page views</th><th className="p-2">Sessions</th><th className="p-2">WhatsApp clicks</th></tr></thead>
            <tbody>{report.countries.map(row => <tr className="border-b" key={row.country}><td className="p-2">{countryName(row.country)}</td><td className="p-2">{row.views}</td><td className="p-2">{row.sessions}</td><td className="p-2">{row.clicks}</td></tr>)}</tbody>
          </table>
        </div>
        <div className="max-h-[600px] overflow-auto">
          <table className="w-full text-left text-sm">
            <caption className="mb-2 text-left font-semibold">Visit and click log — newest first</caption>
            <thead><tr className="border-b"><th className="p-2">Time (Europe/Paris)</th><th className="p-2">Country</th><th className="p-2">Event</th><th className="p-2">Page</th><th className="p-2">Campaign</th><th className="p-2">Session</th></tr></thead>
            <tbody>{report.events.map(event => <tr className="border-b" key={event.id}>
              <td className="whitespace-nowrap p-2">{dateFormat.format(new Date(event.time))}</td><td className="p-2">{countryName(event.country)}</td><td className="p-2">{event.kind === "visit" ? "Page view" : "WhatsApp click"}</td><td className="p-2">{event.path}</td><td className="p-2">{event.campaignId || "—"}</td><td className="break-all p-2 font-mono text-xs">{event.sessionId}</td>
            </tr>)}</tbody>
          </table>
        </div>
      </>}
    </>}
  </section>;
}
