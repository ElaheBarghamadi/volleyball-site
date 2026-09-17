/* ============================================================
   attendance.js — shared UI helpers (rings, count-up)
   + attendance page renderer
   ============================================================ */
(function () {
  'use strict';
  window.VB = window.VB || {};
  VB.pages = VB.pages || {};

  var jal = VB.jal, fmt = VB.fmt, D = function () { return VB.data; };

  /* ---------- shared ring component ---------- */
  function ring(size, stroke, pct, color, centerHTML) {
    var r = (size - stroke) / 2;
    var c = 2 * Math.PI * r;
    return '<div class="ring-center" style="width:' + size + 'px;height:' + size + 'px" data-pct="' + pct + '" data-c="' + c + '">' +
      '<svg class="ring-svg" width="' + size + '" height="' + size + '" viewBox="0 0 ' + size + ' ' + size + '" aria-hidden="true">' +
      '<circle class="ring-bg" cx="' + size / 2 + '" cy="' + size / 2 + '" r="' + r + '" fill="none" stroke-width="' + stroke + '"/>' +
      '<circle class="ring-fg" cx="' + size / 2 + '" cy="' + size / 2 + '" r="' + r + '" fill="none" stroke-width="' + stroke + '" stroke="' + color + '" stroke-dasharray="' + c + '" stroke-dashoffset="' + c + '"/>' +
      '</svg><div class="rc-val">' + centerHTML + '</div></div>';
  }
  function animateRings(scope) {
    (scope || document).querySelectorAll('.ring-center').forEach(function (rc) {
      if (rc.dataset.done) return;
      rc.dataset.done = '1';
      var fg = rc.querySelector('.ring-fg');
      var c = +rc.dataset.c;
      var pct = +rc.dataset.pct;
      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          fg.style.strokeDashoffset = String(c * (1 - pct / 100));
        });
      });
    });
  }
  function countUp(el, target, suffix) {
    var start = null, dur = 900;
    function step(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var e = 1 - Math.pow(1 - p, 3);
      el.textContent = fmt.fa(Math.round(target * e)) + (suffix || '');
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  VB.ui = { ring: ring, animateRings: animateRings, countUp: countUp };

  /* ---------- session detail for a Jalali date ---------- */
  function sessionDetailHTML(j) {
    var d = D();
    var s = d.sessionOn(j);
    var rec = d.attendance.record[jal.key(j.jy, j.jm, j.jd)];
    if (!s) {
      return '<div class="session-detail"><div class="sd-head"><b>' + fmt.dateLong(j) + '</b></div><div class="sd-none">برای این تاریخ جلسه تمرینی ثبت نشده است.</div></div>';
    }
    var pill = '';
    if (rec) pill = rec.present ? '<span class="pill pill-success">' + VB.icon('check') + 'حاضر</span>' : '<span class="pill pill-danger">' + VB.icon('x') + 'غایب</span>';
    else if (s.state === 'live') pill = '<span class="pill pill-yellow">در حال برگزاری</span>';
    else pill = '<span class="pill pill-blue">پیش‌رو</span>';
    return '<div class="session-detail">' +
      '<div class="sd-head"><b>' + fmt.dateLong(j) + '</b>' + pill + '</div>' +
      '<div class="sd-rows">' +
      '<div class="sd-row">' + VB.icon('volleyball') + '<span>نوع تمرین:</span><b>' + s.type + '</b></div>' +
      '<div class="sd-row">' + VB.icon('clock') + '<span>ساعت:</span><b>' + fmt.fa(s.start) + ' — ' + fmt.fa(s.end) + '</b></div>' +
      '<div class="sd-row">' + VB.icon('pin') + '<span>محل:</span><b>' + s.hall + '</b></div>' +
      '<div class="sd-row">' + VB.icon('coach') + '<span>مربی:</span><b>' + s.coach + '</b></div>' +
      '</div></div>';
  }
  VB.ui.sessionDetailHTML = sessionDetailHTML;

  /* ---------- page: attendance ---------- */
  VB.pages.attendance = {
    render: function (el) {
      var d = D(), a = d.attendance;
      el.innerHTML =
        '<div class="page-head"><div><div class="overline">عملکرد حضور</div>' +
        '<h2 class="ph-title">حضور و غیاب</h2>' +
        '<p class="ph-sub">جزئیات حضور شما در جلسات تمرین این فصل باشگاه</p></div></div>' +
        '<div class="att-grid">' +
        /* --- main stats --- */
        '<section class="card att-main">' +
        '<div class="att-hero">' +
        ring(172, 13, a.rate, 'url(#gradRing)', '<div><b dir="ltr">' + fmt.fa(a.present) + '<span style="font-size:15px;color:var(--muted)"> / ' + fmt.fa(a.total) + '</span></b><small>جلسه حضور</small></div>') +
        '<div class="att-legend">' +
        '<div class="lg-row"><i class="lg-dot" style="background:var(--success)"></i>حاضر<b>' + fmt.fa(a.present) + ' جلسه</b></div>' +
        '<div class="lg-row"><i class="lg-dot" style="background:var(--danger)"></i>غایب<b>' + fmt.fa(a.absent) + ' جلسه</b></div>' +
        '<div class="lg-row"><i class="lg-dot" style="background:var(--primary-brt)"></i>پیش‌رو این ماه<b>' + fmt.fa(a.remainingInMonth()) + ' جلسه</b></div>' +
        '<div class="lg-row"><i class="lg-dot" style="background:var(--yellow)"></i>استریک فعلی<b>' + fmt.fa(a.streak) + ' جلسه پیاپی</b></div>' +
        '</div></div>' +
        '<svg width="0" height="0" style="position:absolute"><defs><linearGradient id="gradRing" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#39DC86"/><stop offset="1" stop-color="#20DC78"/></linearGradient></defs></svg>' +
        '<div class="stat-tiles">' +
        '<div class="stile s-success"><b data-count="' + a.rate + '" data-suffix="٪">۰٪</b><small>نرخ حضور</small></div>' +
        '<div class="stile s-danger"><b data-count="' + a.absent + '">۰</b><small>غیبت</small></div>' +
        '<div class="stile s-blue"><b data-count="' + a.remainingInMonth() + '">۰</b><small>جلسه باقی‌مانده این ماه</small></div>' +
        '</div>' +
        '<p class="muted" style="font-size:var(--fs-xs);line-height:2">نرخ حضور شما ' + fmt.fa(a.rate) + '٪ است؛ میانگین باشگاه برای گروه پیشرفته ' + fmt.fa(82) + '٪ است. با حضور منظم در جلسات باقی‌مانده، نشان نظم فصل را دریافت می‌کنید.</p>' +
        '</section>' +
        /* --- calendar --- */
        '<section class="card cal-card">' +
        '<div id="att-cal"></div>' +
        '<div class="cal-legend">' +
        '<div class="lg-row"><i class="lg-dot" style="background:var(--success)"></i>حاضر</div>' +
        '<div class="lg-row"><i class="lg-dot" style="background:var(--danger)"></i>غایب</div>' +
        '<div class="lg-row"><i class="lg-dot" style="background:var(--primary-brt)"></i>پیش‌رو</div>' +
        '<div class="lg-row"><i class="lg-dot" style="box-shadow:inset 0 0 0 1.6px var(--primary);border-radius:50%"></i>امروز</div>' +
        '</div>' +
        '<div id="att-detail"></div>' +
        '</section>' +
        '</div>';

      var detail = el.querySelector('#att-detail');
      var minM = jal.addMonths(d.TODAY.jy, d.TODAY.jm, -2);
      var maxM = jal.addMonths(d.TODAY.jy, d.TODAY.jm, 1);
      var cal = new VB.Calendar({
        el: el.querySelector('#att-cal'),
        jy: d.TODAY.jy, jm: d.TODAY.jm,
        min: minM, max: maxM,
        dayState: function (j) {
          var k = jal.key(j.jy, j.jm, j.jd);
          var rec = d.attendance.record[k];
          if (rec) return rec.present ? 'present' : 'absent';
          var s = d.sessionOn(j);
          if (s && (s.state === 'upcoming' || s.state === 'live')) return 'upcoming';
          return '';
        },
        onSelect: function (j) { detail.innerHTML = sessionDetailHTML(j); }
      });
      cal.select(d.TODAY);
      detail.innerHTML = sessionDetailHTML(d.TODAY);
      VB.pages.attendance.selectDate = function (j) {
        cal.select(j);
        detail.innerHTML = sessionDetailHTML(j);
      };

      VB.ui.animateRings(el);
      el.querySelectorAll('[data-count]').forEach(function (b) {
        VB.ui.countUp(b, +b.getAttribute('data-count'), b.getAttribute('data-suffix') || '');
      });
    }
  };
})();
