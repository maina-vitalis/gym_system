if (!self.define) {
  let s,
    e = {};
  const i = (i, t) => (
    (i = new URL(i + ".js", t).href),
    e[i] ||
      new Promise((e) => {
        if ("document" in self) {
          const s = document.createElement("script");
          ((s.src = i), (s.onload = e), document.head.appendChild(s));
        } else ((s = i), importScripts(i), e());
      }).then(() => {
        let s = e[i];
        if (!s) throw new Error(`Module ${i} didn’t register its module`);
        return s;
      })
  );
  self.define = (t, a) => {
    const n =
      s ||
      ("document" in self ? document.currentScript.src : "") ||
      location.href;
    if (e[n]) return;
    let c = {};
    const r = (s) => i(s, n),
      v = { module: { uri: n }, exports: c, require: r };
    e[n] = Promise.all(t.map((s) => v[s] || r(s))).then((s) => (a(...s), c));
  };
}
define(["./workbox-cb477421"], function (s) {
  "use strict";
  (importScripts(),
    self.skipWaiting(),
    s.clientsClaim(),
    s.precacheAndRoute(
      [
        {
          url: "/_next/app-build-manifest.json",
          revision: "57d3f5f4cae87aa69a0099e0575615fe",
        },
        {
          url: "/_next/static/chunks/1526-40d811f81bdcf7f4.js",
          revision: "x3iyIDzTsvgGbyYRzEvfE",
        },
        {
          url: "/_next/static/chunks/164f4fb6.0a8cf1651537b860.js",
          revision: "0a8cf1651537b860",
        },
        {
          url: "/_next/static/chunks/1684-e06de9ec0a88894f.js",
          revision: "x3iyIDzTsvgGbyYRzEvfE",
        },
        {
          url: "/_next/static/chunks/1750-28e3954580f3715b.js",
          revision: "x3iyIDzTsvgGbyYRzEvfE",
        },
        {
          url: "/_next/static/chunks/1944-55637c03731de848.js",
          revision: "x3iyIDzTsvgGbyYRzEvfE",
        },
        {
          url: "/_next/static/chunks/2108-4230fdbe27f2197c.js",
          revision: "x3iyIDzTsvgGbyYRzEvfE",
        },
        {
          url: "/_next/static/chunks/2121.53188f93655a7ff0.js",
          revision: "53188f93655a7ff0",
        },
        {
          url: "/_next/static/chunks/2294-300cecbd46f9a53e.js",
          revision: "x3iyIDzTsvgGbyYRzEvfE",
        },
        {
          url: "/_next/static/chunks/251-6316ee535a612f64.js",
          revision: "x3iyIDzTsvgGbyYRzEvfE",
        },
        {
          url: "/_next/static/chunks/2541-e57b60d8e59fe7bc.js",
          revision: "x3iyIDzTsvgGbyYRzEvfE",
        },
        {
          url: "/_next/static/chunks/2557-85b8aa665b1582df.js",
          revision: "x3iyIDzTsvgGbyYRzEvfE",
        },
        {
          url: "/_next/static/chunks/2960-d8b99df943835c18.js",
          revision: "x3iyIDzTsvgGbyYRzEvfE",
        },
        {
          url: "/_next/static/chunks/3583-51711c0a86e611f7.js",
          revision: "x3iyIDzTsvgGbyYRzEvfE",
        },
        {
          url: "/_next/static/chunks/3759-f168b8c3857ec91c.js",
          revision: "x3iyIDzTsvgGbyYRzEvfE",
        },
        {
          url: "/_next/static/chunks/3906-1ad38274061ef1eb.js",
          revision: "x3iyIDzTsvgGbyYRzEvfE",
        },
        {
          url: "/_next/static/chunks/472.2c08b965bd9148e2.js",
          revision: "2c08b965bd9148e2",
        },
        {
          url: "/_next/static/chunks/4bd1b696-b7e1eae3b65cdea8.js",
          revision: "x3iyIDzTsvgGbyYRzEvfE",
        },
        {
          url: "/_next/static/chunks/5138-1dbb44858e64643d.js",
          revision: "x3iyIDzTsvgGbyYRzEvfE",
        },
        {
          url: "/_next/static/chunks/5152-8d334fac5878f2ae.js",
          revision: "x3iyIDzTsvgGbyYRzEvfE",
        },
        {
          url: "/_next/static/chunks/5224-0f586b30da025d17.js",
          revision: "x3iyIDzTsvgGbyYRzEvfE",
        },
        {
          url: "/_next/static/chunks/624-0f52adc8accfde67.js",
          revision: "x3iyIDzTsvgGbyYRzEvfE",
        },
        {
          url: "/_next/static/chunks/6671-e63276a84d1d42c0.js",
          revision: "x3iyIDzTsvgGbyYRzEvfE",
        },
        {
          url: "/_next/static/chunks/6766-f446e94b0c007a08.js",
          revision: "x3iyIDzTsvgGbyYRzEvfE",
        },
        {
          url: "/_next/static/chunks/6874-429149a85c2fd051.js",
          revision: "x3iyIDzTsvgGbyYRzEvfE",
        },
        {
          url: "/_next/static/chunks/6967-f8393b2f1e099c1c.js",
          revision: "x3iyIDzTsvgGbyYRzEvfE",
        },
        {
          url: "/_next/static/chunks/7-c415e6de48582421.js",
          revision: "x3iyIDzTsvgGbyYRzEvfE",
        },
        {
          url: "/_next/static/chunks/7373-72800ccf618eb704.js",
          revision: "x3iyIDzTsvgGbyYRzEvfE",
        },
        {
          url: "/_next/static/chunks/8062-b225ddd72e58986f.js",
          revision: "x3iyIDzTsvgGbyYRzEvfE",
        },
        {
          url: "/_next/static/chunks/822.d1eebe7df2d8fc0a.js",
          revision: "d1eebe7df2d8fc0a",
        },
        {
          url: "/_next/static/chunks/8250-1034784cad7b6457.js",
          revision: "x3iyIDzTsvgGbyYRzEvfE",
        },
        {
          url: "/_next/static/chunks/8291-418c7d409154162c.js",
          revision: "x3iyIDzTsvgGbyYRzEvfE",
        },
        {
          url: "/_next/static/chunks/8639-eab97579db639b94.js",
          revision: "x3iyIDzTsvgGbyYRzEvfE",
        },
        {
          url: "/_next/static/chunks/9013-b1c83ae9f3250a9d.js",
          revision: "x3iyIDzTsvgGbyYRzEvfE",
        },
        {
          url: "/_next/static/chunks/913.fb6bec3e460ba7b8.js",
          revision: "fb6bec3e460ba7b8",
        },
        {
          url: "/_next/static/chunks/9341.3ca6eb08eac1d97b.js",
          revision: "3ca6eb08eac1d97b",
        },
        {
          url: "/_next/static/chunks/9352-7546bc007e3637eb.js",
          revision: "x3iyIDzTsvgGbyYRzEvfE",
        },
        {
          url: "/_next/static/chunks/ad2866b8.1fc071285e350c45.js",
          revision: "1fc071285e350c45",
        },
        {
          url: "/_next/static/chunks/app/(auth)/sign-in/page-0f293010c62e244b.js",
          revision: "x3iyIDzTsvgGbyYRzEvfE",
        },
        {
          url: "/_next/static/chunks/app/(main)/about/layout-609f1c165b18f5b8.js",
          revision: "x3iyIDzTsvgGbyYRzEvfE",
        },
        {
          url: "/_next/static/chunks/app/(main)/about/page-36ecdf56d09344d7.js",
          revision: "x3iyIDzTsvgGbyYRzEvfE",
        },
        {
          url: "/_next/static/chunks/app/(main)/contact/layout-1b23cdd0f69ca575.js",
          revision: "x3iyIDzTsvgGbyYRzEvfE",
        },
        {
          url: "/_next/static/chunks/app/(main)/contact/page-d65588ed0f9a095b.js",
          revision: "x3iyIDzTsvgGbyYRzEvfE",
        },
        {
          url: "/_next/static/chunks/app/(main)/layout-e97ba757ce31bbbf.js",
          revision: "x3iyIDzTsvgGbyYRzEvfE",
        },
        {
          url: "/_next/static/chunks/app/(main)/nutrition/layout-c39a394e58cd591d.js",
          revision: "x3iyIDzTsvgGbyYRzEvfE",
        },
        {
          url: "/_next/static/chunks/app/(main)/nutrition/page-7a3be180b4ee1539.js",
          revision: "x3iyIDzTsvgGbyYRzEvfE",
        },
        {
          url: "/_next/static/chunks/app/(main)/page-254ed6025f59337c.js",
          revision: "x3iyIDzTsvgGbyYRzEvfE",
        },
        {
          url: "/_next/static/chunks/app/_not-found/page-c0005f731b6bdc9e.js",
          revision: "x3iyIDzTsvgGbyYRzEvfE",
        },
        {
          url: "/_next/static/chunks/app/api/admin/create/route-55df78524dda775a.js",
          revision: "x3iyIDzTsvgGbyYRzEvfE",
        },
        {
          url: "/_next/static/chunks/app/api/auth/%5B...nextauth%5D/route-a54407c298656907.js",
          revision: "x3iyIDzTsvgGbyYRzEvfE",
        },
        {
          url: "/_next/static/chunks/app/api/dashboard/stats/route-beb32256c11b5e5d.js",
          revision: "x3iyIDzTsvgGbyYRzEvfE",
        },
        {
          url: "/_next/static/chunks/app/api/members/%5Bid%5D/route-d1468bb16dff35b1.js",
          revision: "x3iyIDzTsvgGbyYRzEvfE",
        },
        {
          url: "/_next/static/chunks/app/api/members/%5Bid%5D/subscriptions/route-eec8f580a214290b.js",
          revision: "x3iyIDzTsvgGbyYRzEvfE",
        },
        {
          url: "/_next/static/chunks/app/api/members/%5Bid%5D/suspend/route-8cd28989d0948cf9.js",
          revision: "x3iyIDzTsvgGbyYRzEvfE",
        },
        {
          url: "/_next/static/chunks/app/api/members/lookup/route-46b33b7d0c047761.js",
          revision: "x3iyIDzTsvgGbyYRzEvfE",
        },
        {
          url: "/_next/static/chunks/app/api/members/reports/route-b200a97252a99822.js",
          revision: "x3iyIDzTsvgGbyYRzEvfE",
        },
        {
          url: "/_next/static/chunks/app/api/members/route-d94b63af89d15ccf.js",
          revision: "x3iyIDzTsvgGbyYRzEvfE",
        },
        {
          url: "/_next/static/chunks/app/api/members/status/route-d0d34b8591b91ea0.js",
          revision: "x3iyIDzTsvgGbyYRzEvfE",
        },
        {
          url: "/_next/static/chunks/app/api/membership-plans/%5Bid%5D/route-c6407708456c3acd.js",
          revision: "x3iyIDzTsvgGbyYRzEvfE",
        },
        {
          url: "/_next/static/chunks/app/api/membership-plans/route-49187f81c6cea466.js",
          revision: "x3iyIDzTsvgGbyYRzEvfE",
        },
        {
          url: "/_next/static/chunks/app/api/payments/%5Bid%5D/receipt/route-7ec47023853e36c5.js",
          revision: "x3iyIDzTsvgGbyYRzEvfE",
        },
        {
          url: "/_next/static/chunks/app/api/payments/%5Bid%5D/route-d4ccd140dc11ac55.js",
          revision: "x3iyIDzTsvgGbyYRzEvfE",
        },
        {
          url: "/_next/static/chunks/app/api/payments/bulk-delete/route-57fe2ffe2ac54e6b.js",
          revision: "x3iyIDzTsvgGbyYRzEvfE",
        },
        {
          url: "/_next/static/chunks/app/api/payments/callback/route-5e4206e2e65d5952.js",
          revision: "x3iyIDzTsvgGbyYRzEvfE",
        },
        {
          url: "/_next/static/chunks/app/api/payments/push/route-189ed2a0e3ac14ca.js",
          revision: "x3iyIDzTsvgGbyYRzEvfE",
        },
        {
          url: "/_next/static/chunks/app/api/payments/reports/route-313b2325c169537b.js",
          revision: "x3iyIDzTsvgGbyYRzEvfE",
        },
        {
          url: "/_next/static/chunks/app/api/payments/route-963807ec2656f339.js",
          revision: "x3iyIDzTsvgGbyYRzEvfE",
        },
        {
          url: "/_next/static/chunks/app/api/payments/status/route-0797376db4acd761.js",
          revision: "x3iyIDzTsvgGbyYRzEvfE",
        },
        {
          url: "/_next/static/chunks/app/api/test-auth/route-ea98bd1cc06aecf0.js",
          revision: "x3iyIDzTsvgGbyYRzEvfE",
        },
        {
          url: "/_next/static/chunks/app/dashboard/layout-62daa65e579995db.js",
          revision: "x3iyIDzTsvgGbyYRzEvfE",
        },
        {
          url: "/_next/static/chunks/app/dashboard/members/%5Bid%5D/edit/page-2eaaad02a5b6e444.js",
          revision: "x3iyIDzTsvgGbyYRzEvfE",
        },
        {
          url: "/_next/static/chunks/app/dashboard/members/%5Bid%5D/page-908e1f83b67eecab.js",
          revision: "x3iyIDzTsvgGbyYRzEvfE",
        },
        {
          url: "/_next/static/chunks/app/dashboard/members/new/page-0f4c82279222987f.js",
          revision: "x3iyIDzTsvgGbyYRzEvfE",
        },
        {
          url: "/_next/static/chunks/app/dashboard/members/page-cc459e2774fcc544.js",
          revision: "x3iyIDzTsvgGbyYRzEvfE",
        },
        {
          url: "/_next/static/chunks/app/dashboard/members/reports/page-d7ebd324f51e6cd5.js",
          revision: "x3iyIDzTsvgGbyYRzEvfE",
        },
        {
          url: "/_next/static/chunks/app/dashboard/membership-plans/page-65e6a3f9e084b6f9.js",
          revision: "x3iyIDzTsvgGbyYRzEvfE",
        },
        {
          url: "/_next/static/chunks/app/dashboard/page-8171cae6eec8552d.js",
          revision: "x3iyIDzTsvgGbyYRzEvfE",
        },
        {
          url: "/_next/static/chunks/app/dashboard/payments/new/page-f5df45c6cb532692.js",
          revision: "x3iyIDzTsvgGbyYRzEvfE",
        },
        {
          url: "/_next/static/chunks/app/dashboard/payments/page-f57bb3adff1f2ea6.js",
          revision: "x3iyIDzTsvgGbyYRzEvfE",
        },
        {
          url: "/_next/static/chunks/app/dashboard/payments/reports/page-7bdba9157a59f457.js",
          revision: "x3iyIDzTsvgGbyYRzEvfE",
        },
        {
          url: "/_next/static/chunks/app/error-bc36594d7185a0f7.js",
          revision: "x3iyIDzTsvgGbyYRzEvfE",
        },
        {
          url: "/_next/static/chunks/app/layout-23f3c0aee1e69d30.js",
          revision: "x3iyIDzTsvgGbyYRzEvfE",
        },
        {
          url: "/_next/static/chunks/app/not-found-c8e3db0f0fb6bdba.js",
          revision: "x3iyIDzTsvgGbyYRzEvfE",
        },
        {
          url: "/_next/static/chunks/app/register/layout-8df0ccccf99477e4.js",
          revision: "x3iyIDzTsvgGbyYRzEvfE",
        },
        {
          url: "/_next/static/chunks/app/register/page-ea122de4f8e35eee.js",
          revision: "x3iyIDzTsvgGbyYRzEvfE",
        },
        {
          url: "/_next/static/chunks/app/robots.txt/route-a12d1c8d5996f2f5.js",
          revision: "x3iyIDzTsvgGbyYRzEvfE",
        },
        {
          url: "/_next/static/chunks/app/sitemap.xml/route-be03f17c3f559cb9.js",
          revision: "x3iyIDzTsvgGbyYRzEvfE",
        },
        {
          url: "/_next/static/chunks/bc98253f.a20b3a3cf1b114d6.js",
          revision: "a20b3a3cf1b114d6",
        },
        {
          url: "/_next/static/chunks/framework-82b67a6346ddd02b.js",
          revision: "x3iyIDzTsvgGbyYRzEvfE",
        },
        {
          url: "/_next/static/chunks/main-7405b2bb800d1987.js",
          revision: "x3iyIDzTsvgGbyYRzEvfE",
        },
        {
          url: "/_next/static/chunks/main-app-acb41598b7def2e2.js",
          revision: "x3iyIDzTsvgGbyYRzEvfE",
        },
        {
          url: "/_next/static/chunks/pages/_app-0b0b6e26a728d49c.js",
          revision: "x3iyIDzTsvgGbyYRzEvfE",
        },
        {
          url: "/_next/static/chunks/pages/_error-f94192b14105bd76.js",
          revision: "x3iyIDzTsvgGbyYRzEvfE",
        },
        {
          url: "/_next/static/chunks/polyfills-42372ed130431b0a.js",
          revision: "846118c33b2c0e922d7b3a7676f81f6f",
        },
        {
          url: "/_next/static/chunks/webpack-a9990d41cd56283e.js",
          revision: "x3iyIDzTsvgGbyYRzEvfE",
        },
        {
          url: "/_next/static/css/931b179cff3131dc.css",
          revision: "931b179cff3131dc",
        },
        {
          url: "/_next/static/css/d6755936dc9cc418.css",
          revision: "d6755936dc9cc418",
        },
        {
          url: "/_next/static/media/26a46d62cd723877-s.woff2",
          revision: "befd9c0fdfa3d8a645d5f95717ed6420",
        },
        {
          url: "/_next/static/media/55c55f0601d81cf3-s.woff2",
          revision: "43828e14271c77b87e3ed582dbff9f74",
        },
        {
          url: "/_next/static/media/581909926a08bbc8-s.woff2",
          revision: "f0b86e7c24f455280b8df606b89af891",
        },
        {
          url: "/_next/static/media/8e9860b6e62d6359-s.woff2",
          revision: "01ba6c2a184b8cba08b0d57167664d75",
        },
        {
          url: "/_next/static/media/97e0cb1ae144a2a9-s.woff2",
          revision: "e360c61c5bd8d90639fd4503c829c2dc",
        },
        {
          url: "/_next/static/media/df0a9ae256c0569c-s.woff2",
          revision: "d54db44de5ccb18886ece2fda72bdfe0",
        },
        {
          url: "/_next/static/media/e4af272ccee01ff0-s.p.woff2",
          revision: "65850a373e258f1c897a2b3d75eb74de",
        },
        {
          url: "/_next/static/media/gym.ae7caf71.png",
          revision: "77377926a2ab897777730e3726186d09",
        },
        {
          url: "/_next/static/media/hero.a14ad1bd.png",
          revision: "ae474f4f68d2656ef2e0ca7b0f1e7037",
        },
        {
          url: "/_next/static/x3iyIDzTsvgGbyYRzEvfE/_buildManifest.js",
          revision: "23ba0227cfb8be61db54113eeb5198de",
        },
        {
          url: "/_next/static/x3iyIDzTsvgGbyYRzEvfE/_ssgManifest.js",
          revision: "b6652df95db52feb4daf4eca35380933",
        },
        { url: "/gym.png", revision: "77377926a2ab897777730e3726186d09" },
        { url: "/hero.png", revision: "ae474f4f68d2656ef2e0ca7b0f1e7037" },
        {
          url: "/icons/icon-128x128.png",
          revision: "77377926a2ab897777730e3726186d09",
        },
        {
          url: "/icons/icon-144x144.png",
          revision: "77377926a2ab897777730e3726186d09",
        },
        {
          url: "/icons/icon-152x152.png",
          revision: "77377926a2ab897777730e3726186d09",
        },
        {
          url: "/icons/icon-192x192.png",
          revision: "77377926a2ab897777730e3726186d09",
        },
        {
          url: "/icons/icon-384x384.png",
          revision: "77377926a2ab897777730e3726186d09",
        },
        {
          url: "/icons/icon-512x512.png",
          revision: "77377926a2ab897777730e3726186d09",
        },
        {
          url: "/icons/icon-72x72.png",
          revision: "77377926a2ab897777730e3726186d09",
        },
        {
          url: "/icons/icon-96x96.png",
          revision: "77377926a2ab897777730e3726186d09",
        },
        { url: "/manifest.json", revision: "0fc0f9d4e9335026237497f7fbb16aa9" },
        { url: "/offline.html", revision: "9e11abd4b8c7c0a4dca81456f9778d2a" },
        { url: "/robots.txt", revision: "623c61ed5b2e7eec281ae1cafd93b895" },
        { url: "/sitemap.xml", revision: "d029cb3fe07c92fc75a914f12499c745" },
      ],
      { ignoreURLParametersMatching: [] },
    ),
    s.cleanupOutdatedCaches(),
    s.registerRoute(
      "/",
      new s.NetworkFirst({
        cacheName: "start-url",
        plugins: [
          {
            cacheWillUpdate: async ({
              request: s,
              response: e,
              event: i,
              state: t,
            }) =>
              e && "opaqueredirect" === e.type
                ? new Response(e.body, {
                    status: 200,
                    statusText: "OK",
                    headers: e.headers,
                  })
                : e,
          },
        ],
      }),
      "GET",
    ),
    s.registerRoute(
      /^https?.*/,
      new s.NetworkFirst({
        cacheName: "offlineCache",
        plugins: [new s.ExpirationPlugin({ maxEntries: 200 })],
      }),
      "GET",
    ));
});
