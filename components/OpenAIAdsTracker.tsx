"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

type Pixel = ((...args: unknown[]) => void) & { q?: unknown[][] };
declare global { interface Window { oaiq?: Pixel } }

const consentKey = "eo_ads_measurement_consent";
const pixelId = "UTf7nqKu1tdu2THjVCp9VS";

export default function OpenAIAdsTracker() {
  const pathname = usePathname();
  const [consent, setConsent] = useState<boolean | null>(null);
  const [ready, setReady] = useState(false);
  const publicPage = /^\/(tr|en)(\/|$)/.test(pathname);

  useEffect(() => {
    // Temporary owner-requested mode: no consent UI. Preserve existing opt-outs.
    // Do not persist a positive choice: an absent preference is not user consent.
    let enabled = true;
    try { enabled = localStorage.getItem(consentKey) !== "no"; }
    catch { enabled = false; }
    setConsent(enabled);
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready || !publicPage) return;
    if (!window.oaiq && consent === true) {
      const pixel: Pixel = (...args) => { pixel.q!.push(args); };
      pixel.q = [];
      window.oaiq = pixel;
      pixel("consent", true);
      pixel("init", { pixelId });
      const script = document.createElement("script");
      script.async = true;
      script.src = "https://bzrcdn.openai.com/sdk/oaiq.min.js";
      document.head.appendChild(script);
    }
    window.oaiq?.("consent", consent === true);
    if (consent !== true) return;
    const onClick = (event: MouseEvent) => {
      if (event.type === "auxclick" && event.button !== 1) return;
      if (!(event.target instanceof Element)) return;
      const link = event.target.closest("a[href]");
      if (!link) return;
      let url: URL;
      try { url = new URL(link.getAttribute("href")!, window.location.href); }
      catch { return; }
      if ((["https:", "http:"].includes(url.protocol) &&
          ["wa.me", "api.whatsapp.com", "web.whatsapp.com"].includes(url.hostname)) ||
          url.protocol === "whatsapp:") {
        window.oaiq?.("measure", "lead_created", { type: "customer_action" });
      }
    };
    document.addEventListener("click", onClick, true);
    document.addEventListener("auxclick", onClick, true);
    return () => {
      document.removeEventListener("click", onClick, true);
      document.removeEventListener("auxclick", onClick, true);
    };
  }, [consent, ready, publicPage]);

  return null;
}
