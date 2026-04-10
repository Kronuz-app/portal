import { useEffect, useRef } from "react";

const FALLBACK_TOUCH_ICON = "/kronuz-180.png";
const FALLBACK_ICONS = [
  { src: "/kronuz-192.png", sizes: "192x192", type: "image/png", purpose: "any maskable" },
  { src: "/kronuz-512.png", sizes: "512x512", type: "image/png", purpose: "any maskable" },
];

const supportsPwaInstall =
  "BeforeInstallPromptEvent" in window ||
  ("standalone" in navigator && (navigator as any).standalone !== undefined);

export function usePwaIcons() {
  const blobUrlRef = useRef<string | null>(null);

  useEffect(() => {
    const logoUrl = localStorage.getItem("trinity_logo_url");
    const shopName = localStorage.getItem("trinity_unit_name") || "Kronuz";

    let touchIcon = document.querySelector<HTMLLinkElement>("link[rel='apple-touch-icon']");
    if (!touchIcon) {
      touchIcon = document.createElement("link");
      touchIcon.rel = "apple-touch-icon";
      touchIcon.sizes = "180x180";
      document.head.appendChild(touchIcon);
    }
    touchIcon.href = logoUrl || FALLBACK_TOUCH_ICON;

    if (!supportsPwaInstall) return;

    const icons = logoUrl
      ? [{ src: logoUrl, sizes: "any", type: "image/png", purpose: "any maskable" }]
      : FALLBACK_ICONS;

    const manifest = {
      name: shopName,
      short_name: shopName,
      description: "Agende seu horário",
      start_url: "/",
      display: "standalone",
      background_color: "#0a0a0a",
      theme_color: "#0a0a0a",
      icons,
    };

    if (blobUrlRef.current) URL.revokeObjectURL(blobUrlRef.current);

    const blob = new Blob([JSON.stringify(manifest)], { type: "application/manifest+json" });
    const blobUrl = URL.createObjectURL(blob);
    blobUrlRef.current = blobUrl;

    let manifestLink = document.querySelector<HTMLLinkElement>("link[rel='manifest']");
    if (!manifestLink) {
      manifestLink = document.createElement("link");
      manifestLink.rel = "manifest";
      document.head.appendChild(manifestLink);
    }
    manifestLink.href = blobUrl;

    return () => {
      if (blobUrlRef.current) {
        URL.revokeObjectURL(blobUrlRef.current);
        blobUrlRef.current = null;
      }
    };
  }, []);
}
