import { dictionaries, type Locale } from "@/lib/i18n";

export interface CourseCard {
  title: string;
  bold: string;
  lesson: string;
  time: string;
  week: string;
  month: string;
}

const scheduleUrl = "https://iwvrsly8ro5bi96g.public.blob.vercel-storage.com/courses/courses-data.json";

export async function getCourseSchedule(locale: Locale): Promise<CourseCard[]> {
  try {
    const response = await fetch(scheduleUrl, {
      cache: "no-store", signal: AbortSignal.timeout(5000),
    });
    if (!response.ok) throw new Error(`Course schedule: HTTP ${response.status}`);
    const data = await response.json();
    const cards: unknown = locale === "en" ? data.cardCoursesEn : data.cardCoursesTr;
    if (!Array.isArray(cards) || !cards.every((card) =>
      card && ["title", "bold", "lesson", "time", "week", "month"].every((key) => typeof card[key] === "string")
    )) throw new Error("Invalid course schedule");
    // Match the existing browser formatting exactly.
    return (cards as CourseCard[]).map((card) => ({
      ...card,
      month: card.month.replace(/\s+\d{4}$/, "").trim(),
      week: locale === "tr" ? card.week.replace(/(Haftada\s+\d+\s+gün).*/, "$1").trim() : card.week,
    }));
  } catch {
    // Preserve the existing localized fallback when the public feed is down.
    // The browser still retries using its existing refresh logic.
    return dictionaries[locale].courses.cardCourses;
  }
}
