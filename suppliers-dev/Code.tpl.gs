/**
 * دليل موردي الكهرباء — Elec in KSA  (الإصدار 2)
 * الخادم: يربط الموقع وصفحة المشرف بجدول Google Sheet
 * — تخصصات متعددة لكل مورد، منع التكرار، تحديثات الموردين، الرفع الجماعي، التصدير
 */

// ===================== الإعدادات — Settings =====================
const SITE_URL = '__SITE_URL__';
const SHEET_ID = '__SHEET_ID__';
// المشرفون: كل مشرف له اسم وكلمة سر خاصة. whatsapp + callmebotKey اختياريان لتنبيهات واتساب
const ADMINS = [
  {name: 'Ahmed',   password: '__PW1__', whatsapp: '', callmebotKey: ''},
  {name: 'Admin 2', password: '__PW2__', whatsapp: '', callmebotKey: ''},
  {name: 'Admin 3', password: '__PW3__', whatsapp: '', callmebotKey: ''},
];
const CACHE_SECONDS = 300;
const SEED_LABEL = 'القائمة الأولى';
const MAX_BULK = 500;
// ================================================================

//@@SHARED@@

const SHEETS = {
  Suppliers: ['ID','Status','Name','Name_AR','Category','Category_AR','Specialty','Type','Brands','City',
              'Contacts','Mobiles','Phones','Fax','Emails','Address','Notes','Request_ID',
              'Submitted_By','Submitter_Phone','Date','Approved_By','Approved_At','Batch_ID','Dup_Of'],
  Requests:  ['ID','Status','Text','Category','City','Name','Phone','Date','Handled_By'],
  Reviews:   ['ID','Status','Supplier_ID','Rating','Comment','Name','Date','Approved_By','Approved_At','Phone'],
  Updates:   ['ID','Status','Supplier_ID','Data','Submitted_By','Submitter_Phone','Date','Approved_By','Approved_At','Batch_ID'],
};
const STATUS_LIST = {
  Suppliers: ['pending','approved','rejected','deleted','merged'],
  Requests:  ['open','closed','hidden'],
  Reviews:   ['pending','approved','rejected','deleted'],
  Updates:   ['pending','approved','rejected'],
};
const SUPPLIER_FIELDS = {Name:120, Name_AR:120, Category:600, Category_AR:900, Specialty:200, Type:30, Brands:300,
  City:60, Contacts:300, Mobiles:300, Phones:300, Fax:150, Emails:300, Address:250, Notes:500,
  Request_ID:20, Submitted_By:60, Submitter_Phone:30};

// ------------------------- القائمة داخل الجدول (احتياطي) -------------------------
function onOpen() {
  try {
    SpreadsheetApp.getUi().createMenu('📒 دليل الموردين')
      .addItem('🔄 تحديث الموقع الآن', 'clearCache').addItem('📲 تجربة تنبيه الواتساب', 'testWhatsApp').addToUi();
  } catch (e) {}
}
function onEdit(e) { clearCache(); }

// ------------------------- الإعداد والترقية -------------------------
function setup() {
  const ss = SpreadsheetApp.openById(SHEET_ID);
  Object.keys(SHEETS).forEach(name => {
    const sh = ss.getSheetByName(name) || ss.insertSheet(name);
    const head = SHEETS[name];
    alignColumns_(sh, head);
    if (sh.getMaxColumns() < head.length) sh.insertColumnsAfter(sh.getMaxColumns(), head.length - sh.getMaxColumns());
    sh.getRange(1, 1, 1, head.length).setValues([head]).setFontWeight('bold').setBackground('#1b2a6b').setFontColor('#ffffff');
    sh.setFrozenRows(1);
    sh.getRange(1, 1, sh.getMaxRows(), head.length).setNumberFormat('@');
    const rule = SpreadsheetApp.newDataValidation().requireValueInList(STATUS_LIST[name], true).build();
    sh.getRange(2, 2, sh.getMaxRows() - 1, 1).setDataValidation(rule);
  });
  const sup = ss.getSheetByName('Suppliers');
  if (sup.getLastRow() < 2) {
    const res = UrlFetchApp.fetch(SITE_URL.replace(/\/?$/, '/') + 'suppliers.json', {muteHttpExceptions: true});
    if (res.getResponseCode() === 200) {
      const head = SHEETS.Suppliers;
      const values = JSON.parse(res.getContentText()).map(o => head.map(h => h === 'Status' ? (o.Status || 'approved') : String(o[h] == null ? '' : o[h])));
      if (values.length) sup.getRange(2, 1, values.length, head.length).setValues(values);
    }
  }
  clearCache();
  return 'setup done';
}

// If an older version stored the columns in another order, move every column under its own name first.
function alignColumns_(sh, head) {
  const lastCol = sh.getLastColumn(), lastRow = sh.getLastRow();
  if (lastCol < 1 || lastRow < 1) return;
  const old = sh.getRange(1, 1, 1, lastCol).getDisplayValues()[0].map(h => String(h).trim());
  if (!old.some(Boolean) || head.every((h, i) => old[i] === h || (old[i] === '' && i >= old.filter(Boolean).length))) return;
  const known = old.filter(h => h && head.indexOf(h) >= 0);
  if (!known.length) return;                        // not our sheet layout: leave it alone
  const width = Math.max(lastCol, head.length);
  if (sh.getMaxColumns() < width) sh.insertColumnsAfter(sh.getMaxColumns(), width - sh.getMaxColumns());
  const data = lastRow > 1 ? sh.getRange(2, 1, lastRow - 1, lastCol).getDisplayValues() : [];
  const extra = old.map((h, i) => i).filter(i => old[i] && head.indexOf(old[i]) < 0);   // unknown columns are kept at the end
  const newHead = head.concat(extra.map(i => old[i]));
  const rows = data.map(r => head.map(h => { const i = old.indexOf(h); return i >= 0 ? r[i] : ''; }).concat(extra.map(i => r[i])));
  sh.getRange(1, 1, 1, newHead.length).setValues([newHead]);
  if (rows.length) sh.getRange(2, 1, rows.length, newHead.length).setNumberFormat('@').setValues(rows);
  if (lastCol > newHead.length) sh.getRange(1, newHead.length + 1, lastRow, lastCol - newHead.length).clearContent();
}

// One-time upgrade to version 2: new columns + Updates sheet, then one card per company.
function migrateV2() {
  setup();
  upgradeAllCategories_();
  const res = mergeExistingDuplicates_();
  clearCache();
  Logger.log(JSON.stringify(res));
  return res;
}

// version-1 specialty names -> the 12 new sections
function upgradeAllCategories_() {
  const all = readSheet_('Suppliers'); if (!all.length) return;
  const sh = sheet_('Suppliers'), col = SHEETS.Suppliers.indexOf('Category') + 1;   // Category_AR is the next column
  const rows = sh.getRange(2, col, sh.getLastRow() - 1, 2).getDisplayValues();
  const byRow = {}; all.forEach(s => { byRow[s._row] = s; });
  const out = rows.map((r, i) => { const s = byRow[i + 2]; if (!s) return r; const cats = upgradeCats(s.Category); return [joinList(cats), catsAr(cats)]; });
  sh.getRange(2, col, out.length, 2).setNumberFormat('@').setValues(out);
}

function mergeExistingDuplicates_() {
  const all = readSheet_('Suppliers');
  const live = all.filter(s => s.Status === 'approved');
  // union-find over "same company" links (same phone, e-mail or name)
  const parent = {};
  live.forEach(s => { parent[s.ID] = s.ID; });
  const find = x => { while (parent[x] !== x) x = parent[x] = parent[parent[x]]; return x; };
  const seen = [];
  live.forEach(s => {
    seen.forEach(o => {
      const d = findDuplicate(s, [o]);
      if (d && d.level === 'same') parent[find(s.ID)] = find(o.ID);
    });
    seen.push(s);
  });
  const groups = {};
  live.forEach(s => { (groups[find(s.ID)] = groups[find(s.ID)] || []).push(s); });
  let merged = 0, companies = 0;
  Object.keys(groups).forEach(gid => {
    const g = groups[gid];
    companies++;
    if (g.length < 2) return;
    // keep the most common, simplest name as the card's name
    const score = s => g.filter(o => nameKey(o.Name) === nameKey(s.Name)).length * 10 - (s.Name.indexOf('/') >= 0 ? 5 : 0)
      + splitList(s.Mobiles).length + splitList(s.Emails).length + (s.City ? 1 : 0);
    const primary = g.slice().sort((a, b) => score(b) - score(a) || a.ID.localeCompare(b.ID))[0];
    const target = Object.assign({}, primary);
    const otherNames = [];
    g.forEach(s => {
      if (s === primary) return;
      Object.assign(target, mergeDiff(target, s));
      if (nameKey(s.Name) !== nameKey(primary.Name) && otherNames.indexOf(s.Name) < 0) otherNames.push(s.Name);
      setCells_('Suppliers', s._row, {Status: 'merged', Dup_Of: primary.ID});
      merged++;
    });
    if (otherNames.length) target.Brands = joinList(splitList(target.Brands).concat(otherNames));
    const upd = {};
    ['Category','Category_AR','Contacts','Mobiles','Phones','Fax','Emails','Brands','Name_AR','City','Address','Specialty','Type']
      .forEach(f => { if ((target[f] || '') !== (primary[f] || '')) upd[f] = target[f]; });
    if (Object.keys(upd).length) setCells_('Suppliers', primary._row, upd);
  });
  return {before: live.length, companies, merged};
}

// ------------------------- أدوات مشتركة -------------------------
let SS_ = null;
function ss_() { return SS_ || (SS_ = SpreadsheetApp.openById(SHEET_ID)); }
function sheet_(name) { return ss_().getSheetByName(name); }

function readSheet_(name) {
  const sh = sheet_(name);
  if (!sh || sh.getLastRow() < 2) return [];
  const head = SHEETS[name];
  const values = sh.getRange(1, 1, sh.getLastRow(), Math.min(head.length, sh.getMaxColumns())).getDisplayValues();
  values.shift();
  return values.map((r, i) => { const o = {_row: i + 2}; head.forEach((h, j) => { o[h] = r[j] == null ? '' : r[j]; }); return o; })
    .filter(o => o.ID);
}

function findRow_(name, id) {
  const sh = sheet_(name), last = sh.getLastRow();
  if (last < 2) return 0;
  const ids = sh.getRange(2, 1, last - 1, 1).getDisplayValues();
  for (let i = 0; i < ids.length; i++) if (ids[i][0] === id) return i + 2;
  return 0;
}

function setCells_(name, row, obj) {
  const sh = sheet_(name), head = SHEETS[name];
  Object.keys(obj).forEach(k => {
    const c = head.indexOf(k);
    if (c >= 0) sh.getRange(row, c + 1).setNumberFormat('@').setValue(obj[k] == null ? '' : String(obj[k]));
  });
}

function now_() { return Utilities.formatDate(new Date(), 'Asia/Riyadh', 'yyyy-MM-dd HH:mm'); }

function clean_(v, max) {
  let s = (Array.isArray(v) ? v.join(' ; ') : String(v == null ? '' : v)).replace(/[\u0000-\u0008\u000B-\u001F]/g, '').trim().slice(0, max || 200);
  if (/^[=@+\-]/.test(s) && !/^\+?\d/.test(s)) s = "'" + s;
  return s;
}

function phoneKey_(p) { const k = phoneKey(p); return k ? (k.length === 9 ? '966' + k : k) : ''; }
function nameKey_(n) { return normText(n).replace(/^(م|eng|engr)\s+/, ''); }

// clean a supplier sent by a member
function cleanSupplier_(d) {
  const o = {};
  Object.keys(SUPPLIER_FIELDS).forEach(k => { o[k] = clean_(d[k], SUPPLIER_FIELDS[k]); });
  const cats = upgradeCats(splitList(d.Category).map(c => String(c).slice(0, 80)));
  o.Category = clean_(joinList(cats), SUPPLIER_FIELDS.Category);
  o.Category_AR = clean_(catsAr(cats), SUPPLIER_FIELDS.Category_AR);
  if (['Supplier', 'Manufacturer', 'Contractor'].indexOf(o.Type) < 0) o.Type = o.Type ? 'Supplier' : '';
  return o;
}

// ------------------------- لوحة الشرف -------------------------
function leaderboard_(suppliers) {
  const month = Utilities.formatDate(new Date(), 'Asia/Riyadh', 'yyyy-MM');
  const people = {};
  suppliers.forEach(s => {
    if (s.Status !== 'approved') return;
    const by = s.Submitted_By || '';
    if (!by || by.indexOf(SEED_LABEL) === 0) return;
    const key = phoneKey_(s.Submitter_Phone) || ('n:' + nameKey_(by));
    if (key === 'n:') return;
    const p = people[key] = people[key] || {name: by, total: 0, month: 0, answers: 0};
    p.name = by;
    p.total++;
    if (s.Request_ID) p.answers++;
    if ((s.Approved_At || s.Date || '').slice(0, 7) === month) p.month++;
  });
  const list = Object.keys(people).map(k => people[k]);
  const top = list.slice().sort((a, b) => b.total - a.total || b.answers - a.answers).slice(0, 10);
  const monthTop = list.filter(p => p.month > 0).sort((a, b) => b.month - a.month || b.total - a.total).slice(0, 3);
  return {month, top, monthTop, contributors: list.length};
}

// ------------------------- قراءة البيانات للموقع العام -------------------------
function doGet(e) {
  return ContentService.createTextOutput(getCachedList_()).setMimeType(ContentService.MimeType.JSON);
}

function publicSupplier_(s) {
  const o = Object.assign({}, s);
  ['_row', '_keys', 'Status', 'Submitter_Phone', 'Approved_By', 'Approved_At', 'Batch_ID', 'Dup_Of'].forEach(k => delete o[k]);
  return o;
}

function buildList_() {
  const all = readSheet_('Suppliers');
  const board = leaderboard_(all);
  const suppliers = all.filter(s => s.Status === 'approved').map(publicSupplier_);
  const reviews = readSheet_('Reviews').filter(r => r.Status === 'approved')
    .map(r => ({id: r.ID, sid: r.Supplier_ID, rating: Number(r.Rating) || 0, comment: r.Comment, name: r.Name, date: r.Date}));
  const answered = {};
  suppliers.forEach(s => { if (s.Request_ID) (answered[s.Request_ID] = answered[s.Request_ID] || []).push(s.ID); });
  const requests = readSheet_('Requests').filter(r => r.Status !== 'hidden').slice(-300)
    .map(r => ({id: r.ID, status: r.Status, text: r.Text, category: r.Category, city: r.City, name: r.Name,
                date: r.Date, answers: answered[r.ID] || []}));
  return JSON.stringify({ok: true, v: 2, updated: new Date().toISOString(), suppliers, reviews, requests, board});
}

function getCachedList_() {
  const cache = CacheService.getScriptCache();
  const meta = cache.get('list_n');
  if (meta) {
    const keys = []; for (let i = 0; i < Number(meta); i++) keys.push('list_' + i);
    const parts = cache.getAll(keys);
    if (Object.keys(parts).length === keys.length) return keys.map(k => parts[k]).join('');
  }
  const json = buildList_(), size = 90000, obj = {};
  let n = 0;
  for (let i = 0; i < json.length; i += size) obj['list_' + (n++)] = json.substr(i, size);
  obj.list_n = String(n);
  try { cache.putAll(obj, CACHE_SECONDS); } catch (e) {}
  return json;
}

function clearCache() {
  const keys = ['list_n']; for (let i = 0; i < 40; i++) keys.push('list_' + i);
  CacheService.getScriptCache().removeAll(keys);
}

// ------------------------- استقبال الطلبات -------------------------
function doPost(e) {
  let out;
  try {
    const body = JSON.parse(e.postData.contents);
    out = body && body.type === 'admin' ? handleAdmin_(body) : handlePublic_(body);
  } catch (err) { out = {ok: false, error: 'bad_request', detail: String(err).slice(0, 200)}; }
  return ContentService.createTextOutput(JSON.stringify(out)).setMimeType(ContentService.MimeType.JSON);
}

function flood_(weight) {
  const cache = CacheService.getScriptCache();
  const count = Number(cache.get('flood') || 0);
  if (count > 150) return true;
  cache.put('flood', String(count + (weight || 1)), 600);
  return false;
}

// Adds one supplier, or turns it into an update of an existing one. `ctx` holds the current list so a batch sees its own rows.
function addOrUpdate_(d, ctx, by, byPhone, batch) {
  const o = cleanSupplier_(d);
  o.Submitted_By = clean_(by || d.Submitted_By, 60);
  o.Submitter_Phone = clean_(byPhone || d.Submitter_Phone, 30);
  if (!o.Name || !(o.Mobiles || o.Phones || o.Emails)) return {status: 'invalid', name: o.Name};
  const dup = findDuplicate(o, ctx.list.filter(s => s.Status === 'approved' || s.Status === 'pending'));
  if (dup && dup.level === 'same') {
    const target = dup.item, diff = mergeDiff(target, o);
    if (!Object.keys(diff).length) return {status: 'exists', name: o.Name, id: target.ID, existing: target.Name};
    if (target.Status === 'pending') {            // not public yet: just complete the pending card
      setCells_('Suppliers', target._row, diff); Object.assign(target, diff); target._keys = null;
      return {status: 'merged_pending', name: o.Name, id: target.ID, existing: target.Name};
    }
    const id = ctx.nextUpd();
    ctx.updRows.push([id, 'pending', target.ID, JSON.stringify(diff), o.Submitted_By, o.Submitter_Phone, ctx.now, '', '', batch || '']);
    return {status: 'update', name: o.Name, id: target.ID, existing: target.Name, fields: Object.keys(diff)};
  }
  const id = ctx.nextSup();
  const rec = Object.assign({}, o, {ID: id, Status: 'pending', Date: ctx.now, Batch_ID: batch || '', Dup_Of: dup ? dup.item.ID : ''});
  ctx.supRows.push(SHEETS.Suppliers.map(h => rec[h] == null ? '' : String(rec[h])));
  ctx.list.push(rec);
  return {status: 'new', name: o.Name, id, likely: dup ? dup.item.Name : ''};
}

function newCtx_() {
  const list = readSheet_('Suppliers');
  const maxOf = (rows, p) => rows.reduce((m, r) => Math.max(m, parseInt(String(r.ID).replace(/\D/g, ''), 10) || 0), 0);
  let s = maxOf(list), u = maxOf(readSheet_('Updates'));
  return {list, now: now_(), supRows: [], updRows: [],
    nextSup: () => 'S' + String(++s).padStart(4, '0'), nextUpd: () => 'U' + String(++u).padStart(4, '0')};
}
function flushCtx_(ctx) {
  if (ctx.supRows.length) appendRows_(sheet_('Suppliers'), ctx.supRows);
  if (ctx.updRows.length) appendRows_(sheet_('Updates'), ctx.updRows);
}

function handlePublic_(body) {
  if (!body || typeof body !== 'object') return {ok: false, error: 'bad_request'};
  if (body.website) return {ok: true};
  if (flood_(body.type === 'bulk' ? 5 : 1)) return {ok: false, error: 'busy'};
  const lock = LockService.getScriptLock();
  lock.waitLock(25000);
  try {
    const d = body.data || {};
    if (body.type === 'supplier') {
      const ctx = newCtx_();
      const r = addOrUpdate_(d, ctx);
      if (r.status === 'invalid') return {ok: false, error: 'missing'};
      flushCtx_(ctx);
      if (r.status === 'new') alertAdmins_('🆕 مورد جديد بانتظار الموافقة\n' + r.name + (d.City ? ' – ' + clean_(d.City) : '') + (d.Submitted_By ? '\nأضافه: ' + clean_(d.Submitted_By) : ''));
      if (r.status === 'update') alertAdmins_('🔄 معلومة جديدة لمورد موجود: ' + r.existing);
      return Object.assign({ok: true}, r);
    }
    if (body.type === 'bulk') {
      const rows = Array.isArray(body.rows) ? body.rows.slice(0, MAX_BULK) : [];
      if (!rows.length) return {ok: false, error: 'missing'};
      const ctx = newCtx_(), batch = 'B' + Utilities.formatDate(new Date(), 'Asia/Riyadh', 'yyMMddHHmmss');
      const results = rows.map(r => addOrUpdate_(r || {}, ctx, body.by, body.byPhone, batch));
      flushCtx_(ctx);
      const count = st => results.filter(r => r.status === st).length;
      const sum = {new: count('new'), update: count('update') + count('merged_pending'), exists: count('exists'), invalid: count('invalid')};
      if (sum.new || sum.update) alertAdmins_('📦 قائمة جديدة من ' + (clean_(body.by, 60) || 'عضو') + ': ' + sum.new + ' جديد، ' + sum.update + ' تحديث');
      return {ok: true, batch, summary: sum, results};
    }
    if (body.type === 'request') {
      if (clean_(d.Text, 500).length < 3) return {ok: false, error: 'missing'};
      const sh = sheet_('Requests'), id = nextId_(sh, 'R');
      appendRows_(sh, [[id, 'open', clean_(d.Text, 500), clean_(d.Category, 80), clean_(d.City, 60), clean_(d.Name, 60), clean_(d.Phone, 30), now_(), '']]);
      clearCache();
      return {ok: true, id};
    }
    if (body.type === 'review') {
      const rating = Math.max(0, Math.min(5, parseInt(d.Rating, 10) || 0));
      if (!clean_(d.Supplier_ID, 20) || (!rating && !clean_(d.Comment))) return {ok: false, error: 'missing'};
      const sh = sheet_('Reviews'), id = nextId_(sh, 'V');
      appendRows_(sh, [[id, 'pending', clean_(d.Supplier_ID, 20), String(rating || ''), clean_(d.Comment, 400), clean_(d.Name, 60), now_(), '', '', clean_(d.Phone, 30)]]);
      alertAdmins_('⭐ تقييم جديد بانتظار الموافقة\n' + (rating ? '★'.repeat(rating) + ' ' : '') + clean_(d.Comment, 120));
      return {ok: true, id};
    }
    return {ok: false, error: 'bad_type'};
  } finally { lock.releaseLock(); }
}

// ------------------------- صفحة المشرف -------------------------
function adminFor_(pass) {
  const cache = CacheService.getScriptCache();
  const a = ADMINS.find(x => x.password && !/^(CHANGE|__PW)/.test(x.password) && x.password === String(pass || ''));
  if (a) return a;                                   // the right password always works
  const fails = Number(cache.get('admin_fails') || 0);
  if (fails > 15) return {blocked: true};            // too many wrong guesses: slow the guesser down
  cache.put('admin_fails', String(fails + 1), 900);
  return null;
}

function handleAdmin_(body) {
  const admin = adminFor_(body.pass);
  if (admin && admin.blocked) return {ok: false, error: 'blocked'};
  if (!admin) return {ok: false, error: 'wrong_password'};
  const act = body.action, sheetName = body.sheet, id = clean_(body.id, 20), now = now_();
  const stamp = {Approved_By: admin.name, Approved_At: now};

  if (act === 'login' || act === 'load') {
    const sup = readSheet_('Suppliers');
    const byId = {}; sup.forEach(s => { byId[s.ID] = s; });
    return {ok: true, admin: admin.name, v: 2,
      pending: sup.filter(s => s.Status === 'pending').map(s => Object.assign(publicSupplier_(s), {
        Submitter_Phone: s.Submitter_Phone, Batch_ID: s.Batch_ID, Dup_Of: s.Dup_Of, DupName: s.Dup_Of && byId[s.Dup_Of] ? byId[s.Dup_Of].Name : ''})),
      updates: readSheet_('Updates').filter(u => u.Status === 'pending').map(u => {
        const t = byId[u.Supplier_ID] || {};
        let data = {}; try { data = JSON.parse(u.Data); } catch (e) {}
        return {ID: u.ID, Supplier_ID: u.Supplier_ID, SupplierName: t.Name || u.Supplier_ID, Data: data,
          Current: Object.keys(data).reduce((m, k) => (m[k] = t[k] || '', m), {}),
          Submitted_By: u.Submitted_By, Submitter_Phone: u.Submitter_Phone, Date: u.Date, Batch_ID: u.Batch_ID};
      }),
      reviews: readSheet_('Reviews').filter(r => r.Status === 'pending')
        .map(r => Object.assign(r, {SupplierName: (byId[r.Supplier_ID] || {}).Name || r.Supplier_ID})),
      requests: readSheet_('Requests').filter(r => r.Status === 'open' && !sup.some(s => s.Status === 'approved' && s.Request_ID === r.ID)).reverse(),
      suppliers: act === 'load' ? sup.filter(s => s.Status === 'approved' || s.Status === 'deleted')
        .map(s => ({ID: s.ID, Status: s.Status, Name: s.Name, Name_AR: s.Name_AR, Category: s.Category, Category_AR: s.Category_AR,
                    City: s.City, Mobiles: s.Mobiles, Phones: s.Phones, Emails: s.Emails, Brands: s.Brands, Submitted_By: s.Submitted_By})) : [],
      board: leaderboard_(sup)};
  }
  if (act === 'get') {
    const it = readSheet_('Suppliers').find(s => s.ID === id);
    return it ? {ok: true, item: publicSupplier_(Object.assign({}, it, {Status: undefined}))} : {ok: false, error: 'not_found'};
  }
  if (act === 'export') {
    return {ok: true, suppliers: readSheet_('Suppliers').filter(s => s.Status === 'approved').map(publicSupplier_)};
  }

  const lock = LockService.getScriptLock();
  lock.waitLock(25000);
  try {
    if (act === 'add') {               // an admin adds a supplier: published at once, still checked for duplicates
      const ctx = newCtx_();
      const r = addOrUpdate_(body.data || {}, ctx, admin.name, '', '');
      if (r.status === 'invalid') return {ok: false, error: 'missing'};
      const H = SHEETS.Suppliers;
      ctx.supRows.forEach(row => { row[H.indexOf('Status')] = 'approved'; row[H.indexOf('Approved_By')] = admin.name; row[H.indexOf('Approved_At')] = now; });
      ctx.updRows.forEach(u => { const t = ctx.list.find(x => x.ID === u[2]); if (t) setCells_('Suppliers', t._row, JSON.parse(u[3])); });
      ctx.updRows = [];
      flushCtx_(ctx);
      clearCache();
      return Object.assign({ok: true}, r);
    }
    if (act === 'approve_batch') {
      const batch = clean_(body.batch, 30);
      if (!batch) return {ok: false, error: 'missing'};
      let n = 0;
      readSheet_('Suppliers').forEach(s => { if (s.Batch_ID === batch && s.Status === 'pending') { setCells_('Suppliers', s._row, Object.assign({Status: 'approved'}, stamp)); n++; } });
      readSheet_('Updates').forEach(u => { if (u.Batch_ID === batch && u.Status === 'pending') { applyUpdate_(u, stamp); n++; } });
      clearCache();
      return {ok: true, count: n};
    }
    if (act === 'merge') {            // merge a pending supplier into an existing one
      const sup = readSheet_('Suppliers');
      const src = sup.find(s => s.ID === id), dst = sup.find(s => s.ID === clean_(body.into, 20));
      if (!src || !dst) return {ok: false, error: 'not_found'};
      const diff = mergeDiff(dst, src);
      if (nameKey(src.Name) !== nameKey(dst.Name) && splitList(diff.Brands || dst.Brands).indexOf(src.Name) < 0)   // keep the other name searchable
        diff.Brands = joinList(splitList(diff.Brands || dst.Brands).concat([src.Name]));
      if (Object.keys(diff).length) setCells_('Suppliers', dst._row, diff);
      setCells_('Suppliers', src._row, Object.assign({Status: 'merged', Dup_Of: dst.ID}, stamp));
      clearCache();
      return {ok: true};
    }
    if (!SHEETS[sheetName]) return {ok: false, error: 'bad_sheet'};
    const row = findRow_(sheetName, id);
    if (!row) return {ok: false, error: 'not_found'};
    if (sheetName === 'Updates') {
      const u = readSheet_('Updates').find(x => x.ID === id);
      if (act === 'approve') applyUpdate_(u, stamp);
      else setCells_('Updates', row, Object.assign({Status: 'rejected'}, stamp));
    } else if (act === 'edit' || act === 'edit_approve') {
      const d = body.data || {}, upd = {};
      Object.keys(SUPPLIER_FIELDS).forEach(k => { if (k in d) upd[k] = clean_(d[k], SUPPLIER_FIELDS[k]); });
      if ('Category' in d) { upd.Category = clean_(joinList(splitList(d.Category)), SUPPLIER_FIELDS.Category); upd.Category_AR = clean_(catsAr(upd.Category), SUPPLIER_FIELDS.Category_AR); }
      if (sheetName === 'Suppliers') setCells_(sheetName, row, upd);
      if (act === 'edit_approve') setCells_(sheetName, row, Object.assign({Status: 'approved'}, stamp));
    } else if (act === 'approve') {
      setCells_(sheetName, row, sheetName === 'Requests' ? {Status: 'open', Handled_By: admin.name} : Object.assign({Status: 'approved'}, stamp));
    } else if (act === 'reject') {
      setCells_(sheetName, row, sheetName === 'Requests' ? {Status: 'hidden', Handled_By: admin.name} : Object.assign({Status: 'rejected'}, stamp));
    } else if (act === 'delete') {
      setCells_(sheetName, row, sheetName === 'Requests' ? {Status: 'hidden', Handled_By: admin.name} : Object.assign({Status: 'deleted'}, stamp));
    } else if (act === 'restore') {
      setCells_(sheetName, row, Object.assign({Status: 'approved'}, stamp));
    } else if (act === 'close') {
      setCells_(sheetName, row, {Status: 'closed', Handled_By: admin.name});
    } else return {ok: false, error: 'bad_action'};
    clearCache();
    return {ok: true};
  } finally { lock.releaseLock(); }
}

function applyUpdate_(u, stamp) {
  if (!u) return;
  const target = readSheet_('Suppliers').find(s => s.ID === u.Supplier_ID);
  let data = {}; try { data = JSON.parse(u.Data); } catch (e) {}
  if (target) {
    const diff = mergeDiff(target, data);     // re-check: another update may already have added some of it
    if (Object.keys(diff).length) setCells_('Suppliers', target._row, diff);
  }
  setCells_('Updates', findRow_('Updates', u.ID), Object.assign({Status: 'approved'}, stamp));
}

// ------------------------- تنبيه واتساب للمشرفين (اختياري) -------------------------
function alertAdmins_(text) {
  const msg = '[دليل الموردين – Elec in KSA]\n' + text + '\n\nللمراجعة: ' + SITE_URL.replace(/\/?$/, '/') + 'admin.html';
  ADMINS.forEach(a => {
    if (!a.whatsapp || !a.callmebotKey) return;
    try {
      UrlFetchApp.fetch('https://api.callmebot.com/whatsapp.php?phone=' + encodeURIComponent('+' + phoneKey_(a.whatsapp)) +
        '&text=' + encodeURIComponent(msg) + '&apikey=' + encodeURIComponent(a.callmebotKey), {muteHttpExceptions: true});
    } catch (e) {}
  });
}
function testWhatsApp() { alertAdmins_('✅ هذه رسالة تجربة. التنبيهات تعمل.'); }

// ------------------------- أدوات الكتابة -------------------------
function nextId_(sh, prefix) {
  const last = sh.getLastRow();
  let max = 0;
  if (last > 1) sh.getRange(2, 1, last - 1, 1).getDisplayValues().forEach(r => {
    const n = parseInt(String(r[0]).replace(/\D/g, ''), 10); if (n > max) max = n;
  });
  return prefix + String(max + 1).padStart(4, '0');
}

function appendRows_(sh, rows) {
  if (!rows.length) return;
  const r = sh.getLastRow() + 1, w = Math.max.apply(null, rows.map(x => x.length));
  const vals = rows.map(x => x.concat(Array(w - x.length).fill('')));
  sh.getRange(r, 1, vals.length, w).setNumberFormat('@').setValues(vals);
}
