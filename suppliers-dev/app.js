(() => {
'use strict';
const $ = s => document.querySelector(s);
const $$ = s => document.querySelectorAll(s);
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const G = CONFIG.GROUP_NAME;

/*@@SHARED*/
/*@@END*/

/* ---------- icons ---------- */
const P = {
 search:'<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
 home:'<path d="M3 11 12 3l9 8"/><path d="M5 10v10h5v-6h4v6h5V10"/>',
 list:'<path d="M8 6h13M8 12h13M8 18h13"/><circle cx="3.5" cy="6" r="1"/><circle cx="3.5" cy="12" r="1"/><circle cx="3.5" cy="18" r="1"/>',
 plus:'<path d="M12 5v14M5 12h14"/>',
 chat:'<path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1.1-4.6A8 8 0 1 1 21 12z"/><path d="M8.5 11h7M8.5 14.5h4"/>',
 trophy:'<path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0z"/><path d="M17 5h3v2a3 3 0 0 1-3 3M7 5H4v2a3 3 0 0 0 3 3"/>',
 back:'<path d="M15 6l-6 6 6 6"/>',
 user:'<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
 call:'<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2"/>',
 share:'<circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="m8.6 13.5 6.8 4M15.4 6.5l-6.8 4"/>',
 star:'<path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1 6.2-5.5-2.9-5.5 2.9 1-6.2L3 9.6l6.2-.9z"/>',
 cable:'<path d="M3 6h5a3 3 0 0 1 0 6H7a3 3 0 0 0 0 6h11"/><path d="M18 15v6M21 16v4"/>',
 bolt:'<path d="M13 2 4.5 13.5H11L10 22l8.5-11.5H12z"/>',
 bulb:'<path d="M9 18h6M10 21.5h4"/><path d="M12 2.5a6.5 6.5 0 0 0-3.8 11.8c.5.4.8 1 .8 1.6V16h6v-.1c0-.6.3-1.2.8-1.6A6.5 6.5 0 0 0 12 2.5z"/>',
 fire:'<path d="M12 22c4 0 7-2.8 7-6.8 0-3.5-2.4-5.6-3.6-8.2-.9 1.7-1.9 2.6-2.9 2.8.2-2.6-.9-5-3-6.8.2 4.1-4.5 6.6-4.5 12.2C5 19.2 8 22 12 22z"/>',
 wifi:'<path d="M2 9a15 15 0 0 1 20 0M5.5 12.5a10 10 0 0 1 13 0M9 16a5 5 0 0 1 6 0"/><circle cx="12" cy="19.5" r="1"/>',
 tools:'<path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-2.4 2.4-2.6-.4-.4-2.6z"/>',
 panel:'<rect x="4" y="3" width="16" height="18" rx="2"/><path d="M8 7h8M8 11h3M13 11h3M8 15h3M13 15h3"/>',
 box:'<path d="M3 7.5 12 3l9 4.5v9L12 21l-9-4.5z"/><path d="M3 7.5 12 12l9-4.5M12 12v9"/>',
 sheet:'<rect x="3.5" y="3" width="17" height="18" rx="2"/><path d="M3.5 9h17M3.5 15h17M10 3v18"/>',
 clip:'<rect x="6" y="4" width="12" height="17" rx="2"/><path d="M9 4V2.5h6V4M9 10h6M9 14h6"/>',
 download:'<path d="M12 3v12M7 10l5 5 5-5M4 20h16"/>',
 upload:'<path d="M12 21V9M7 14l5-5 5 5M4 4h16"/>',
 plug:'<path d="M9 2v5M15 2v5M6 7h12v4a6 6 0 0 1-12 0z"/><path d="M12 17v5"/>',
 pipe:'<path d="M3 8h18M3 16h18"/><path d="M6 8v8M18 8v8"/>',
 gen:'<rect x="3" y="6" width="18" height="12" rx="2"/><path d="m12 8-2.5 4h5L12 16"/>',
 sun:'<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
 earth:'<path d="M12 3v10M5 13h14M7.5 17h9M10 21h4"/>',
 crane:'<path d="M4 21h8M7 21V4l12 4H7M17 8v5"/><path d="M15 13h4v3h-4z"/>',
 lift:'<rect x="4.5" y="2.5" width="15" height="19" rx="2"/><path d="M12 2.5v19M6.8 9.5 8.3 7.5 9.8 9.5M14.2 7.5 15.7 9.5 17.2 7.5"/>',
 store:'<path d="M4 9h16l-1-5H5z"/><path d="M5 9v11h14V9M9 20v-6h6v6"/>',
};
const icon = n => n === 'wa'
  ? '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2m0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2m4.5-6.1c-.2-.1-1.5-.7-1.7-.8s-.4-.1-.6.1-.6.8-.8 1-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.3-.4.8-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.9 11.9 0 0 0 4.6 4c1.7.7 2.4.8 3.2.7a2.8 2.8 0 0 0 1.8-1.3 2.3 2.3 0 0 0 .2-1.3c-.1-.1-.3-.2-.5-.3"/></svg>'
  : `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${P[n] || P.bolt}</svg>`;
const paintIcons = (root = document) => root.querySelectorAll('[data-icon]').forEach(el => { el.innerHTML = icon(el.dataset.icon); });
const GROUP_OF = id => TAXONOMY.find(g => g.id === id);
const groupIcon = s => { const c = (s._cats || [])[0]; const g = c && CAT_INFO[c] ? GROUP_OF(CAT_INFO[c].group) : null; return g ? g.icon : 'box'; };

/* ---------- words ---------- */
const T = {
 ar:{title:'دليل موردي الكهرباء',brand_sub:'قروب مهندسي الكهرباء',search_ph:'ابحث: Honeywell، كابلات، مولدات…',
  mode_sup:'موردون ومصانع',mode_srv:'تأجير واختبارات',mode_con:'مقاولون متخصصون',q_ask:'اطلب مورداً',q_add:'أضف مورداً',q_bulk:'شارك قائمة موردين',
  sg_all:q=>`كل النتائج لـ «${q}»`,sg_sec:'قسم',sg_spec:'تخصص',sg_co:'شركة',sg_brand:'ماركة',sg_city:'مدينة',also_in:'نتائج أخرى في:',q_join:'انضم للقروب',
  inst_h:'ثبّت الدليل على جوالك',inst_p:'أيقونة بجانب واتساب، تفتح مثل التطبيق',inst_btn:'تثبيت',inst_ios:'اضغط زر المشاركة ⬆️ ثم «إضافة إلى الشاشة الرئيسية»',
  cats_h:'استكشف التصنيفات',quick_h:'الوصول السريع',see_all_cats:'عرض الكل',by_line:(n,c)=>`<b>${n}</b> شركة في <b>${c}</b> قسماً · يجمعه أعضاء قروب ${G}`,
  see_all:'كل الموردين',recent_h:'آخر الإضافات',all_sup:'كل الموردين',all_srv:'كل التأجير والاختبارات',all_con:'كل المقاولين',all_in:'الكل',
  n_home:'الرئيسية',n_list:'الدليل',n_req:'الطلبات',n_board:'المساهمون',all_city:'كل المدن',
  found:n=>`${n} شركة`,showing:(a,b)=>`يظهر ${a} من ${b}`,more:'عرض المزيد',sup_n:n=>`${n} شركة`,
  empty_h:'لم نجد مورداً بهذا البحث',empty_p:'اطلبه من الأعضاء، وعندما يرد أحدهم يُضاف إلى الدليل للجميع.',ask_btn:'اطلب هذا المورد',add_btn:'أعرف مورداً، أضيفه',
  contact:'المسؤول',mobile:'جوال',phone:'هاتف',fax:'فاكس',email:'إيميل',address:'العنوان',brands:'الماركات وأسماء أخرى',notes:'ملاحظات',city:'المدينة',spec:'التفاصيل',cats:'التخصصات',
  call:'اتصال',whatsapp:'واتساب',share:'مشاركة',rate:'قيّم',
  mfr:'مصنع',sup:'مورد',con:'مقاول',inactive:'غير نشط',added_by:'أضافه',no_reviews:'لا توجد تقييمات بعد.',
  rv_h:'تقييمك',rv_comment:'تعليقك (مثال: الأسعار ممتازة، أو الرقم لا يرد)',rv_send:'أرسل التقييم',
  tab_req:'طلبات الأعضاء',req_h:'تبحث عن مورد ولم تجده؟',req_p:'اكتب طلبك. من يعرف المورد يضغط «أعرف المورد» ويضيف بياناته.',req_text:'ماذا تبحث عنه؟',
  req_text_ph:'مثال: مورد أكسس كنترول Kantech في الرياض',your_name:'اسمك',your_phone:'رقمك',optional_phone:'(اختياري — لا يظهر لأحد)',optional:'(اختياري)',req_send:'انشر الطلب',
  req_n:n=>`الطلبات (${n})`,req_open:'بانتظار رد',req_done:'تم الرد',i_know:'أعرف المورد',see_answer:'عرض المورد',no_req:'لا توجد طلبات حالياً.',
  tab_board:'المساهمون',month_h:'نجم الشهر',month_p:'الأكثر إضافة للموردين هذا الشهر',board_h:'لوحة الشرف',board_p:'تُحسب الإضافات بعد موافقة المشرف.',
  board_cta:'أضف مورداً وانضم للوحة',month_empty:'لا أحد بعد هذا الشهر — كن أنت!',board_empty:'اللوحة فارغة. أول من يضيف مورداً يتصدر!',
  adds:n=>n==1?'إضافة واحدة':n==2?'إضافتان':`${n} ${n<=10?'إضافات':'إضافة'}`,answers_n:n=>n==1?'ردّ على طلب واحد':n==2?'ردّ على طلبين':`ردّ على ${n} ${n<=10?'طلبات':'طلباً'}`,
  add_h:'أضف مورداً',add_p:'يظهر للجميع بعد موافقة المشرف. ثلاث خانات فقط مطلوبة.',
  fast_paste:'الصق رسالة',fast_vcf:'من جهات الاتصال',fast_bulk:'رفع قائمة',
  paste_p:'الصق هنا رسالة المورد أو توقيع الإيميل أو بطاقة العمل، وسنستخرج الاسم والأرقام والإيميل تلقائياً.',paste_ph:'مثال:\nشركة النور للكابلات\nم. أحمد – 0501234567\nsales@alnoor.com – الدمام',
  paste_go:'استخرج البيانات',filled:n=>`✨ عبّأنا ${n} خانات تلقائياً. راجعها ثم اختر التخصصات.`,filled_none:'لم نجد بيانات واضحة في النص. اكتبها يدوياً.',
  f_name:'اسم الشركة أو المورد',f_mob:'رقم الجوال أو الهاتف',f_mob_h:'أكثر من رقم؟ افصل بينها بفاصلة',f_type:'النوع',f_cats:'التخصصات',
  f_cats_h:'اضغط على الأقسام التي يبيعها. ضغطة على القسم تعني أنه يبيع القسم كله.',picked:n=>n?`(${n} مختار)`:'',picked_secs:n=>!n?'':n==1?'(قسم واحد)':n==2?'(قسمان)':n<=10?`(${n} أقسام)`:`(${n} قسماً)`,gen_b:'مورد شامل',gen_s:'كل مواد الكهرباء (بدون الإنارة)',fine_h:'حدد أكثر (اختياري)',fine_p:'إذا كان يبيع أشياء محددة فقط داخل القسم، اخترها. وإن تركتها فالمعنى: القسم كله.',whole:'القسم كله',f_other:'تخصص آخر غير موجود؟',f_other_ph:'اكتبه هنا (اختياري)',all_types:'الكل',be_first:'أضف أول شركة',f_mfrs:'🏭 مصانع',f_sups:'🏪 موردون',city_other:'مدينة أخرى',more_details:'تفاصيل أكثر (اختياري)',
  f_brands:'الماركات التي يوردها',f_brands_h:'(مثل Honeywell, Bosch)',t_sup:'مورد',t_mfr:'مصنع',t_con:'مقاول',f_spec:'المنتجات أو التخصص بالتفصيل',
  f_contact:'اسم الشخص المسؤول',f_tel:'هاتف المكتب',f_email:'الإيميل',f_addr:'العنوان',f_notes:'ملاحظات',add_send:'أرسل للمراجعة',
  answering:t=>`أنت ترد على الطلب: «${t}»`,
  dup_same:n=>`⚠️ هذا المورد موجود في الدليل: <b>${n}</b>`,dup_same_p:'إذا عندك معلومة جديدة له (رقم آخر، تخصص، مدينة) أكمل الإرسال وستُضاف لبطاقته بعد موافقة المشرف.',
  dup_likely:n=>`قد يكون نفس المورد: <b>${n}</b>`,dup_open:'افتح البطاقة',
  sent_sup:'وصلنا المورد ✅ سيظهر بعد موافقة المشرف. شكراً لمساهمتك.',sent_upd:n=>`شكراً ✅ معلومتك الجديدة لـ «${n}» بانتظار موافقة المشرف.`,
  sent_exists:n=>`«${n}» موجود في الدليل بنفس البيانات، لا حاجة لإضافته 👍`,sent_req:'تم نشر طلبك ✅ شارك رابط الدليل في القروب ليرد الأعضاء.',
  sent_rv:'وصلنا تقييمك ✅ سيظهر بعد موافقة المشرف.',need_name:'اكتب اسم المورد.',need_contact:'أضف رقم جوال أو هاتف أو إيميل.',need_cats:'اختر قسماً واحداً على الأقل.',need_text:'اكتب ماذا تبحث عنه.',
  need_rate:'اختر عدد النجوم أو اكتب تعليقاً.',busy:'الخدمة مشغولة الآن، حاول بعد دقائق.',neterr:'لم يصل الإرسال. تأكد من الإنترنت وحاول مرة أخرى.',
  not_connected:'الإضافة غير مفعّلة بعد — المشرف يكمل الإعداد.',sending:'جارٍ الإرسال…',
  bulk_h:'رفع قائمة موردين',bulk_h2:'عندك قائمة؟ ارفعها دفعة واحدة',bulk_p:'ارفع ملف Excel أو CSV بأي ترتيب أعمدة. نتعرف على الأعمدة تلقائياً، ونستبعد الموردين الموجودين، ونعرض لك النتيجة قبل الإرسال.',
  bulk_pick:'اختر الملف',bulk_tpl:'تحميل القالب',bulk_reading:'جارٍ قراءة الملف…',bulk_bad:'لم نجد عمود «اسم الشركة» في الملف. حمّل القالب واستخدمه.',bulk_empty:'الملف فارغ.',
  s_new:'جديد',s_upd:'معلومة جديدة',s_exists:'موجود',s_invalid:'ناقص',bulk_send:n=>`أرسل ${n} للمراجعة`,bulk_nothing:'لا يوجد جديد في هذه القائمة — كل الموردين موجودون مسبقاً 👍',
  bulk_done:(a,b)=>`✅ وصلت القائمة: ${a} مورد جديد و${b} تحديث بانتظار موافقة المشرف. شكراً لك!`,bulk_more:n=>`و${n} صفاً آخر…`,bulk_libfail:'تعذّر تحميل قارئ ملفات Excel. تأكد من الإنترنت وحاول مرة أخرى.',
  x_title:`دليل موردي الكهرباء – قروب ${G}`,x_join:'للانضمام للقروب',x_need:'اختر تصنيفاً أو مدينة أو ابحث أولاً، ثم حمّل النتيجة.',x_done:'تم تجهيز ملف Excel ✅',
  copy:y=>`© ${y} ${G} — جميع الحقوق محفوظة`,disclaimer:'البيانات يضيفها أعضاء القروب للفائدة. تأكد من المورد قبل أي تعامل مالي.',
  join_line:'🔹 للانضمام لقروب الواتساب:',dir_line:`📒 صفحة دليل موردي الكهرباء – قروب ${G}`,share_wa:'مشاركة في واتساب',no_wa:'لا يوجد رقم جوال',ago_today:'اليوم',ago_days:n=>`قبل ${n} يوم`},
 en:{title:'Electrical Suppliers Directory',brand_sub:'Electrical engineers group',search_ph:'Search: Honeywell, cables, generators…',
  mode_sup:'Suppliers',mode_srv:'Rental & testing',mode_con:'Contractors',q_ask:'Ask',q_add:'Add supplier',q_bulk:'Share a supplier list',
  sg_all:q=>`All results for “${q}”`,sg_sec:'Section',sg_spec:'Specialty',sg_co:'Company',sg_brand:'Brand',sg_city:'City',also_in:'Also found in:',q_join:'Join group',
  inst_h:'Install on your phone',inst_p:'An icon next to WhatsApp, opens like an app',inst_btn:'Install',inst_ios:'Tap Share ⬆️ then “Add to Home Screen”',
  cats_h:'Explore categories',quick_h:'Quick access',see_all_cats:'See all',by_line:(n,c)=>`<b>${n}</b> companies in <b>${c}</b> sections · collected by ${G} members`,
  see_all:'All suppliers',recent_h:'Recently added',all_sup:'All suppliers',all_srv:'All rental & testing',all_con:'All contractors',all_in:'All',
  n_home:'Home',n_list:'Directory',n_req:'Requests',n_board:'Top',all_city:'All cities',
  found:n=>`${n} companies`,showing:(a,b)=>`Showing ${a} of ${b}`,more:'Show more',sup_n:n=>`${n} companies`,
  empty_h:'No supplier found',empty_p:'Ask the members. When someone answers, it is added for everyone.',ask_btn:'Ask for it',add_btn:'I know one, add it',
  contact:'Contact',mobile:'Mobile',phone:'Phone',fax:'Fax',email:'E-mail',address:'Address',brands:'Brands & other names',notes:'Notes',city:'City',spec:'Details',cats:'Specialties',
  call:'Call',whatsapp:'WhatsApp',share:'Share',rate:'Rate',
  mfr:'Manufacturer',sup:'Supplier',con:'Contractor',inactive:'Not active',added_by:'Added by',no_reviews:'No reviews yet.',
  rv_h:'Your rating',rv_comment:'Your comment (e.g. good prices, or number not answering)',rv_send:'Send review',
  tab_req:'Member requests',req_h:'Looking for a supplier?',req_p:'Post what you need. Members who know one tap “I know a supplier”.',req_text:'What are you looking for?',
  req_text_ph:'e.g. Kantech access control supplier in Riyadh',your_name:'Your name',your_phone:'Your phone',optional_phone:'(optional — never shown)',optional:'(optional)',req_send:'Post request',
  req_n:n=>`Requests (${n})`,req_open:'Waiting',req_done:'Answered',i_know:'I know a supplier',see_answer:'See supplier',no_req:'No requests yet.',
  tab_board:'Contributors',month_h:'Star of the month',month_p:'Most suppliers added this month',board_h:'Leaderboard',board_p:'Counted after admin approval.',
  board_cta:'Add a supplier and join the board',month_empty:'Nobody yet this month — be the first!',board_empty:'The board is empty. The first to add a supplier leads!',
  adds:n=>`${n} added`,answers_n:n=>`answered ${n} requests`,
  add_h:'Add a supplier',add_p:'Shown to everyone after admin approval. Only three fields are required.',
  fast_paste:'Paste a message',fast_vcf:'From contacts',fast_bulk:'Upload a list',
  paste_p:'Paste a supplier message, e-mail signature or business card text. We pick out the name, numbers and e-mail.',paste_ph:'e.g.\nAl Noor Cables Co.\nEng. Ahmed – 0501234567\nsales@alnoor.com – Dammam',
  paste_go:'Fill the form',filled:n=>`✨ Filled ${n} fields. Check them, then pick the specialties.`,filled_none:'No clear details found. Please type them.',
  f_name:'Company / supplier name',f_mob:'Mobile or phone',f_mob_h:'More than one? Separate with a comma',f_type:'Type',f_cats:'Specialties',
  f_cats_h:'Tap the sections it sells. One tap = the whole section.',picked:n=>n?`(${n} picked)`:'',picked_secs:n=>n?`(${n} sections)`:'',gen_b:'General supplier',gen_s:'All electrical materials (no lighting)',fine_h:'Be more specific (optional)',fine_p:'Only sells certain items in a section? Pick them. Leave empty = the whole section.',whole:'whole section',f_other:'Another specialty?',f_other_ph:'Type it here (optional)',all_types:'All',be_first:'Add the first one',f_mfrs:'🏭 Manufacturers',f_sups:'🏪 Suppliers',city_other:'Other city',more_details:'More details (optional)',
  f_brands:'Brands supplied',f_brands_h:'(e.g. Honeywell, Bosch)',t_sup:'Supplier / agent',t_mfr:'Manufacturer',t_con:'Contractor',f_spec:'Products in detail',
  f_contact:'Contact person',f_tel:'Office phone',f_email:'E-mail',f_addr:'Address',f_notes:'Notes',add_send:'Send for review',
  answering:t=>`You are answering: “${t}”`,
  dup_same:n=>`⚠️ Already in the directory: <b>${n}</b>`,dup_same_p:'Have something new for it (another number, specialty, city)? Send it and it is added to its card after approval.',
  dup_likely:n=>`Might be the same as: <b>${n}</b>`,dup_open:'Open card',
  sent_sup:'Received ✅ It appears after admin approval. Thank you.',sent_upd:n=>`Thanks ✅ Your new details for “${n}” are waiting for approval.`,
  sent_exists:n=>`“${n}” is already listed with these details 👍`,sent_req:'Request posted ✅ Share the link in the group so members can answer.',
  sent_rv:'Review received ✅ It will appear after approval.',need_name:'Enter the supplier name.',need_contact:'Add a mobile, phone or e-mail.',need_cats:'Pick at least one section.',need_text:'Write what you are looking for.',
  need_rate:'Pick stars or write a comment.',busy:'Busy right now, try again in a few minutes.',neterr:'Not sent. Check your connection and try again.',
  not_connected:'Adding is not switched on yet.',sending:'Sending…',
  bulk_h:'Upload a supplier list',bulk_h2:'Have a list? Upload it in one go',bulk_p:'Upload an Excel or CSV file with any column order. We detect the columns, skip suppliers already listed and show you the result before sending.',
  bulk_pick:'Choose file',bulk_tpl:'Download template',bulk_reading:'Reading the file…',bulk_bad:'No company name column found. Download the template and use it.',bulk_empty:'The file is empty.',
  s_new:'New',s_upd:'New info',s_exists:'Listed',s_invalid:'Incomplete',bulk_send:n=>`Send ${n} for review`,bulk_nothing:'Nothing new in this list — every supplier is already listed 👍',
  bulk_done:(a,b)=>`✅ List received: ${a} new suppliers and ${b} updates are waiting for approval. Thank you!`,bulk_more:n=>`and ${n} more rows…`,bulk_libfail:'Could not load the Excel reader. Check your connection and try again.',
  x_title:`Electrical Suppliers Directory – ${G} group`,x_join:'Join the group',x_need:'Pick a category or city, or search first, then download the result.',x_done:'Excel file ready ✅',
  copy:y=>`© ${y} ${G} — all rights reserved`,disclaimer:'Listings are shared by group members. Verify a supplier before any payment.',
  join_line:'🔹 Join the WhatsApp group:',dir_line:`📒 Electrical Suppliers Directory – ${G} group`,share_wa:'Share on WhatsApp',no_wa:'No mobile number',ago_today:'today',ago_days:n=>`${n}d ago`}
};
let lang = 'ar';
try { lang = localStorage.getItem('lang') || 'ar'; } catch(e){}
const t = (k, ...a) => { const v = (T[lang] && T[lang][k] !== undefined) ? T[lang][k] : T.ar[k]; return typeof v === 'function' ? v(...a) : (v ?? k); };
const catName = c => CAT_INFO[c] ? (lang === 'ar' ? CAT_INFO[c].ar : c) : c;
const catShort = c => CAT_INFO[c] ? (lang === 'ar' ? CAT_INFO[c].sar : CAT_INFO[c].sen) : c;
const groupName = g => lang === 'ar' ? g.ar : g.en;
const cityName = c => lang === 'ar' ? (CITY_AR[c] || c) : c;

/* ---------- search ---------- */
const SYN = {
 'كابل':'cable','كابلات':'cable','كيبل':'cable','مولد':'generator','مولدات':'generator','جنريتر':'generator','انارة':'lighting','اناره':'lighting','اضاءه':'lighting','كشافات':'lighting',
 'كاميرات':'cctv','كاميرا':'cctv','مراقبه':'cctv','حريق':'fire','انذار':'alarm','محول':'transformer','محولات':'transformer','لوحات':'panel','لوحه':'panel','طبلون':'panel',
 'تاريض':'earthing','ارضي':'earthing','صواعق':'lightning','اكسس':'access','دخول':'access','بوابات':'gate','مواقف':'parking','صوت':'audio','مفاتيح':'switch','افياش':'wiring',
 'مواسير':'conduit','حوامل':'tray','تري':'tray','باسواي':'busway','بطاريات':'ups','شبكات':'data','خفيف':'low current','شمسيه':'solar','سولار':'solar',
 'الرياض':'riyadh','رياض':'riyadh','الدمام':'dammam','دمام':'dammam','الخبر':'khobar','خبر':'khobar','جده':'jeddah','الشرقيه':'eastern','الجبيل':'jubail',
 'مصعد':'elevator','مصاعد':'elevator','اسانسير':'elevator','اصانصير':'elevator','سلالم':'escalator','تاجير':'rental','اختبار':'testing','اختبارات':'testing','فحص':'testing',
 'رافعه':'crane','رافعات':'crane','كرين':'crane','مقاول':'contracting','مقاولين':'contracting','مقاولات':'contracting','صيانه':'maintenance','قواطع':'breaker','قاطع':'breaker','عدد':'tools','ادوات':'tools',
 'مصنع':'manufacturer','مصانع':'manufacturer','نحاس':'copper','المنيوم':'aluminum','انفرتر':'inverter','الواح':'panel','بطاريه':'battery','سنترال':'pabx','ذكي':'smart',
 'هانيويل':'honeywell','بوش':'bosch','سيمنس':'siemens','شنايدر':'schneider','اشنايدر':'schneider','الفنار':'fanar','فنار':'fanar','ليجراند':'legrand','السويدي':'sewedy','كانتك':'kantech','فيليبس':'philips','ابب':'abb'
};
// two-way dictionary: Arabic word -> English words and English word -> Arabic words
const SYN2 = {};
Object.entries(SYN).forEach(([a, e]) => { (SYN2[a] = SYN2[a] || []).push(e); (SYN2[e] = SYN2[e] || []).push(a); });
// "sound skeleton": Siemens and سيمنس both become "smns", so a name typed in the other language still matches
const AR_SK = {'ب':'b','پ':'b','ت':'t','ط':'t','ث':'s','س':'s','ص':'s','ز':'s','ذ':'s','ظ':'s','ج':'g','غ':'g','گ':'g','خ':'k','ق':'k','ك':'k','د':'d','ض':'d','ر':'r','ش':'x','چ':'x','ف':'f','ڤ':'f','ل':'l','م':'m','ن':'n'};
function skel(w){
  if (/[\u0600-\u06ff]/.test(w)) {
    if (w.length > 4 && w.startsWith('ال')) w = w.slice(2);
    if (w.length > 4 && w.endsWith('ات')) w = w.slice(0, -2);
    w = [...w].map(c => AR_SK[c] || (/\d/.test(c) ? c : '')).join('');
  } else {
    w = w.replace(/x/g, 'ks').replace(/sch|sh|ch/g, 'x').replace(/ph/g, 'f').replace(/th/g, 't').replace(/kh|ck|qu/g, 'k').replace(/gh/g, 'g')
      .replace(/c(?=[eiy])/g, 's').replace(/[cq]/g, 'k').replace(/z/g, 's').replace(/j/g, 'g').replace(/v/g, 'f').replace(/p/g, 'b').replace(/[aeiouyhw]/g, '');
  }
  return w.replace(/(.)\1+/g, '$1');
}
// every way a word can be looked for: itself, "al-" removed, and its sound skeleton
function skelWords(text){
  const out = [];
  normText(text).split(' ').forEach(w => {
    if (!w) return;
    out.push(skel(w));
    const bare = w.replace(/^(al|el)(?=[a-z]{4})/, '');
    if (bare !== w) out.push(skel(bare));
  });
  return ' ' + out.filter(Boolean).join(' ') + ' ';
}
const QSTOP = new Set([...NAME_STOP, 'مورد', 'موردين', 'supplier', 'suppliers', 'في', 'من', 'in']);
// a search becomes a list of words; each word has its alternatives (translations + sound skeleton)
function tokens(q){
  let ws = normText(q).split(' ').filter(Boolean);
  if (ws.length > 1) { const k = ws.filter(w => !QSTOP.has(w)); if (k.length) ws = k; }
  return ws.map(w => ({w, alts: [w].concat(SYN2[w] || []), sk: w.length >= 3 ? skel(w) : ''}));
}
const tokMatch = (s, tk) => tk.alts.some(a => s._hay.includes(a)) || (tk.sk.length >= 3 && s._sk.includes(' ' + tk.sk));

/* ---------- phones ---------- */
function tel(raw){ const k = phoneKey(raw); return k ? (k.length === 9 ? '966' + k : k) : ''; }
const isMobileKSA = d => /^9665\d{8}$/.test(d);

/* ---------- state ---------- */
let DATA = {suppliers:[], reviews:[], requests:[], board:null};
let SG_INDEX = null;
let byId = {}, revBy = {}, shownLimit = 30, answerReq = null;
let mode = 'sup', filt = {group:'', cat:'', city:'', type:''};
let ME = {name:'', phone:''};
try { ME = JSON.parse(localStorage.getItem('me') || 'null') || ME; } catch(e){}
const MODES = ['sup', 'srv', 'con'];
try { const m = localStorage.getItem('mode'); mode = MODES.includes(m) ? m : 'sup'; } catch(e){}

// three tabs: suppliers & factories / rental & testing / specialised contractors
const TAB_GROUP = {srv: 'services', con: 'contracting'};
const SUP_GROUPS = TAXONOMY.filter(g => !g.con && !g.tab).map(g => g.id);
const groupMode = id => { const g = GROUP_OF(id); return g && g.con ? 'con' : g && g.tab ? g.tab : 'sup'; };
const isCon = s => s.Type === 'Contractor' || s._groups.includes('contracting');
const isSrv = s => s._groups.includes('services');
const isSup = s => s.Type !== 'Contractor' && (!s._groups.length || s._groups.some(g => SUP_GROUPS.includes(g)));
const IN = {sup: isSup, srv: isSrv, con: isCon};
const inMode = s => IN[mode](s);
const modeOf = s => MODES.find(m => IN[m](s)) || 'sup';
function setMode(m){ mode = m; try { localStorage.setItem('mode', mode); } catch(e){} }

/* ---------- load ---------- */
async function load(){
  let cached = null;
  try { cached = JSON.parse(localStorage.getItem('dir_cache') || 'null'); } catch(e){}
  if (cached) setData(cached);
  try {
    const url = CONFIG.API_URL ? CONFIG.API_URL + '?t=' + Date.now() : 'suppliers.json';
    const res = await fetch(url, {cache:'no-store'});
    if (!res.ok) throw new Error(res.status);
    let j = await res.json();
    if (Array.isArray(j)) j = {suppliers:j};
    setData(j);
    try { localStorage.setItem('dir_cache', JSON.stringify(j)); } catch(e){}
  } catch(e) {}
}
function setData(j){
  DATA = {suppliers:j.suppliers||[], reviews:j.reviews||[], requests:j.requests||[], board:j.board||null};
  byId = {}; revBy = {}; SG_INDEX = null;
  DATA.suppliers.forEach(s => {
    s._cats = upgradeCats(s.Category);
    s._groups = groupsOf(s._cats);
    s._hay = normText([s.Name, s.Name_AR, s.Category, s.Category_AR, s.Specialty, s.Brands, s.City, CITY_AR[s.City], s.Contacts, s.Notes, s.Address, s.Emails,
      s._cats.map(c => CAT_INFO[c] ? CAT_INFO[c].sar + ' ' + CAT_INFO[c].sen : '').join(' ')].join(' '));
    s._sk = skelWords([s.Name, s.Name_AR, s.Brands, s.Contacts, s.City].join(' '));
    s._nm = normText(s.Name + ' ' + (s.Name_AR || ''));
    byId[s.ID] = s;
  });
  DATA.reviews.forEach(r => (revBy[r.sid] = revBy[r.sid] || []).push(r));
  renderAll();
  route();
}
function renderAll(){ renderHome(); fillForms(); renderList(); renderRequests(); renderBoard(); }

/* ---------- home ---------- */
function renderHome(){
  $$('.seg [data-mode]').forEach(b => b.setAttribute('aria-selected', b.dataset.mode === mode));
  const pool = DATA.suppliers.filter(inMode);
  const CG = TAB_GROUP[mode] && GROUP_OF(TAB_GROUP[mode]);
  $('#tiles').innerHTML = (CG
    ? CG.cats.map(c => `<button class="tile" data-group="${CG.id}" data-tcat="${esc(c[0])}"><span class="ti">${icon(CG.icon)}</span><b>${esc(catName(c[0]))}</b><small>${(n => n ? t('sup_n', n) : t('be_first'))(pool.filter(s => s._cats.includes(c[0])).length)}</small></button>`).join('')
    : SUP_GROUPS.map(GROUP_OF).map(g => `<button class="tile" data-group="${g.id}"><span class="ti">${icon(g.icon)}</span><b>${esc(groupName(g))}</b><small>${(n => n ? t('sup_n', n) : t('be_first'))(pool.filter(s => s._groups.includes(g.id)).length)}</small></button>`).join(''))
    + `<button class="tile" data-go="list" data-all="1"><span class="ti">${icon('list')}</span><b>${esc(t('all_' + mode))}</b><small>${t('sup_n', pool.length)}</small></button>`;
  $('#by').innerHTML = t('by_line', DATA.suppliers.length, SUP_GROUPS.length);
  const b = DATA.board, star = b && b.monthTop && b.monthTop[0];
  $('#star-sec').hidden = !star;
  if (star) { $('#star-name').textContent = star.name; $('#star-n').textContent = t('adds', star.month); }
  const recent = DATA.suppliers.filter(s => s.Submitted_By && !/^القائمة الأولى/.test(s.Submitted_By))
    .sort((a, b) => String(b.Date).localeCompare(String(a.Date))).slice(0, 5);
  $('#recent-sec').hidden = !recent.length;
  const today = new Date();
  $('#recent').innerHTML = recent.map(s => {
    const d = Math.max(0, Math.round((today - new Date(String(s.Date).replace(' ', 'T'))) / 864e5));
    return `<button class="ri" data-open="${esc(s.ID)}"><span class="ti">${icon(groupIcon(s))}</span><span class="m"><b>${esc(s.Name)}</b><small>${esc([catsLine(s, 1), s.Submitted_By].filter(Boolean).join(' · '))}</small></span><span class="when">${isNaN(d) ? '' : d === 0 ? t('ago_today') : t('ago_days', d)}</span></button>`;
  }).join('');
}
function catsLine(s, max){
  const c = s._cats.filter(x => !filt.group || !CAT_INFO[x] || CAT_INFO[x].group === filt.group);
  // whole section first, then the named specialties
  const list = (c.length ? c : s._cats).slice().sort((a, b) => (CAT_INFO[b] && CAT_INFO[b].whole ? 1 : 0) - (CAT_INFO[a] && CAT_INFO[a].whole ? 1 : 0));
  const shown = list.slice(0, max).map(catShort).join('، ');
  return list.length > max ? shown + ` +${list.length - max}` : shown;
}

/* ---------- list ---------- */
// in a section: a supplier who chose this specialty, or the whole section
const hasCat = (s, c) => s._cats.includes(c) || (CAT_INFO[c] && s._cats.includes('@' + CAT_INFO[c].group));
const typeOk = s => !filt.type || (filt.type === 'Manufacturer' ? s.Type === 'Manufacturer' : s.Type !== 'Manufacturer');
function inSection(s){ return (!filt.group || s._groups.includes(filt.group)) && (!filt.cat || hasCat(s, filt.cat)); }
// specialists first: named specialties in this section, then fewer sections overall
function rank(s){
  if (!filt.group) return 0;
  const named = filt.cat ? s._cats.includes(filt.cat) : s._cats.some(c => CAT_INFO[c] && !CAT_INFO[c].whole && CAT_INFO[c].group === filt.group);
  return s._groups.length * 2 + (named ? 0 : 1);
}
// how well a company matches the search: name starts with it, a name word starts with it, found anywhere, sounds alike
function qScore(s, q, full){
  if (!q.length) return 0;
  if (full && (s._nm.startsWith(full) || (' ' + s._nm).includes(' ' + full))) return 0;
  if (q.some(tk => tk.alts.some(a => (' ' + s._nm).includes(' ' + a)))) return 1;
  return q.every(tk => tk.alts.some(a => s._hay.includes(a))) ? 2 : 3;
}
const qMatch = (s, q) => q.every(tk => tokMatch(s, tk));
function filtered(){
  const q = tokens($('#q').value), full = normText($('#q').value);
  const list = DATA.suppliers.filter(s => inMode(s) && inSection(s) && typeOk(s) && (!filt.city || s.City === filt.city) && qMatch(s, q));
  if (!filt.group && !q.length) return list;
  return list.map((s, i) => [qScore(s, q, full) * 100 + rank(s), i, s]).sort((a, b) => a[0] - b[0] || a[1] - b[1]).map(x => x[2]);
}
// the same search in the other tabs, so nothing is hidden by the tab you are on
function otherModes(){
  const q = tokens($('#q').value);
  if (!q.length || filt.group) return [];
  return MODES.filter(m => m !== mode).map(m => [m, DATA.suppliers.filter(s => IN[m](s) && (!filt.city || s.City === filt.city) && qMatch(s, q)).length]).filter(x => x[1]);
}
function renderChips(){
  const g = filt.group && GROUP_OF(filt.group);
  $('#cat-chips').hidden = !g;
  if (g) {
    const pool = DATA.suppliers.filter(s => inMode(s) && s._groups.includes(g.id) && typeOk(s));
    const cats = g.cats.map(c => ({key: c[0], n: pool.filter(s => hasCat(s, c[0])).length})).filter(x => x.n);
    $('#cat-chips').innerHTML = [`<button class="chip" data-cat="" aria-pressed="${!filt.cat}">${t('all_in')}</button>`]
      .concat(cats.map(c => `<button class="chip" data-cat="${esc(c.key)}" aria-pressed="${filt.cat === c.key}">${esc(catShort(c.key))} <small>${c.n}</small></button>`)).join('');
  }
  $('#type-chips').hidden = mode !== 'sup';
  $('#type-chips').innerHTML = [['', 'all_types'], ['Manufacturer', 'f_mfrs'], ['Supplier', 'f_sups']]
    .map(([k, l]) => `<button class="chip" data-ftype="${k}" aria-pressed="${filt.type === k}">${t(l)}</button>`).join('');
  const pool = DATA.suppliers.filter(s => inMode(s) && inSection(s) && typeOk(s));
  const cities = {}; pool.forEach(s => { if (s.City) cities[s.City] = (cities[s.City] || 0) + 1; });
  const list = Object.entries(cities).sort((a, b) => b[1] - a[1]).map(([c]) => c);
  if (filt.city && !list.includes(filt.city)) filt.city = '';
  $('#city-chips').innerHTML = [`<button class="chip" data-city="" aria-pressed="${!filt.city}">${t('all_city')}</button>`]
    .concat(list.map(c => `<button class="chip" data-city="${esc(c)}" aria-pressed="${filt.city === c}">${esc(cityName(c))}</button>`)).join('');
}
const stars = n => { const r = Math.round(n); return '★'.repeat(r) + '☆'.repeat(5 - r); };
const typeLabel = x => ({Manufacturer:t('mfr'), Supplier:t('sup'), Contractor:t('con')}[x] || '');
function cardHTML(s){
  const mobs = splitList(s.Mobiles), phones = splitList(s.Phones);
  const first = tel(mobs[0] || phones[0] || ''), waNum = mobs.concat(phones).map(tel).find(isMobileKSA);
  const rated = (revBy[s.ID] || []).filter(r => r.rating), avg = rated.length ? rated.reduce((a, r) => a + r.rating, 0) / rated.length : 0;
  const inactive = /NOT ACTIVE/i.test(s.Notes || '');
  return `<article class="sc" id="r-${esc(s.ID)}">
    <div class="sc-head" role="button" tabindex="0" aria-expanded="false" data-id="${esc(s.ID)}">
      <span class="sc-main"><b><bdi>${esc(s.Name)}</bdi>${s.Type === 'Manufacturer' ? `<span class="badge">${t('mfr')}</span>` : s.Type === 'Contractor' ? `<span class="badge">${t('con')}</span>` : ''}${inactive ? `<span class="badge b-off">${t('inactive')}</span>` : ''}</b>
        ${s.Name_AR ? `<span class="ar">${esc(s.Name_AR)}</span>` : ''}
        ${s.Contacts ? `<span class="who">${icon('user')}<bdi>${esc(splitList(s.Contacts)[0])}</bdi></span>` : ''}
        <small>${esc([catsLine(s, 2), cityName(s.City)].filter(Boolean).join(' · '))}${rated.length ? ` · <span class="stars">${stars(avg)}</span>` : ''}</small></span>
      <span class="qa">
        ${first ? `<a class="rb" href="tel:+${first}" aria-label="${t('call')}" data-stop>${icon('call')}</a>` : `<span class="rb off" aria-hidden="true">${icon('call')}</span>`}
        ${waNum ? `<a class="rb wa" href="https://wa.me/${waNum}" target="_blank" rel="noopener" aria-label="${t('whatsapp')}" data-stop>${icon('wa')}</a>` : `<span class="rb off" title="${t('no_wa')}" aria-hidden="true">${icon('wa')}</span>`}
        <button class="rb" type="button" data-share="${esc(s.ID)}" data-stop aria-label="${t('share')}">${icon('share')}</button>
      </span>
    </div>
    <div class="detail"></div>
  </article>`;
}
function detailHTML(s){
  const line = (k, v) => v ? `<dt>${t(k)}</dt><dd>${v}</dd>` : '';
  const ph = list => splitList(list).map(p => { const d = tel(p); return d ? `<a class="num" href="tel:+${d}">${esc(p)}</a>` : `<span class="num">${esc(p)}</span>`; }).join('<br>');
  const mob = splitList(s.Mobiles).map(p => { const d = tel(p);
    return d ? `<a class="num" href="tel:+${d}">${esc(p)}</a>${isMobileKSA(d) ? ` · <a href="https://wa.me/${d}" target="_blank" rel="noopener">${t('whatsapp')}</a>` : ''}` : `<span class="num">${esc(p)}</span>`; }).join('<br>');
  const rv = revBy[s.ID] || [], notes = (s.Notes || '').replace(/NOT ACTIVE/i, '').trim();
  const cats = s._cats.length ? `<div class="tagrow">${s._cats.map(c => `<span class="tagc">${esc(catName(c))}</span>`).join('')}</div>` : '';
  return `<dl class="dl">
    ${line('cats', cats)}
    ${line('contact', esc(s.Contacts).replace(/ ; /g, '، '))}${line('mobile', mob)}${line('phone', ph(s.Phones))}
    ${line('fax', splitList(s.Fax).map(f => `<span class="num">${esc(f)}</span>`).join('<br>'))}
    ${line('email', splitList(s.Emails).map(e => `<a href="mailto:${esc(e)}" dir="ltr">${esc(e)}</a>`).join('<br>'))}
    ${line('city', esc(cityName(s.City)))}${line('brands', esc(s.Brands).replace(/ ; /g, '، '))}${line('spec', esc(s.Specialty))}${line('address', esc(s.Address))}${line('notes', esc(notes))}
   </dl>
   <div class="acts"><button class="btn primary" data-share="${esc(s.ID)}">${icon('wa')}${t('share_wa')}</button><button class="btn" data-rate="${esc(s.ID)}">${icon('star')}${t('rate')}</button></div>
   <div class="reviews">
    ${rv.length ? rv.slice(-20).reverse().map(r => `<div class="rv">${r.rating ? `<span class="stars">${stars(r.rating)}</span> ` : ''}<b>${esc(r.name || '')}</b> <span class="muted">${esc((r.date || '').slice(0, 10))}</span><div>${esc(r.comment)}</div></div>`).join('') : `<div class="muted">${t('no_reviews')}</div>`}
    <form class="rv-form" data-sid="${esc(s.ID)}" hidden novalidate style="margin-top:10px">
      <div class="f"><label>${t('rv_h')}</label><div class="rate">${[1,2,3,4,5].map(n => `<button type="button" data-star="${n}" aria-label="${n}">★</button>`).join('')}</div></div>
      <div class="f"><textarea rows="2" maxlength="400" placeholder="${esc(t('rv_comment'))}"></textarea></div>
      <div class="f"><input type="text" maxlength="60" placeholder="${esc(t('your_name'))}" value="${esc(ME.name)}"></div>
      <input class="trap" name="website" tabindex="-1" autocomplete="off" aria-hidden="true">
      <button class="btn primary" type="submit">${t('rv_send')}</button>
      <div class="rv-msg" aria-live="polite"></div>
    </form>
   </div>
   ${s.Submitted_By ? `<p class="muted" style="margin:10px 0 0">${t('added_by')}: ${esc(s.Submitted_By)}</p>` : ''}`;
}
function listTitle(){
  if (filt.cat) return catName(filt.cat);
  if (filt.group) return groupName(GROUP_OF(filt.group));
  return t('all_' + mode);
}
function renderList(){
  renderChips();
  const list = filtered();
  $('#list-title').textContent = listTitle();
  $('#count').textContent = list.length > shownLimit ? t('showing', shownLimit, list.length) : t('found', list.length);
  $('#list').innerHTML = list.slice(0, shownLimit).map(cardHTML).join('');
  $('#empty').hidden = !!list.length;
  $('#count').hidden = !list.length;
  $('#more').hidden = list.length <= shownLimit; $('#more').textContent = t('more');
  const om = otherModes();
  $('#also').hidden = !om.length;
  $('#also').innerHTML = om.length ? `<span>${t('also_in')}</span>` + om.map(([m, n]) => `<button class="chip" data-mode="${m}">${esc(t('mode_' + m))} <small>${n}</small></button>`).join('') : '';
}
function toggleCard(head){
  const card = head.closest('.sc'), open = !card.classList.contains('open');
  card.classList.toggle('open', open); head.setAttribute('aria-expanded', open);
  const s = byId[head.dataset.id];
  if (open && s) card.querySelector('.detail').innerHTML = detailHTML(s);
}

/* ---------- Excel (export, template, import) ---------- */
let xlsxP = null;
function loadXLSX(){
  if (window.XLSX) return Promise.resolve(window.XLSX);
  return xlsxP || (xlsxP = new Promise((ok, no) => {
    const sc = document.createElement('script');
    sc.src = 'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js';
    sc.onload = () => ok(window.XLSX); sc.onerror = () => { xlsxP = null; no(new Error('xlsx')); };
    document.head.appendChild(sc);
  }));
}
const COLS = [['Name','اسم الشركة','Company'],['Name_AR','الاسم بالعربي','Arabic name'],['Type','النوع','Type'],['Category','التخصصات','Specialties'],
  ['City','المدينة','City'],['Contacts','الشخص المسؤول','Contact person'],['Mobiles','الجوال','Mobile'],['Phones','هاتف المكتب','Office phone'],
  ['Emails','الإيميل','E-mail'],['Brands','الماركات','Brands'],['Address','العنوان','Address']];
async function exportList(){
  const q = $('#q').value.trim();
  if (!filt.group && !filt.cat && !filt.city && !q) return toast(t('x_need'));
  let X; try { X = await loadXLSX(); } catch(e) { return toast(t('bulk_libfail')); }
  const L = lang === 'ar' ? 1 : 2;
  const rows = filtered().map(s => COLS.map(([k]) => k === 'Category' ? s._cats.map(catName).join('، ') : k === 'Type' ? typeLabel(s[k]) : k === 'City' ? cityName(s.City) : String(s[k] || '').replace(/ ; /g, ' / ')));
  const head = [[t('x_title')], [listTitle() + (q ? ' – ' + q : '') + (filt.city ? ' – ' + cityName(filt.city) : '') + ' · ' + new Date().toISOString().slice(0, 10)],
    [t('x_join') + ': ' + CONFIG.JOIN_LINK], [CONFIG.SITE_URL], [], COLS.map(c => c[L])];
  const ws = X.utils.aoa_to_sheet(head.concat(rows));
  ws['!cols'] = COLS.map((c, i) => ({wch: [28, 22, 10, 40, 12, 22, 20, 18, 30, 30, 30][i]}));
  if (lang === 'ar') ws['!views'] = [{RTL: true}];
  const wb = X.utils.book_new(); wb.Workbook = {Views: [{RTL: lang === 'ar'}]};
  X.utils.book_append_sheet(wb, ws, 'Suppliers');
  X.writeFile(wb, `Elec-in-KSA-${(listTitle() + (q ? '-' + q : '')).replace(/[\\/:*?"<>|\s]+/g, '-').slice(0, 40)}.xlsx`);
  toast(t('x_done'));
}
const TPL_HEAD = ['اسم الشركة *', 'الجوال *', 'النوع (مصنع / مورد / مقاول)', 'التخصص', 'المدينة', 'هاتف المكتب', 'الإيميل', 'الشخص المسؤول', 'الماركات', 'العنوان', 'ملاحظات'];
async function downloadTemplate(){
  let X; try { X = await loadXLSX(); } catch(e) { return toast(t('bulk_libfail')); }
  const ws = X.utils.aoa_to_sheet([TPL_HEAD, ['شركة المثال للكابلات', '0501234567', 'مورد', 'الكابلات والأسلاك، حوامل الكابلات', 'الدمام', '0138000000', 'sales@example.com', 'م. أحمد', 'Bahra, Elsewedy', '', ''], ['مؤسسة المثال الشاملة', '0551234567', 'مورد', 'مورد شامل', 'الرياض', '', '', '', '', '', '']]);
  ws['!cols'] = TPL_HEAD.map(() => ({wch: 22})); ws['!views'] = [{RTL: true}];
  const cats = [['القسم', 'التخصص (اكتب اسم القسم وحده إذا كان يبيع القسم كله)']].concat([['مورد شامل', 'كل مواد الكهرباء (بدون الإنارة)']], ...TAXONOMY.map(g => [[g.ar, g.ar + ' (القسم كله)']].concat(g.cats.map(c => [g.ar, c[1]]))));
  const ws2 = X.utils.aoa_to_sheet(cats); ws2['!cols'] = [{wch: 24}, {wch: 44}]; ws2['!views'] = [{RTL: true}];
  const wb = X.utils.book_new(); wb.Workbook = {Views: [{RTL: true}]};
  X.utils.book_append_sheet(wb, ws, 'الموردون'); X.utils.book_append_sheet(wb, ws2, 'التخصصات');
  X.writeFile(wb, 'Elec-in-KSA-suppliers-template.xlsx');
}

/* ---------- reading free text: pasted messages, vCards, Excel cells ---------- */
const CAT_WORDS = {
  'LV Cables': ['lv cable', 'power cable', 'كابلات جهد منخفض'], 'MV Cables': ['mv cable', 'كابلات جهد متوسط', 'xlpe'], 'Building Wires': ['wire', 'wires', 'اسلاك', 'سلك'],
  'Control & ELV Cables': ['control cable', 'كابلات تحكم'], 'Cable Accessories': ['termination', 'joint', 'raychem', 'ملحقات الكابلات', 'رؤوس'],
  '@cables': ['cable', 'cables', 'كابل', 'كابلات', 'elsewedy', 'السويدي', 'riyadh cables', 'bahra'],
  'Distribution Boards': ['distribution board', 'لوحات توزيع', 'mdb', 'smdb', 'طبلون'], 'Panel Manufacturing': ['panel builder', 'تصنيع لوحات', 'مصنع لوحات'],
  'Circuit Breakers': ['breaker', 'breakers', 'mcb', 'mccb', 'acb', 'قواطع', 'قاطع'], 'MCC & Control Panels': ['mcc', 'control panel', 'لوحات تحكم'],
  '@panels': ['panel', 'panels', 'لوحات', 'لوحه', 'switchboard'],
  'Wiring Devices': ['wiring device', 'socket', 'sockets', 'افياش', 'فيش', 'mk', 'legrand'], 'Floor Boxes': ['floor box'], 'Isolators': ['isolator', 'disconnect', 'مفاتيح فصل'],
  'Conduits': ['conduit', 'pvc', 'emt', 'مواسير', 'ماسوره'], 'Boxes & First Fix': ['box', 'علب', 'تاسيس'], 'Cable Trays': ['tray', 'ladder', 'حوامل', 'تري'],
  'Trunking': ['trunking'], 'Busway': ['busway', 'busduct', 'باسواي'],
  'Indoor Lighting': ['indoor', 'downlight', 'spot', 'سبوت'], 'Outdoor Lighting & Poles': ['outdoor', 'pole', 'poles', 'street light', 'اعمده', 'كشافات', 'flood'],
  'Emergency & Exit Lighting': ['emergency light', 'exit', 'طوارئ'], 'Lighting Control': ['lighting control', 'dali'],
  '@lighting': ['lighting', 'light', 'lights', 'fixture', 'انارة', 'اناره', 'اضاءه', 'led', 'philips'],
  'Transformers': ['transformer', 'محول', 'محولات'], 'RMU': ['rmu', 'ring main'], 'Package Substations': ['substation', 'محطه', 'محطات'], 'MV Switchgear': ['switchgear', '33kv', '13.8kv', 'جهد متوسط'],
  'Generators': ['generator', 'generators', 'genset', 'مولد', 'مولدات', 'جنريتر', 'cummins', 'perkins'], 'ATS': ['ats', 'تحويل اوتوماتيكي'], 'UPS': ['ups'], 'Batteries': ['battery', 'batteries', 'بطاريات'],
  'Solar Panels': ['solar panel', 'pv', 'الواح'], 'Solar Inverters': ['inverter', 'انفرتر'], 'Energy Storage': ['storage', 'bess', 'تخزين'], '@solar': ['solar', 'شمسيه', 'سولار'],
  'Earthing': ['earthing', 'grounding', 'تاريض', 'ارضي'], 'Lightning Protection': ['lightning', 'صواعق', 'furse'],
  'Fire Alarm': ['fire alarm', 'انذار حريق', 'notifier', 'simplex', 'edwards'], 'VESDA': ['vesda'], 'Fire Suppression': ['fm200', 'fm 200', 'suppression', 'اطفاء'],
  '@fire': ['fire', 'حريق'],
  'CCTV': ['cctv', 'camera', 'cameras', 'كاميرات', 'كاميرا', 'مراقبه', 'hikvision', 'dahua'], 'Access Control': ['access control', 'اكسس', 'تحكم بالدخول', 'kantech'],
  'Time Attendance': ['attendance', 'حضور'], 'Parking & Gates': ['parking', 'barrier', 'مواقف', 'بوابات'], 'Data & Networks': ['data', 'network', 'networks', 'شبكات', 'fiber', 'cisco', 'cat6'],
  'Telephone Systems': ['telephone', 'telephony', 'pabx', 'سنترال'], 'PA & Audio': ['public address', 'pa system', 'audio', 'نداء', 'صوتيات'], 'Screens & Clocks': ['signage', 'clock', 'شاشات', 'ساعات'],
  'BMS': ['bms', 'building management'], 'KNX Smart Home': ['knx', 'smart home', 'منازل ذكيه'], 'PLC & Automation': ['plc', 'automation', 'scada', 'اتمته'],
  '@lowcurrent': ['low current', 'تيار خفيف', 'elv'],
  'Tools': ['tools', 'عدد', 'ادوات'], 'Test & Measuring': ['tester', 'meter', 'fluke', 'megger', 'قياس'],
  'Cranes & Heavy Equipment': ['crane', 'cranes', 'رافعه', 'رافعات', 'كرين', 'manlift', 'man lift', 'scissor', 'بوبكات', 'اليات'], 'Cable Pulling Equipment': ['cable pulling', 'winch', 'سحب الكابلات', 'ونش'],
  'Test Van': ['test van', 'عربه اختبار'], 'Cable Fault Locating': ['fault locat', 'cable fault', 'اعطال الكابلات', 'vlf', 'hipot', 'hi pot'],
  'Transformer & Panel Testing': ['relay testing', 'transformer testing', 'فحص المحولات', 'oil test'], 'Earthing Testing': ['earth test', 'فحص التاريض'],
  '@services': ['rental', 'تاجير', 'testing', 'اختبارات'],
  '@elevators': ['elevator', 'elevators', 'lift', 'lifts', 'مصعد', 'مصاعد', 'اسانسير', 'اصانصير'], 'Escalators & Walkways': ['escalator', 'escalators', 'سلالم متحركه', 'travelator'],
  'Passenger & Freight Elevators': ['passenger elevator', 'freight elevator', 'مصاعد ركاب', 'مصعد ركاب'], 'Elevator Spare Parts': ['elevator parts', 'قطع غيار مصاعد', 'قطع غيار المصاعد'],
  'Elevator Installation & Maintenance': ['elevator maintenance', 'صيانه المصاعد', 'صيانه مصاعد', 'تركيب مصاعد'],
  'Electrical Contracting': ['electrical contracting', 'مقاولات كهربائيه', 'مقاول كهرباء'], 'Low Current Contracting': ['مقاولات تيار خفيف'], 'MEP Contracting': ['mep'],
  'Solar Contracting': ['مقاولات طاقه شمسيه'], 'Testing & Commissioning': ['commissioning', 'testing and commissioning', 'فحص وتشغيل الانظمه'], 'O&M': ['o&m', 'maintenance', 'صيانه'],
};
const GENERAL_WORDS = ['مورد شامل', 'شامل', 'general supplier', 'مواد كهربائيه', 'electrical materials', 'electrical supplies', 'مستلزمات كهربائيه'];
function guessCats(text){
  const tx = ' ' + normText(text) + ' ';
  const found = [];
  Object.keys(CAT_INFO).forEach(k => {
    const ci = CAT_INFO[k];
    const words = (CAT_WORDS[k] || []).concat([k, ci.ar, ci.sar, ci.sen]).map(w => normText(w)).filter(w => w.length >= 2);
    if (words.some(w => tx.includes(' ' + w + ' ') || (w.length >= 5 && tx.includes(w)))) found.push(k);
  });
  if (GENERAL_WORDS.some(w => tx.includes(normText(w)))) GENERAL_GROUPS.forEach(g => found.push('@' + g));
  // "testing transformers" is a service, not a transformer supplier
  const NOT_WITH = {'Cable Fault Locating': ['@cables', 'LV Cables', 'MV Cables'], 'Transformer & Panel Testing': ['Transformers', '@mv', '@panels'], 'Earthing Testing': ['@earthing', 'Earthing'], 'Cable Pulling Equipment': ['@cables']};
  Object.keys(NOT_WITH).forEach(k => { if (found.includes(k)) NOT_WITH[k].forEach(x => { const i = found.indexOf(x); if (i >= 0) found.splice(i, 1); }); });
  // a named specialty makes "the whole section" unnecessary
  return found.filter((k, i) => found.indexOf(k) === i && !(CAT_INFO[k].whole && found.some(x => !CAT_INFO[x].whole && CAT_INFO[x].group === CAT_INFO[k].group)));
}
const CITY_WORDS = Object.keys(CITY_AR).filter(c => !/,/.test(c)).map(c => [c, [c, CITY_AR[c], CITY_AR[c].replace(/^ال/, '')].map(normText)]);
CITY_WORDS.push(['Al Khobar', ['khobar', 'الخبر', 'خبر']], ['Jeddah', ['jeddah', 'jedda', 'جده']], ['Al Hasa', ['hofuf', 'ahsa', 'الاحساء', 'الهفوف']]);
function guessCity(text){
  const tx = ' ' + normText(text) + ' ';
  const hit = CITY_WORDS.find(([, ws]) => ws.some(w => w.length >= 3 && tx.includes(' ' + w + ' ')));
  return hit ? hit[0] : '';
}
const PHONE_RE = /(?:\+|00)?\d[\d\s\-().]{6,}\d/g;
const EMAIL_RE = /[A-Za-z0-9._%+\-]+@[A-Za-z0-9.\-]+\.[A-Za-z]{2,}/g;
const COMPANY_RE = /(شركه|شركة|مؤسسه|مؤسسة|مصنع|مجموعه|مجموعة|\bco\b|company|\best\b|ltd|llc|trading|factory|industries|group|holding|electric|cables?|lighting|systems?)/i;
const PERSON_RE = /^(م\s*\.\s*|م\s+|المهندس|مهندس|eng\.?|engr\.?|mr\.?|mrs\.?|ms\.?|الاستاذ|أ\.)\s*/i;
function parseText(text){
  const out = {Mobiles: [], Phones: [], Emails: []};
  const raw = String(text || '').replace(/\r/g, '');
  (raw.match(EMAIL_RE) || []).forEach(e => { if (!out.Emails.includes(e.toLowerCase())) out.Emails.push(e.toLowerCase()); });
  const lines = raw.split('\n').map(l => l.replace(/[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\u{2B00}-\u{2BFF}\u{FE0F}]/gu, '').trim()).filter(Boolean);
  const keep = [];
  lines.forEach(l => {
    if (/https?:\/\/|chat\.whatsapp\.com|www\./i.test(l)) return;
    const noMail = l.replace(EMAIL_RE, ' ');
    const phones = (noMail.match(PHONE_RE) || []).filter(p => p.replace(/\D/g, '').length >= 8);
    phones.forEach(p => { const k = phoneKey(p); if (!k) return;
      const list = /^5\d{8}$/.test(k) ? out.Mobiles : out.Phones;
      if (![...out.Mobiles, ...out.Phones].some(x => phoneKey(x) === k)) list.push(p.trim()); });
    const rest = noMail.replace(PHONE_RE, ' ').replace(/(mobile|mob|tel|phone|fax|email|e-mail|جوال|موبايل|هاتف|تلفون|فاكس|ايميل|بريد)\s*[:：.]?/gi, ' ')
      .replace(/[|•·,،:–—\-]+/g, ' ').replace(/\s+/g, ' ').trim();
    if (rest.length >= 2 && !/^(dir_line|للانضمام|join)/i.test(rest) && !/دليل موردي الكهرباء|قروب|whatsapp group|للانضمام/i.test(rest)) keep.push({l: rest, orig: l, fax: /fax|فاكس/i.test(l)});
  });
  // share-format support: "Name — الاسم" on the first line
  let name = '', nameAr = '', contact = '';
  const company = keep.find(x => COMPANY_RE.test(x.l) && !PERSON_RE.test(x.l));
  const person = keep.find(x => PERSON_RE.test(x.l));
  const first = keep.find(x => x !== person && !x.fax && x.l.length <= 80 && !CITY_WORDS.some(([, ws]) => ws.includes(normText(x.l))));
  const pick = company || first;
  if (pick) { const parts = pick.l.split(/\s+—\s+|\s+-\s+/); name = parts[0]; if (parts[1] && /[؀-ۿ]/.test(parts[1]) && !/[؀-ۿ]/.test(parts[0])) nameAr = parts[1]; }
  if (person) contact = person.l.replace(/\s+(—|-).*$/, '').trim();
  if (out.Phones.length && /fax|فاكس/i.test(raw)) {
    const faxLine = lines.find(l => /fax|فاكس/i.test(l));
    if (faxLine) out.Phones = out.Phones.filter(p => !faxLine.includes(p));
  }
  return {Name: name, Name_AR: nameAr, Contacts: contact, Mobiles: out.Mobiles.join(' , '), Phones: out.Phones.join(' , '),
    Emails: out.Emails.join(' , '), City: guessCity(raw), cats: guessCats(raw)};
}
function parseVcf(text){
  const lines = String(text).replace(/\r\n[ \t]/g, '').split(/\r?\n/);
  const out = {Mobiles: [], Phones: [], Emails: []}; let fn = '', org = '', adr = '', title = '';
  lines.forEach(l => {
    const m = l.match(/^([A-Z\-]+)((?:;[^:]*)?):(.*)$/i); if (!m) return;
    const key = m[1].toUpperCase(), params = m[2].toUpperCase(), val = m[3].replace(/\\,/g, ',').replace(/\\;/g, ';').trim();
    if (key === 'FN') fn = val;
    else if (key === 'ORG') org = val.split(';').filter(Boolean).join(' ');
    else if (key === 'TITLE') title = val;
    else if (key === 'TEL') { const k = phoneKey(val); if (k) (/^5\d{8}$/.test(k) || /CELL|MOBILE/.test(params) ? out.Mobiles : out.Phones).push(val); }
    else if (key === 'EMAIL') out.Emails.push(val);
    else if (key === 'ADR') adr = val.split(';').filter(Boolean).join(' ');
  });
  return {Name: org || fn, Contacts: org ? fn : '', Mobiles: out.Mobiles.join(' , '), Phones: out.Phones.join(' , '), Emails: out.Emails.join(' , '),
    Address: adr, City: guessCity(adr + ' ' + org), cats: guessCats(org + ' ' + title)};
}

/* ---------- add form ---------- */
let picked = new Set();
const COMMON_CITIES = ['Riyadh', 'Dammam', 'Al Khobar', 'Jeddah', 'Jubail', 'Al Hasa', 'Makkah', 'Madinah'];
const isConForm = () => getType() === 'Contractor';
function renderPicker(){
  const el = $('#cat-picker');
  if (isConForm()) {
    const g = GROUP_OF('contracting');
    el.innerHTML = `<div class="pg-c">${g.cats.map(c => `<button type="button" class="pc" data-pick="${esc(c[0])}" aria-pressed="${picked.has(c[0])}">${esc(lang === 'ar' ? c[1] : c[3])}</button>`).join('')}</div>`;
  } else {
    const on = g => [...picked].some(k => CAT_INFO[k] && CAT_INFO[k].group === g.id);
    const secs = TAXONOMY.filter(g => !g.con), allGen = GENERAL_GROUPS.every(id => on(GROUP_OF(id)));
    const chosen = secs.filter(on);
    el.innerHTML = `<button type="button" class="genb" data-general aria-pressed="${allGen}">${icon('store')}<span><b>${t('gen_b')}</b><small>${t('gen_s')}</small></span></button>
      <div class="secs">${secs.map(g => `<button type="button" class="secb" data-sec="${g.id}" aria-pressed="${on(g)}">${icon(g.icon)}<span>${esc(groupName(g))}</span></button>`).join('')}</div>
      ${chosen.length ? `<details class="fine" id="fine"${fineOpen ? ' open' : ''}><summary>${t('fine_h')}</summary><p class="h">${t('fine_p')}</p>
        ${chosen.map(g => `<div class="pg"><div class="pg-h">${icon(g.icon)}<span>${esc(groupName(g))}</span><span class="n">${picked.has('@' + g.id) ? t('whole') : ''}</span></div>
          <div class="pg-c">${g.cats.map(c => `<button type="button" class="pc" data-pick="${esc(c[0])}" aria-pressed="${picked.has(c[0])}">${esc(lang === 'ar' ? c[2] : c[3])}</button>`).join('')}</div></div>`).join('')}</details>` : ''}`;
  }
  const n = new Set([...picked].map(k => CAT_INFO[k] ? CAT_INFO[k].group : k)).size;
  $('#cat-count').textContent = isConForm() ? t('picked', picked.size) : t('picked_secs', n);
}
let fineOpen = false;
function toggleSection(id){
  const keys = [...picked].filter(k => CAT_INFO[k] && CAT_INFO[k].group === id);
  if (keys.length) keys.forEach(k => picked.delete(k)); else picked.add('@' + id);
}
function toggleSub(k){
  const g = CAT_INFO[k].group;
  picked.has(k) ? picked.delete(k) : picked.add(k);
  if (g === 'contracting') return;
  const subs = [...picked].some(x => CAT_INFO[x] && !CAT_INFO[x].whole && CAT_INFO[x].group === g);
  if (subs) picked.delete('@' + g); else picked.add('@' + g);
}
function toggleGeneral(){
  const all = GENERAL_GROUPS.every(id => [...picked].some(k => CAT_INFO[k] && CAT_INFO[k].group === id));
  GENERAL_GROUPS.forEach(id => { const has = [...picked].some(k => CAT_INFO[k] && CAT_INFO[k].group === id);
    if (all) toggleSection(id); else if (!has) picked.add('@' + id); });
}
function renderCityPick(){
  const cur = $('#a-city').value.trim();
  $('#a-city-chips').innerHTML = COMMON_CITIES.map(c => `<button type="button" class="chip ${cur === c ? 'on' : ''}" data-acity="${esc(c)}">${esc(cityName(c))}</button>`).join('');
}
function setType(v){ $$('#a-type [data-v]').forEach(b => b.setAttribute('aria-pressed', b.dataset.v === v)); if ($('#cat-picker')) renderPicker(); }
const getType = () => ($('#a-type [aria-pressed=true]') || {}).dataset?.v || 'Supplier';
function fillForms(){
  renderPicker(); renderCityPick();
  [['#a-by', ME.name], ['#a-byph', ME.phone], ['#rq-name', ME.name], ['#rq-phone', ME.phone], ['#bk-by', ME.name], ['#bk-byph', ME.phone]]
    .forEach(([id, val]) => { const el = $(id); if (el && !el.value) el.value = val || ''; });
}
function applyParsed(p){
  let n = 0;
  const put = (id, val) => { if (val && !$(id).value.trim()) { $(id).value = val; n++; } };
  put('#a-name', p.Name); put('#a-mob', [p.Mobiles, p.Phones && !p.Mobiles ? p.Phones : ''].filter(Boolean).join(' , '));
  if (p.Mobiles && p.Phones) put('#a-tel', p.Phones);
  put('#a-email', p.Emails); put('#a-contact', p.Contacts); put('#a-addr', p.Address);
  if (p.City && !$('#a-city').value) { $('#a-city').value = p.City; n++; renderCityPick(); }
  const cs = p.cats || [], conOnly = cs.length && cs.every(c => CAT_INFO[c] && CAT_INFO[c].group === 'contracting');
  if (conOnly) setType('Contractor');
  cs.forEach(c => picked.add(c)); if (cs.length) n++;
  renderPicker();
  if ($('#a-email').value || $('#a-tel').value || $('#a-contact').value) $('#more-d').open = true;
  $('#filled').hidden = false; $('#filled').textContent = n ? t('filled', n) : t('filled_none');
  checkDup();
}
function formData(){
  return {Name: v('#a-name'), Mobiles: v('#a-mob').replace(/\s*[,،/]\s*/g, ' ; '), Phones: v('#a-tel').replace(/\s*[,،/]\s*/g, ' ; '), Emails: v('#a-email').replace(/\s*[,،]\s*/g, ' ; '),
    Category: [...picked].filter(k => isConForm() === (CAT_INFO[k] && CAT_INFO[k].group === 'contracting')).concat(splitList(v('#a-other').replace(/[،,]/g, ';'))), Type: getType(), City: v('#a-city'), Contacts: v('#a-contact'), Brands: v('#a-brands'), Specialty: v('#a-spec'),
    Address: v('#a-addr'), Notes: v('#a-notes'), Submitted_By: v('#a-by'), Submitter_Phone: v('#a-byph'), Request_ID: answerReq ? answerReq.id : ''};
}
let dupTimer;
function checkDup(){
  clearTimeout(dupTimer);
  dupTimer = setTimeout(() => {
    const d = formData(), box = $('#dup');
    if (!d.Name && !d.Mobiles && !d.Emails) { box.hidden = true; return; }
    const r = findDuplicate(d, DATA.suppliers);
    if (!r) { box.hidden = true; return; }
    box.hidden = false; box.className = 'dup' + (r.level === 'likely' ? ' likely' : '');
    box.innerHTML = (r.level === 'same' ? t('dup_same', esc(r.item.Name)) + `<div>${t('dup_same_p')}</div>` : t('dup_likely', esc(r.item.Name)))
      + `<div><button type="button" data-open="${esc(r.item.ID)}">${t('dup_open')}</button></div>`;
  }, 250);
}
function resetAdd(){
  $('#f-add').reset(); picked = new Set(); fineOpen = false; setType(mode === 'con' ? 'Contractor' : 'Supplier');
  $('#dup').hidden = true; $('#filled').hidden = true; $('#paste-box').hidden = true; $('#paste-text').value = ''; $('#more-d').open = false;
  fillForms(); setAnswer(null);
}

/* ---------- bulk upload ---------- */
const HEAD_MAP = [
  ['Name', /^(اسم الشركه|اسم الشركة|الشركه|الشركة|اسم المورد|المورد|المصنع|اسم|company|company name|supplier|supplier name|vendor|vendor name|name|brand name|supplier\/vendor\/brand name)\b/i],
  ['Mobiles', /(جوال|موبايل|الجوال|واتساب|mobile|cell|whatsapp|gsm)/i],
  ['Phones', /(هاتف|تلفون|رقم|phone|tel|contact ?#|contact no|telephone)/i],
  ['Emails', /(ايميل|إيميل|بريد|email|e-mail|mail)/i],
  ['Category', /(تخصص|تصنيف|نشاط|المجال|مجال|category|specialty|speciality|scope|activity|products?|service)/i],
  ['City', /(مدينه|مدينة|المدينه|المدينة|city|location|region|منطقه)/i],
  ['Contacts', /(المسؤول|مسؤول|الشخص|contact person|attn|contact name|person|sales)/i],
  ['Brands', /(ماركات|الماركات|وكالات|brands?|agency|agencies)/i],
  ['Address', /(عنوان|العنوان|address)/i],
  ['Notes', /(ملاحظات|notes?|remarks?)/i],
  ['Type', /(النوع|نوع|type)/i],
];
function mapHeader(row){
  const map = {};
  row.forEach((h, i) => {
    const s = String(h || '').trim(); if (!s) return;
    for (const [field, re] of HEAD_MAP) { if (re.test(s) && !(field in map)) { map[field] = i; break; } }
  });
  return map;
}
function rowToSupplier(r, map){
  const g = f => map[f] == null ? '' : String(r[map[f]] == null ? '' : r[map[f]]).trim();
  const all = [g('Mobiles'), g('Phones')].join(' , ');
  const p = parseText(all);
  const catText = g('Category');
  let cats = [].concat(...splitList(catText.replace(/[،,\/]/g, ';')).map(x => {
    const n = normText(x.replace(/\(.*?\)/g, ''));
    if (GENERAL_WORDS.some(w => normText(w) === n)) return GENERAL_GROUPS.map(g => '@' + g);
    if (OLD_CATS[x.trim()]) return OLD_CATS[x.trim()];
    const exact = Object.keys(CAT_INFO).find(k => normText(k) === n || normText(CAT_INFO[k].ar) === n || normText(CAT_INFO[k].sar) === n);
    return exact ? [exact] : [];
  }));
  if (!cats.length && catText) cats = guessCats(catText);
  if (!cats.length && catText) cats = [catText.slice(0, 80)];
  const typeTxt = normText(g('Type'));
  return {Name: g('Name'), Mobiles: p.Mobiles.replace(/ , /g, ' ; '), Phones: p.Phones.replace(/ , /g, ' ; '),
    Emails: splitList(g('Emails').replace(/[,،\s]+/g, ';')).filter(e => /@/.test(e)).join(' ; '), Category: cats,
    City: guessCity(g('City')) || g('City'), Contacts: g('Contacts'), Brands: g('Brands'), Address: g('Address'), Notes: g('Notes'),
    Type: /مصنع|manufact|factory/.test(typeTxt) ? 'Manufacturer' : /مقاول|contract/.test(typeTxt) ? 'Contractor' : /مورد|وكيل|supplier|agent|trading/.test(typeTxt) ? 'Supplier' : ''};
}
let BULK = [];
async function readBulk(file){
  const m = $('#bulk-msg'); m.innerHTML = `<div class="msg">${t('bulk_reading')}</div>`; $('#bulk-preview').hidden = true;
  let X; try { X = await loadXLSX(); } catch(e) { return showMsg(m, false, t('bulk_libfail')); }
  const buf = await file.arrayBuffer();
  const wb = X.read(buf, {type: 'array'});
  const ws = wb.Sheets[wb.SheetNames[0]];
  const rows = X.utils.sheet_to_json(ws, {header: 1, raw: false, defval: ''}).filter(r => r.some(c => String(c).trim()));
  if (!rows.length) return showMsg(m, false, t('bulk_empty'));
  let hi = rows.findIndex(r => { const mp = mapHeader(r); return 'Name' in mp && Object.keys(mp).length >= 2; });
  if (hi < 0) return showMsg(m, false, t('bulk_bad'));
  const map = mapHeader(rows[hi]);
  const known = DATA.suppliers.slice(), seen = [];
  BULK = rows.slice(hi + 1).map(r => rowToSupplier(r, map)).filter(s => s.Name || s.Mobiles || s.Phones).map(s => {
    let st = 'new', match = null;
    if (!s.Name || !(s.Mobiles || s.Phones || s.Emails)) st = 'invalid';
    else {
      const d = findDuplicate(s, known.concat(seen));
      if (d && d.level === 'same') { match = d.item; st = Object.keys(mergeDiff(d.item, s)).length ? 'update' : 'exists'; }
    }
    if (st !== 'invalid') seen.push(Object.assign({ID: 'tmp' + seen.length}, s, {Category: joinList(s.Category)}));
    return {s, st, match};
  });
  m.innerHTML = '';
  renderBulk();
}
function renderBulk(){
  const c = st => BULK.filter(x => x.st === st).length;
  $('#bulk-preview').hidden = false;
  $('#bulk-sums').innerHTML = [['new', 's_new', '🟢'], ['update', 's_upd', '🔄'], ['exists', 's_exists', '⛔'], ['invalid', 's_invalid', '⚠️']]
    .map(([st, k, e]) => `<div>${e}<b>${c(st)}</b>${t(k)}</div>`).join('');
  const send = c('new') + c('update');
  $('#bulk-send').textContent = send ? t('bulk_send', send) : t('bulk_nothing');
  $('#bulk-send').disabled = !send;
  const E = {new: '🟢', update: '🔄', exists: '⛔', invalid: '⚠️'};
  const shown = BULK.slice(0, 150);
  $('#bulk-rows').innerHTML = shown.map(x => `<div class="br"><span class="st">${E[x.st]}</span><span><b>${esc(x.s.Name || '—')}</b>
    <small>${esc([splitList(x.s.Mobiles)[0] || splitList(x.s.Phones)[0], x.s.Category.map(catShort).join('، '), cityName(x.s.City)].filter(Boolean).join(' · '))}${x.match ? ' · ' + esc(t('s_exists')) + ': ' + esc(x.match.Name) : ''}</small></span></div>`).join('')
    + (BULK.length > shown.length ? `<div class="br"><small>${t('bulk_more', BULK.length - shown.length)}</small></div>` : '');
}

/* ---------- requests ---------- */
function renderRequests(){
  const rq = DATA.requests.slice().reverse();
  const open = rq.filter(r => !r.answers.length && r.status === 'open').length;
  $('#n-req').hidden = !open; $('#n-req').textContent = open;
  $('#req-count').textContent = rq.length ? t('req_n', rq.length) : '';
  $('#req-list').innerHTML = rq.length ? rq.map(r => {
    const done = r.answers.length || r.status === 'closed';
    return `<div class="req"><p>${esc(r.text)}</p>
      <div class="muted"><span class="pill ${done ? 'p-done' : 'p-open'}">${done ? t('req_done') : t('req_open')}</span> ${[r.city, r.name, (r.date || '').slice(0, 10)].filter(Boolean).map(esc).join(' · ')}</div>
      <div class="acts">${r.answers.map(id => byId[id] ? `<button class="btn" data-open="${esc(id)}">${t('see_answer')}: ${esc(byId[id].Name)}</button>` : '').join('')}
        <button class="btn ${done ? '' : 'volt'}" data-answer="${esc(r.id)}">${t('i_know')}</button></div></div>`;
  }).join('') : `<div class="empty"><p>${t('no_req')}</p></div>`;
}

/* ---------- board ---------- */
function renderBoard(){
  const b = DATA.board || {top:[], monthTop:[]};
  const mt = b.monthTop || [], M = ['🥇','🥈','🥉'];
  $('#pod').innerHTML = mt.length ? [1, 0, 2].map(i => mt[i] ? `<div class="${i === 0 ? 'first' : ''}"><div class="m">${M[i]}</div><b>${esc(mt[i].name)}</b><small>${t('adds', mt[i].month)}</small></div>` : '<span></span>').join('')
    : `<div style="grid-column:span 3">${t('month_empty')}</div>`;
  $('#board').innerHTML = b.top && b.top.length ? b.top.map((p, i) => `<li><span class="n">${M[i] || i + 1}</span><span class="who">${esc(p.name)}${p.answers ? `<small>${t('answers_n', p.answers)}</small>` : ''}</span><span class="c">${t('adds', p.total)}</span></li>`).join('')
    : `<li><span class="who" style="font-weight:400;color:var(--ink-3)">${t('board_empty')}</span></li>`;
}

/* ---------- sending ---------- */
function remember(name, phone){ ME = {name: name || ME.name, phone: phone || ME.phone}; try { localStorage.setItem('me', JSON.stringify(ME)); } catch(e){} }
async function post(body, form){
  if (form && form.querySelector('input[name=website]') && form.querySelector('input[name=website]').value) return {ok:true};
  if (!CONFIG.API_URL) return {ok:false, error:'not_connected'};
  try {
    const res = await fetch(CONFIG.API_URL, {method:'POST', headers:{'Content-Type':'text/plain;charset=utf-8'}, body: JSON.stringify(body)});
    return await res.json();
  } catch(e) { return {ok:false, error:'net'}; }
}
const send = (type, data, form) => post({type, data}, form);
const showMsg = (el, ok, text) => { el.innerHTML = `<div class="msg ${ok ? 'ok' : 'err'}">${esc(text)}</div>`; };
const errText = r => r.error === 'not_connected' ? t('not_connected') : r.error === 'busy' ? t('busy') : r.error === 'missing' ? t('need_contact') : t('neterr');
const v = id => $(id).value.trim();

$('#f-add').addEventListener('submit', async e => {
  e.preventDefault();
  const m = $('#a-msg'), btn = e.target.querySelector('[type=submit]');
  const data = formData();
  if (!data.Name) return showMsg(m, false, t('need_name'));
  if (!data.Mobiles && !data.Phones && !data.Emails) return showMsg(m, false, t('need_contact'));
  if (!data.Category.length) return showMsg(m, false, t('need_cats'));
  btn.disabled = true; m.textContent = t('sending');
  const r = await send('supplier', data, e.target);
  btn.disabled = false;
  if (!r.ok) return showMsg(m, false, errText(r));
  remember(data.Submitted_By, data.Submitter_Phone);
  const msg = r.status === 'exists' ? t('sent_exists', r.existing || data.Name) : (r.status === 'update' || r.status === 'merged_pending') ? t('sent_upd', r.existing || data.Name) : t('sent_sup');
  resetAdd(); showMsg(m, true, msg);
});
$('#f-req').addEventListener('submit', async e => {
  e.preventDefault();
  const m = $('#rq-msg'), btn = e.target.querySelector('[type=submit]');
  if (v('#rq-text').length < 3) return showMsg(m, false, t('need_text'));
  remember(v('#rq-name'), v('#rq-phone'));
  btn.disabled = true; m.textContent = t('sending');
  const text = v('#rq-text');
  const r = await send('request', {Text:text, City:v('#rq-city'), Name:v('#rq-name'), Phone:v('#rq-phone')}, e.target);
  btn.disabled = false;
  if (r.ok) { showMsg(m, true, t('sent_req')); $('#rq-text').value = '';
    DATA.requests.push({id:r.id || '', status:'open', text, city:v('#rq-city'), name:v('#rq-name'), date:new Date().toISOString(), answers:[]}); renderRequests(); }
  else showMsg(m, false, errText(r));
});
document.addEventListener('submit', async e => {
  const f = e.target.closest('.rv-form'); if (!f) return;
  e.preventDefault();
  const m = f.querySelector('.rv-msg'), rating = +(f.dataset.rating || 0), comment = f.querySelector('textarea').value.trim(), name = f.querySelector('input[type=text]').value.trim();
  if (!rating && !comment) return showMsg(m, false, t('need_rate'));
  const btn = f.querySelector('[type=submit]'); btn.disabled = true; m.textContent = t('sending');
  remember(name, ME.phone);
  const r = await send('review', {Supplier_ID:f.dataset.sid, Rating:rating, Comment:comment, Name:name, Phone:ME.phone}, f);
  btn.disabled = false;
  if (r.ok) { showMsg(m, true, t('sent_rv')); f.querySelector('textarea').value = ''; } else showMsg(m, false, errText(r));
});
$('#bulk-send').addEventListener('click', async () => {
  const rows = BULK.filter(x => x.st === 'new' || x.st === 'update').map(x => Object.assign({}, x.s));
  if (!rows.length) return;
  const by = v('#bk-by'), byPhone = v('#bk-byph'); remember(by, byPhone);
  const b = $('#bulk-send'), m = $('#bulk-res'); b.disabled = true; m.textContent = t('sending');
  const r = await post({type: 'bulk', rows, by, byPhone});
  if (!r.ok) { b.disabled = false; return showMsg(m, false, errText(r)); }
  showMsg(m, true, t('bulk_done', r.summary.new, r.summary.update));
  BULK = []; $('#bulk-rows').innerHTML = ''; $('#bulk-sums').innerHTML = ''; b.textContent = '✓';
});
function setAnswer(req){ answerReq = req; $('#answering').hidden = !req; if (req) $('#answering').textContent = t('answering', req.text); }

/* ---------- share ---------- */
function share(s){
  const CAT_EMOJI = [['fire', '🔥'], ['lighting', '💡'], ['lowcurrent', '📡'], ['cables', '🔌'], ['mv', '⚡'], ['backup', '🔋'], ['solar', '☀️'], ['panels', '🔧'], ['switches', '🔌'], ['conduits', '🧰'], ['earthing', '⚡'], ['elevators', '🛗'], ['tools', '🛠'], ['services', '🏗'], ['contracting', '👷']];
  const emoji = (CAT_EMOJI.find(([g]) => s._groups[0] === g) || [, '🏭'])[1];
  const city = s.City ? cityName(s.City) : '';
  const shown = s._cats;
  const cats = shown.slice(0, 3).map(catName).join('، ') + (shown.length > 3 ? '…' : '');
  const head = ['🏢 ' + s.Name + (s.Name_AR ? ' — ' + s.Name_AR : ''), emoji + ' ' + cats + (city ? ' — ' + city : '')];
  const info = [];
  if (s.Contacts) info.push('👤 ' + s.Contacts.replace(/ ; /g, '، '));
  splitList(s.Mobiles).forEach(p => info.push('📱 ' + p));
  splitList(s.Phones).forEach(p => info.push('☎️ ' + p));
  splitList(s.Emails).forEach(p => info.push('✉️ ' + p));
  const home = CONFIG.SITE_URL.replace(/[?#].*$/, '');
  const text = head.join('\n') + (info.length ? '\n\n' + info.join('\n') : '') +
    '\n\n' + t('dir_line') + '\n' + home + '\n\n' + t('join_line') + '\n' + CONFIG.JOIN_LINK;
  window.open('https://wa.me/?text=' + encodeURIComponent(text), '_blank', 'noopener');
}
function toast(m){ const d = document.createElement('div'); d.className = 'toast'; d.textContent = m; document.body.appendChild(d); setTimeout(() => d.remove(), 2800); }

/* ---------- navigation (hash routes so the phone back button works) ---------- */
const VIEWS = ['home', 'list', 'requests', 'board', 'add', 'bulk'];
function go(view){
  if (view === 'list') { shownLimit = 30; renderList(); }
  const h = '#' + view + (view === 'list' && (filt.group || filt.cat) ? '/' + encodeURIComponent(filt.group + '|' + filt.cat) : '');
  if (location.hash !== h) location.hash = h; else route();
}
function route(){
  const m = location.hash.match(/^#s=([\w-]+)/);
  if (m && byId[m[1]]) { openSupplier(m[1]); return; }
  const [view, st] = location.hash.slice(1).split('/');
  const name = VIEWS.includes(view) ? view : 'home';
  if (name === 'list') {
    const [g, c] = decodeURIComponent(st || '').split('|');
    if ((g || '') !== filt.group || (c || '') !== filt.cat) { filt.group = g || ''; filt.cat = c || ''; }
    renderList();
  }
  if (name !== 'add') setAnswer(null);
  VIEWS.forEach(n => $('#v-' + n).hidden = n !== name);
  $$('.nav [data-go]').forEach(b => { if (b.dataset.go === name) b.setAttribute('aria-current', 'page'); else b.removeAttribute('aria-current'); });
  $('#export').hidden = name !== 'list';
  window.scrollTo(0, 0);
}
function openSupplier(id){
  const s = byId[id]; if (!s) return;
  if (!inMode(s)) { setMode(modeOf(s)); renderHome(); }
  filt = {group:'', cat:'', city:'', type:''}; $('#q').value = s.Name; shownLimit = 30;
  history.replaceState(null, '', '#list'); route(); renderList();
  const head = document.querySelector(`#r-${CSS.escape(id)} .sc-head`);
  if (head) { toggleCard(head); setTimeout(() => head.scrollIntoView({block:'center', behavior:'smooth'}), 60); }
}
window.addEventListener('hashchange', route);

/* ---------- suggestions while typing ---------- */
// everything that can be suggested: sections, specialties, companies, brands, cities (built once per data load)
function sgIndex(){
  if (SG_INDEX) return SG_INDEX;
  const ix = [], seen = new Set();
  const add = (kind, key, words, extra) => ix.push(Object.assign({kind, key, nt: ' ' + normText(words.join(' ')) + ' ', sk: skelWords(words.join(' '))}, extra));
  TAXONOMY.forEach(g => {
    add('sec', g.id, [g.ar, g.en].concat(CAT_WORDS['@' + g.id] || []), {group: g.id, cat: '', ic: g.icon});
    g.cats.forEach(c => add('spec', c[0], [c[0], c[1], c[2], c[3]].concat(CAT_WORDS[c[0]] || []), {group: g.id, cat: c[0], ic: g.icon}));
  });
  DATA.suppliers.forEach(x => {
    add('co', x.ID, [x.Name, x.Name_AR || ''], {id: x.ID, ic: groupIcon(x)});
    splitList(x.Brands).forEach(b => { const k = normText(b); if (k.length > 1 && !seen.has(k) && k !== normText(x.Name)) { seen.add(k); add('brand', b, [b], {ic: 'star'}); } });
  });
  [...new Set(DATA.suppliers.map(x => x.City).filter(c => c && CITY_AR[c] && !/,/.test(c)))].forEach(c => add('city', c, [c, CITY_AR[c]], {ic: 'home'}));
  return (SG_INDEX = ix);
}
const SG_MAX = {sec: 2, spec: 3, co: 4, brand: 2, city: 1};
function suggest(text){
  const nq = normText(text); if (!nq) return [];
  const words = nq.split(' '), last = words[words.length - 1];
  // the typed letters, their translations (كاب → cable) and their sound skeleton
  const pre = [nq].concat(words.length === 1 && last.length >= 2 ? Object.keys(SYN2).filter(k => k.startsWith(last)).flatMap(k => SYN2[k]) : []);
  const sk = words.length === 1 && last.length >= 3 ? skel(last) : '';
  const score = it => pre.some(p => it.nt.startsWith(' ' + p)) ? 0 : pre.some(p => it.nt.includes(' ' + p)) ? 1 : sk.length >= 3 && it.sk.includes(' ' + sk) ? 2 : -1;
  const got = {sec: [], spec: [], co: [], brand: [], city: []};
  sgIndex().forEach(it => { const sc = score(it); if (sc >= 0) got[it.kind].push([sc, it]); });
  const out = [];
  ['sec', 'spec', 'co', 'brand', 'city'].forEach(k => got[k].sort((a, b) => a[0] - b[0]).slice(0, SG_MAX[k]).forEach(x => out.push(x[1])));
  // a specialty already covered by a suggested section is not repeated
  return out.filter(it => !(it.kind === 'spec' && out.some(o => o.kind === 'sec' && o.group === it.group && normText(catName(it.cat)) === normText(groupName(GROUP_OF(o.group)))))).slice(0, 9);
}
function sgLabel(it){
  if (it.kind === 'sec') return groupName(GROUP_OF(it.group));
  if (it.kind === 'spec') return catName(it.cat);
  if (it.kind === 'co') { const x = byId[it.id]; return x.Name + (x.Name_AR ? ' · ' + x.Name_AR : ''); }
  if (it.kind === 'city') return cityName(it.key);
  return it.key;
}
function sgSub(it){
  if (it.kind === 'spec') return t('sg_spec') + ' · ' + groupName(GROUP_OF(it.group));
  if (it.kind === 'co') return [catsLine(byId[it.id], 1), cityName(byId[it.id].City)].filter(Boolean).join(' · ');
  return t('sg_' + it.kind);
}
let sgList = [], sgPos = -1;
function showSugg(input){
  const box = input.closest('.sbox-wrap').querySelector('.sugg'), v = input.value.trim();
  sgList = v ? suggest(v) : []; sgPos = -1;
  if (!v) { box.hidden = true; return; }
  box.innerHTML = `<button type="button" class="sg all" data-sg="-1">${icon('search')}<span><b>${esc(t('sg_all', v))}</b></span></button>`
    + sgList.map((it, i) => `<button type="button" class="sg" data-sg="${i}" role="option"><span class="ic">${icon(it.ic)}</span><span><b dir="auto">${esc(sgLabel(it))}</b><small dir="auto">${esc(sgSub(it))}</small></span></button>`).join('');
  box.hidden = false;
}
const hideSugg = () => $$('.sugg').forEach(b => b.hidden = true);
function pickSugg(i, input){
  hideSugg();
  const it = sgList[i], home = input.id === 'q-home';
  if (!it) { if (home) homeSearch(); else { input.blur(); } return; }
  $('#q-home').value = '';
  if (it.kind === 'co') { input.blur(); return openSupplier(it.id); }
  shownLimit = 30;
  if (it.kind === 'sec' || it.kind === 'spec') {
    if (groupMode(it.group) !== mode) { setMode(groupMode(it.group)); renderHome(); }
    $('#q').value = ''; filt = {group: it.group, cat: it.cat, city: '', type: ''};
  } else if (it.kind === 'city') { $('#q').value = ''; filt = {group: '', cat: '', city: it.key, type: ''}; }
  else { $('#q').value = it.key; filt = {group: '', cat: '', city: '', type: ''}; }
  input.blur(); go('list'); renderList();
}
$$('.sbox').forEach(lb => {
  const w = document.createElement('div'); w.className = 'sbox-wrap';
  lb.parentNode.insertBefore(w, lb); w.appendChild(lb);
  w.insertAdjacentHTML('beforeend', '<div class="sugg" role="listbox" hidden></div>');
  const input = lb.querySelector('input'), box = w.querySelector('.sugg');
  box.addEventListener('pointerdown', e => e.preventDefault());   // keep the keyboard open while tapping
  box.addEventListener('click', e => { const b = e.target.closest('[data-sg]'); if (b) pickSugg(+b.dataset.sg, input); });
  input.addEventListener('focus', () => { if (input.value.trim()) showSugg(input); });
  input.addEventListener('blur', () => setTimeout(() => { box.hidden = true; }, 120));
  input.addEventListener('keydown', e => {
    const items = box.querySelectorAll('[data-sg]');
    if (e.key === 'Escape') { box.hidden = true; return; }
    if ((e.key === 'ArrowDown' || e.key === 'ArrowUp') && !box.hidden && items.length) {
      e.preventDefault(); sgPos = (sgPos + 1 + (e.key === 'ArrowDown' ? 1 : -1) + items.length) % items.length - 1;
      items.forEach((b, i) => b.classList.toggle('on', i - 1 === sgPos));
    }
    if (e.key === 'Enter') { e.preventDefault(); if (!box.hidden && sgPos >= 0) pickSugg(sgPos, input); else if (input.id === 'q-home') { hideSugg(); homeSearch(); } else { hideSugg(); input.blur(); } }
  });
});

/* ---------- events ---------- */
let timer, sgTimer;
$('#q').addEventListener('input', () => { clearTimeout(timer); timer = setTimeout(() => { shownLimit = 30; renderList(); }, 120); clearTimeout(sgTimer); sgTimer = setTimeout(() => showSugg($('#q')), 60); });
const homeSearch = () => { $('#q').value = $('#q-home').value; filt = {group:'', cat:'', city:'', type:''}; go('list'); };
$('#q-home').addEventListener('input', () => { clearTimeout(sgTimer); sgTimer = setTimeout(() => showSugg($('#q-home')), 60); });
$('#more').addEventListener('click', () => { shownLimit += 40; renderList(); });
$('#empty-ask').addEventListener('click', () => { $('#rq-text').value = $('#q').value.trim(); go('requests'); });
$('#empty-add').addEventListener('click', () => { $('#a-name').value = $('#q').value.trim(); go('add'); checkDup(); });
$('#export').addEventListener('click', exportList);
['#a-name', '#a-mob', '#a-email', '#a-tel'].forEach(id => $(id).addEventListener('input', checkDup));
$('#a-city').addEventListener('input', renderCityPick);
$('#b-paste').addEventListener('click', () => { $('#paste-box').hidden = !$('#paste-box').hidden; if (!$('#paste-box').hidden) $('#paste-text').focus(); });
$('#paste-go').addEventListener('click', () => { applyParsed(parseText($('#paste-text').value)); $('#paste-box').hidden = true; });
$('#b-vcf').addEventListener('click', () => $('#vcf-file').click());
$('#vcf-file').addEventListener('change', async e => { const f = e.target.files[0]; if (!f) return; applyParsed(parseVcf(await f.text())); e.target.value = ''; });
$('#bulk-file').addEventListener('change', e => { const f = e.target.files[0]; if (f) readBulk(f); e.target.value = ''; });
$('#bulk-tpl').addEventListener('click', downloadTemplate);

document.addEventListener('click', e => {
  const sh0 = e.target.closest('button[data-share]'); if (sh0) { e.stopPropagation(); return share(byId[sh0.dataset.share]); }
  if (e.target.closest('[data-stop]')) return;
  const head = e.target.closest('.sc-head'); if (head) return toggleCard(head);
  const md = e.target.closest('[data-mode]'); if (md) { setMode(md.dataset.mode); if (TAB_GROUP[mode] ? filt.group !== TAB_GROUP[mode] : !SUP_GROUPS.includes(filt.group)) filt.group = filt.cat = ''; renderHome(); renderList(); return; }
  const grp = e.target.closest('[data-group]'); if (grp) { if (groupMode(grp.dataset.group) !== mode) { setMode(groupMode(grp.dataset.group)); renderHome(); } $('#q').value = ''; filt = {group: grp.dataset.group, cat: grp.dataset.tcat || '', city: '', type: ''}; return go('list'); }
  const cat = e.target.closest('[data-cat]'); if (cat) { filt.cat = cat.dataset.cat; shownLimit = 30; return renderList(); }
  const city = e.target.closest('[data-city]'); if (city) { filt.city = city.dataset.city; shownLimit = 30; return renderList(); }
  const sec = e.target.closest('[data-sec]'); if (sec) { toggleSection(sec.dataset.sec); return renderPicker(); }
  if (e.target.closest('[data-general]')) { toggleGeneral(); return renderPicker(); }
  const pk = e.target.closest('[data-pick]'); if (pk) { toggleSub(pk.dataset.pick); return renderPicker(); }
  const ft = e.target.closest('[data-ftype]'); if (ft) { filt.type = ft.dataset.ftype; shownLimit = 30; return renderList(); }
  const ac = e.target.closest('[data-acity]'); if (ac) { $('#a-city').value = $('#a-city').value === ac.dataset.acity ? '' : ac.dataset.acity; return renderCityPick(); }
  const ty = e.target.closest('#a-type [data-v]'); if (ty) return setType(ty.dataset.v);
  const g = e.target.closest('[data-go]'); if (g) { if (g.dataset.all) { filt = {group:'', cat:'', city:'', type:''}; $('#q').value = ''; } if (g.dataset.go === 'add' && !answerReq) {} return go(g.dataset.go); }
  const op = e.target.closest('[data-open]'); if (op) return openSupplier(op.dataset.open);
  const rt = e.target.closest('[data-rate]'); if (rt) { const f = rt.closest('.detail').querySelector('.rv-form'); f.hidden = !f.hidden; return; }
  const st = e.target.closest('[data-star]'); if (st) { const f = st.closest('form'); f.dataset.rating = st.dataset.star;
    f.querySelectorAll('[data-star]').forEach(b => b.classList.toggle('on', +b.dataset.star <= +st.dataset.star)); return; }
  const ans = e.target.closest('[data-answer]'); if (ans) { const r = DATA.requests.find(x => x.id === ans.dataset.answer); go('add'); setTimeout(() => setAnswer(r), 0); return; }
});
document.addEventListener('toggle', e => { if (e.target.id === 'fine') fineOpen = e.target.open; }, true);
document.addEventListener('keydown', e => { const h = e.target.closest && e.target.closest('.sc-head'); if (h && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); toggleCard(h); } });

/* ---------- install as app ---------- */
let deferred = null;
const dismissed = () => { try { return localStorage.getItem('inst_x') === '1'; } catch(e) { return false; } };
const standalone = matchMedia('(display-mode: standalone)').matches || navigator.standalone;
const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent);
window.addEventListener('beforeinstallprompt', e => { e.preventDefault(); deferred = e; if (!dismissed() && !standalone) $('#install').hidden = false; });
if (isIOS && !standalone && !dismissed()) { $('#install').hidden = false; $('#inst-btn').hidden = true; $('#inst-p').dataset.t = 'inst_ios'; }
$('#inst-btn').addEventListener('click', async () => { if (!deferred) return; deferred.prompt(); await deferred.userChoice; deferred = null; $('#install').hidden = true; });
$('#inst-x').addEventListener('click', () => { $('#install').hidden = true; try { localStorage.setItem('inst_x', '1'); } catch(e){} });
if ('serviceWorker' in navigator && location.protocol === 'https:') navigator.serviceWorker.register('sw.js').catch(() => {});

/* ---------- language ---------- */
function applyLang(){
  document.documentElement.lang = lang; document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  document.title = t('title') + ' – ' + G;
  $$('[data-t]').forEach(el => el.textContent = t(el.dataset.t));
  $$('[data-tp]').forEach(el => el.placeholder = t(el.dataset.tp));
  $('#lang').textContent = lang === 'ar' ? 'EN' : 'عربي';
  $('#copy').textContent = t('copy', new Date().getFullYear());
  renderAll();
}
$('#lang').addEventListener('click', () => { lang = lang === 'ar' ? 'en' : 'ar'; try { localStorage.setItem('lang', lang); } catch(e){} applyLang(); });

$('#join').href = CONFIG.JOIN_LINK;
setType(mode === 'con' ? 'Contractor' : 'Supplier');
paintIcons();
applyLang();
route();
load();
})();
