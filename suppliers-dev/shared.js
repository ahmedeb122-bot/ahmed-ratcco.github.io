/* ===== shared: categories + duplicate detection (same code in the site, the admin page and the Google script) ===== */
// [key (stored), Arabic name, short Arabic, short English]. A section on its own is stored as '@' + id ("the whole section").
const TAXONOMY = [
  {id: 'cables', ar: 'الكابلات والأسلاك', en: 'Cables & wires', icon: 'cable', cats: [
    ['LV Cables', 'كابلات جهد منخفض', 'جهد منخفض', 'LV cables'],
    ['MV Cables', 'كابلات جهد متوسط', 'جهد متوسط', 'MV cables'],
    ['Building Wires', 'أسلاك التأسيس', 'أسلاك التأسيس', 'Building wires'],
    ['Control & ELV Cables', 'كابلات التحكم والتيار الخفيف', 'كابلات تحكم', 'Control cables'],
    ['Cable Accessories', 'ملحقات الكابلات (رؤوس ووصلات)', 'رؤوس ووصلات', 'Cable accessories'],
  ]},
  {id: 'panels', ar: 'اللوحات والقواطع', en: 'Panels & breakers', icon: 'panel', cats: [
    ['Distribution Boards', 'لوحات التوزيع', 'لوحات التوزيع', 'Distribution boards'],
    ['Panel Manufacturing', 'تصنيع اللوحات', 'تصنيع اللوحات', 'Panel builders'],
    ['Circuit Breakers', 'القواطع (MCB / MCCB / ACB)', 'القواطع', 'Breakers'],
    ['MCC & Control Panels', 'لوحات المحركات والتحكم MCC', 'لوحات MCC', 'MCC panels'],
  ]},
  {id: 'switches', ar: 'المفاتيح والأفياش', en: 'Switches & sockets', icon: 'plug', cats: [
    ['Wiring Devices', 'المفاتيح والأفياش', 'مفاتيح وأفياش', 'Switches & sockets'],
    ['Floor Boxes', 'صناديق الأرضيات', 'صناديق الأرضيات', 'Floor boxes'],
    ['Isolators', 'مفاتيح الفصل', 'مفاتيح الفصل', 'Isolators'],
  ]},
  {id: 'conduits', ar: 'التأسيس والمواسير والحوامل', en: 'Conduits & trays', icon: 'pipe', cats: [
    ['Conduits', 'المواسير (PVC وحديد)', 'المواسير', 'Conduits'],
    ['Boxes & First Fix', 'العلب ولوازم التأسيس', 'العلب والتأسيس', 'Boxes & first fix'],
    ['Cable Trays', 'حوامل الكابلات Cable Tray', 'حوامل الكابلات', 'Cable trays'],
    ['Trunking', 'مجاري الكابلات Trunking', 'مجاري Trunking', 'Trunking'],
    ['Busway', 'مجاري القضبان Busway', 'Busway', 'Busway'],
  ]},
  {id: 'lighting', ar: 'الإنارة', en: 'Lighting', icon: 'bulb', cats: [
    ['Indoor Lighting', 'إنارة داخلية', 'إنارة داخلية', 'Indoor lighting'],
    ['Outdoor Lighting & Poles', 'إنارة خارجية وأعمدة', 'خارجية وأعمدة', 'Outdoor & poles'],
    ['Emergency & Exit Lighting', 'إنارة الطوارئ واللوحات الإرشادية', 'إنارة الطوارئ', 'Emergency & exit'],
    ['Lighting Control', 'أنظمة التحكم بالإنارة', 'تحكم الإنارة', 'Lighting control'],
  ]},
  {id: 'mv', ar: 'المحولات والجهد المتوسط', en: 'Transformers & MV', icon: 'bolt', cats: [
    ['Transformers', 'المحولات', 'المحولات', 'Transformers'],
    ['RMU', 'وحدات الحلقة الرئيسية RMU', 'وحدات RMU', 'RMU'],
    ['Package Substations', 'المحطات المدمجة', 'المحطات المدمجة', 'Package substations'],
    ['MV Switchgear', 'مفاتيح الجهد المتوسط', 'مفاتيح جهد متوسط', 'MV switchgear'],
  ]},
  {id: 'backup', ar: 'المولدات و UPS', en: 'Generators & UPS', icon: 'gen', cats: [
    ['Generators', 'المولدات', 'المولدات', 'Generators'],
    ['ATS', 'مفاتيح التحويل ATS', 'مفاتيح ATS', 'ATS'],
    ['UPS', 'أجهزة UPS', 'أجهزة UPS', 'UPS'],
    ['Batteries', 'البطاريات', 'البطاريات', 'Batteries'],
  ]},
  {id: 'solar', ar: 'الطاقة الشمسية', en: 'Solar', icon: 'sun', cats: [
    ['Solar Panels', 'الألواح الشمسية', 'الألواح', 'Solar panels'],
    ['Solar Inverters', 'الانفرترات', 'الانفرترات', 'Inverters'],
    ['Energy Storage', 'بطاريات التخزين', 'بطاريات التخزين', 'Energy storage'],
  ]},
  {id: 'earthing', ar: 'التأريض والصواعق', en: 'Earthing & lightning', icon: 'earth', cats: [
    ['Earthing', 'التأريض', 'التأريض', 'Earthing'],
    ['Lightning Protection', 'الحماية من الصواعق', 'الصواعق', 'Lightning protection'],
  ]},
  {id: 'fire', ar: 'إنذار الحريق', en: 'Fire alarm', icon: 'fire', cats: [
    ['Fire Alarm', 'أنظمة إنذار الحريق', 'إنذار الحريق', 'Fire alarm'],
    ['VESDA', 'الكشف المبكر عن الدخان VESDA', 'VESDA', 'VESDA'],
    ['Fire Suppression', 'أنظمة الإطفاء', 'الإطفاء', 'Suppression'],
  ]},
  {id: 'lowcurrent', ar: 'التيار الخفيف', en: 'Low current', icon: 'wifi', cats: [
    ['CCTV', 'كاميرات المراقبة', 'الكاميرات', 'CCTV'],
    ['Access Control', 'التحكم بالدخول', 'التحكم بالدخول', 'Access control'],
    ['Time Attendance', 'الحضور والانصراف', 'الحضور والانصراف', 'Time attendance'],
    ['Parking & Gates', 'البوابات والمواقف', 'البوابات والمواقف', 'Parking & gates'],
    ['Data & Networks', 'الشبكات والبيانات', 'الشبكات', 'Data & networks'],
    ['Telephone Systems', 'أنظمة الهاتف', 'الهاتف', 'Telephone'],
    ['PA & Audio', 'النداء العام والصوتيات', 'النداء والصوتيات', 'PA & audio'],
    ['Screens & Clocks', 'الشاشات والساعات', 'الشاشات والساعات', 'Screens & clocks'],
    ['BMS', 'أنظمة إدارة المباني BMS', 'BMS', 'BMS'],
    ['KNX Smart Home', 'المنازل الذكية KNX', 'المنازل الذكية', 'KNX / smart home'],
    ['PLC & Automation', 'الأتمتة والتحكم PLC', 'أتمتة PLC', 'PLC & automation'],
  ]},
  {id: 'elevators', ar: 'المصاعد والسلالم الكهربائية', en: 'Elevators & escalators', icon: 'lift', cats: [
    ['Passenger & Freight Elevators', 'مصاعد ركاب وبضائع', 'مصاعد ركاب وبضائع', 'Passenger & freight'],
    ['Escalators & Walkways', 'سلالم ومماشي متحركة', 'سلالم متحركة', 'Escalators & walkways'],
    ['Elevator Spare Parts', 'قطع غيار المصاعد', 'قطع الغيار', 'Spare parts'],
  ]},
  {id: 'tools', ar: 'العِدد وأجهزة القياس', en: 'Tools & testers', icon: 'tools', cats: [
    ['Tools', 'عدد يدوية وكهربائية', 'العِدد', 'Tools'],
    ['Test & Measuring', 'أجهزة القياس والفحص', 'أجهزة القياس', 'Test & measuring'],
  ]},
  {id: 'services', tab: 'srv', ar: 'التأجير والاختبارات', en: 'Rental & testing', icon: 'crane', cats: [
    ['Cranes & Heavy Equipment', 'رافعات وآليات ثقيلة', 'رافعات وآليات', 'Cranes & heavy equipment'],
    ['Cable Pulling Equipment', 'معدات سحب ومد الكابلات', 'سحب الكابلات', 'Cable pulling'],
    ['Test Van', 'عربة اختبارات', 'عربة اختبارات', 'Test van'],
    ['Cable Fault Locating', 'كشف أعطال الكابلات', 'أعطال الكابلات', 'Cable fault locating'],
    ['Transformer & Panel Testing', 'فحص المحولات واللوحات', 'فحص المحولات واللوحات', 'Transformer & panel testing'],
    ['Earthing Testing', 'فحص وتشغيل أنظمة التأريض', 'فحص التأريض', 'Earthing testing'],
  ]},
  {id: 'contracting', con: true, ar: 'المقاولات', en: 'Contracting', icon: 'tools', cats: [
    ['Electrical Contracting', 'مقاولات كهرباء عامة', 'كهرباء عامة', 'Electrical'],
    ['Low Current Contracting', 'مقاولات تيار خفيف', 'تيار خفيف', 'Low current'],
    ['MEP Contracting', 'مقاولات MEP كاملة', 'MEP كاملة', 'Full MEP'],
    ['Solar Contracting', 'مقاولات طاقة شمسية', 'طاقة شمسية', 'Solar'],
    ['MV & Substations Contracting', 'جهد متوسط ومحطات', 'جهد متوسط ومحطات', 'MV & substations'],
    ['Testing & Commissioning', 'فحص واختبار وتشغيل', 'فحص وتشغيل', 'Testing & commissioning'],
    ['O&M', 'تشغيل وصيانة', 'تشغيل وصيانة', 'O&M'],
    ['Elevator Installation & Maintenance', 'تركيب وصيانة المصاعد', 'المصاعد', 'Elevators'],
  ]},
];
// "general supplier": one tap picks every materials section (no lighting)
const GENERAL_GROUPS = ['cables', 'panels', 'switches', 'conduits', 'earthing'];
const CAT_INFO = {};
TAXONOMY.forEach(g => {
  CAT_INFO['@' + g.id] = {key: '@' + g.id, ar: g.ar, sar: g.ar, sen: g.en, group: g.id, whole: true};
  g.cats.forEach(c => { CAT_INFO[c[0]] = {key: c[0], ar: c[1], sar: c[2], sen: c[3], group: g.id}; });
});
// old (version 1) specialty names -> new ones
const OLD_CATS = {
  'Generators & ATS': ['Generators', 'ATS'], 'Transformer': ['Transformers'], 'Package Substations & Panel Boards': ['Package Substations', 'Distribution Boards'],
  'Medium Voltage Switch Gear 33KV': ['MV Switchgear'], 'Switchgear Business Unit / SBU': ['MV Switchgear', '@panels'], 'Solar & Batteries': ['@solar'],
  'LV & MV Panel Boards': ['@panels'], 'Disconnecting Switches': ['Isolators'], 'Wiring Devices & Floor Box': ['Wiring Devices', 'Floor Boxes'],
  'Cables': ['@cables'], 'Cable Accessories (LV & MV)': ['Cable Accessories'], 'Cable Tray & Accessories': ['Cable Trays'], 'PVC Conduits and Accessories': ['Conduits'],
  'Under Floor Trunking & Raised Floor Cable Tray': ['Trunking', 'Floor Boxes'], 'Lightning Protection & Earthing': ['@earthing'],
  'Electrical Materials (1ST & 2ND Fix)': GENERAL_GROUPS.map(g => '@' + g), 'Electrical Supplies & IT Solutions': GENERAL_GROUPS.map(g => '@' + g).concat(['Data & Networks']),
  'Lighting, Fixtures & Poles': ['@lighting'], 'LED Lights (USA Made)': ['Indoor Lighting'], 'Low Current Systems & Cables': ['@lowcurrent'],
  'Data & IP Telephony Systems': ['Data & Networks', 'Telephone Systems'], 'CCTV System': ['CCTV'], 'Access Control System': ['Access Control'], 'BMS System': ['BMS'],
  'Control System (BMS – Integrated)': ['BMS'], 'Smart Home / KNX': ['KNX Smart Home'], 'Public Address System': ['PA & Audio'],
  'Audio Visual & Auditorium Systems': ['PA & Audio', 'Screens & Clocks'], 'IP CCTV, Audio Visual & Public Address': ['CCTV', 'PA & Audio'],
  'IP Clock Display System': ['Screens & Clocks'], 'IP Digital Signage System': ['Screens & Clocks'], 'Car Parking System & Gate Barrier System': ['Parking & Gates'],
  'Check In & Check Out System': ['Time Attendance'], 'Fire Alarm, VESDA & Fire Protection': ['@fire'], 'Electrical & Mechanical Works / Safety': ['MEP Contracting'],
  'Full MEP Works Contractors': ['MEP Contracting'], 'Equipment Rental': ['Cranes & Heavy Equipment'], 'O&M & General Contracting': ['O&M'], 'Lighting': ['@lighting'],
};
function upgradeCats(list) {
  const out = [];
  splitList(list).forEach(c => (OLD_CATS[c] || [c]).forEach(k => { if (out.indexOf(k) < 0) out.push(k); }));
  return out;
}
const groupsOf = cats => splitList(cats).map(c => CAT_INFO[c] ? CAT_INFO[c].group : '').filter((g, i, a) => g && a.indexOf(g) === i);

const CITY_AR = {'Riyadh': 'الرياض', 'Dammam': 'الدمام', 'Al Khobar': 'الخبر', 'Jeddah': 'جدة', 'Eastern Province': 'المنطقة الشرقية',
  'Jubail': 'الجبيل', 'Al Hasa': 'الأحساء', 'Madinah': 'المدينة المنورة', 'Makkah': 'مكة المكرمة', 'Qassim': 'القصيم', 'Abha': 'أبها',
  'Tabuk': 'تبوك', 'UAE': 'الإمارات', 'China': 'الصين', 'Canada': 'كندا', 'Austria': 'النمسا', 'Dammam, Riyadh, Jeddah': 'الدمام، الرياض، جدة'};

function splitList(s) {
  return (Array.isArray(s) ? s : String(s == null ? '' : s).split(/\s*[;؛\n]\s*/)).map(x => String(x).trim()).filter(Boolean);
}
function joinList(a) { return a.filter(Boolean).join(' ; '); }

// one key for a phone however it is written: 0501234567 = +966 50 123 4567 = 00966501234567 = (13) 835-2391
function phoneKey(p) {
  let d = String(p == null ? '' : p).replace(/ext.*$/i, '').replace(/\D/g, '');
  if (d.startsWith('00')) d = d.slice(2);
  if (d.startsWith('966')) d = d.slice(3);
  d = d.replace(/^0+/, '');
  if (d.length === 8 && /^[2-7]/.test(d)) d = '1' + d;   // landline written without its leading 1, e.g. (3) 835-2391
  return d.length >= 8 ? d : '';
}
function emailKey(e) { const m = String(e || '').toLowerCase().match(/[a-z0-9._%+\-]+@[a-z0-9.\-]+\.[a-z]{2,}/); return m ? m[0] : ''; }
const FREE_MAIL = /@(gmail|hotmail|yahoo|outlook|live|icloud|msn|aol|ymail)\./;
function normText(s) {
  return String(s || '').toLowerCase().replace(/[ً-ْـ]/g, '').replace(/[أإآ]/g, 'ا').replace(/ى/g, 'ي')
    .replace(/ة/g, 'ه').replace(/ؤ/g, 'و').replace(/ئ/g, 'ي').replace(/[^\p{L}\p{N}]+/gu, ' ').trim();
}
const NAME_STOP = new Set(['موسسه', 'co', 'company', 'cos', 'est', 'establishment', 'ltd', 'llc', 'limited', 'trading', 'trade', 'group', 'holding',
  'factory', 'industries', 'industry', 'industrial', 'the', 'and', 'for', 'of', 'corp', 'corporation', 'inc', 'ksa', 'sa', 'saudi',
  'شركه', 'مصنع', 'مجموعه', 'للتجاره', 'التجاريه', 'تجاره', 'المحدوده', 'محدوده', 'للمقاولات', 'مقاولات', 'و', 'ذ', 'م', 'م.']);
function nameKey(n) {
  const words = normText(String(n || '').replace(/\(.*?\)/g, ' ')).split(' ')
    .filter(w => w && !NAME_STOP.has(w)).map(w => (w.length > 4 && w.startsWith('ال')) ? w.slice(2) : w).filter(w => w !== 'al' && w !== 'el');
  let k = words.join('');
  if (/^al[a-z]{4,}/.test(k)) k = k.slice(2);
  return k;
}
function dice(a, b) {
  if (!a || !b) return 0;
  if (a === b) return 1;
  const grams = s => { const m = {}; for (let i = 0; i < s.length - 1; i++) { const g = s.slice(i, i + 2); m[g] = (m[g] || 0) + 1; } return m; };
  const A = grams(a), B = grams(b); let inter = 0, na = 0, nb = 0;
  Object.keys(A).forEach(g => { na += A[g]; if (B[g]) inter += Math.min(A[g], B[g]); });
  Object.keys(B).forEach(g => { nb += B[g]; });
  return na + nb ? (2 * inter) / (na + nb) : 0;
}
function supplierKeys(s) {
  return {
    phones: splitList((s.Mobiles || '') + ';' + (s.Phones || '')).map(phoneKey).filter(Boolean),
    emails: splitList(s.Emails).map(emailKey).filter(Boolean),
    name: nameKey(s.Name), nameAr: nameKey(s.Name_AR),
  };
}
// returns {item, level: 'same' | 'likely', why} or null
function findDuplicate(cand, list, skipId) {
  const c = supplierKeys(cand);
  let likely = null;
  for (const s of list) {
    if (!s || s.ID === skipId) continue;
    const k = s._keys || (s._keys = supplierKeys(s));
    const p = c.phones.find(x => k.phones.includes(x));
    if (p) return {item: s, level: 'same', why: 'phone'};
    if (c.emails.find(x => k.emails.includes(x))) return {item: s, level: 'same', why: 'email'};
    if (c.name.length >= 3 && (c.name === k.name || c.name === k.nameAr)) return {item: s, level: 'same', why: 'name'};
    if (c.nameAr.length >= 3 && (c.nameAr === k.name || c.nameAr === k.nameAr)) return {item: s, level: 'same', why: 'name'};
    if (!likely) {
      const dom = c.emails.map(e => e.split('@')[1]).find(d => !FREE_MAIL.test('@' + d) && k.emails.some(e => e.endsWith('@' + d)));
      if (dom) likely = {item: s, level: 'likely', why: 'domain'};
      else if (c.name.length >= 5 && k.name.length >= 5 && dice(c.name, k.name) >= 0.85) likely = {item: s, level: 'likely', why: 'similar_name'};
      else if (c.name && k.name && Math.min(c.name.length, k.name.length) >= 4 && (c.name.startsWith(k.name) || k.name.startsWith(c.name))) likely = {item: s, level: 'likely', why: 'similar_name'};
    }
  }
  return likely;
}
const LIST_FIELDS = {Mobiles: phoneKey, Phones: phoneKey, Fax: phoneKey, Emails: emailKey, Contacts: normText, Category: x => x, Brands: normText};
const FILL_FIELDS = ['Name_AR', 'City', 'Address', 'Specialty'];
// what `src` adds to `target` (only new values). Returns {} when nothing is new.
function mergeDiff(target, src) {
  const out = {};
  Object.keys(LIST_FIELDS).forEach(f => {
    const keyOf = LIST_FIELDS[f], have = splitList(target[f]), haveKeys = have.map(keyOf);
    const known = k => f === 'Contacts' ? haveKeys.some(h => h.includes(k) || k.includes(h)) : haveKeys.includes(k);
    const add = splitList(src[f]).filter(v => { const k = keyOf(v); return k && !known(k) && (haveKeys.push(k), true); });
    if (add.length) out[f] = joinList(have.concat(add));
  });
  FILL_FIELDS.forEach(f => { if (!String(target[f] || '').trim() && String(src[f] || '').trim()) out[f] = String(src[f]).trim(); });
  if (out.Category) out.Category_AR = catsAr(out.Category);
  return out;
}
function catsAr(cats) { return joinList(splitList(cats).map(c => (CAT_INFO[c] ? CAT_INFO[c].ar : c))); }
/* ===== end shared ===== */
