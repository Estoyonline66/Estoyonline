"use client";

import { useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { isTrackingPath, lessonPaths, type LessonEvent } from "@/lib/free-lesson-analytics";

const sessionKey = "eo_free_lesson_session";
const campaignKey = "eo_free_lesson_campaign";

export default function FreeLessonTracker() {
  const pathname = usePathname();
  const campaignFromUrl = useSearchParams().get("campaign_id");
  const previousPath = useRef<string | null>(null);
  const session = useRef<string | null>(null);
  const campaign = useRef<LessonEvent["campaignId"]>(undefined);

  useEffect(() => {
    const path = pathname.replace(/\/$/, "") || "/";
    try { session.current = sessionStorage.getItem(sessionKey) ?? session.current; } catch { /* In-memory tracking if storage is blocked. */ }
    if (session.current) {
      try {
        const saved = sessionStorage.getItem(campaignKey);
        if (saved === "cht" || saved === "tr") campaign.current = saved;
      } catch { /* Storage is optional. */ }
    }
    if ((path === "/en/free-lesson" || campaignFromUrl === "tr") && !session.current) {
      session.current = crypto.randomUUID();
      try { sessionStorage.setItem(sessionKey, session.current); } catch { /* Storage is optional. */ }
    }
    if (campaignFromUrl === "tr" || (path === "/en/free-lesson" && campaignFromUrl === "cht")) {
      // The latest explicit campaign landing owns subsequent clicks, not earlier events.
      campaign.current = campaignFromUrl;
      try { sessionStorage.setItem(campaignKey, campaignFromUrl); } catch { /* Storage is optional. */ }
    }
    function send(kind: "visit" | "whatsapp") {
      if (!session.current || !isTrackingPath(path)) return;
      const body = JSON.stringify({ id: crypto.randomUUID(), sessionId: session.current, kind, path, campaignId: campaign.current });
      // Keep the request alive when the visitor leaves for WhatsApp.
      void fetch("/api/free-lesson-events", {
        method: "POST", headers: { "Content-Type": "application/json" }, body, keepalive: true,
      }).catch(() => undefined);
    }
    const visitKey = `${path}:${campaignFromUrl === "cht" || campaignFromUrl === "tr" ? campaignFromUrl : ""}`;
    if ((path === "/en/free-lesson" || campaignFromUrl === "tr") && previousPath.current !== visitKey) send("visit");
    previousPath.current = visitKey;
    const onClick = (event: MouseEvent) => {
      if (event.type === "auxclick" && event.button !== 1) return;
      if ((campaign.current !== "tr" && !lessonPaths.includes(path)) || !(event.target instanceof Element)) return;
      const link = event.target.closest("a[href]");
      if (!link) return;
      const url = new URL(link.getAttribute("href")!, window.location.href);
      if (url.hostname === "wa.me" || url.hostname === "api.whatsapp.com") send("whatsapp");
    };
    document.addEventListener("click", onClick, true);
    document.addEventListener("auxclick", onClick, true);
    return () => {
      document.removeEventListener("click", onClick, true);
      document.removeEventListener("auxclick", onClick, true);
    };
  }, [pathname, campaignFromUrl]);
  return null;
}
