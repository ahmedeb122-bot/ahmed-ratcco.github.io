# دليل موردي الكهرباء – قروب Elec in KSA
**Project brief: read this first in every new chat about this project.**
Last updated: 2026-10-31 (version 4.3 live).

---

## 1. Who and why
- **Owner:** Ahmed Ibrahim (Engr., Department Director – Energy, RATCCO). He runs the WhatsApp group **Elec in KSA**, which has 300+ electrical engineers.
- **Goal:** a phone-first directory of electrical suppliers, manufacturers and contractors in KSA. Members add suppliers and admins approve them. It replaces the repeated "who sells X?" questions in the group.
- **Main purpose: promote the group, not the directory.** Every share message carries the group join link. Byline: «يجمعه أعضاء قروب Elec in KSA».
- Group join link: https://chat.whatsapp.com/GJl9mvCQb9FBPI4gyP44y6

## 2. How to work with Ahmed (important)
- He is a **beginner, not a programmer**.
  - Explain in **simple Arabic**, step by step, as if to a 12-year-old.
  - Translate English technical terms.
- **Always ask before building:** discuss options, give a recommendation, then build. He likes multiple-choice questions with a recommended option.
- He wants **zero manual steps**. Do the deployment yourself through the browser on his laptop when it is linked. Never ask him to edit code.
- **Design rules:**
  - Tawakkalna-style look: IBM Plex Sans Arabic, bundled locally.
  - Only **two colours**: navy plus electric yellow.
  - Large, modern, mobile first. Dark mode supported.
- Before publishing, test everything locally (see §8) and show him screenshots.

## 3. Live links
| What | Where |
|---|---|
| Public site | https://ahmedeb122-bot.github.io/ahmed-ratcco.github.io/suppliers/ |
| Admin page | https://ahmedeb122-bot.github.io/ahmed-ratcco.github.io/suppliers/admin.html |
| Backend (Apps Script web app, URL never changes) | https://script.google.com/macros/s/AKfycbxlbLC7wLk2wcSCnZelHFFvbFyGUbBWLFL_BgS_cI30wfeiF32K1gVl1KGJ_lJxMY3isw/exec |
| Apps Script project «Elec in KSA - Suppliers API» (standalone, uses `SpreadsheetApp.openById`) | https://script.google.com/home/projects/1wr3h7z2NT_l0Icx0uyxCgslDDW-NP7UWkVapbcizFS4YUqg2-JQ3OlSm/edit |
| Data | Google Sheet in Ahmed's Drive. Its id is inside the Apps Script code (`SHEET_ID`), not in this repo |
| GitHub repo | `ahmedeb122-bot/ahmed-ratcco.github.io` (GitHub Pages, branch `main`) |
| Setup guide doc (version 1, written for Ahmed) | https://claude.ai/artifact/H48k6o6ZzmSuJdnj1qUSE3 |

**Admins:** Ahmed plus up to 2 more, each with their own password. The passwords live **only** in the live Apps Script project and must **never** be committed or printed.

## 4. Files
```
suppliers/                 ← what GitHub Pages serves (the live site)
  index.html               public site (HTML+CSS; script injected from suppliers-dev/app.js)
  admin.html               admin page (its script lives inside the file)
  suppliers.json           fallback copy of the list (used offline / if the API fails)
  sw.js                    service worker: network-first; BUMP `CACHE = 'elec-ksa-vN'` on every release
  manifest.webmanifest, icon-*.png, apple-touch-icon.png, fonts/*.woff2
suppliers-dev/             ← sources (not needed by the live site)
  shared.js                sections (TAXONOMY), old→new names (OLD_CATS), duplicate check — shared by site, admin and backend
  app.js                   public site script
  Code.tpl.gs              Google Apps Script backend template (placeholders __SITE_URL__, __SHEET_ID__, __PW1..3__)
  build.py                 injects shared.js/app.js into the pages, writes out/Code.public.gs and out/Code.test.gs
  tests/                   fakegas.js (runs the real backend in Node with a fake Sheet) + Playwright tests
  PROJECT_BRIEF.md         this file
```
Shared code goes between the `/*@@SHARED*/ … /*@@END*/` markers in the pages and at `//@@SHARED@@` in the template. **Always edit `shared.js` / `app.js` and run `build.py`.** Never hand-edit the injected copies.

## 5. Data model (Google Sheet)
- **Suppliers:** ID (S0001…), Status (pending/approved/rejected/deleted/merged), Name, Name_AR, Category (keys joined by ` ; `), Category_AR, Specialty, Type (Supplier/Manufacturer/Contractor), Brands, City, Contacts, Mobiles, Phones, Fax, Emails, Address, Notes, Request_ID, Submitted_By, Submitter_Phone (private), Date, Approved_By, Approved_At, Batch_ID, Dup_Of.
- **Updates:** new info for an existing supplier, waiting for approval. Columns: ID (U…), Status, Supplier_ID, Data (JSON of only the new values), Submitted_By, Submitter_Phone, Date, Approved_By, Approved_At, Batch_ID.
- **Requests:** "looking for a supplier" posts.
- **Reviews:** star ratings and comments.
- **Stats** (version 4, created automatically on the first count): Date (yyyy-MM-dd), Kind, Key, Count — one row per day + kind + key. Kinds: `visit` (key empty; one per device per day via localStorage `st_day`), `search` / `nores` (words as typed, lowercased, max 40 chars; anything with 6+ digits or an @ is dropped, so no phone numbers or e-mails), `section` (group id), `open` / `call` / `wa` / `share` (supplier ID). No names, no phone numbers, no IPs.
- `setup()` aligns old column orders by header name (`alignColumns_`) before writing headers, so it is safe to run again.
- Public JSON (`doGet`) shows only approved suppliers and hides private fields. It is cached for 5 minutes, and `clearCache()` runs after every admin action.

## 6. Sections (agreed with Ahmed, 2026-10-31)
- **Sections:** shop-style, two levels (section → optional specialty).
- **"Whole section":** a supplier can pick a whole section, stored as `@<id>`. Picking a specialty inside the section replaces `@id`.

**Suppliers tab (13 sections):**
1. cables الكابلات والأسلاك
2. panels اللوحات والقواطع
3. switches المفاتيح والأفياش
4. conduits التأسيس والمواسير والحوامل
5. lighting الإنارة
6. mv المحولات والجهد المتوسط
7. backup المولدات و UPS
8. solar الطاقة الشمسية
9. earthing التأريض والصواعق
10. fire إنذار الحريق
11. lowcurrent التيار الخفيف (CCTV, access, attendance, gates, networks, phone, PA, screens, BMS, KNX, PLC)
12. elevators المصاعد والسلالم الكهربائية (passenger & freight, escalators & walkways, spare parts) — added in version 3
13. tools العِدد وأجهزة القياس

**Rental & testing tab (`tab: 'srv'`, version 3):** group `services` التأجير والاختبارات (cranes and heavy equipment, cable pulling, test van, cable fault locating, transformer/panel testing, earthing testing). The supplier form can still pick it.

**Contractors tab («مقاولون متخصصون»):** 8 specialties (group `contracting`, `con: true`), incl. «تركيب وصيانة المصاعد» (version 3).

**Which tab a company shows in (app.js):** `isSup` = not Type Contractor and has a suppliers-tab section (or none); `isSrv` = has `services`; `isCon` = Type Contractor or has `contracting`. A company can show in more than one tab.

**Rules:**
- **«مورد شامل» (general supplier)** button = cables + panels + switches + conduits + earthing. It does **not** include lighting; Ahmed said general suppliers usually don't sell lighting.
- **Company type filter** inside a section: 🏭 مصانع / 🏪 موردون. Contractors are their own tab.
- **List order inside a section:** specialists first (fewer sections × 2, plus a named specialty), then general suppliers.
- **"Other" specialty:** free text the member types; the admin sees it.
- **Old version-1 names:** `upgradeCats()` maps them. The live data was migrated on 2026-10-31.

## 7. Features (versions 2–4)
**Public site**
- Home (version 3): smaller header; search with live suggestions; three tabs موردون ومصانع / تأجير واختبارات / مقاولون متخصصون; quick access = أضف مورداً، شارك قائمة موردين، انضم للقروب، المساهمون (join moved before contributors in version 4.2) («اطلب مورداً» removed, still in bottom nav); section tiles (empty ones say «أضف أول شركة»), recent additions, star of the month.
- List:
  - Specialty chips, type chips and city chips.
  - Each card has call, WhatsApp and share. Share opens WhatsApp with a fixed format, the home link and the group join link.
  - Excel export only when a section, search or city is selected; the full export is for admins.
- Search (version 3):
  - Two-way dictionary `SYN` → `SYN2` (Arabic ↔ English words and brands).
  - Sound skeleton `skel()`: Arabic and Latin letters map to the same consonants (سيمنس = Siemens = `smns`). Used only for words of 3+ letters; very short names (Bosch, ABB) need a `SYN` entry.
  - Suggestions under both search boxes while typing: sections, specialties, companies, brands, cities (`suggest()`).
  - Equipment search (version 4.3): words in `MACHINE` (آلة، مكينة، ماكينة، معدات، آليات، إيجار، machine, equipment, rental…) are not matched against cards; they set `tokens().rent`, which opens the rental tab (once per new search, if it has results) and sorts rental companies first; a machine word alone lists the whole rental tab. `KINDS` = equipment families matched at word start (cable pulling: ونش/winch/drum/jack/حامل/بكرات…; ramming: رامنج/ramming/piling/DTH/drill/دريل…; cranes: كرين/crane/forklift/مان ليفت…); a family word also counts as rental intent. Sound match also covers Specialty + Notes (`_sk2`, whole sound-words only, so كرين ≠ current).
  - Results sorted name-first; a «نتائج أخرى في» row links to the other tabs.
- Add (only name + phone required):
  - Ways to fill it: paste a message (auto-fill), contact .vcf, or Excel/CSV bulk upload with a template, up to 500 rows.
  - Duplicate check by phone, e-mail or name, with a warning while typing. A duplicate becomes an "update" that adds only the new values.
- Requests board, reviews, leaderboard. A bulk upload counts fully toward the leaderboard; Ahmed accepted this.
- Usage counts (version 4, app.js `track()`): each thing counts once per page visit; queued and sent as one `{type:'stats', ev:[[kind,key]…]}` with `navigator.sendBeacon` (on page hide, after 8 s, every 30 s, or at 25 events). A search counts after 1.5 s without typing; with 0 results it also counts as `nores`. Opening a supplier from a share link puts its name in the search box, so it counts as a search too.

**Admin sign-in (version 4.1):** members never sign in. Public home footer has a small «🔒 دخول المشرفين» link → `admin.html` (password screen). After sign-in, admin.html stores `admin_pass` + `admin_name` in localStorage (same origin as the site), so the public app shows a yellow bar «🔒 أنت مشرف: <name> · لوحة الإدارة · خروج» (`paintAdmin()` in app.js) and hides the footer link. «خروج» (in app or admin page) clears both keys. admin.html header has «↩ الدليل» back to the app. A stored password is cleared only on `wrong_password` (not on network errors).

**Card editing (version 4.2):** every opened card has a button under the share/rate buttons.
- Member: «اقترح تعديل» opens an inline form (`.ed-form`, `openEdit()` in app.js) prefilled with Name, Name_AR, Contacts, Mobiles, Phones, Emails, City, Brands, Specialty, Address, Notes + «ما الذي تغيّر؟», name (required) and phone (optional). Sends `{type:'suggest', id, data, by, byPhone}` with only the changed fields. Backend (`editDiff_`) stores an Updates row whose Data has `_replace:1` (+ `_why`). Rejects `no_change`, `not_found` (not approved) and `missing` (would leave no phone/e-mail). Uses the normal posting limit.
- Admin page: such updates show as «✏️ اقتراح تعديل» with قبل (struck) / بعد per field; «✅ اعتمد التعديل» REPLACES the old values (`applyUpdate_` with `_replace`), unlike normal updates which only add.
- Admin signed in on the phone (`admin_pass` in localStorage): the button is yellow «تعديل» and saves at once through the existing admin `edit` action; the app patches its data in place. Sections/specialties are not in this form (link to لوحة الإدارة). A stale password signs the admin out of the app with a message.
- List fields are shown with «،» in the form and stored with ` ; `.

**Admin page** (password remembered on the phone)
- **Pending tab:**
  - A bulk list comes as one card with «اعتمد القائمة كلها».
  - Updates show only the ➕ new values.
  - A possible duplicate shows ⚠️ with a «ادمجه فيه» button.
- **«كل الموردين» tab:**
  - ➕ add (published at once, still checked for duplicates), ✏️ edit with section chips, 🗑 delete / ↩️ restore.
  - 🔍 «قد تكون مكررة» list with **ادمج** / **ليست مكررة**. The "not a duplicate" choice is remembered per phone. When merging, the other name is kept in Brands so it stays searchable.
  - ⬇️ full Excel export.
- **«الإحصائيات» tab** (version 4, admin action `stats`, `statsSummary_(days)`): 7 / 30 / 90 days; tiles (visits, call+WhatsApp, searches, shares); daily visitors bar chart; top suppliers by call+WhatsApp+share; top searches; «بحثوا ولم يجدوا نتيجة»; top sections.
- **Security:**
  - The right password always works.
  - After 15 wrong guesses in 15 minutes, further wrong guesses are blocked.
  - Public posting limit is 150 posts per 10 minutes, shared across all members.
  - Stats beacons have their own limit (3000 per 10 minutes, `stat_flood`) and never use the posting limit. **Deploy the backend before the site** whenever the site starts sending a new request type, or the old backend would count it against the posting limit.

**Not wanted for now:** WhatsApp alerts to admins (CallMeBot). Ahmed checks the admin page himself. Direct editing of the Sheet is not used; admins do everything from the admin page. Manual Sheet edits show on the site after up to 5 minutes.

## 8. Develop and test
```bash
python3 suppliers-dev/build.py                     # after any change
node suppliers-dev/tests/fakegas.js suppliers-dev/out/Code.test.gs suppliers/suppliers.json migrate   # fake backend on :8766
cd suppliers && python3 -m http.server 8765        # site on :8765
# make test copies of the pages that talk to the fake backend:
sed 's#https://script.google.com/macros/s/[^/]*/exec#http://localhost:8766/exec#' index.html > t-index.html  (same for admin.html → t-admin.html)
```
- **Running Playwright tests:** tests in `suppliers-dev/tests/` open `t-index.html` / `t-admin.html`. They route cdnjs SheetJS to a local copy: `npm pack xlsx@0.18.5`, then fix the path at the top of each test. Admin test password: `pass1`.
- **fakegas.js options:**
  - Port: `PORT=8767`.
  - 5th arg `shuffled` seeds an old column layout, to test `alignColumns_`.
  - `/__dump` shows all sheets.
- **Background servers die when a shell runs `pkill -f fakegas`.** Start them with run_in_background and restart after each backend change.
- **Delete `t-*.html` before committing.**

## 9. Deploy (how it was done on 2026-10-31)
Needs Ahmed's laptop linked, using the built-in browser of the Claude desktop app, where he is signed in to Google and GitHub.

1. **Backend (only when `Code.tpl.gs` or `shared.js` changed):**
   1. Run `build.py`.
   2. Push `out/Code.public.gs` to a temporary branch (e.g. `tmp-setup`, as `code-v2.gs`). The branch is public, but this file has no passwords.
   3. In the Apps Script editor tab, in page JS:
      1. Fetch the file from `api.github.com/repos/…/contents/…?ref=tmp-setup`. raw.githubusercontent is blocked by CSP.
      2. Base64-decode it as UTF-8 and check a hash.
      3. Read the **current** code from `monaco.editor.getModels()[0].getValue()`.
      4. Keep the live `const ADMINS = [ … ];` block and the live `const SHEET_ID = '…';` line: replace those two pieces of the new code with the live ones **inside the browser** (regex on both). Never print them. `build.py` leaves `__SHEET_ID__` unless `suppliers-dev/local.json` exists.
      5. Before `setValue`, check the live code minus those two pieces has the hash of the previous build (proves nobody hand-edited anything else). `new Function()` is blocked by the editor's CSP, so check syntax with node in the sandbox instead.
   4. Click the editor, press Ctrl+S, and wait for «تم الحفظ».
   5. If the data needs a one-time change, select that function in the dropdown and click «تنفيذ» (Run).
   6. **نشر → إدارة عمليات النشر → ✏️ → الإصدار: الإصدار الجديد → نشر.** This keeps the same URL. Latest: Apps Script **version 5** (2026-10-31, statistics).
   7. Afterwards, force-push `main:tmp-setup` to remove the temp file.
2. **Site:** bump `CACHE` in `sw.js`, commit `suppliers/*` to `main` and push. GitHub Pages updates in about 1 minute.
3. **Check:**
   - Through the browser: the API returns `v:3` (wait up to 5 minutes for the cache); the page shows the new UI; an admin call with a wrong password returns `wrong_password`.
   - The sandbox cannot reach script.google.com directly; use the browser.

## 10. History
- **Version 1:** cards, call/WhatsApp/share, requests, reviews, leaderboard, admin page.
- **Version 2 (2026-10-31):**
  - Multiple specialties per company.
  - The 4 easy entry methods and the duplicate check.
  - Excel export.
  - Contractors tab and the 13 shop-style sections.
  - Admin add, possible-duplicates list and security fixes.
  - Data merged from 284 rows to 195 companies (89 merged); the old rows are kept with Status `merged`.
- **2026-10-31: verified import from a 166-page MEP supplier PDF.**
  - The PDF was mostly mechanical (lifts, HVAC, plumbing, pumps…). Ahmed chose: electrical sections only; drop any company that cannot be verified online; keep the official company phone/e-mail first and at most a rep whose e-mail is on the company domain.
  - Each candidate was checked on its own website (WebFetch, or the laptop's built-in browser when robots blocked it) and phone numbers were matched against the PDF text layer.
  - 14 passed. Ahmed dropped SFFECO (mainly fire-fighting equipment) and Al-Fainaq (general contractor), so **12 were sent** as one bulk batch `B261031102420` (pending, by «أحمد إبراهيم (قائمة مدقّقة)»): Sahra Control, SESO, SAS Systems Engineering, NAFFCO KSA, Al Shaikh Intl, ETECHS, Al-Alameya Group (IFMI), SYSCON, Alfaneyah, Saudi Ensas (Voltas), EWM, Al-Alamia (ASSSCO).
  - Integrators that sell and install (SAS, Al Shaikh, ETECHS, IFMI) are Type `Supplier` plus `Low Current Contracting`, so they show in both tabs. `Type: Contractor` hides a company from supplier sections (`isSup` in app.js).
  - Not added: duplicates (Siemens, Schneider, Secutron, Honeywell, Arab Emergency, Saudi Pan Gulf, SETRA, Alfanar); dead or for-sale domains; Gmail/phone-only firms; non-electrical firms.

- **Version 3 (2026-10-31):**
  - Header ~15% smaller; «اطلب مورداً» removed from quick access; «رفع قائمة Excel» renamed «شارك قائمة موردين».
  - Three tabs: suppliers & factories / rental & testing / specialised contractors.
  - New section المصاعد والسلالم الكهربائية + contractor specialty تركيب وصيانة المصاعد. Backend redeployed as Apps Script version 3 (API `v:3`, same URL); `sw.js` cache `elec-ksa-v7`.
  - Bilingual + sound-alike search with live suggestions.
- **2026-10-31: elevator companies from the same PDF (pages 1–5), verified the same way.**
  - Sent as bulk batch `B261031105500` (pending): Mitsubishi Electric Saudi (MELSA), Schindler Olayan, Otis Saudi Arabia, TK Elevator, KONE Saudi (KONE Areeco), Gulf Elevators & Escalators (FUJI), Khaled Juffali Co. (KLEEMANN).
  - OEMs are Type `Manufacturer` with Passenger & Freight Elevators + Escalators + `Elevator Installation & Maintenance`, so they appear in the elevators section and in the contractors tab.
  - Alfaneyah got `Elevator Installation & Maintenance` + brand Hyundai Elevator. It was still pending, so the backend merged this into its card in batch `B261031102420` (`merged_pending`).
  - Not added (site dead or no web presence): Fujitec (phone only), Anmar Al-Riyadh (Orona), Sanyo Elevator Saudi (domain redirects to Japan), CGC Elevators (site "coming soon", no contacts), Smart Elevators (smevo), Rakan Elevators (midgrkl), Ajyad, Al-Banaoon, Aman Al-Ibtikar.
  - Tested first on fakegas with v3 code: elevators section shows 7 companies after approval.
- **2026-10-31: version 4 – statistics.** Anonymous usage counts on the site + «الإحصائيات» tab in the admin page (see §5 Stats, §7). Backend = Apps Script version 5; site `sw.js` cache `elec-ksa-v8`. Tested on fakegas with 4 simulated visitors (exact counts; phone numbers in Latin and Arabic digits and e-mails dropped; bad keys dropped; supplier posts unaffected) and the old e2e8/e2e9 tests. Counting starts on 2026-10-31.
- **2026-10-31: admin passwords changed.** Ahmed typed the new passwords himself in the Apps Script editor (Claude never types passwords); Claude checked syntax, saved state and deployed **Apps Script version 4** (same URL). API still `v:3`; a wrong password returns `wrong_password`. Any future backend deploy must copy these new passwords from the live code (§9).

- **2026-10-31: version 4.1 – admin sign-in from the app.** Ahmed couldn't reach the admin page from the installed app (it had no link; admin.html was a separate URL only). Added footer link «🔒 دخول المشرفين», the admin bar in the app, sign-out from the app, and «↩ الدليل» in admin.html. Site only, no backend change; `sw.js` cache `elec-ksa-v9`. Tested on fakegas (visitor → wrong password → sign-in → app bar → sign-out).

- **2026-10-31: version 4.2 – edit a card.** Trigger: a Cummins Arabia sales engineer asked Ahmed to replace the contact on Cummins' card, and Ahmed found no edit button in the app. Ahmed chose: admin ✏️ directly on the card; members can suggest a fix that waits for approval; approved suggestions REPLACE old values. Also moved «انضم للقروب» before «المساهمون» in quick access (Ahmed saw it is still partly cut off on a phone and chose to keep the horizontal row as is; a 2×2 grid was offered). Backend = **Apps Script version 6** (same URL, API still `v:3`, new public type `suggest`); site `sw.js` cache `elec-ksa-v10`. Tested on fakegas (member suggests → admin sees before/after → approve replaces; admin edit in the app; stale admin password; no change / wipe contacts / unknown id rejected).
- **2026-10-31: version 4.3 – equipment search.** Trigger: a member renting ramming / DTH machines (solar pile driving); Ahmed asked that «ramming machine» find «رامنج» and that آلة/مكينة/machine searches show rental equipment, e.g. cable pulling machine = ونش سحب كابلات, Cable Drum Jack = حامل بكرات كابلات. Site only; `sw.js` cache `elec-ksa-v12`. Follow-up fix the same day: on each new search, if the current tab has no results (or a normal search is typed while on the rental tab) the app switches to the tab with the most results, so «كابلات» after an equipment search goes back to suppliers. Tested with 18 queries on fakegas (all equipment queries open the rental tab; كابلات / سيمنس / مولدات / Honeywell unchanged).

## 11. Open ideas (not requested yet)
- Review the 12 "possible duplicates" in the admin page (e.g. MESC × MESC/Middle East, SASCOM ×2, SETRA × TREND/SETRA).
- WhatsApp alerts for admins, if Ahmed ever wants them.
- Update the setup-guide doc for versions 2–3.
- Grow the `SYN` dictionary with short brand names members search for (e.g. بوش = Bosch) since the sound match skips words under 3 consonants.
- Elevators section: invite more elevator suppliers/contractors in the group (7 OEMs are pending).
- Approve batches `B261031102420` (12 companies) and `B261031105500` (7 elevator companies) in the admin page.
- The new admin passwords are 4 digits (Ahmed's choice, warned they are easy to guess). Suggest longer ones if the admin page is ever misused.
- Stats sheet grows by ~50–200 rows a day; if it ever gets slow (tens of thousands of rows), move rows older than a year to an archive sheet.
- Idea offered to Ahmed, not decided yet: a «مطابقة الأعمدة» (column-mapping) step in bulk upload, so members can confirm/correct what each Excel column means before sending.
- Approve batch `B261031102420` details: IFMI shows a false "likely duplicate" hint with "International Co. for Modern Industries"; it is a different company.
- Secutron (S0110) has no phone or e-mail in the directory. The PDF lists one rep mobile only, so it was not added.
- Cummins Arabia: the live directory has S0116 «CUMMINS / OLAYAN» and S0117 «CUMMINS / SAUDI TECHNIC». Mohamed Megahed (Sales Engineer – Power Gen, Riyadh, Cummins Saudi Arabia Ltd, a Cummins–Olayan partnership) asked to replace the current contact (Eng. Omar, Aftermarket). Ahmed can do it now with «تعديل» on the card.
- «انضم للقروب» is the 3rd pill and partly hidden on narrow phones; a 2×2 quick-access grid was offered if Ahmed changes his mind.
- Not decided: a rental specialty for pile-driving / drilling machines (رامنج / DTH) under التأجير والاختبارات (needs a backend deploy because shared.js changes). For now such companies go under «رافعات وآليات ثقيلة» with the machine type in التفاصيل.
