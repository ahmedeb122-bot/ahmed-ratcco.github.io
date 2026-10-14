# يبحث في ويكيميديا كومنز عن صورة لكل أكلة، وينزّلها داخل مجلد التطبيق
# candidates/ = 4 صور مرشحة لكل أكلة (للاختيار)   img/ = الصورة المختارة   credits.json = اسم المصور والرخصة
import json, os, re, time, urllib.parse, urllib.request

HERE = os.path.dirname(os.path.abspath(__file__))
APP = os.path.dirname(HERE)
UA = {"User-Agent": "MatbakhFamilyMealApp/1.0 (github.com/ahmedeb122-bot; personal family app)"}
API = "https://commons.wikimedia.org/w/api.php"


def get(url, tries=5):
    for i in range(tries):
        try:
            with urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=40) as r:
                return r.read()
        except Exception as e:
            log("  retry", i + 1, repr(e)[:200])
            time.sleep(20 * (i + 1))
    raise RuntimeError("failed: " + url)


def api(params):
    time.sleep(1.5)
    params.update(format="json", formatversion="2")
    return json.loads(get(API + "?" + urllib.parse.urlencode(params)))


def clean(html):
    return re.sub(r"\s+", " ", re.sub(r"<[^>]+>", "", html or "")).strip()


def info_params(width):
    return dict(prop="imageinfo", iiprop="url|size|mime|extmetadata", iiurlwidth=str(width))


def ok(ii):
    lic = (ii.get("extmetadata", {}).get("LicenseShortName", {}) or {}).get("value", "")
    if ii.get("mime") not in ("image/jpeg", "image/png", "image/webp"):
        return False
    w, h = ii.get("width", 0), ii.get("height", 0)
    if w < 500 or h < 350 or not (0.6 <= w / max(h, 1) <= 2.2):
        return False
    return bool(re.search(r"CC|Public domain|PD|CC0", lic, re.I))


def search(q, width):
    if q.startswith("File:"):
        d = api(dict(action="query", titles=q, **info_params(width)))
    else:
        d = api(dict(action="query", generator="search", gsrsearch=q + " filetype:bitmap", gsrnamespace="6",
                     gsrlimit="12", **info_params(width)))
    pages = sorted(d.get("query", {}).get("pages", []), key=lambda p: p.get("index", 0))
    out = []
    for p in pages:
        ii = (p.get("imageinfo") or [None])[0]
        if ii and ok(ii):
            out.append((p["title"], ii))
    return out


def credit(title, ii):
    m = ii.get("extmetadata", {})
    v = lambda k: clean((m.get(k) or {}).get("value", ""))
    return {"file": title, "page": ii.get("descriptionurl", ""), "author": v("Artist")[:80] or "غير معروف",
            "license": v("LicenseShortName")}


LOG = []


def log(*a):
    s = " ".join(str(x) for x in a)
    print(s)
    LOG.append(s)


def main():
    queries = json.load(open(os.path.join(HERE, "images.json"), encoding="utf-8"))
    rd = lambda n, d: json.load(open(os.path.join(HERE, n), encoding="utf-8")) if os.path.exists(os.path.join(HERE, n)) else d
    picks, redo = rd("picks.json", {}), rd("redo.json", None)
    report = rd("candidates.json", {})
    cp = os.path.join(APP, "credits.json")
    credits = json.load(open(cp, encoding="utf-8")) if os.path.exists(cp) else {}
    cand_dir, img_dir = os.path.join(HERE, "candidates"), os.path.join(APP, "img")
    os.makedirs(cand_dir, exist_ok=True)
    os.makedirs(img_dir, exist_ok=True)
    for mid, qs in queries.items():
        if mid.startswith("_"):
            continue
        try:
            if redo is None or mid in redo:
                find(mid, qs, cand_dir, report)
            pick = picks.get(mid, 0)
            title = pick if isinstance(pick, str) else (report.get(mid) or [None] * 9)[pick] if pick < len(report.get(mid) or []) else None
            if title and credits.get(mid, {}).get("file") != title:
                chosen = search(title, 800)
                if chosen:
                    t, ii = chosen[0]
                    open(os.path.join(img_dir, f"{mid}.jpg"), "wb").write(get(ii["thumburl"]))
                    credits[mid] = credit(t, ii)
            log(mid, "->", credits.get(mid, {}).get("file"))
        except Exception as e:
            log("ERROR", mid, repr(e))
    json.dump(report, open(os.path.join(HERE, "candidates.json"), "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    json.dump(credits, open(cp, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    log("done", len(credits), "images")
    open(os.path.join(HERE, "log.txt"), "w", encoding="utf-8").write("\n".join(LOG))


def find(mid, qs, cand_dir, report):
    found, seen = [], set()
    for q in qs:
        for t, ii in search(q, 360):
            if t not in seen:
                seen.add(t)
                found.append((t, ii))
        if len(found) >= 4:
            break
    found = found[:4]
    report[mid] = [t for t, _ in found]
    for n, (t, ii) in enumerate(found):
        open(os.path.join(cand_dir, f"{mid}_{n}.jpg"), "wb").write(get(ii["thumburl"]))
        time.sleep(1)
    log(mid, "candidates", len(found))


if __name__ == "__main__":
    main()
