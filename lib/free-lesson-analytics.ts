export type LessonEvent = {
  id: string;
  sessionId: string;
  kind: "visit" | "whatsapp";
  path: string;
  country: string;
  time: string;
};

export const lessonPaths = ["/en/free-lesson", "/en", "/en/contact"];

export function summarizeLessonEvents(events: LessonEvent[]) {
  const unique = [...new Map(events.map((event) => [event.id, event])).values()];
  const countries = new Map<string, { country: string; views: number; sessions: Set<string>; clicks: number }>();
  for (const event of unique) {
    const row = countries.get(event.country) ?? { country: event.country, views: 0, sessions: new Set<string>(), clicks: 0 };
    if (event.kind === "visit") {
      row.views++;
      row.sessions.add(event.sessionId);
    } else row.clicks++;
    countries.set(event.country, row);
  }
  return {
    countries: [...countries.values()].map(({ sessions, ...row }) => ({ ...row, sessions: sessions.size })).sort((a, b) => b.views - a.views),
    events: unique.sort((a, b) => b.time.localeCompare(a.time)),
  };
}
