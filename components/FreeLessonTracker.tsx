"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { lessonPaths } from "@/lib/free-lesson-analytics";

const sessionKey = "eo_free_lesson_session";

export default function FreeLessonTracker() {
  const pathname = usePathname();
  const previousPath = useRef<string | null>(null);
  const session = useRef<string | null>(null);

  useEffect(() => {
    const path = pathname.replace(/\/$/, "");
    try { session.current = sessionStorage.getItem(sessionKey) ?? session.current; } catch { /* In-memory tracking if storage is blocked. */ }
    if (path === "/en/free-lesson" && !session.current) {
      session.current = crypto.randomUUID();
      try { sessionStorage.setItem(sessionKey, session.current); } catch { /* Storage is optional. */ }
    }
    function send(kind: "visit" | "whatsapp") {
      if (!session.current) return;
      const body = JSON.stringify({ id: crypto.randomUUID(), sessionId: session.current, kind, path });
      // Keep the request alive when the visitor leaves for WhatsApp.
      void fetch("/api/free-lesson-events", {
        method: "POST", headers: { "Content-Type": "application/json" }, body, keepalive: true,
      }).catch(() => undefined);
    }
    if (path === "/en/free-lesson" && previousPath.current !== path) send("visit");
    previousPath.current = path;
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
  }, [pathname]);
  return null;
}
