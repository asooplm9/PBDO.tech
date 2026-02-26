/* ============================================================
   PBDO.tech – Shared JavaScript Utilities
   ============================================================ */

'use strict';

// ── 1. XSS Protection ─────────────────────────────────────────
/**
 * Escape a string for safe HTML insertion via DOM textContent.
 * Prevents XSS by never using innerHTML with untrusted input.
 * @param {string} str
 * @returns {string}
 */
function sanitizeHTML(str) {
  if (str === null || str === undefined) return '';
  const node = document.createElement('div');
  node.textContent = String(str);
  return node.innerHTML;
}

// ── 2. Gregorian → Jalali Conversion ──────────────────────────
/**
 * Convert a JavaScript Date (or ISO string) to a Jalali date object.
 * Uses the standard astronomical algorithm.
 * @param {Date|string} date
 * @returns {{ jy: number, jm: number, jd: number }}
 */
function toJalali(date) {
  const d = (date instanceof Date) ? date : new Date(date);
  const gy = d.getFullYear();
  const gm = d.getMonth() + 1;
  const gd = d.getDate();

  const g_d_no = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];

  let jy, jm, jd;
  // gy2 is used only for the leap-year correction terms in the day count;
  // advancing the year by 1 after February is the standard technique.
  let gy2 = (gm > 2) ? (gy + 1) : gy;
  let g_day_no =
    365 * (gy - 1600) +
    Math.floor((gy2 - 1601) / 4) -
    Math.floor((gy2 - 1601) / 100) +
    Math.floor((gy2 - 1601) / 400) +
    g_d_no[gm - 1] + gd - 10;

  if (gm > 2 && ((gy % 4 === 0 && gy % 100 !== 0) || gy % 400 === 0)) {
    g_day_no++;
  }

  let j_day_no = g_day_no - 79;
  let j_np = Math.floor(j_day_no / 12053);
  j_day_no %= 12053;

  jy = 979 + 33 * j_np + 4 * Math.floor(j_day_no / 1461);
  j_day_no %= 1461;

  if (j_day_no >= 366) {
    jy += Math.floor((j_day_no - 1) / 365);
    j_day_no = (j_day_no - 1) % 365;
  }

  const j_days_in_month = [31, 31, 31, 31, 31, 31, 30, 30, 30, 30, 30, 29];
  for (jm = 0; jm < 11 && j_day_no >= j_days_in_month[jm]; jm++) {
    j_day_no -= j_days_in_month[jm];
  }
  jd = j_day_no + 1;
  jm = jm + 1;

  return { jy, jm, jd };
}

// ── 3. Current Jalali datetime string ─────────────────────────
/**
 * Returns the current date and time as a Jalali string.
 * Format: "YYYY/MM/DD – HH:MM"
 * @returns {string}
 */
function getJalaliNow() {
  const now = new Date();
  const { jy, jm, jd } = toJalali(now);
  const hh = String(now.getHours()).padStart(2, '0');
  const mm = String(now.getMinutes()).padStart(2, '0');
  const pad = (n) => String(n).padStart(2, '0');
  return `${jy}/${pad(jm)}/${pad(jd)} – ${hh}:${mm}`;
}

// ── 4. Provinces Master List ───────────────────────────────────
/**
 * Returns an array of all 31 Iranian provinces with id, name,
 * capital, and a representative cities array.
 * @returns {Array<{id:number, name:string, capital:string, cities:string[]}>}
 */
function getProvinces() {
  return [
    { id:  1, name: 'آذربایجان شرقی',       capital: 'تبریز',        cities: ['تبریز', 'مراغه', 'مرند', 'اهر', 'سراب', 'بناب', 'ملکان'] },
    { id:  2, name: 'آذربایجان غربی',       capital: 'ارومیه',       cities: ['ارومیه', 'خوی', 'میاندوآب', 'مهاباد', 'بوکان', 'سلماس', 'نقده'] },
    { id:  3, name: 'اردبیل',               capital: 'اردبیل',       cities: ['اردبیل', 'پارس‌آباد', 'مشگین‌شهر', 'خلخال', 'بیله‌سوار'] },
    { id:  4, name: 'اصفهان',               capital: 'اصفهان',       cities: ['اصفهان', 'کاشان', 'خمینی‌شهر', 'نجف‌آباد', 'شاهین‌شهر', 'فلاورجان'] },
    { id:  5, name: 'البرز',                capital: 'کرج',          cities: ['کرج', 'نظرآباد', 'هشتگرد', 'طالقان', 'ساوجبلاغ'] },
    { id:  6, name: 'ایلام',                capital: 'ایلام',        cities: ['ایلام', 'مهران', 'دهلران', 'آبدانان', 'ایوان'] },
    { id:  7, name: 'بوشهر',               capital: 'بوشهر',        cities: ['بوشهر', 'برازجان', 'گناوه', 'کنگان', 'جم', 'خارک'] },
    { id:  8, name: 'تهران',               capital: 'تهران',        cities: ['تهران', 'ری', 'شمیرانات', 'اسلامشهر', 'ورامین', 'پردیس', 'دماوند'] },
    { id:  9, name: 'چهارمحال و بختیاری', capital: 'شهرکرد',       cities: ['شهرکرد', 'بروجن', 'فارسان', 'لردگان', 'اردل'] },
    { id: 10, name: 'خراسان جنوبی',        capital: 'بیرجند',       cities: ['بیرجند', 'قائن', 'فردوس', 'طبس', 'نهبندان'] },
    { id: 11, name: 'خراسان رضوی',         capital: 'مشهد',         cities: ['مشهد', 'نیشابور', 'سبزوار', 'تربت حیدریه', 'کاشمر', 'گناباد', 'تربت جام'] },
    { id: 12, name: 'خراسان شمالی',        capital: 'بجنورد',       cities: ['بجنورد', 'شیروان', 'اسفراین', 'فاروج', 'مانه و سملقان'] },
    { id: 13, name: 'خوزستان',             capital: 'اهواز',        cities: ['اهواز', 'آبادان', 'خرمشهر', 'دزفول', 'بهبهان', 'ماهشهر', 'شوشتر', 'مسجدسلیمان'] },
    { id: 14, name: 'زنجان',               capital: 'زنجان',        cities: ['زنجان', 'ابهر', 'خرمدره', 'قیدار', 'ماهنشان'] },
    { id: 15, name: 'سمنان',               capital: 'سمنان',        cities: ['سمنان', 'شاهرود', 'دامغان', 'گرمسار', 'مهدیشهر'] },
    { id: 16, name: 'سیستان و بلوچستان',  capital: 'زاهدان',       cities: ['زاهدان', 'زابل', 'چابهار', 'ایرانشهر', 'خاش', 'سراوان', 'نیکشهر'] },
    { id: 17, name: 'فارس',               capital: 'شیراز',        cities: ['شیراز', 'مرودشت', 'جهرم', 'کازرون', 'فسا', 'داراب', 'لارستان'] },
    { id: 18, name: 'قزوین',              capital: 'قزوین',        cities: ['قزوین', 'البرز', 'تاکستان', 'آبیک', 'بویین‌زهرا'] },
    { id: 19, name: 'قم',                 capital: 'قم',           cities: ['قم', 'جعفریه', 'خلجستان'] },
    { id: 20, name: 'کردستان',            capital: 'سنندج',        cities: ['سنندج', 'سقز', 'بانه', 'مریوان', 'قروه', 'دیواندره', 'بیجار'] },
    { id: 21, name: 'کرمان',              capital: 'کرمان',        cities: ['کرمان', 'جیرفت', 'بم', 'رفسنجان', 'سیرجان', 'شهربابک', 'زرند'] },
    { id: 22, name: 'کرمانشاه',           capital: 'کرمانشاه',     cities: ['کرمانشاه', 'اسلام‌آباد غرب', 'سنقر', 'کنگاور', 'هرسین', 'جوانرود'] },
    { id: 23, name: 'کهگیلویه و بویراحمد', capital: 'یاسوج',      cities: ['یاسوج', 'گچساران', 'دهدشت', 'دوگنبدان', 'سی‌سخت'] },
    { id: 24, name: 'گلستان',             capital: 'گرگان',        cities: ['گرگان', 'گنبد کاووس', 'علی‌آباد کتول', 'بندر گز', 'آزادشهر', 'کردکوی'] },
    { id: 25, name: 'گیلان',              capital: 'رشت',          cities: ['رشت', 'انزلی', 'لاهیجان', 'لنگرود', 'آستارا', 'رودبار', 'صومعه‌سرا'] },
    { id: 26, name: 'لرستان',             capital: 'خرم‌آباد',    cities: ['خرم‌آباد', 'بروجرد', 'دورود', 'کوهدشت', 'نورآباد', 'ازنا'] },
    { id: 27, name: 'مازندران',           capital: 'ساری',         cities: ['ساری', 'آمل', 'بابل', 'بابلسر', 'قائم‌شهر', 'نوشهر', 'چالوس', 'تنکابن'] },
    { id: 28, name: 'مرکزی',              capital: 'اراک',         cities: ['اراک', 'ساوه', 'خمین', 'محلات', 'دلیجان', 'شازند'] },
    { id: 29, name: 'هرمزگان',            capital: 'بندرعباس',     cities: ['بندرعباس', 'قشم', 'کیش', 'بندرلنگه', 'میناب', 'حاجی‌آباد'] },
    { id: 30, name: 'همدان',              capital: 'همدان',        cities: ['همدان', 'ملایر', 'نهاوند', 'تویسرکان', 'اسدآباد', 'رزن'] },
    { id: 31, name: 'یزد',               capital: 'یزد',          cities: ['یزد', 'میبد', 'اردکان', 'بافق', 'ابرکوه', 'تفت'] },
  ];
}

// ── 5. Format ISO date as Jalali datetime ─────────────────────
/**
 * Format an ISO 8601 date string to a human-readable Jalali string.
 * @param {string} isoString
 * @returns {string}  e.g. "۱۴۰۳/۰۴/۱۲ – ۱۴:۳۰"
 */
function formatDate(isoString) {
  if (!isoString) return '—';
  try {
    const d = new Date(isoString);
    const { jy, jm, jd } = toJalali(d);
    const hh = String(d.getHours()).padStart(2, '0');
    const mm = String(d.getMinutes()).padStart(2, '0');
    const pad = (n) => String(n).padStart(2, '0');
    return `${jy}/${pad(jm)}/${pad(jd)} – ${hh}:${mm}`;
  } catch {
    return isoString;
  }
}

// ── 6. Tracking Code Generator ────────────────────────────────
/**
 * Generate a unique 8-character alphanumeric tracking code.
 * @returns {string}  e.g. "A3F9KR2M"
 */
function generateTrackingCode() {
  // Excludes visually ambiguous characters: I, O (mistaken for 1, 0) and 1, 0 themselves.
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  const array = new Uint8Array(8);
  crypto.getRandomValues(array);
  for (let i = 0; i < 8; i++) {
    code += chars[array[i] % chars.length];
  }
  return code;
}

// ── 7. Toast Notification ─────────────────────────────────────
/**
 * Display a non-blocking toast notification.
 * @param {string} message
 * @param {'success'|'error'|'warning'|'info'} [type='info']
 * @param {number} [duration=4000]  milliseconds before auto-dismiss
 */
function showToast(message, type = 'info', duration = 4000) {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    document.body.appendChild(container);
  }

  const icons = {
    success: '✅',
    error:   '❌',
    warning: '⚠️',
    info:    'ℹ️',
  };

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.setAttribute('role', 'alert');
  toast.setAttribute('aria-live', 'polite');

  const iconSpan = document.createElement('span');
  iconSpan.className = 'toast-icon';
  iconSpan.textContent = icons[type] || icons.info;

  const msgSpan = document.createElement('span');
  msgSpan.className = 'toast-message';
  msgSpan.textContent = message;  // textContent – no XSS risk

  toast.appendChild(iconSpan);
  toast.appendChild(msgSpan);
  container.appendChild(toast);

  const dismiss = () => {
    toast.classList.add('removing');
    toast.addEventListener('animationend', () => toast.remove(), { once: true });
  };

  toast.addEventListener('click', dismiss);
  setTimeout(dismiss, duration);
}

// ── 8. Sample Data Initialisation ────────────────────────────
/**
 * Populate localStorage with realistic demo data on first load.
 * Each key is prefixed with "pbdo_" and will not be overwritten
 * if it already exists.
 */
function initSampleData() {
  // ── Reports ─────────────────────────────────────────────────
  if (!localStorage.getItem('pbdo_reports')) {
    const statuses   = ['pending', 'under_review', 'resolved', 'rejected'];
    const urgencies  = ['low', 'medium', 'high', 'critical'];
    const threatTypes = [
      'فعالیت مشکوک زیستی', 'آلودگی منابع آب', 'انتشار ماده شیمیایی',
      'تهدید هسته‌ای', 'بیماری واگیر دار', 'آلودگی هوا', 'تهدید رادیولوژیک',
      'ورود غیرمجاز مواد خطرناک',
    ];

    const sampleReports = [
      { id: 1,  trackingCode: 'A3F9KR2M', name: 'علی محمدی',        phone: '09121234567', province: 'تهران',               city: 'تهران',       threatType: threatTypes[0], urgency: 'high',     description: 'مشاهده فعالیت مشکوک در انبار صنعتی شهر ری', status: 'under_review', submittedAt: '2024-07-01T08:30:00Z', adminNotes: 'در دست بررسی توسط تیم میدانی' },
      { id: 2,  trackingCode: 'B7JT5HNQ', name: 'مریم رضایی',        phone: '09351234567', province: 'اصفهان',              city: 'کاشان',       threatType: threatTypes[1], urgency: 'medium',   description: 'بوی نامعمول از رودخانه زاینده‌رود در منطقه صنعتی', status: 'pending', submittedAt: '2024-07-02T10:15:00Z', adminNotes: '' },
      { id: 3,  trackingCode: 'C2MX8VPL', name: 'حسن کریمی',         phone: '09161234567', province: 'خوزستان',             city: 'اهواز',       threatType: threatTypes[2], urgency: 'critical', description: 'انتشار دود غلیظ از یک کارخانه پتروشیمی', status: 'resolved', submittedAt: '2024-06-28T14:00:00Z', adminNotes: 'موضوع رسیدگی و برطرف شد' },
      { id: 4,  trackingCode: 'D5RK3WYZ', name: 'زهرا حسینی',        phone: '09111234567', province: 'خراسان رضوی',         city: 'مشهد',        threatType: threatTypes[4], urgency: 'high',     description: 'گزارش بیماری تنفسی مشکوک در مدرسه', status: 'under_review', submittedAt: '2024-07-03T09:00:00Z', adminNotes: 'تیم بهداشت اعزام شد' },
      { id: 5,  trackingCode: 'E8SN6TFG', name: 'احمد قاسمی',        phone: '09301234567', province: 'فارس',                city: 'شیراز',       threatType: threatTypes[5], urgency: 'low',      description: 'کیفیت هوا در منطقه چهار شیراز کاهش یافته', status: 'resolved', submittedAt: '2024-06-25T07:45:00Z', adminNotes: 'ناشی از گرد و خاک طبیعی' },
      { id: 6,  trackingCode: 'F1PQ9UHD', name: 'نرگس موسوی',        phone: '09221234567', province: 'گیلان',               city: 'رشت',         threatType: threatTypes[1], urgency: 'medium',   description: 'آلودگی رنگی رودخانه سفیدرود در بخش فومنات', status: 'pending', submittedAt: '2024-07-04T11:20:00Z', adminNotes: '' },
      { id: 7,  trackingCode: 'G4LW2BJN', name: 'محمود صادقی',       phone: '09141234567', province: 'آذربایجان شرقی',      city: 'تبریز',       threatType: threatTypes[6], urgency: 'high',     description: 'هشدار تشعشعات از یک مرکز پزشکی قدیمی', status: 'under_review', submittedAt: '2024-07-05T16:30:00Z', adminNotes: 'آزمایشگاه اعزام شد' },
      { id: 8,  trackingCode: 'H6VC7EKR', name: 'فاطمه تقوی',        phone: '09051234567', province: 'مازندران',            city: 'ساری',        threatType: threatTypes[0], urgency: 'low',      description: 'ورود کامیون‌های مشکوک به جنگل', status: 'rejected', submittedAt: '2024-06-20T13:00:00Z', adminNotes: 'پس از بررسی تهدید تأیید نشد' },
      { id: 9,  trackingCode: 'J9AM4SXP', name: 'کمال نوری',          phone: '09181234567', province: 'کرمان',               city: 'کرمان',       threatType: threatTypes[7], urgency: 'medium',   description: 'ورود محموله ناشناس از مرز شرقی', status: 'under_review', submittedAt: '2024-07-06T08:00:00Z', adminNotes: 'هماهنگی با گمرک در جریان است' },
      { id: 10, trackingCode: 'K3BT1DNY', name: 'لیلا شیرازی',       phone: '09321234567', province: 'البرز',               city: 'کرج',         threatType: threatTypes[2], urgency: 'critical', description: 'بوی گاز خردل در منطقه صنعتی هشتگرد', status: 'pending', submittedAt: '2024-07-07T06:50:00Z', adminNotes: '' },
      { id: 11, trackingCode: 'M7FX5GCZ', name: 'رضا اکبری',          phone: '09431234567', province: 'سیستان و بلوچستان',  city: 'زاهدان',      threatType: threatTypes[3], urgency: 'high',     description: 'اطلاعات مشکوک درباره مواد پرتوزا در مرز', status: 'under_review', submittedAt: '2024-07-07T12:10:00Z', adminNotes: 'پیگیری با سازمان انرژی اتمی' },
      { id: 12, trackingCode: 'N2QR8VLT', name: 'ستاره منصوری',       phone: '09191234567', province: 'کردستان',             city: 'سنندج',       threatType: threatTypes[4], urgency: 'medium',   description: 'شیوع اسهال خونی در یک روستای اطراف سنندج', status: 'resolved', submittedAt: '2024-07-01T15:00:00Z', adminNotes: 'تیم اورژانس بهداشتی اعزام شد' },
    ];
    localStorage.setItem('pbdo_reports', JSON.stringify(sampleReports));
  }

  // ── Alerts / News ────────────────────────────────────────────
  if (!localStorage.getItem('pbdo_alerts')) {
    const alerts = [
      { id: 1, title: 'هشدار کیفیت هوا – تهران', message: 'شاخص کیفیت هوا در تهران به سطح ناسالم رسیده است. از تردد غیرضروری خودداری کنید.', level: 'warning', active: true,  createdAt: '2024-07-07T06:00:00Z' },
      { id: 2, title: 'پایش ویژه مرزهای شرقی',   message: 'عملیات پایش ویژه در استان‌های مرزی شرق کشور آغاز شد. گزارش‌های مردمی راستی‌آزمایی می‌شوند.', level: 'info', active: true,  createdAt: '2024-07-06T10:00:00Z' },
      { id: 3, title: 'بحران آلودگی رودخانه کارون', message: 'سطح آلودگی رودخانه کارون در بازه اهواز بحرانی است. مصرف آب رودخانه‌ای ممنوع است.', level: 'crisis', active: true,  createdAt: '2024-07-05T14:30:00Z' },
      { id: 4, title: 'رزمایش دفاع بیولوژیک',     message: 'رزمایش دفاع بیولوژیک در پنج استان شمالی برگزار می‌شود. این یک تمرین آموزشی است.', level: 'info', active: false, createdAt: '2024-07-01T08:00:00Z' },
      { id: 5, title: 'اضطرار شیمیایی – اهواز',   message: 'نشت ماده شیمیایی در منطقه صنعتی اهواز گزارش شده است. ساکنان محلی تخلیه کنند.', level: 'emergency', active: true,  createdAt: '2024-07-07T04:15:00Z' },
    ];
    localStorage.setItem('pbdo_alerts', JSON.stringify(alerts));
  }

  // ── Province Threat Levels ────────────────────────────────────
  if (!localStorage.getItem('pbdo_provinces')) {
    const provinces = getProvinces().map((p, idx) => {
      // Threat level map: index → level.  Most provinces are green;
      // a handful are yellow (active monitoring) and two are orange (elevated risk).
      const ORANGE_IDX  = new Set([7, 12]);          // خوزستان (idx 12) and بوشهر (idx 7)
      const YELLOW_IDX  = new Set([0, 3, 10, 15, 16, 24]); // آذربایجان شرقی، اصفهان، خراسان رضوی، سیستان، فارس، گیلان
      let level = 'green';
      if (ORANGE_IDX.has(idx))      level = 'orange';
      else if (YELLOW_IDX.has(idx)) level = 'yellow';
      return {
        id:        p.id,
        name:      p.name,
        capital:   p.capital,
        level,
        lastUpdate: new Date(Date.now() - Math.random() * 3600000 * 5).toISOString(),
      };
    });
    localStorage.setItem('pbdo_provinces', JSON.stringify(provinces));
  }

  // ── Monitoring Stations ───────────────────────────────────────
  if (!localStorage.getItem('pbdo_stations')) {
    const provinces = getProvinces();
    const stationTypes = ['زیستی', 'شیمیایی', 'رادیولوژیک', 'هوا', 'آب'];
    const statuses = ['online', 'online', 'online', 'warning', 'offline'];

    const stations = provinces.map((p, idx) => ({
      id:       idx + 1,
      province: p.name,
      city:     p.capital,
      type:     stationTypes[idx % stationTypes.length],
      status:   statuses[idx % statuses.length],
      lastPing: new Date(Date.now() - Math.random() * 600000).toISOString(),
      readings: {
        temperature: (20 + Math.random() * 15).toFixed(1),
        humidity:    (40 + Math.random() * 40).toFixed(0),
        pressure:    (1000 + Math.random() * 30).toFixed(0),
      },
    }));
    localStorage.setItem('pbdo_stations', JSON.stringify(stations));
  }

  // ── Users ─────────────────────────────────────────────────────
  if (!localStorage.getItem('pbdo_users')) {
    const users = [
      { id: 1, username: 'admin',     name: 'دکتر سعید رحیمی',   role: 'مدیر ارشد', email: 'admin@pbdo.tech',    active: true,  lastLogin: '2024-07-07T07:00:00Z', province: 'تهران' },
      { id: 2, username: 'manager1',  name: 'مهندس لیلا احمدی',  role: 'مدیر',      email: 'manager@pbdo.tech',  active: true,  lastLogin: '2024-07-07T06:30:00Z', province: 'اصفهان' },
      { id: 3, username: 'operator1', name: 'کارشناس حسن نوری',   role: 'اپراتور',   email: 'op1@pbdo.tech',      active: true,  lastLogin: '2024-07-06T22:00:00Z', province: 'خراسان رضوی' },
      { id: 4, username: 'viewer1',   name: 'ناظر رضا کاظمی',    role: 'ناظر',      email: 'viewer1@pbdo.tech',  active: false, lastLogin: '2024-07-04T14:00:00Z', province: 'فارس' },
    ];
    localStorage.setItem('pbdo_users', JSON.stringify(users));
  }

  // ── Ticker Messages ──────────────────────────────────────────
  if (!localStorage.getItem('pbdo_ticker')) {
    const ticker = [
      '🔴 هشدار اضطراری: نشت شیمیایی در اهواز – ساکنان تخلیه کنند',
      '🟡 آلودگی رودخانه کارون: پایش مستمر در جریان است',
      '🟢 سیستم‌های پایش در ۲۸ استان به‌روز و فعال هستند',
      '🔵 رزمایش دفاع بیولوژیک در استان‌های شمالی: ۱۵ تا ۲۰ تیرماه',
      '🟠 افزایش شاخص آلودگی هوا در تهران – احتیاط کنید',
      '🟢 گزارش ماهانه پایش محیط‌زیست منتشر شد',
      '🔵 سامانه PBDO به‌روزرسانی شد – نسخه ۲.۴.۱',
      '🟡 پایش ویژه مناطق مرزی شرقی در حال اجرا است',
    ];
    localStorage.setItem('pbdo_ticker', JSON.stringify(ticker));
  }
}

// ── 9. Update Header Datetime Display ─────────────────────────
function _updateDatetimeDisplay() {
  const el = document.getElementById('header-datetime');
  if (el) el.textContent = getJalaliNow();
}

// ── 10. Service Worker Registration ───────────────────────────
function _registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/sw.js')
        .catch(() => { /* SW optional – silent fail */ });
    });
  }
}

// ── 11. Page Initialisation ────────────────────────────────────
/**
 * Called on DOMContentLoaded.
 * Bootstraps sample data, starts the clock, and registers the SW.
 */
function initPage() {
  initSampleData();
  _updateDatetimeDisplay();
  // Store interval ID so callers can clear it if needed (e.g., SPA teardown).
  initPage._intervalId = setInterval(_updateDatetimeDisplay, 60_000);
  _registerServiceWorker();
}

document.addEventListener('DOMContentLoaded', initPage);
