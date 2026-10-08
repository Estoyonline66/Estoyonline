export type LessonEvent = {
  id: string;
  sessionId: string;
  kind: "visit" | "whatsapp";
  path: string;
  country: string;
  time: string;
  campaignId?: "cht";
};

export const lessonPaths = ["/en/free-lesson", "/en", "/en/contact"];

export type CampaignFilter = "all" | "cht" | "other";

export function summarizeLessonEvents(events: LessonEvent[], campaign: CampaignFilter = "all") {
  const unique = [...new Map(events.map((event) => [event.id, event])).values()].filter(event =>
    campaign === "all" || (campaign === "cht" ? event.campaignId === "cht" : event.campaignId !== "cht")
  );
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
