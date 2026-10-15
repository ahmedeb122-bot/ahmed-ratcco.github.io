// يحفظ ملفات التطبيق في الجوال حتى يعمل بدون إنترنت
const CACHE = "matbakh-v8";
const FILES = ["./", "./index.html", "./manifest.json", "./icon-192.png", "./icon-512.png", "./icon-maskable.png"];
const IDS = ["b1","b2","b3","b4","b5","b6","b7","b8","l1","l2","l3","l4","l5","l6","l7","l8","l9","l10","l11","l12","l13","l14",
  "d1","d2","d3","d4","d5","d6","d7","d8","d9","d10"];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(async c => {
    await c.addAll(FILES);
    // صور الأكلات: كل صورة وحدها، حتى لا يفشل الحفظ كله إذا نقصت صورة
    await Promise.all(["./credits.json", ...IDS.map(id => "./img/" + id + ".jpg")].map(u => c.add(u).catch(() => {})));
  }));
  self.skipWaiting();
});

self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))));
  self.clients.claim();
});

self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  const isFont = url.host === "fonts.googleapis.com" || url.host === "fonts.gstatic.com";
  if (url.origin !== location.origin && !isFont) return;
  // الصور: من الجوال أولاً (أسرع)
  if (url.pathname.includes("/img/")) {
    e.respondWith(caches.match(req).then(r => r || fetch(req).then(res => {
      if (res.ok) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)); }
      return res;
    })));
    return;
  }
  // الصفحة: من الإنترنت أولاً (لتصل التحديثات)، وإذا لا يوجد إنترنت فمن النسخة المحفوظة
  e.respondWith(
    fetch(req).then(res => {
      const copy = res.clone();
      caches.open(CACHE).then(c => c.put(req, copy));
      return res;
    }).catch(() => caches.match(req).then(r => r || caches.match("./index.html")))
  );
});
