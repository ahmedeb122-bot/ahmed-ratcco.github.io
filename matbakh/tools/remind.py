# يرسل تنبيهات مواعيد الوجبات إلى تطبيق ntfy (يعمل تلقائياً من GitHub Actions كل ربع ساعة)
# التنبيه: قبل الموعد بساعة، ثم كل نصف ساعة، حتى نصف ساعة بعد الموعد، ويتوقف عند الضغط على "تم الطبخ"
import json, os, re, urllib.request
from datetime import datetime, timedelta, timezone

TOPIC = "matbakh-431a8f1f83"          # قناة التنبيهات (نشترك فيها من جوال أحمد وجوال الزوجة)
DONE = TOPIC + "-done"                # رسائل "تم الطبخ" (من التطبيق أو من زر التنبيه)
PLAN = TOPIC + "-plan"                # وجبات اليوم الفعلية (يرسلها التطبيق بعد أي تغيير)
APP = "https://ahmedeb122-bot.github.io/ahmed-ratcco.github.io/matbakh/"
NTFY = "https://ntfy.sh"
RIYADH = timezone(timedelta(hours=3))
MEALS = {"b": ("الفطور", 9 * 60), "l": ("الغداء", 14 * 60), "d": ("العشاء", 19 * 60 + 30)}
BEFORE, AFTER, GAP = 60, 30, 25       # دقائق: يبدأ قبل ساعة، آخر تنبيه بعد نصف ساعة، ولا يتكرر قبل 25 دقيقة


def poll(topic, since="14h"):
    url = f"{NTFY}/{topic}/json?poll=1&since={since}"
    with urllib.request.urlopen(url, timeout=30) as r:
        lines = r.read().decode("utf-8").splitlines()
    return [m for m in map(json.loads, lines) if m.get("event") == "message"]


def names():
    html = open(os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "index.html"), encoding="utf-8").read()
    return dict(re.findall(r'\{id:"(\w+)",n:"([^"]+)"', html))


def send(title, message, prio, today, k):
    body = {"topic": TOPIC, "title": title, "message": message, "priority": prio, "tags": ["stew"],
            "click": APP,
            "actions": [{"action": "http", "label": "✓ تم الطبخ", "url": f"{NTFY}/{DONE}", "method": "POST",
                         "body": f"{today} {k}", "clear": True},
                        {"action": "view", "label": "افتحي المطبخ", "url": APP}]}
    req = urllib.request.Request(NTFY, data=json.dumps(body).encode("utf-8"), headers={"Content-Type": "application/json"})
    urllib.request.urlopen(req, timeout=30).read()


def main():
    now = datetime.now(RIYADH)
    today = now.strftime("%Y-%m-%d")
    if os.environ.get("TEST") == "1":
        send("🔔 تجربة تنبيهات المطبخ", "إذا وصلك هذا التنبيه فالإعداد صحيح. لا تضغطي «تم الطبخ» هنا.", 3, "test", "x")
        print("test sent")
        return
    mins = now.hour * 60 + now.minute
    due = [k for k, (_, t) in MEALS.items() if t - BEFORE - 5 <= mins <= t + AFTER + 10]
    if not due:
        print("no meal window now", now)
        return
    k = due[0]
    label, t = MEALS[k]
    # هل طُبخت؟ آخر رسالة لهذه الوجبة اليوم هي التي تقرر (done أو undo)
    state = None
    for m in sorted(poll(DONE), key=lambda m: m["time"]):
        p = m.get("message", "").split()
        if len(p) >= 2 and p[-2] == today and p[-1] == k:
            state = p[0] != "undo"
    if state:
        print("already cooked", k)
        return
    sent = [m for m in poll(TOPIC, "3h") if m.get("message", "").find(label) >= 0 and now.timestamp() - m["time"] < GAP * 60]
    if sent:
        print("sent recently, skip")
        return
    meal = ""
    for m in sorted(poll(PLAN, "24h"), key=lambda m: m["time"]):
        p = dict(x.split(":", 1) for x in m.get("message", "").split()[1:] if ":" in x)
        if m.get("message", "").startswith(today) and p.get(k):
            meal = names().get(p[k], "")
    diff = t - mins
    clock = {"b": "9:00 صباحاً", "l": "2:00 ظهراً", "d": "7:30 مساءً"}[k]
    what = f": {meal}" if meal else ""
    if diff > 40:
        title, prio, msg = f"⏰ {label} بعد ساعة", 3, f"{label} الساعة {clock}{what}. وقت البدء في التحضير."
    elif diff > 10:
        title, prio, msg = f"⏰ {label} بعد نصف ساعة", 4, f"{label} الساعة {clock}{what}."
    elif diff > -15:
        title, prio, msg = f"🍽️ حان وقت {label}", 5, f"{label}{what}. اضغطي «تم الطبخ» عند الانتهاء."
    else:
        title, prio, msg = f"⚠️ {label} متأخر", 5, f"{label} تأخر نصف ساعة{what}. تأخير الأكل يربك سكر الوالدة."
    send(title, msg, prio, today, k)
    print("sent", title)


if __name__ == "__main__":
    main()
