/* ============================================================
   data.js — realistic mock data, generated relative to "today"
   so the product always feels live and consistent.
   ============================================================ */
(function () {
  'use strict';
  window.VB = window.VB || {};

  var jal = VB.jal, fmt = VB.fmt;
  var TODAY = jal.todayJ();
  var NOW = new Date();

  /* ---------- player ---------- */
  var player = {
    firstName: 'احمد',
    lastName: 'احمدی',
    role: 'بازیکن',
    position: 'دریافت‌کننده',
    level: 'پیشرفته',
    group: 'نوجوانان',
    birth: { jy: 1388, jm: 4, jd: 12 },
    phone: '0912 345 6789',
    email: 'ahmad.ahmadi@vc.ir',
    city: 'تهران',
    playerId: 'VC-1405-023',
    number: '023',
    joinedYear: 1402
  };

  var coach = {
    name: 'سارا احمدی',
    role: 'مربی گروه پیشرفته',
    phone: '0912 118 4477',
    email: 's.ahmadi@vc.ir',
    experience: '۱۲ سال سابقه مربی‌گری',
    certificate: 'مدرک درجه ۲ مربی‌گری فدراسیون والیبال',
    bio: 'سارا احمدی سرمربی گروه پیشرفته نوجوانان باشگاه است؛ تمرکز اصلی او روی تکنیک دریافت، سرویس پرشی و نظم تیمی است. برنامه تمرینی هر هفته بر اساس عملکرد بازیکنان به‌روزرسانی می‌شود.',
    planNote: 'برنامه این هفته: تمرکز روی دریافت سرویس و انتقال به ضدحمله.'
  };

  /* ---------- weekly training template ---------- */
  var WEEK_TEMPLATE = [
    { dow: 0, start: '18:00', end: '19:30', type: 'تمرین تکنیک و دریافت', hall: 'سالن اصلی باشگاه', coach: coach.name },
    { dow: 2, start: '18:00', end: '19:30', type: 'تمرین تیمی و تاکتیک', hall: 'سالن اصلی باشگاه', coach: coach.name },
    { dow: 4, start: '19:00', end: '20:30', type: 'بدنسازی و آمادگی جسمانی', hall: 'سالن بدنسازی', coach: 'محمد رضایی' }
  ];

  /* ---------- build session slots: 9 weeks back → 3 weeks ahead ---------- */
  var todayWd = jal.wdIndex(TODAY.date);
  var shanbeh = new Date(TODAY.date.getTime() - todayWd * jal.DAY);
  var slots = [];
  for (var w = -9; w <= 3; w++) {
    WEEK_TEMPLATE.forEach(function (t) {
      var g = new Date(shanbeh.getTime() + (w * 7 + t.dow) * jal.DAY);
      var j = jal.toJ(g);
      slots.push({
        id: 's' + w + '_' + t.dow,
        j: j, date: g,
        dow: t.dow,
        start: t.start, end: t.end,
        type: t.type, hall: t.hall, coach: t.coach
      });
    });
  }
  slots.sort(function (a, b) { return a.date - b.date; });

  function slotStart(s) {
    var p = s.start.split(':');
    var d = new Date(s.date.getTime());
    d.setHours(+p[0], +p[1], 0, 0);
    return d;
  }
  function slotEnd(s) {
    var p = s.end.split(':');
    var d = new Date(s.date.getTime());
    d.setHours(+p[0], +p[1], 0, 0);
    return d;
  }

  /* state of each slot relative to now */
  var ABSENT_IDX = [2, 6, 9, 13, 17, 20]; /* of the last 24 held sessions */
  var pastSlots = slots.filter(function (s) { return slotEnd(s) < NOW; });
  var recorded = pastSlots.slice(-24); /* season record window = 24 sessions */
  var recordedKeys = {};
  recorded.forEach(function (s, i) {
    s.state = 'held';
    s.present = ABSENT_IDX.indexOf(i) === -1;
    recordedKeys[jal.key(s.j.jy, s.j.jm, s.j.jd)] = s;
  });
  slots.forEach(function (s) {
    if (s.state === 'held') return;
    if (slotStart(s) <= NOW && slotEnd(s) >= NOW) s.state = 'live';
    else if (slotStart(s) > NOW) s.state = 'upcoming';
    else { s.state = 'held'; s.present = true; }
  });

  var upcomingSlots = slots.filter(function (s) { return s.state === 'upcoming'; });
  var liveSlot = slots.filter(function (s) { return s.state === 'live'; })[0] || null;
  var nextSession = liveSlot || upcomingSlots[0];

  /* ---------- attendance stats ---------- */
  var present = recorded.filter(function (s) { return s.present; }).length;
  var absent = recorded.length - present;
  var streak = 0;
  for (var i = recorded.length - 1; i >= 0; i--) {
    if (recorded[i].present) streak++; else break;
  }
  function remainingInMonth() {
    return upcomingSlots.filter(function (s) { return s.j.jm === TODAY.jm && s.j.jy === TODAY.jy; }).length;
  }
  /* weekly consistency: last 8 weeks present-count per week (of 3) */
  function weeklyConsistency() {
    var out = [];
    for (var wk = 7; wk >= 0; wk--) {
      var weekStart = new Date(shanbeh.getTime() - wk * 7 * jal.DAY);
      var weekEnd = new Date(weekStart.getTime() + 7 * jal.DAY);
      var inWeek = recorded.filter(function (s) { return s.date >= weekStart && s.date < weekEnd; });
      var p = inWeek.filter(function (s) { return s.present; }).length;
      var lbl = wk === 0 ? 'این هفته' : 'هفته ' + fmt.fa(wk === 1 ? 'قبل' : wk - 1 + ' قبل');
      out.push({ label: wk === 0 ? 'این هفته' : fmt.fa(8 - wk), present: p, total: inWeek.length || 3, isCurrent: wk === 0 });
    }
    return out;
  }

  var attendance = {
    present: present,
    total: recorded.length,
    absent: absent,
    rate: Math.round((present / recorded.length) * 100),
    streak: streak,
    discipline: 90,
    remainingInMonth: remainingInMonth,
    weeklyConsistency: weeklyConsistency,
    record: recordedKeys,
    upcoming: upcomingSlots
  };

  /* ---------- payments ---------- */
  function monthLabel(jy, jm) { return fmt.monthTitle(jy, jm); }
  var payments = [];
  (function buildPayments() {
    var amounts = [2500000, 2500000, 2500000, 2500000, 2400000, 2400000];
    for (var k = 0; k < 6; k++) {
      var m = jal.addMonths(TODAY.jy, TODAY.jm, -k);
      var due = { jy: m.jy, jm: m.jm, jd: 15 };
      var status = 'paid';
      var paidOn = due;
      if (k === 0 && TODAY.jd < 15) { status = 'pending'; paidOn = null; }
      payments.push({
        id: 'p' + k,
        title: 'شهریه ' + monthLabel(m.jy, m.jm),
        type: 'شهریه ماهانه',
        amount: amounts[k],
        due: due,
        paidOn: status === 'paid' ? paidOn : null,
        status: status
      });
    }
    /* extra items to exercise every status */
    var pendDue = jal.addDays(TODAY, 5);
    payments.push({
      id: 'px1', title: 'هزینه ثبت مسابقه دوستانه', type: 'مسابقه',
      amount: 450000, due: pendDue, paidOn: null, status: 'pending'
    });
    var expDue = jal.addDays(TODAY, -35);
    payments.push({
      id: 'px2', title: 'ثبت‌نام کارگاه سرویس پرشی', type: 'کارگاه',
      amount: 380000, due: expDue, paidOn: null, status: 'expired'
    });
  })();

  var tuition = {
    current: payments[0],
    nextDue: (function () {
      var m = jal.addMonths(TODAY.jy, TODAY.jm, TODAY.jd >= 15 ? 1 : 0);
      return { jy: m.jy, jm: m.jm, jd: 15 };
    })(),
    list: payments
  };

  /* ---------- registration / membership ---------- */
  var regStart = (function () {
    if (TODAY.jd >= 10) return { jy: TODAY.jy, jm: TODAY.jm, jd: 10 };
    var m = jal.addMonths(TODAY.jy, TODAY.jm, -1);
    return { jy: m.jy, jm: m.jm, jd: 10 };
  })();
  var regEndM = jal.addMonths(regStart.jy, regStart.jm, 6);
  var registration = {
    package: 'حرفه‌ای',
    level: player.level,
    group: player.group,
    coach: coach.name,
    start: regStart,
    end: { jy: regEndM.jy, jm: regEndM.jm, jd: 29 },
    status: 'active',
    sessionsPerWeek: 3,
    features: [
      { t: '۳ جلسه تمرین در هفته', s: 'تکنیک، تیمی، بدنسازی' },
      { t: 'ارزیابی ماهانه آمادگی جسمانی', s: 'گزارش اختصاصی بازیکن' },
      { t: 'پوشش بیمه ورزشی', s: 'در طول اعتبار ثبت‌نام' },
      { t: 'حق حضور در مسابقات رسمی', s: 'رده سنی نوجوانان' },
      { t: 'دسترسی به سالن بدنسازی', s: 'ساعت ۱۶ تا ۲۱' }
    ]
  };

  /* ---------- insurance ---------- */
  var insStart = { jy: TODAY.jy, jm: TODAY.jm, jd: 1 };
  var insEndM = jal.addMonths(insStart.jy, insStart.jm, 9);
  var insEnd = { jy: insEndM.jy, jm: insEndM.jm, jd: 0 };
  insEnd = jal.addDays({ jy: insEndM.jy, jm: insEndM.jm, jd: 1 }, -1);
  var insurance = {
    status: 'active',
    start: insStart,
    end: insEnd,
    daysLeft: jal.diffDays(TODAY, insEnd),
    totalDays: jal.diffDays(insStart, insEnd),
    covers: [
      'آسیب‌دیدگی در جریان تمرینات و مسابقات رسمی',
      'هزینه‌های پزشکی و بستری تا سقف تعهدات',
      'مسئولیت مدنی در قبال سایر بازیکنان',
      'حمل‌ونقل اضطراری از محل مسابقه'
    ]
  };

  /* ---------- announcements ---------- */
  var announcements = [
    { id: 'a1', cat: 'مهم', important: true, date: jal.addDays(TODAY, -1), title: 'برنامه تمرینات هفته آینده منتشر شد', text: 'برنامه کامل هفته شامل تمرین تکنیک، تمرین تیمی و بدنسازی در بخش برنامه تمرین قابل مشاهده است.' },
    { id: 'a2', cat: 'مسابقه', important: false, date: jal.addDays(TODAY, -3), title: 'اعلام برنامه مسابقه دوستانه با باشگاه آرمان', text: 'مسابقه دوستانه روز پنجشنبه هفته آینده ساعت ۱۷ در سالن اصلی برگزار می‌شود. حضور همه بازیکنان الزامی است.' },
    { id: 'a3', cat: 'پرداخت', important: false, date: jal.addDays(TODAY, -6), title: 'مهلت پرداخت شهریه ماه جاری', text: 'برای جلوگیری از توقف خودکار ثبت‌نام، پرداخت شهریه تا پانزدهم ماه لازم است.' },
    { id: 'a4', cat: 'تمرین', important: false, date: jal.addDays(TODAY, -10), title: 'کارگاه تخصصی سرویس پرشی با مربی مهمان', text: 'کارگاه دو ساعته سرویس پرشی با ظرفیت محدود برگزار می‌شود؛ اولویت با بازیکنان گروه پیشرفته است.' },
    { id: 'a5', cat: 'عمومی', important: false, date: jal.addDays(TODAY, -16), title: 'تجهیز سالن بدنسازی به دستگاه‌های جدید', text: 'از این هفته دسترسی به دستگاه‌های جدید بدنسازی برای همه بازیکنان ثبت‌نام‌شده فعال است.' }
  ];

  /* ---------- notifications ---------- */
  var notifications = [
    { id: 'n1', type: 'info', read: false, text: nextSession ? ('تمرین بعدی ' + (function () { var dw = jal.diffDays(TODAY, nextSession.j); return dw === 0 ? 'امروز' : dw === 1 ? 'فردا' : jal.WEEKDAYS[nextSession.dow] + ' آینده'; })() + ' ساعت ' + fmt.fa(nextSession.start) + ' برگزار می‌شود.') : 'برنامه جدیدی ثبت نشده است.', time: jal.addDays(TODAY, 0), hour: '۰۹:۰۰' },
    { id: 'n2', type: 'match', read: false, text: 'اعلام برنامه مسابقه دوستانه با باشگاه آرمان.', time: jal.addDays(TODAY, -1), hour: '۱۸:۲۰' },
    { id: 'n3', type: 'success', read: true, text: 'پرداخت شهریه شما با موفقیت ثبت شد.', time: jal.addDays(TODAY, -7), hour: '۲۰:۱۴' },
    { id: 'n4', type: 'info', read: false, text: 'برنامه تمرینات هفته آینده منتشر شد.', time: jal.addDays(TODAY, -1), hour: '۱۲:۰۰' },
    { id: 'n5', type: 'warning', read: true, text: 'ثبت‌نام کارگاه سرویس پرشی منقضی شد.', time: jal.addDays(TODAY, -35), hour: '۲۳:۵۹' }
  ];

  /* ---------- faq / support ---------- */
  /* ---------- club-provided performance dataset (SPIKE panel) ---------- */
  var performance = {
    readiness: {
      total: 81,
      parts: [
        { label: 'جسمانی', val: 81, color: 'var(--yellow)' },
        { label: 'ریکاوری', val: 68, color: 'var(--info)' },
        { label: 'تغذیه', val: 82, val2: 82, color: 'var(--success)' }
      ]
    },
    seasonStats: [
      { value: null, stat: 'rate', suffix: '٪', label: 'نرخ حضور', delta: '▲ ۴٪', up: true },
      { value: null, stat: 'held', suffix: '', label: 'جلسه تمرین', delta: '▲ ۱۶', up: true },
      { value: '۹٫۱', stat: null, suffix: '', label: 'میانگین امتیاز', delta: '▲ ۰٫۳', up: true },
      { value: '۲۳', stat: null, suffix: '', label: 'بازی رسمی', delta: '— ثابت', up: false }
    ],
    kpis: [
      { icon: 'volleyball', tone: 'y', value: '۷۶٪', label: 'دقت پاس (ست)', spark: [26, 22, 24, 16, 18, 11, 13, 7, 5] },
      { icon: 'zap', tone: 'b', value: '۳۲۴', unit: 'cm', label: 'حداکثر ارتفاع پرش', spark: [28, 25, 20, 21, 15, 14, 10, 9, 6] },
      { icon: 'target', tone: 'y', value: '۵۴٪', label: 'سرویس موفق', spark: [14, 18, 12, 20, 16, 22, 15, 12, 14] },
      { icon: 'flame', tone: 'b', value: null, stat: 'streak', label: 'روز پیاپی حضور', streak: true }
    ],
    skills: [
      { label: 'پاس / ست', val: 92 },
      { label: 'سرویس', val: 78 },
      { label: 'دفاع روی تور', val: 65 },
      { label: 'اسپک', val: 84 },
      { label: 'ریسیو', val: 71 },
      { label: 'پرش عمودی', val: 89 }
    ],
    teamAvg: [70, 66, 60, 68, 63, 72],
    courtNote: 'بیشترین حضور مؤثر در <b style="color:var(--yellow)">پست ۱</b> — ۴۲٪ از پاس‌های موفق از این ناحیه اجرا شده.',
    video: {
      title: 'ست‌آپ ترکیبی — ست دوم',
      dur: '۰۲:۱۴',
      match: 'بازی مقابل تیم البرز',
      notes: [
        { t: '۰۰:۱۲', text: 'تایمینگ پاس پشت: نیم‌ثانیه دیرتر از اسپکر — روی گام آخر کار کن.' },
        { t: '۰۰:۴۸', text: 'انتخاب منطقه عالی؛ فریب بلوک میانی کاملاً درست بود.' },
        { t: '۰۱:۳۷', text: 'بعد از دریافت ضعیف، پوشش توپ دوم را فراموش نکن.' }
      ]
    },
    policy: { insurer: 'فدراسیون والیبال', number: 'VB-9823451', coverage: 'تا ۵۰۰ م.ت' },
    badges: [
      { m: '🔥', t: 'حضور کامل', s: 'یک ماه بدون غیبت', test: function (a) { return a.streak >= 4; } },
      { m: '🏆', t: 'قهرمان استانی', s: 'لیگ نوجوانان ۱۴۰۴', test: function () { return true; } },
      { m: '🎯', t: 'سرویس طلایی', s: '۱۰ ایس در یک بازی', test: function () { return true; } },
      { m: '🚀', t: 'پرش ۳۲۰+', s: 'رکورد شخصی', test: function () { return true; } },
      { m: '🛡', t: 'دیوار دفاعی', s: '۵۰ بلاک موفق', test: function () { return false; } },
      { m: '⚙️', t: 'آهنین', s: '۱۵ روز پیاپی', test: function (a) { return a.streak >= 15; } },
      { m: '👑', t: 'کاپیتان', s: 'رهبری ۱۰ بازی', test: function () { return false; } },
      { m: '🌟', t: 'MVP فصل', s: 'بهترین بازیکن', test: function () { return false; } }
    ]
  };

  var faq = [
    { q: 'اگر یک جلسه تمرین را از دست بدهم چه می‌شود؟', a: 'غیبت شما در پرونده حضور ثبت می‌شود. اگر پیش از شروع جلسه از بخش برنامه تمرین اعلام کنید، غیبت موجه ثبت می‌شود و روی نرخ نظم شما اثر منفی ندارد.' },
    { q: 'چطور می‌توانم شهریه را پرداخت کنم؟', a: 'از بخش شهریه، روی مورد در انتظار پرداخت بزنید و پرداخت را تأیید کنید. رسید دیجیتال همان لحظه صادر می‌شود.' },
    { q: 'بیمه ورزشی چه مواردی را پوشش می‌دهد؟', a: 'پوشش بیمه شامل آسیب‌دیدگی در تمرینات و مسابقات رسمی، هزینه‌های پزشکی تا سقف تعهدات و مسئولیت مدنی است. جزئیات در بخش بیمه آمده است.' },
    { q: 'امکان تغییر گروه تمرینی وجود دارد؟', a: 'بله؛ پس از ارزیابی ماهانه، مربی می‌تواند پیشنهاد جابه‌جایی گروه بدهد. درخواست نهایی از بخش پشتیبانی ثبت می‌شود.' }
  ];

  var settings = {
    notifTraining: true,
    notifPayment: true,
    notifAnnounce: true,
    notifEmail: false,
    theme: 'dark',
    language: 'fa'
  };
  try {
    var saved = JSON.parse(localStorage.getItem('vb-settings') || 'null');
    if (saved) Object.assign(settings, saved);
  } catch (e) { /* ignore */ }

  VB.data = {
    TODAY: TODAY,
    NOW: NOW,
    player: player,
    coach: coach,
    slots: slots,
    weekTemplate: WEEK_TEMPLATE,
    nextSession: nextSession,
    liveSlot: liveSlot,
    upcomingSlots: upcomingSlots,
    attendance: attendance,
    tuition: tuition,
    registration: registration,
    insurance: insurance,
    announcements: announcements,
    notifications: notifications,
    performance: performance,
    faq: faq,
    settings: settings,
    slotStart: slotStart,
    slotEnd: slotEnd,
    sessionOn: function (j) {
      var k = jal.key(j.jy, j.jm, j.jd);
      return slots.filter(function (s) { return jal.key(s.j.jy, s.j.jm, s.j.jd) === k; })[0] || null;
    },
    saveSettings: function () {
      try { localStorage.setItem('vb-settings', JSON.stringify(settings)); } catch (e) { /* ignore */ }
    }
  };
})();
