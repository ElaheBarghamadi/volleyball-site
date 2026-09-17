/* ============================================================
   dashboard.js — main page (SPIKE layout, data-driven)
   hero player card + readiness ring, KPI strip, radar + court,
   fee + insurance + monthly attendance, schedule + video +
   coach note, badges
   ============================================================ */
(function () {
  'use strict';
  window.VB = window.VB || {};
  VB.pages = VB.pages || {};

  var jal = VB.jal, fmt = VB.fmt;
  var D = function () { return VB.data; };
  var timer = null;
  VB.data.confirmed = VB.data.confirmed || {};

  var BADGE_ICONS = ['flame', 'medal', 'target', 'zap', 'insurance', 'flame', 'users', 'medal'];
  var FA_MAP = { '۰': 0, '۱': 1, '۲': 2, '۳': 3, '۴': 4, '۵': 5, '۶': 6, '۷': 7, '۸': 8, '۹': 9 };
  function FA_DIGITS(str) {
    return String(str).replace(/[۰-۹]/g, function (d) { return FA_MAP[d]; });
  }

  /* ---------- tiny svg builders ---------- */
  function spark(points, stroke) {
    var n = points.length;
    var coords = points.map(function (y, i) { return (i * (200 / (n - 1))).toFixed(1) + ',' + y; });
    return '<svg class="spark" viewBox="0 0 200 34" preserveAspectRatio="none" aria-hidden="true">' +
      '<polygon points="0,34 ' + coords.join(' ') + ' 200,34" fill="' + stroke + '"/>' +
      '<polyline points="' + coords.join(' ') + '" pathLength="100" fill="none" stroke="' + stroke + '" stroke-width="2.5" stroke-linecap="round"/></svg>';
  }

  function radarSVG(vals, team) {
    var cx = 115, cy = 115, rMax = 92;
    function pt(i, v) {
      var a = (-90 + i * 60) * Math.PI / 180;
      var r = (v / 100) * rMax;
      return (cx + r * Math.cos(a)).toFixed(1) + ',' + (cy + r * Math.sin(a)).toFixed(1);
    }
    var idx = [0, 1, 2, 3, 4, 5];
    var rings = [1, .76, .52, .28].map(function (k) {
      return '<polygon points="' + idx.map(function (i) { return pt(i, 100 * k); }).join(' ') + '"/>';
    }).join('');
    var spokes = idx.map(function (i) {
      var p = pt(i, 100).split(',');
      return '<line x1="' + cx + '" y1="' + cy + '" x2="' + p[0] + '" y2="' + p[1] + '"/>';
    }).join('');
    var labels = ['پاس', 'سرویس', 'دفاع', 'اسپک', 'ریسیو', 'پرش'].map(function (t, i) {
      var p = pt(i, 120).split(',');
      return '<text x="' + p[0] + '" y="' + (+p[1] + 4) + '">' + t + '</text>';
    }).join('');
    var teamPoly = '<polygon points="' + team.map(function (v, i) { return pt(i, v); }).join(' ') + '" class="radar-team"/>';
    var myPoly = '<polygon points="' + vals.map(function (v, i) { return pt(i, v); }).join(' ') + '" class="radar-me"/>';
    var dots = vals.map(function (v, i) {
      var p = pt(i, v).split(',');
      return '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="3.6"/>';
    }).join('');
    return '<svg class="radar" viewBox="0 0 230 230" role="img" aria-label="نمودار مهارت‌های شش‌گانه">' +
      '<g class="radar-grid">' + rings + '</g>' +
      '<g class="radar-spokes">' + spokes + '</g>' +
      teamPoly + myPoly +
      '<g class="radar-dots">' + dots + '</g>' +
      '<g class="radar-labels">' + labels + '</g></svg>';
  }

  function courtSVG() {
    return '<svg class="court" viewBox="0 0 200 320" aria-hidden="true">' +
      '<defs>' +
      '<radialGradient id="hm1"><stop offset="0" stop-color="#FF6500" stop-opacity=".72"/><stop offset="1" stop-color="#FF6500" stop-opacity="0"/></radialGradient>' +
      '<radialGradient id="hm2"><stop offset="0" stop-color="#FF9B35" stop-opacity=".65"/><stop offset="1" stop-color="#FF9B35" stop-opacity="0"/></radialGradient>' +
      '<radialGradient id="hm3"><stop offset="0" stop-color="#39A0FF" stop-opacity=".45"/><stop offset="1" stop-color="#39A0FF" stop-opacity="0"/></radialGradient>' +
      '</defs>' +
      '<rect x="10" y="10" width="180" height="300" rx="10" class="court-bg"/>' +
      '<line x1="10" y1="160" x2="190" y2="160" stroke="#FF9B35" stroke-width="3"/>' +
      '<line x1="10" y1="105" x2="190" y2="105" class="court-line" stroke-dasharray="6 5"/>' +
      '<line x1="10" y1="215" x2="190" y2="215" class="court-line" stroke-dasharray="6 5"/>' +
      '<circle cx="148" cy="198" r="56" fill="url(#hm1)"/>' +
      '<circle cx="62" cy="192" r="46" fill="url(#hm2)"/>' +
      '<circle cx="104" cy="256" r="42" fill="url(#hm3)"/>' +
      '<circle cx="148" cy="198" r="8" class="court-pin"/>' +
      '<text x="148" y="201.5" font-size="9" text-anchor="middle" fill="#7A2E00" font-weight="800">۱</text>' +
      '<text x="100" y="30" font-size="10" text-anchor="middle" class="court-txt">زمین حریف</text>' +
      '<text x="100" y="300" font-size="10" text-anchor="middle" class="court-txt">زمین خودی</text>' +
      '</svg>';
  }

  function barcode(str) {
    var bars = '', x = 0;
    for (var i = 0; i < str.length; i++) {
      var c = str.charCodeAt(i);
      var w = 2 + (c % 3);
      bars += '<rect x="' + x + '" y="0" width="' + w + '" height="30" fill="currentColor"/>';
      x += w + 2 + ((c >> 2) % 3);
    }
    return '<div class="barcode" aria-hidden="true"><svg viewBox="0 0 ' + x + ' 30" preserveAspectRatio="none">' + bars + '</svg></div>';
  }

  /* ---------- hero: player card ---------- */
  function pcardHTML() {
    var d = D(), p = d.player, a = d.attendance, pf = d.performance;
    var stats = pf.seasonStats.map(function (s) {
      var v;
      if (s.stat === 'rate') v = fmt.fa(a.rate) + '٪';
      else if (s.stat === 'held') v = fmt.fa(a.present);
      else v = s.value;
      return '<div class="pstat"><b>' + v + '</b><small>' + s.label + '</small><i class="' + (s.up ? '' : 'flat') + '">' + s.delta + '</i></div>';
    }).join('');
    var tags =
      '<span class="tg y">' + p.position + '</span>' +
      '<span class="tg">گروه ' + p.group + '</span>' +
      '<span class="tg">سطح ' + p.level + '</span>' +
      '<span class="tg">شماره ' + fmt.fa(p.number) + '</span>';
    var s = d.nextSession;
    var nx = '';
    if (s) {
      var isToday = jal.cmp(s.j, d.TODAY) === 0;
      nx = '<div class="nx">' +
        '<span class="hchip' + (isToday ? ' is-today' : '') + '">' + VB.icon(isToday ? 'zap' : 'calendar') +
        (s.state === 'live' ? 'در جریان' : isToday ? 'امروز' : jal.WEEKDAYS[s.dow]) +
        ' · <span dir="ltr">' + fmt.fa(s.start) + '</span></span>' +
        '<span class="hchip">' + VB.icon('pin') + s.hall + '</span>' +
        '<span class="nx-cd" id="nx-count" aria-label="شمارش معکوس تا تمرین بعدی"></span>' +
        '<span class="grow"></span>' +
        '<span class="pacts">' +
        '<button type="button" class="btn y" data-go="schedule">مشاهده برنامه</button>' +
        '<button type="button" class="btn ghost" data-session>جزئیات تمرین</button>' +
        '</span>' +
        '</div>';
    }
    return '<div class="pcard"><div class="pcard-media" aria-hidden="true"></div>' +
      '<div class="num" aria-hidden="true">' + fmt.fa(p.number) + '</div>' +
      '<div class="ptop">' +
      '<div class="avat" aria-hidden="true">' + p.firstName[0] + '.' + p.lastName[0] + '<span class="on" title="آنلاین"></span></div>' +
      '<div class="pinfo"><h2>' + p.firstName + ' ' + p.lastName + '</h2><div class="role">' + tags + '</div></div>' +
      '</div>' +
      '<div class="pstats">' + stats + '</div>' +
      nx +
      '</div>';
  }

  /* ---------- hero: readiness ring ---------- */
  function ringcardHTML() {
    var pf = D().performance, r = pf.readiness;
    var rings = [
      { r: 72, w: 13, color: 'url(#gRead)', val: r.parts[0].val },
      { r: 54, w: 9, color: 'var(--info)', val: r.parts[1].val },
      { r: 38, w: 7, color: 'var(--success)', val: r.parts[2].val }
    ].map(function (x) {
      var c = 2 * Math.PI * x.r;
      return '<circle cx="85" cy="85" r="' + x.r + '" fill="none" class="ring-track" stroke-width="' + x.w + '"/>' +
        '<circle cx="85" cy="85" r="' + x.r + '" fill="none" stroke="' + x.color + '" stroke-width="' + x.w + '" ' +
        'stroke-linecap="round" stroke-dasharray="' + c.toFixed(0) + '" stroke-dashoffset="' + c.toFixed(0) + '" ' +
        'data-off="' + (c * (1 - x.val / 100)).toFixed(0) + '" class="ring-anim" transform="rotate(-90 85 85)"/>';
    }).join('');
    return '<div class="card ringcard">' +
      '<div class="chead"><h3><span class="d"></span>شاخص آمادگی امروز</h3><span class="clink sm">برنامه: ' + jal.WEEKDAYS[D().nextSession ? D().nextSession.dow : 0] + '</span></div>' +
      '<div class="ringwrap">' +
      '<svg viewBox="0 0 170 170" role="img" aria-label="شاخص آمادگی ' + fmt.fa(r.total) + ' از ۱۰۰">' +
      '<defs><linearGradient id="gRead" x1="0" y1="0" x2="1" y2="1">' +
      '<stop offset="0" stop-color="#FF6500"/><stop offset="1" stop-color="#FF830D"/></linearGradient></defs>' +
      rings + '</svg>' +
      '<div class="mid"><b>' + fmt.fa(r.total) + '</b><small>از ۱۰۰</small></div>' +
      '</div>' +
      '<div class="rlegend">' + r.parts.map(function (p) {
        return '<span><i style="background:' + p.color + '"></i>' + p.label + ' ' + fmt.fa(p.val) + '٪</span>';
      }).join('') + '</div>' +
      '<div class="tipbox">' + VB.icon('info') + ' توصیه مربی: ' + D().coach.planNote + '</div>' +
      '</div>';
  }

  /* ---------- KPI strip ---------- */
  function kpisHTML() {
    var a = D().attendance;
    return D().performance.kpis.map(function (k) {
      var stroke = k.tone === 'y' ? 'var(--yellow)' : 'var(--info)';
      var body;
      if (k.streak) {
        body = '<div class="kval streak-v"><b data-count="' + a.streak + '">' + fmt.fa(0) + '</b><small>روز</small></div>' +
          '<div class="klabel">' + k.label + '</div>' +
          '<div class="streak-bars" aria-hidden="true">' +
          [0, 1, 2, 3, 4, 5, 6].map(function (i) {
            var present = i >= 7 - Math.min(a.streak, 7);
            return '<i class="' + (present ? 'p' + (i === 6 ? ' now' : '') : '') + '"></i>';
          }).join('') + '</div>';
      } else {
        var suf = k.value.indexOf('٪') > -1 ? '٪' : '';
        var num = FA_DIGITS(k.value.replace(/٪/g, '').trim());
        body = '<div class="kval"><b data-count="' + num + '" data-suffix="' + suf + '">' + fmt.fa(0) + suf + '</b>' +
          (k.unit ? '<small>' + k.unit + '</small>' : '') + '</div>' +
          '<div class="klabel">' + k.label + '</div>' +
          spark(k.spark, stroke);
      }
      return '<div class="card kpi">' +
        '<div class="kico ' + k.tone + '">' + VB.icon(k.icon) + '</div>' +
        body + '</div>';
    }).join('');
  }

  /* ---------- radar + court ---------- */
  function radarCard() {
    var pf = D().performance;
    var skl = pf.skills.map(function (s) {
      return '<div class="skl"><span>' + s.label + '</span><span class="skbar"><i style="width:' + s.val + '%"></i></span><b>' + fmt.fa(s.val) + '</b></div>';
    }).join('');
    return '<div class="card">' +
      '<div class="chead"><h3><span class="d"></span>پروفایل مهارت</h3>' +
      '<button type="button" class="clink team-toggle" data-team-toggle aria-pressed="true">' +
      '<i class="swatch me"></i>من <i class="swatch team"></i>میانگین تیم</button></div>' +
      '<div class="radarbox">' +
      radarSVG(pf.skills.map(function (s) { return s.val; }), pf.teamAvg) +
      '<div class="sklist">' + skl + '</div>' +
      '</div></div>';
  }

  function courtCard() {
    return '<div class="card">' +
      '<div class="chead"><h3><span class="d"></span>نقشه حرارتی زمین</h3>' +
      '<button type="button" class="clink" data-go="progress">۱۰ بازی اخیر ←</button></div>' +
      '<div class="courtbox">' + courtSVG() +
      '<div class="hmside">' +
      '<div class="hm-legend">' +
      '<span><i style="background:#FF6500"></i>ناحیه اسپک — ۴۲٪</span>' +
      '<span><i style="background:#FF9B35"></i>ناحیه پاس — ۳۱٪</span>' +
      '<span><i style="background:#39A0FF"></i>ناحیه دفاع — ۲۷٪</span>' +
      '</div>' +
      '<p class="hm-note">' + D().performance.courtNote + '</p>' +
      '</div></div></div>';
  }

  /* ---------- row3: fee / insurance / attendance ---------- */
  function feeCard() {
    var t = D().tuition;
    var monthly = t.list.slice(0, 6);
    var paidN = monthly.filter(function (p) { return p.status === 'paid'; }).length;
    var pct = Math.round((paidN / monthly.length) * 100);
    var cur = t.current;
    var inst = monthly.slice(0, 4).map(function (p) {
      var cls = p.status === 'paid' ? 'paid' : p.status === 'pending' ? 'due' : 'late';
      var ico = p.status === 'paid' ? VB.icon('check') : p.status === 'pending' ? VB.icon('clock') : VB.icon('alert');
      return '<div class="inst ' + cls + '">' + ico + '<small>' + jal.MONTHS[p.due.jm - 1] + '</small></div>';
    }).join('');
    var btn = cur.status === 'pending'
      ? '<button type="button" class="btn y w100" data-pay="' + cur.id + '">پرداخت شهریه ' + fmt.money(cur.amount) + ' تومان</button>'
      : '<button type="button" class="btn g w100" data-go="tuition">شهریه این ماه پرداخت شده ✓</button>';
    return '<div class="card fee">' +
      '<div class="chead"><h3><span class="d"></span>' + cur.title + '</h3>' +
      '<button type="button" class="clink" data-go="tuition">همه فاکتورها ←</button></div>' +
      '<div class="amt"><b>' + fmt.money(cur.amount) + '</b><small>تومان · سررسید ' + fmt.dateShort(cur.due) + '</small></div>' +
      '<div class="prog" role="img" aria-label="' + fmt.fa(pct) + ' درصد از شهریه‌های شش‌ماهه پرداخت شده">' +
      '<i style="width:' + pct + '%"></i></div>' +
      '<div class="prog-txt"><span>' + fmt.fa(paidN) + ' از ' + fmt.fa(monthly.length) + ' قسط پرداخت شده</span><span>' + fmt.fa(pct) + '٪</span></div>' +
      '<div class="insts">' + inst + '</div>' +
      btn + '</div>';
  }

  function tickCard() {
    var ins = D().insurance, pol = D().performance.policy, p = D().player;
    return '<div class="card tick">' +
      '<div class="tick-hd">' + VB.icon('check') +
      '<div><b>بیمه ورزشی فعال</b><small>اعتبار تا ' + fmt.dateLong(ins.end) + ' · ' + fmt.fa(ins.daysLeft) + ' روز باقی‌مانده</small></div></div>' +
      '<div class="rowk"><span>بیمه‌گر</span><b>' + pol.insurer + '</b></div>' +
      '<div class="rowk"><span>شماره بیمه‌نامه</span><b dir="ltr">' + pol.number + '</b></div>' +
      '<div class="rowk"><span>سقف تعهد</span><b>' + pol.coverage + '</b></div>' +
      '<div class="rowk"><span>دارنده</span><b>' + p.firstName + ' ' + p.lastName + '</b></div>' +
      barcode(pol.number) +
      '<div class="tick-btns">' +
      '<button type="button" class="btn b" data-ins-card>دانلود کارت</button>' +
      '<button type="button" class="btn g" data-ins-claim>ثبت حادثه</button>' +
      '</div></div>';
  }

  function miniCalCard() {
    var d = D(), a = d.attendance, T = d.TODAY;
    var firstG = jal.toG(T.jy, T.jm, 1);
    var offset = jal.wdIndex(firstG);
    var len = jal.monthLen(T.jy, T.jm);
    var cells = '';
    for (var e = 0; e < offset; e++) cells += '<i class="c e"></i>';
    var counts = { p: 0, a: 0, n: 0 };
    for (var day = 1; day <= len; day++) {
      var j = { jy: T.jy, jm: T.jm, jd: day };
      var s = d.sessionOn(j);
      var cls = 'c';
      if (s) {
        if (s.state === 'held') { cls += s.present ? ' p' : ' a'; counts[s.present ? 'p' : 'a']++; }
        else { cls += ' n'; counts.n++; }
      }
      if (jal.cmp(j, T) === 0) cls += ' t';
      cells += '<i class="' + cls + '">' + fmt.fa(day) + '</i>';
    }
    var head = jal.WEEKDAYS_SHORT.map(function (w) { return '<i>' + w + '</i>'; }).join('');
    return '<div class="card calcard">' +
      '<div class="chead"><h3><span class="d"></span>حضور این ماه</h3>' +
      '<button type="button" class="clink" data-go="attendance">جزئیات ←</button></div>' +
      '<div class="mini-cal"><div class="cal-hd">' + head + '</div><div class="cal-grid">' + cells + '</div></div>' +
      '<div class="legrow">' +
      '<span><i class="p"></i>حاضر ' + fmt.fa(counts.p) + '</span>' +
      '<span><i class="a"></i>غایب ' + fmt.fa(counts.a) + '</span>' +
      '<span><i class="n"></i>پیش‌رو ' + fmt.fa(counts.n) + '</span>' +
      '</div></div>';
  }

  /* ---------- sessions ---------- */
  function sessRow(s, isFirst) {
    var d = D();
    var conf = d.confirmed[s.id];
    var rt;
    if (s.state === 'live') rt = '<span class="tag live"><span class="pulse"></span>در جریان</span>';
    else if (jal.cmp(s.j, d.TODAY) === 0) rt = '<span class="tag y cd-chip" data-cd="' + s.id + '"></span>';
    else if (conf) rt = '<span class="tag g">' + VB.icon('check') + 'حضور تأیید شد</span>';
    else rt = '<button type="button" class="btn b s" data-confirm="' + s.id + '">تأیید حضور</button>';
    return '<div class="sess' + (isFirst ? ' y' : '') + '" data-sess="' + s.id + '" role="button" tabindex="0" aria-label="جلسه ' + fmt.dateLong(s.j, true) + '">' +
      '<div class="sy"><b>' + fmt.fa(s.j.jd) + '</b><small>' + jal.WEEKDAYS_SHORT[s.dow] + '</small></div>' +
      '<div class="sinfo"><b>' + s.type + '</b><small><span dir="ltr">' + fmt.fa(s.start) + '–' + fmt.fa(s.end) + '</span> · ' + s.hall + '</small></div>' +
      '<div class="srt">' + rt + '</div></div>';
  }
  function sessionsCard() {
    var d = D();
    var rows = (d.liveSlot ? [d.liveSlot] : []).concat(d.upcomingSlots.filter(function (s) { return s !== d.liveSlot; })).slice(0, 4);
    return '<div class="card">' +
      '<div class="chead"><h3><span class="d"></span>برنامه پیش‌رو</h3>' +
      '<button type="button" class="clink" data-go="schedule">تقویم کامل ←</button></div>' +
      '<div class="sesslist">' + rows.map(function (s, i) { return sessRow(s, i === 0); }).join('') + '</div></div>';
  }

  /* ---------- video + coach note ---------- */
  function videoCard() {
    var v = D().performance.video;
    return '<div class="card vid">' +
      '<div class="chead"><h3><span class="d"></span>آنالیز ویدیویی</h3><span class="clink sm">' + v.dur + '</span></div>' +
      '<button type="button" class="vid-thumb" data-play-video aria-label="پخش آنالیز ' + v.title + '">' +
      '<span class="play"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5.5v13l11-6.5z" fill="currentColor"/></svg></span>' +
      '<span class="vmeta"><b>' + v.title + '</b><small>' + v.match + ' · ' + fmt.fa(v.notes.length) + ' نکته مربی</small></span>' +
      '</button></div>';
  }

  function noteCard() {
    var c = D().coach;
    return '<div class="card note">' +
      '<div class="chead"><h3><span class="d"></span>یادداشت مربی</h3></div>' +
      '<div class="note-body">' +
      '<div class="cav" aria-hidden="true">' + c.name.split(' ').map(function (w) { return w[0]; }).join('.') + '</div>' +
      '<div><b>' + c.name + '</b><small>' + c.role + '</small>' +
      '<p>' + c.planNote + '</p></div>' +
      '</div></div>';
  }

  /* ---------- badges ---------- */
  function badgesCard() {
    var pf = D().performance, a = D().attendance;
    var unlocked = pf.badges.filter(function (b) { return b.test(a); }).length;
    var items = pf.badges.map(function (b, i) {
      var got = b.test(a);
      return '<div class="bg' + (got ? '' : ' lock') + '" data-badge="' + i + '" role="button" tabindex="0" aria-label="' + b.t + ' — ' + (got ? 'کسب شده' : 'قفل') + '">' +
        '<span class="bg-m">' + (got ? VB.icon(BADGE_ICONS[i]) : VB.icon('lock')) + '</span>' +
        '<b>' + b.t + '</b><small>' + b.s + '</small></div>';
    }).join('');
    return '<div class="card">' +
      '<div class="chead"><h3><span class="d"></span>دستاوردها</h3>' +
      '<button type="button" class="clink" data-go="progress">' + fmt.fa(unlocked) + ' از ' + fmt.fa(pf.badges.length) + ' باز شده ←</button></div>' +
      '<div class="badges">' + items + '</div></div>';
  }

  function footHTML() {
    return '<p class="dash-foot">' + VB.icon('info') +
      ' داده‌های عملکردی از سامانه آنالیز باشگاه · آخرین به‌روزرسانی ' + fmt.dateLong(D().TODAY) + '</p>';
  }

  /* ---------- countdown ---------- */
  function cdText(target) {
    var ms = target - new Date();
    if (ms <= 0) return 'شروع شد!';
    var s = Math.floor(ms / 1000);
    var dd = Math.floor(s / 86400); s -= dd * 86400;
    var hh = Math.floor(s / 3600); s -= hh * 3600;
    var mm = Math.floor(s / 60); s -= mm * 60;
    var core = fmt.pad2(hh) + ':' + fmt.pad2(mm) + ':' + fmt.pad2(s);
    return dd > 0 ? fmt.fa(dd) + ' روز و ' + fmt.fa(core) : fmt.fa(core);
  }
  function tickCountdown(el) {
    var s = D().nextSession;
    var out = el.querySelector('#nx-count');
    if (out && s) {
      var target = s.state === 'live' ? D().slotEnd(s) : D().slotStart(s);
      out.textContent = cdText(target);
    }
    el.querySelectorAll('[data-cd]').forEach(function (chip) {
      var slot = D().slots.filter(function (x) { return x.id === chip.getAttribute('data-cd'); })[0];
      if (slot) chip.textContent = 'تا شروع ' + cdText(D().slotStart(slot));
    });
  }

  /* ---------- modals ---------- */
  function insuranceCardModal() {
    var pol = D().performance.policy, p = D().player, ins = D().insurance;
    VB.modal.open({
      size: 'sm',
      title: 'کارت بیمه ورزشی',
      icon: 'insurance',
      tone: 'success',
      body: '<div class="ins-card-view">' +
        '<div class="ins-card">' +
        '<div class="ic-top"><span>' + VB.icon('volleyball') + ' باشگاه والیبال فراز</span><b dir="ltr">' + pol.number + '</b></div>' +
        '<div class="ic-name">' + p.firstName + ' ' + p.lastName + '</div>' +
        '<div class="ic-rows">' +
        '<span>بیمه‌گر<b>' + pol.insurer + '</b></span>' +
        '<span>اعتبار<b>' + fmt.dateShort(ins.start) + ' تا ' + fmt.dateShort(ins.end) + '</b></span>' +
        '<span>سقف تعهد<b>' + pol.coverage + '</b></span>' +
        '</div>' + barcode(pol.number) +
        '</div><p class="hint">این کارت معادل دیجیتال بیمه‌نامه شماست؛ برای ارائه به پزشک یا مرکز درمانی کافی است همین صفحه را نشان دهید.</p></div>',
      actions: [{ label: 'بستن', class: 'btn-ghost' }]
    });
    VB.toast('کارت بیمه آماده ارائه است', 'success', 'insurance');
  }
  function claimModal() {
    VB.modal.open({
      size: 'sm',
      title: 'ثبت گزارش حادثه',
      icon: 'alert',
      tone: 'danger',
      body: '<form class="claim-form" id="claim-form">' +
        '<label class="field"><span>تاریخ حادثه</span>' +
        '<input type="date" class="input" name="date" required></label>' +
        '<label class="field"><span>شرح حادثه</span>' +
        '<textarea class="input" name="desc" rows="3" placeholder="مثلاً: پیچ‌خوردگی مچ پا هنگام فرود بعد از اسپک…" required></textarea></label>' +
        '</form>',
      actions: [
        {
          label: 'ارسال گزارش', class: 'btn-primary', onClick: function (close, panel) {
            var f = panel.querySelector('#claim-form');
            if (!f.date.value || !f.desc.value.trim()) {
              VB.toast('تاریخ و شرح حادثه الزامی است', 'danger', 'alert');
              return;
            }
            close();
            VB.toast('گزارش حادثه ثبت شد؛ کارشناس بیمه تماس می‌گیرد', 'success', 'check');
          }
        },
        { label: 'انصراف', class: 'btn-ghost' }
      ]
    });
  }
  function videoModal() {
    var v = D().performance.video;
    VB.modal.open({
      size: 'md',
      title: v.title,
      icon: 'eye',
      body: '<div class="vid-view">' +
        '<div class="vid-frame" role="img" aria-label="پیش‌نمایش ویدیو">' +
        '<span class="play"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5.5v13l11-6.5z" fill="currentColor"/></svg></span>' +
        '<b>' + v.dur + '</b></div>' +
        '<div class="vid-notes">' + v.notes.map(function (n) {
          return '<div class="vnote"><span dir="ltr">' + n.t + '</span><p>' + n.text + '</p></div>';
        }).join('') + '</div></div>',
      actions: [{ label: 'بستن', class: 'btn-ghost' }]
    });
  }
  function badgeModal(i) {
    var b = D().performance.badges[i];
    var got = b.test(D().attendance);
    VB.modal.open({
      size: 'sm',
      title: b.t,
      icon: got ? 'medal' : 'lock',
      tone: got ? 'success' : 'warning',
      body: '<p>' + b.s + '</p><p class="hint">' + (got
        ? 'این دستاورد را کسب کرده‌اید — آفرین!'
        : 'برای باز شدن این دستاورد، شرط «' + b.s + '» را کامل کنید.') + '</p>',
      actions: [{ label: got ? 'عالی است!' : 'بستن', class: got ? 'btn-primary' : 'btn-ghost' }]
    });
  }

  /* ---------- page ---------- */
  VB.pages.dashboard = {
    render: function (el) {
      el.innerHTML =
        '<section class="dash-hero">' + pcardHTML() + ringcardHTML() + '</section>' +
        '<section class="dash-kpis">' + kpisHTML() + '</section>' +
        '<section class="dash-two">' + radarCard() + courtCard() + '</section>' +
        '<section class="dash-row3">' + feeCard() + tickCard() + miniCalCard() + '</section>' +
        '<section class="dash-two">' + sessionsCard() +
        '<div class="stack-col">' + videoCard() + noteCard() + '</div>' +
        '</section>' +
        badgesCard() + footHTML();

      /* KPI count-up */
      el.querySelectorAll('.kval b[data-count]').forEach(function (b) {
        VB.ui.countUp(b, +b.getAttribute('data-count'), b.getAttribute('data-suffix') || '');
      });

      /* ring animation */
      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          el.querySelectorAll('.ring-anim').forEach(function (c) {
            c.style.strokeDashoffset = c.getAttribute('data-off');
          });
        });
      });

      /* events */
      el.querySelectorAll('[data-go]').forEach(function (b) {
        b.addEventListener('click', function () { VB.navigate(b.getAttribute('data-go')); });
      });
      var sessBtn = el.querySelector('[data-session]');
      if (sessBtn) sessBtn.addEventListener('click', function () {
        if (D().nextSession) VB.ui.sessionModal(D().nextSession);
      });
      var pay = el.querySelector('[data-pay]');
      if (pay) pay.addEventListener('click', function () { VB.ui.payFlow(pay.getAttribute('data-pay')); });
      el.querySelector('[data-ins-card]').addEventListener('click', insuranceCardModal);
      el.querySelector('[data-ins-claim]').addEventListener('click', claimModal);
      el.querySelector('[data-play-video]').addEventListener('click', videoModal);

      var teamToggle = el.querySelector('[data-team-toggle]');
      teamToggle.addEventListener('click', function () {
        var on = teamToggle.getAttribute('aria-pressed') === 'true';
        teamToggle.setAttribute('aria-pressed', String(!on));
        el.querySelector('.radar-team').classList.toggle('hide', on);
      });

      el.querySelectorAll('.sess').forEach(function (row) {
        var id = row.getAttribute('data-sess');
        var slot = D().slots.filter(function (s) { return s.id === id; })[0];
        function open() { if (slot) VB.ui.sessionModal(slot); }
        row.addEventListener('click', open);
        row.addEventListener('keydown', function (e) {
          if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); }
        });
        var cf = row.querySelector('[data-confirm]');
        if (cf) cf.addEventListener('click', function (e) {
          e.stopPropagation();
          D().confirmed[id] = true;
          var rt = cf.parentNode;
          rt.innerHTML = '<span class="tag g">' + VB.icon('check') + 'حضور تأیید شد</span>';
          VB.toast('حضور شما در جلسه ' + fmt.dateLong(slot.j, true) + ' ثبت شد', 'success', 'check');
        });
      });

      el.querySelectorAll('[data-badge]').forEach(function (b) {
        function open() { badgeModal(+b.getAttribute('data-badge')); }
        b.addEventListener('click', open);
        b.addEventListener('keydown', function (e) {
          if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); }
        });
      });

      tickCountdown(el);
      timer = setInterval(function () { tickCountdown(el); }, 1000);
    },
    destroy: function () {
      if (timer) { clearInterval(timer); timer = null; }
    },
    resume: function () {
      if (!timer) {
        var el = document.getElementById('page-dashboard');
        timer = setInterval(function () { tickCountdown(el); }, 1000);
        tickCountdown(el);
      }
    }
  };
})();
