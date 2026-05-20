"use client";

import { useEffect } from "react";
import { trackClick } from "@/lib/api";

const META_PIXEL_ID =
  process.env.NEXT_PUBLIC_META_PIXEL_ID || "1956891195007947";
const TIKTOK_PIXEL_ID = process.env.NEXT_PUBLIC_TIKTOK_PIXEL_ID;
const SNAP_PIXEL_ID = process.env.NEXT_PUBLIC_SNAP_PIXEL_ID;

const CLICK_TRACKED_KEY = "_najd_click_tracked";

function recordLandingClickOnce() {
  if (typeof window === "undefined") return;
  try {
    if (window.sessionStorage.getItem(CLICK_TRACKED_KEY)) return;
    window.sessionStorage.setItem(CLICK_TRACKED_KEY, "1");
  } catch {
    // sessionStorage blocked (private mode, etc.) — skip dedupe but still track once
  }

  const params = new URLSearchParams(window.location.search);
  const utm = {
    utm_source: params.get("utm_source") || undefined,
    utm_medium: params.get("utm_medium") || undefined,
    utm_campaign: params.get("utm_campaign") || undefined,
    utm_content: params.get("utm_content") || undefined,
    utm_term: params.get("utm_term") || undefined,
  };
  const clickIds = {
    fbclid: params.get("fbclid") || undefined,
    ttclid: params.get("ttclid") || undefined,
    sc_click_id:
      params.get("ScCid") || params.get("sc_click_id") || undefined,
  };

  trackClick({
    landing_page: window.location.href,
    referrer: document.referrer || undefined,
    user_agent: navigator.userAgent,
    utm: Object.values(utm).some(Boolean) ? utm : undefined,
    click_ids: Object.values(clickIds).some(Boolean) ? clickIds : undefined,
  });
}

export function PixelProvider() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    recordLandingClickOnce();

    window._pixelQueue = window._pixelQueue || [];
    window._pixelsLoaded = false;

    function loadPixels() {
      if (typeof window === "undefined") return;

      if (META_PIXEL_ID && !window.fbq) {
        const script = document.createElement("script");
        script.innerHTML = `
          !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window, document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');
          fbq('init', '${META_PIXEL_ID}');
          fbq('track', 'PageView');
        `;
        document.head.appendChild(script);
      }

      if (TIKTOK_PIXEL_ID && !window.ttq) {
        const script = document.createElement("script");
        script.innerHTML = `
          !function (w, d, t) {
            w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e},ttq.load=function(e,n){var i="https://analytics.tiktok.com/i18n/pixel/events.js";ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=i,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};var o=document.createElement("script");o.type="text/javascript",o.async=!0,o.src=i+"?sdkid="+e+"&lib="+t;var a=document.getElementsByTagName("script")[0];a.parentNode.insertBefore(o,a)};
            ttq.load('${TIKTOK_PIXEL_ID}');
            ttq.page();
          }(window, document, 'ttq');
        `;
        document.head.appendChild(script);
      }

      if (SNAP_PIXEL_ID && !window.snaptr) {
        const script = document.createElement("script");
        script.innerHTML = `
          (function(e,t,n){if(e.snaptr)return;var a=e.snaptr=function(){a.handleRequest?a.handleRequest.apply(a,arguments):a.queue.push(arguments)};a.queue=[];var s='script';r=t.createElement(s);r.async=!0;r.src=n;var u=t.getElementsByTagName(s)[0];u.parentNode.insertBefore(r,u);})(window,document,'https://sc-static.net/scevent.min.js');
          snaptr('init', '${SNAP_PIXEL_ID}');
          snaptr('track', 'PAGE_VIEW');
        `;
        document.head.appendChild(script);
      }

      window._pixelsLoaded = true;
      const queue = window._pixelQueue || [];
      queue.forEach((fn) => {
        try {
          fn();
        } catch {
          // noop
        }
      });
      window._pixelQueue = [];
    }

    if ("requestIdleCallback" in window) {
      requestIdleCallback(() => loadPixels(), { timeout: 3000 });
    } else {
      setTimeout(loadPixels, 1500);
    }
  }, []);

  return null;
}
