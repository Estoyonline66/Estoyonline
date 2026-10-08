"use client";

import { useCallback, useEffect, useState } from "react";
import { summarizeLessonEvents } from "@/lib/free-lesson-analytics";
import { Button } from "@/components/ui/button";

type Report = ReturnType<typeof summarizeLessonEvents>;
const countryNames = new Intl.DisplayNames(["en"], { type: "region" });
const countryName = (code: string) => code === "Unknown" ? "Unknown" : countryNames.of(code) || code;
const dateFormat = new Intl.DateTimeFormat("en-GB", { timeZone: "Europe/Paris", dateStyle: "medium", timeStyle: "medium" });

export default function FreeLessonReport({ password }: { password: string }) {
  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/free-lesson-events", { cache: "no-store", headers: { Authorization: `Bearer ${password}` } });
      if (!response.ok) throw new Error(response.status === 401 ? "Please sign in again to view this report." : "Unable to load Free Lesson logs. Please try again.");
      setReport(await response.json());
    } catch (err) { setError(err instanceof Error ? err.message : "Unable to load logs."); }
    finally { setLoading(false); }
  }, [password]);
  useEffect(() => { void load(); }, [load]);

  return <section className="mb-8 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
    <div className="mb-4 flex items-center justify-between gap-4 border-b pb-3">
      <h2 className="text-xl font-bold">Free Lesson — visits &amp; WhatsApp clicks</h2>
      <Button size="sm" variant="outline" onClick={() => void load()} disabled={loading}>{loading ? "Loading…" : "Refresh"}</Button>
    </div>
    <p className="mb-4 text-sm text-gray-600">Every Free Lesson page view is counted, including reloads. WhatsApp clicks are linked to the same browser-tab session after visiting Free Lesson. Times: Europe/Paris. Country is approximate; unavailable locations appear as Unknown. Clicks do not confirm a message was sent.</p>
    {error && <p role="alert" className="mb-4 text-red-600">{error}</p>}
    {report && <>
      <p className="mb-4 font-semibold">Page views: {report.events.filter(e => e.kind === "visit").length} · Sessions: {new Set(report.events.filter(e => e.kind === "visit").map(e => e.sessionId)).size} · WhatsApp clicks: {report.events.filter(e => e.kind === "whatsapp").length}</p>
      {report.events.length === 0 ? <p>No Free Lesson records yet.</p> : <>
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
            <thead><tr className="border-b"><th className="p-2">Time (Europe/Paris)</th><th className="p-2">Country</th><th className="p-2">Event</th><th className="p-2">Page</th><th className="p-2">Session</th></tr></thead>
            <tbody>{report.events.map(event => <tr className="border-b" key={event.id}>
              <td className="whitespace-nowrap p-2">{dateFormat.format(new Date(event.time))}</td><td className="p-2">{countryName(event.country)}</td><td className="p-2">{event.kind === "visit" ? "Page view" : "WhatsApp click"}</td><td className="p-2">{event.path}</td><td className="break-all p-2 font-mono text-xs">{event.sessionId}</td>
            </tr>)}</tbody>
          </table>
        </div>
      </>}
    </>}
  </section>;
}
