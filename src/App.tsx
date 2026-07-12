import { useEffect } from "react";

import { MarketingPage } from "./site/MarketingPage";

const SITE_SCRIPTS = [
  "/site/hero-caustics.js",
  "/site/concept-lib.js",
  "/site/pillar-diagrams.js",
  "/site/pillar-scenes.js",
  "/site/execution-scroll.js",
] as const;

const SITE_SCRIPT_ATTRIBUTE = "data-zylith-site-script";
let siteRuntimePromise: Promise<void> | undefined;

function loadScript(src: string) {
  const existing = document.querySelector<HTMLScriptElement>(`script[src='${src}'][${SITE_SCRIPT_ATTRIBUTE}='true']`);
  if (existing) return Promise.resolve();

  return new Promise<void>((resolve, reject) => {
    const script = document.createElement("script");
    script.src = src;
    script.async = false;
    script.setAttribute(SITE_SCRIPT_ATTRIBUTE, "true");
    script.onload = () => resolve();
    script.onerror = () => reject(new Error(`Failed to load ${src}`));
    document.body.appendChild(script);
  });
}

function ensureSiteRuntime() {
  siteRuntimePromise ??= SITE_SCRIPTS.reduce(
    (chain, src) => chain.then(() => loadScript(src)),
    Promise.resolve(),
  ).catch((error: unknown) => {
    siteRuntimePromise = undefined;
    throw error;
  });

  return siteRuntimePromise;
}

export default function App() {
  useEffect(() => {
    void ensureSiteRuntime();
  }, []);

  return <MarketingPage />;
}
