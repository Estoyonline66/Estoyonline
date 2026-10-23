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
  const [settingsOpen, setSettingsOpen] = useState(false);
  const turkish = pathname === "/tr" || pathname.startsWith("/tr/");
  const publicPage = /^\/(tr|en)(\/|$)/.test(pathname);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(consentKey);
      if (saved === "yes" || saved === "no") setConsent(saved === "yes");
    } catch { /* Consent remains optional when storage is unavailable. */ }
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

  function choose(value: boolean) {
    window.oaiq?.("consent", value);
    try { localStorage.setItem(consentKey, value ? "yes" : "no"); } catch { /* Session-only choice. */ }
    setConsent(value);
    setSettingsOpen(false);
  }

  if (!ready || !publicPage) return null;
  if (consent !== null && !settingsOpen) return (
    <button className="fixed bottom-2 left-2 z-[100] rounded bg-white px-2 py-1 text-xs text-gray-600 shadow" onClick={() => setSettingsOpen(true)}>
      {turkish ? "Gizlilik tercihleri" : "Privacy preferences"}
    </button>
  );
  return (
    <section aria-label={turkish ? "Reklam ölçümü tercihi" : "Advertising measurement preference"} className="fixed bottom-4 left-4 right-4 z-[100] max-w-lg rounded-xl border bg-white p-4 text-sm text-gray-900 shadow-lg">
      <p>{turkish
        ? "Reklamların etkisini ölçmek için OpenAI ölçüm teknolojisini kullanmamıza izin verir misiniz? İzin verirseniz WhatsApp tıklamalarınız ve reklam eşleştirme bilgileri OpenAI ile paylaşılır. Tercihinizi daha sonra değiştirebilirsiniz."
        : "May we use OpenAI measurement technology to measure advertising results? If you accept, WhatsApp clicks and ad matching information are shared with OpenAI. You can change your choice later."}</p>
      <div className="mt-3 flex gap-3">
        <button className="rounded border px-4 py-2" onClick={() => choose(false)}>{turkish ? "Reddet" : "Decline"}</button>
        <button className="rounded border px-4 py-2" onClick={() => choose(true)}>{turkish ? "Kabul et" : "Accept"}</button>
      </div>
    </section>
  );
}
