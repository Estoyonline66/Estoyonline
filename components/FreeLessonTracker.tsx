"use client";

import { useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { lessonPaths } from "@/lib/free-lesson-analytics";

const sessionKey = "eo_free_lesson_session";
const campaignKey = "eo_free_lesson_campaign";

export default function FreeLessonTracker() {
  const pathname = usePathname();
  const campaignFromUrl = useSearchParams().get("campaign_id");
  const previousPath = useRef<string | null>(null);
  const session = useRef<string | null>(null);
  const campaign = useRef<"cht" | undefined>(undefined);

  useEffect(() => {
    const path = pathname.replace(/\/$/, "");
    try { session.current = sessionStorage.getItem(sessionKey) ?? session.current; } catch { /* In-memory tracking if storage is blocked. */ }
    if (session.current) {
      try { if (sessionStorage.getItem(campaignKey) === "cht") campaign.current = "cht"; } catch { /* Storage is optional. */ }
    }
    if (path === "/en/free-lesson" && !session.current) {
      session.current = crypto.randomUUID();
      try { sessionStorage.setItem(sessionKey, session.current); } catch { /* Storage is optional. */ }
    }
    if (path === "/en/free-lesson" && campaignFromUrl === "cht") {
      campaign.current = "cht";
      try { sessionStorage.setItem(campaignKey, "cht"); } catch { /* Storage is optional. */ }
    }
    function send(kind: "visit" | "whatsapp") {
      if (!session.current) return;
      const body = JSON.stringify({ id: crypto.randomUUID(), sessionId: session.current, kind, path, campaignId: campaign.current });
      // Keep the request alive when the visitor leaves for WhatsApp.
      void fetch("/api/free-lesson-events", {
        method: "POST", headers: { "Content-Type": "application/json" }, body, keepalive: true,
      }).catch(() => undefined);
    }
    const visitKey = `${path}:${campaignFromUrl === "cht" ? "cht" : ""}`;
    if (path === "/en/free-lesson" && previousPath.current !== visitKey) send("visit");
    previousPath.current = visitKey;
    const onClick = (event: MouseEvent) => {
      if (event.type === "auxclick" && event.button !== 1) return;
      if (!lessonPaths.includes(path) || !(event.target instanceof Element)) return;
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
