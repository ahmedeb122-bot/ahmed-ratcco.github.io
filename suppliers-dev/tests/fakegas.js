// Runs the real Code.gs in Node with an in-memory fake of Google Sheets, so the site and admin page can be tested end to end.
const fs = require('fs'), vm = require('vm'), http = require('http');

class Range {
  constructor(sh, r, c, nr, nc) { Object.assign(this, {sh, r, c, nr: nr || 1, nc: nc || 1}); }
  getDisplayValues() { const o = []; for (let i = 0; i < this.nr; i++) { const row = []; for (let j = 0; j < this.nc; j++) row.push(String(this.sh.get(this.r + i, this.c + j))); o.push(row); } return o; }
  getValues() { return this.getDisplayValues(); }
  setValues(v) { v.forEach((row, i) => row.forEach((x, j) => this.sh.set(this.r + i, this.c + j, x))); return this; }
  setValue(x) { this.sh.set(this.r, this.c, x); return this; }
  setNumberFormat() { return this; } setFontWeight() { return this; } setBackground() { return this; } setFontColor() { return this; }
  setDataValidation() { return this; } clearContent() { for (let i = 0; i < this.nr; i++) for (let j = 0; j < this.nc; j++) this.sh.set(this.r + i, this.c + j, ''); return this; } getRow() { return this.r; } getNumRows() { return this.nr; }
}
class Sheet {
  constructor(name) { this.name = name; this.rows = []; }
  get(r, c) { return (this.rows[r - 1] || [])[c - 1] ?? ''; }
  set(r, c, v) { while (this.rows.length < r) this.rows.push([]); const row = this.rows[r - 1]; while (row.length < c) row.push(''); row[c - 1] = String(v).replace(/^'/, ''); }
  getRange(r, c, nr, nc) { return new Range(this, r, c, nr, nc); }
  getLastRow() { let n = this.rows.length; while (n && !this.rows[n - 1].some(x => x !== '')) n--; return n; }
  getLastColumn() { return Math.max(0, ...this.rows.map(r => { let n = r.length; while (n && r[n - 1] === '') n--; return n; })); } getMaxRows() { return 1000; } getMaxColumns() { return 30; } insertColumnsAfter() {} setFrozenRows() {} getName() { return this.name; }
}
const sheets = {};
const ss = { getSheetByName: n => sheets[n] || null, insertSheet: n => (sheets[n] = new Sheet(n)), getSheets: () => Object.values(sheets), deleteSheet() {}, getUrl: () => 'fake' };
const store = {};
const sentWA = [];
const ctx = {
  Logger: { log: (...a) => console.log('LOG', ...a) },
  SpreadsheetApp: { getActive: () => ss, openById: () => ss, getUi: () => ({ alert: m => console.log('ALERT', m), createMenu: () => ({ addItem() { return this; }, addSeparator() { return this; }, addToUi() {} }) }),
                    newDataValidation: () => ({ requireValueInList() { return this; }, build() { return {}; } }) },
  CacheService: { getScriptCache: () => ({ get: k => store[k] ?? null, put: (k, v) => { store[k] = v; }, getAll: ks => { const o = {}; ks.forEach(k => { if (k in store) o[k] = store[k]; }); return o; },
                                           putAll: o => Object.assign(store, o), removeAll: ks => ks.forEach(k => delete store[k]) }) },
  LockService: { getScriptLock: () => ({ waitLock() {}, tryLock() { return true; }, releaseLock() {} }) },
  ContentService: { MimeType: { JSON: 'json' }, createTextOutput: t => ({ t, setMimeType() { return this; } }) },
  Utilities: { formatDate: (d, tz, f) => f === 'yyyy-MM-dd' ? new Date(d.getTime() + 3 * 36e5).toISOString().slice(0, 10) : f === 'yyyy-MM' ? d.toISOString().slice(0, 7) : f === 'yyMMddHHmmss' ? d.toISOString().replace(/\D/g,'').slice(2,14) : d.toISOString().slice(0, 16).replace('T', ' ') },
  UrlFetchApp: { fetch: (u) => { if (u.includes('callmebot')) { sentWA.push(decodeURIComponent(u)); return { getResponseCode: () => 200 }; }
                                  return { getResponseCode: () => 200, getContentText: () => fs.readFileSync(process.argv[3], 'utf8') }; } },
  Session: { getEffectiveUser: () => ({ getEmail: () => '' }) },
  console,
};
let code = fs.readFileSync(process.argv[2], 'utf8').replace("whatsapp: '', callmebotKey: ''}", "whatsapp: '0551112222', callmebotKey: 'KEY1'}");
vm.createContext(ctx); vm.runInContext(code, ctx);
if (process.argv[5] === 'shuffled') {   // an old layout: other column order, no Batch_ID / Dup_Of, one unknown column
  const head = ['ID','Name','Status','Category','Name_AR','Category_AR','Specialty','Type','Brands','City','Contacts','Mobiles','Phones','Fax','Emails','Address','Notes','Request_ID','Submitted_By','Date','Approved_By','Approved_At','Submitter_Phone','Old_Col'];
  const sh = ss.insertSheet('Suppliers'); sh.rows.push(head.slice());
  JSON.parse(fs.readFileSync(process.argv[3], 'utf8')).forEach(o => sh.rows.push(head.map(h => h === 'Old_Col' ? 'x' : String(o[h] == null ? '' : o[h]))));
}
vm.runInContext(process.argv[4] === 'migrate' ? 'migrateV2()' : 'setup()', ctx);
console.log('suppliers rows', sheets.Suppliers.getLastRow() - 1);

http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*'); res.setHeader('Content-Type', 'application/json');
  if (req.url.startsWith('/__dump')) return res.end(JSON.stringify(Object.fromEntries(Object.entries(sheets).map(([k, s]) => [k, s.rows]))));
  if (req.url.startsWith('/__wa')) return res.end(JSON.stringify(sentWA));
  if (req.url.startsWith('/__sheet')) return res.end(JSON.stringify(Object.fromEntries(Object.entries(sheets).map(([k, s]) => [k, s.rows.slice(0, 1).concat(s.rows.slice(-6))]))));
  if (req.method === 'GET') { const out = ctx.doGet({}); return res.end(out.t); }
  let b = ''; req.on('data', c => b += c); req.on('end', () => { const out = ctx.doPost({ postData: { contents: b } }); res.end(out.t); });
}).listen(+(process.env.PORT || 8766), () => console.log('fake GAS on', process.env.PORT || 8766));
