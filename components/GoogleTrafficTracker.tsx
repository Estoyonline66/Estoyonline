"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

const STORAGE_ACTIVE = "eo_google_g1";
const STORAGE_SID = "eo_google_g1_sid";
const DEBUG_PREFIX = "[google-g1-client]";

function clientScreenPayload() {
  if (typeof window === "undefined") return undefined;
  const round = (n: number) => Math.round(Math.min(8192, Math.max(0, n)));
  return {
    sw: round(window.screen?.width ?? 0),
    sh: round(window.screen?.height ?? 0),
    vh: round(window.innerHeight),
    vw: round(window.innerWidth),
    dpr: Math.min(4, Math.max(1, Number(window.devicePixelRatio) || 1)),
    lang:
      navigator.language ||
      (Array.isArray(navigator.languages) && navigator.languages[0]) ||
      undefined,
  };
}

async function sendLog(kind: "entry" | "nav", sessionId: string, path: string) {
  try {
    const extras = typeof window !== "undefined" ? clientScreenPayload() : undefined;
    console.info(`${DEBUG_PREFIX} send start`, { kind, sessionId, path, extras });
    const res = await fetch("/api/google-g1", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sessionId,
        kind,
        path,
        ...(extras ? { client: extras } : {}),
      }),
      keepalive: true,
    });
    const text = await res.text().catch(() => "");
    console.info(`${DEBUG_PREFIX} send result`, {
      kind,
      status: res.status,
      ok: res.ok,
      body: text.slice(0, 500),
    });
  } catch (err) {
    console.error(`${DEBUG_PREFIX} send error`, { kind, sessionId, path, err });
  }
}

/** Sadece URL'de ?g=1 olduğunda (ve aynı oturumda sessionStorage işareti varken) sunucuya log gönderir. */
function entryDedupeKey(sessionId: string) {
  return `eo_google_g1_entry_${sessionId}`;
}

export default function GoogleTrafficTracker() {
  const pathname = usePathname();
  const firstPathSkipped = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const params = new URLSearchParams(window.location.search);
    console.info(`${DEBUG_PREFIX} effect entry-check`, {
      pathname,
      search: window.location.search,
      g: params.get("g"),
      active: sessionStorage.getItem(STORAGE_ACTIVE),
      sid: sessionStorage.getItem(STORAGE_SID),
    });

    if (params.get("g") === "1") {
      sessionStorage.setItem(STORAGE_ACTIVE, "1");
      let sid = sessionStorage.getItem(STORAGE_SID);
      if (!sid) {
        sid = crypto.randomUUID();
        sessionStorage.setItem(STORAGE_SID, sid);
      }
      const dedupeKey = entryDedupeKey(sid);
      if (!sessionStorage.getItem(dedupeKey)) {
        sessionStorage.setItem(dedupeKey, "1");
        const path = `${pathname}${window.location.search || ""}`;
        console.info(`${DEBUG_PREFIX} entry sending`, { sid, dedupeKey, path });
        void sendLog("entry", sid, path);
      } else {
        console.info(`${DEBUG_PREFIX} entry skipped dedupe`, { sid, dedupeKey });
      }
      return;
    }

    if (sessionStorage.getItem(STORAGE_ACTIVE) !== "1") {
      console.info(`${DEBUG_PREFIX} not active, skip`);
      return;
    }
  }, [pathname]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem(STORAGE_ACTIVE) !== "1") return;

    const sid = sessionStorage.getItem(STORAGE_SID);
    if (!sid) return;

    if (!firstPathSkipped.current) {
      firstPathSkipped.current = true;
      console.info(`${DEBUG_PREFIX} nav first render skip`, { sid, pathname });
      return;
    }

    const path = `${pathname}${window.location.search || ""}`;
    console.info(`${DEBUG_PREFIX} nav sending`, { sid, path });
    void sendLog("nav", sid, path);
  }, [pathname]);

  return null;
}
