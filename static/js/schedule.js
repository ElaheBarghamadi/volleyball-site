/* ============================================================
   schedule.js — weekly interactive timeline + session modals
   ============================================================ */
(function () {
  'use strict';
  window.VB = window.VB || {};
  VB.pages = VB.pages || {};
  VB.ui = VB.ui || {};

  var jal = VB.jal, fmt = VB.fmt;
  var D = function () { return VB.data; };
  var state = { week: 0, dow: 'all' };
  var MIN_WEEK = -3, MAX_WEEK = 3;

  function weekStart(offset) {
    var d = D();
    return new Date(d.TODAY.date.getTime() - jal.wdIndex(d.TODAY.date) * jal.DAY + offset * 7 * jal.DAY);
  }
  function weekSlots(offset) {
    var start = weekStart(offset);
    var end = new Date(start.getTime() + 7 * jal.DAY);
    return D().slots.filter(function (s) { return s.date >= start && s.date < end; });
  }
  function weekLabel(offset) {
    var s = jal.toJ(weekStart(offset));
    var e = jal.toJ(new Date(weekStart(offset).getTime() + 6 * jal.DAY));
    if (s.jm === e.jm) return fmt.fa(s.jd) + ' تا ' + fmt.fa(e.jd) + ' ' + jal.MONTHS[s.jm - 1] + ' ' + fmt.fa(s.jy);
    return fmt.fa(s.jd) + ' ' + jal.MONTHS[s.jm - 1] + ' تا ' + fmt.fa(e.jd) + ' ' + jal.MONTHS[e.jm - 1];
  }

  function statusPill(s) {
    var rec = D().attendance.record[jal.key(s.j.jy, s.jm, s.jd)];
    if (rec) return rec.present ? '<span class="pill pill-success">' + VB.icon('check') + 'حاضر</span>' : '<span class="pill pill-danger">' + VB.icon('x') + 'غایب</span>';
    if (s.state === 'live') return '<span class="pill pill-yellow">در حال برگزاری</span>';
    if (s.state === 'held') return '<span class="pill pill-muted">برگزار شده</span>';
    return '<span class="pill pill-blue">پیش‌رو</span>';
  }

  /* ---------- shared session modal ---------- */
  VB.ui.sessionModal = function (s) {
    if (!s) return;
    var rec = D().attendance.record[jal.key(s.j.jy, s.jm, s.jd)];
    VB.modal.open({
      title: s.type,
      icon: 'volleyball',
      tone: 'blue',
      body: '<div class="detail-list">' +
        '<div class="dl-row">' + VB.icon('calendar') + '<span>تاریخ</span><b>' + fmt.dateLong(s.j) + '</b></div>' +
        '<div class="dl-row">' + VB.icon('clock') + '<span>ساعت</span><b>' + fmt.fa(s.start) + ' — ' + fmt.fa(s.end) + '</b></div>' +
        '<div class="dl-row">' + VB.icon('pin') + '<span>محل</span><b>' + s.hall + '</b></div>' +
        '<div class="dl-row">' + VB.icon('coach') + '<span>مربی</span><b>' + s.coach + '</b></div>' +
        '<div class="dl-row">' + VB.icon('attendance') + '<span>وضعیت</span><b>' + statusPill(s) + '</b></div>' +
        (rec && !rec.present ? '<div class="dl-row">' + VB.icon('info') + '<span>علت</span><b>غیبت ثبت‌شده در پرونده حضور</b></div>' : '') +
        '</div>',
      actions: [
        {
          label: 'مشاهده در تقویم حضور', class: 'btn-soft', icon: 'calendar', onClick: function (close) {
            close();
            VB.navigate('attendance', { select: s.j });
          }
        },
        { label: 'بستن', class: 'btn-ghost' }
      ]
    });
  };

  VB.ui.coachModal = function () {
    var c = D().coach;
    VB.modal.open({
      title: c.name,
      icon: 'coach',
      tone: 'navy',
      size: 'md',
      body: '<div style="display:flex;gap:14px;align-items:center;margin-bottom:14px">' +
        '<div class="avatar lg" style="background:linear-gradient(140deg,#123C63,#0D2944)">' + c.name[0] + '</div>' +
        '<div><b style="font-size:var(--fs-md)">' + c.role + '</b><div class="muted" style="font-size:var(--fs-xs)">' + c.experience + '</div></div></div>' +
        '<p style="line-height:2;margin-bottom:14px">' + c.bio + '</p>' +
        '<div class="detail-list">' +
        '<div class="dl-row">' + VB.icon('medal') + '<span>مدرک</span><b>' + c.certificate + '</b></div>' +
        '<div class="dl-row">' + VB.icon('phone') + '<span>تماس</span><b style="direction:ltr">' + c.phone + '</b></div>' +
        '<div class="dl-row">' + VB.icon('mail') + '<span>ایمیل</span><b style="direction:ltr">' + c.email + '</b></div>' +
        '<div class="dl-row">' + VB.icon('zap') + '<span>برنامه این هفته</span><b>' + c.planNote + '</b></div>' +
        '</div>',
      actions: [{ label: 'بستن', class: 'btn-ghost' }]
    });
  };

  /* ---------- timeline ---------- */
  function timelineHTML() {
    var list = weekSlots(state.week).filter(function (s) { return state.dow === 'all' || s.dow === +state.dow; });
    if (!list.length) return '<div class="tl-empty">در این هفته و با این فیلتر، جلسه‌ای ثبت نشده است.</div>';
    return list.map(function (s, i) {
      var rec = D().attendance.record[jal.key(s.j.jy, s.jm, s.jd)];
      var cls = 'tl-item';
      if (rec && !rec.present) cls += ' is-absent is-past';
      else if (rec) cls += ' is-past';
      else if (s.state === 'live') cls += ' is-now';
      return '<div class="' + cls + '" style="animation-delay:' + (i * 70) + 'ms">' +
        '<div class="tl-time"><b>' + fmt.fa(s.start) + '</b><small>' + fmt.fa(s.end) + '</small></div>' +
        '<div class="tl-node"></div>' +
        '<button type="button" class="tl-card" data-slot="' + s.id + '">' +
        '<div class="tl-day"><b>' + jal.WEEKDAYS[s.dow] + '</b><small>' + fmt.fa(s.j.jd) + '/' + fmt.fa(s.j.jm) + '</small></div>' +
        '<div class="tl-main"><div class="tl-type">' + s.type + '</div>' +
        '<div class="tl-meta"><span>' + VB.icon('coach') + s.coach + '</span><span>' + VB.icon('pin') + s.hall + '</span></div></div>' +
        statusPill(s) +
        '</button></div>';
    }).join('');
  }

  function toolsHTML() {
    var dows = [{ v: 'all', l: 'همه روزها' }, { v: '0', l: 'شنبه' }, { v: '2', l: 'دوشنبه' }, { v: '4', l: 'چهارشنبه' }];
    return '<div class="sched-tools">' +
      '<div class="week-nav">' +
      '<button type="button" class="wn-btn" data-w="-1" aria-label="هفته قبل" ' + (state.week <= MIN_WEEK ? 'disabled' : '') + '>' + VB.icon('chevron-right') + '</button>' +
      '<div class="wn-label">' + (state.week === 0 ? 'هفته جاری · ' : '') + weekLabel(state.week) + '</div>' +
      '<button type="button" class="wn-btn" data-w="1" aria-label="هفته بعد" ' + (state.week >= MAX_WEEK ? 'disabled' : '') + '>' + VB.icon('chevron-left') + '</button>' +
      '</div>' +
      '<div class="filters" role="tablist" aria-label="فیلتر روز">' +
      dows.map(function (d) { return '<button type="button" role="tab" aria-selected="' + (state.dow === d.v) + '" class="chip' + (state.dow === d.v ? ' is-active' : '') + '" data-dow="' + d.v + '">' + d.l + '</button>'; }).join('') +
      '</div></div>';
  }

  function bind(el) {
    el.querySelectorAll('.wn-btn').forEach(function (b) {
      b.addEventListener('click', function () {
        state.week += +b.getAttribute('data-w');
        refresh(el);
      });
    });
    el.querySelectorAll('[data-dow]').forEach(function (c) {
      c.addEventListener('click', function () { state.dow = c.getAttribute('data-dow'); refresh(el); });
    });
    el.querySelectorAll('[data-slot]').forEach(function (b) {
      b.addEventListener('click', function () {
        var s = D().slots.filter(function (x) { return x.id === b.getAttribute('data-slot'); })[0];
        VB.ui.sessionModal(s);
      });
    });
    /* swipe to change week (mobile-friendly) */
    var zone = el.querySelector('#tl-zone');
    var x0 = null;
    zone.addEventListener('touchstart', function (e) { x0 = e.touches[0].clientX; }, { passive: true });
    zone.addEventListener('touchend', function (e) {
      if (x0 === null) return;
      var dx = e.changedTouches[0].clientX - x0;
      x0 = null;
      if (Math.abs(dx) < 60) return;
      /* RTL: swipe right => previous week */
      var next = state.week + (dx > 0 ? -1 : 1);
      if (next < MIN_WEEK || next > MAX_WEEK) return;
      state.week = next;
      refresh(el);
      VB.toast('نمایش ' + (state.week === 0 ? 'هفته جاری' : 'هفته ' + weekLabel(state.week)), 'info', 'schedule');
    }, { passive: true });
  }

  function refresh(el) {
    el.querySelector('#sched-tools').outerHTML = '<div id="sched-tools">' + toolsHTML() + '</div>';
    el.querySelector('#tl-zone').innerHTML = '<div class="timeline"><div class="tl-line"></div>' + timelineHTML() + '</div>';
    bind(el);
  }

  VB.pages.schedule = {
    render: function (el) {
      el.innerHTML =
        '<div class="page-head"><div><div class="overline">برنامه هفتگی</div>' +
        '<h2 class="ph-title">برنامه تمرین</h2>' +
        '<p class="ph-sub">خط زمان جلسات این هفته؛ برای جزئیات روی هر جلسه بزنید</p></div>' +
        '<div class="ph-actions"><button type="button" class="btn btn-ghost btn-sm" data-coach>' + VB.icon('coach') + 'مربی این هفته</button></div></div>' +
        '<div id="sched-tools">' + toolsHTML() + '</div>' +
        '<div id="tl-zone"><div class="timeline"><div class="tl-line"></div>' + timelineHTML() + '</div></div>';
      bind(el);
      el.querySelector('[data-coach]').addEventListener('click', function () { VB.ui.coachModal(); });
    }
  };
})();
