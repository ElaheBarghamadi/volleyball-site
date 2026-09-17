/* ============================================================
   pages.js — tuition, registration, insurance, progress,
   announcements, profile, settings, support + shared flows
   ============================================================ */
(function () {
  'use strict';
  window.VB = window.VB || {};
  VB.pages = VB.pages || {};
  VB.ui = VB.ui || {};

  var jal = VB.jal, fmt = VB.fmt;
  var D = function () { return VB.data; };

  /* ============================================================
     shared flows
     ============================================================ */
  function trackCode(id) {
    var n = 0;
    for (var i = 0; i < id.length; i++) n = (n * 31 + id.charCodeAt(i)) % 999999;
    return 'VC-' + fmt.fa(String(100000 + n));
  }

  VB.ui.receiptModal = function (p) {
    VB.modal.open({
      title: 'رسید پرداخت',
      icon: 'receipt',
      tone: 'success',
      body: '<div class="detail-list">' +
        '<div class="dl-row">' + VB.icon('receipt') + '<span>بابت</span><b>' + p.title + '</b></div>' +
        '<div class="dl-row">' + VB.icon('tuition') + '<span>مبلغ</span><b>' + fmt.money(p.amount) + ' تومان</b></div>' +
        '<div class="dl-row">' + VB.icon('calendar') + '<span>تاریخ پرداخت</span><b>' + fmt.dateShort(p.paidOn || p.due) + '</b></div>' +
        '<div class="dl-row">' + VB.icon('lock') + '<span>روش پرداخت</span><b>درگاه پرداخت باشگاه</b></div>' +
        '<div class="dl-row">' + VB.icon('check') + '<span>کد پیگیری</span><b>' + trackCode(p.id) + '</b></div>' +
        '</div>',
      actions: [
        { label: 'بستن', class: 'btn-ghost' }
      ]
    });
  };

  VB.ui.payFlow = function (id) {
    var p = D().tuition.list.filter(function (x) { return x.id === id; })[0];
    if (!p) return;
    VB.modal.confirm({
      title: 'پرداخت ' + p.title,
      message: 'مبلغ ' + fmt.money(p.amount) + ' تومان از کیف پول باشگاهی شما کسر و رسید دیجیتال صادر می‌شود. ادامه می‌دهید؟',
      confirmLabel: 'پرداخت ' + fmt.money(p.amount) + ' تومان',
      icon: 'tuition',
      tone: 'warning'
    }).then(function (ok) {
      if (!ok) return;
      p.status = 'paid';
      p.paidOn = D().TODAY;
      VB.toast('پرداخت با موفقیت انجام شد؛ رسید صادر شد.', 'success');
      D().notifications.unshift({ id: 'n' + Date.now(), type: 'success', read: false, text: 'پرداخت «' + p.title + '» ثبت شد.', time: D().TODAY, hour: fmt.fa(new Date().getHours()) + ':' + fmt.fa(fmt.pad2(new Date().getMinutes())) });
      VB.notifications.render(); VB.notifications.badge();
      VB.rerenderCurrent();
      setTimeout(function () { VB.ui.receiptModal(p); }, 420);
    });
  };

  function editDrawer() {
    var p = D().player;
    VB.drawer.open({
      title: 'ویرایش اطلاعات',
      icon: 'edit',
      tone: 'blue',
      body: '<form id="edit-form" class="form-grid" novalidate>' +
        '<div class="field"><label for="f-fn">نام</label><input id="f-fn" name="firstName" value="' + p.firstName + '"><span class="err">نام را وارد کنید.</span></div>' +
        '<div class="field"><label for="f-ln">نام خانوادگی</label><input id="f-ln" name="lastName" value="' + p.lastName + '"><span class="err">نام خانوادگی را وارد کنید.</span></div>' +
        '<div class="field"><label for="f-ph">شماره تماس</label><input id="f-ph" name="phone" value="' + p.phone + '" style="direction:ltr;text-align:end"><span class="err">شماره تماس معتبر نیست.</span></div>' +
        '<div class="field"><label for="f-em">ایمیل</label><input id="f-em" name="email" value="' + p.email + '" style="direction:ltr;text-align:end"><span class="err">ایمیل معتبر نیست.</span></div>' +
        '<div class="field"><label for="f-bi">تاریخ تولد</label><input id="f-bi" name="birth" value="' + fmt.dateShort(p.birth) + '"><span class="err">تاریخ را وارد کنید.</span></div>' +
        '<div class="field"><label for="f-ci">شهر</label><input id="f-ci" name="city" value="' + p.city + '"><span class="err">شهر را وارد کنید.</span></div>' +
        '</form>',
      actions: [
        {
          label: 'ذخیره تغییرات', class: 'btn-primary', icon: 'check', onClick: function (close, panel) {
            var form = panel.querySelector('#edit-form');
            var ok = true;
            function check(name, test) {
              var input = form.querySelector('[name="' + name + '"]');
              var bad = !test(input.value.trim());
              input.closest('.field').classList.toggle('has-err', bad);
              if (bad) ok = false;
            }
            check('firstName', function (v) { return v.length > 1; });
            check('lastName', function (v) { return v.length > 1; });
            check('phone', function (v) { return /^0\d{3}\s?\d{3}\s?\d{4}$/.test(v); });
            check('email', function (v) { return /^\S+@\S+\.\S+$/.test(v); });
            check('birth', function (v) { return v.length >= 8; });
            check('city', function (v) { return v.length > 1; });
            if (!ok) return;
            var fd = new FormData(form);
            p.firstName = fd.get('firstName'); p.lastName = fd.get('lastName');
            p.phone = fd.get('phone'); p.email = fd.get('email'); p.city = fd.get('city');
            var b = fd.get('birth').split(/[/-]/).map(function (x) { return +x.replace(/[۰-۹]/g, function (c) { return '۰۱۲۳۴۵۶۷۸۹'.indexOf(c); }); });
            if (b.length === 3) p.birth = { jy: b[0], jm: b[1], jd: b[2] };
            close();
            VB.toast('اطلاعات شما ذخیره شد.', 'success');
            VB.rerenderCurrent();
            VB.navigation.refreshGreeting();
          }
        },
        { label: 'انصراف', class: 'btn-ghost' }
      ]
    });
  }
  VB.ui.editDrawer = editDrawer;

  /* ============================================================
     TUITION
     ============================================================ */
  var PAY_PILL = {
    paid: '<span class="pill pill-success">' + VB.icon('check') + 'پرداخت شده</span>',
    pending: '<span class="pill pill-warning">در انتظار پرداخت</span>',
    expired: '<span class="pill pill-danger">منقضی شده</span>'
  };

  VB.pages.tuition = {
    render: function (el) {
      var d = D(), t = d.tuition;
      var pending = t.current.status === 'pending';
      var rows = t.list.map(function (p) {
        var action = '';
        if (p.status === 'paid') action = '<button type="button" class="icon-btn" style="width:36px;height:36px;border-radius:11px" data-receipt="' + p.id + '" aria-label="مشاهده رسید">' + VB.icon('receipt') + '</button>';
        if (p.status === 'pending') action = '<button type="button" class="btn btn-yellow btn-sm" data-pay="' + p.id + '">پرداخت</button>';
        return '<div class="pl-row">' +
          '<div class="ic-tile ' + (p.status === 'paid' ? 'success' : p.status === 'pending' ? 'warning' : 'danger') + '" style="width:38px;height:38px;border-radius:12px">' + VB.icon(p.type === 'شهریه ماهانه' ? 'tuition' : p.type === 'مسابقه' ? 'medal' : 'zap') + '</div>' +
          '<div class="pl-month"><b>' + p.title + '</b><small>سررسید: ' + fmt.dateShort(p.due) + (p.paidOn ? ' · پرداخت: ' + fmt.dateShort(p.paidOn) : '') + '</small></div>' +
          '<div class="pl-amount">' + fmt.money(p.amount) + '<small>تومان</small></div>' +
          PAY_PILL[p.status] + action +
          '</div>';
      }).join('');

      el.innerHTML =
        '<div class="page-head"><div><div class="overline">مالی باشگاه</div>' +
        '<h2 class="ph-title">شهریه</h2>' +
        '<p class="ph-sub">وضعیت پرداخت، سررسید بعدی و تاریخچه مالی شما</p></div></div>' +
        '<div class="pay-grid">' +
        '<section class="card pay-current">' +
        '<div class="pay-status-row"><div class="ic-tile ' + (pending ? 'warning' : 'success') + '">' + VB.icon('tuition') + '</div>' +
        '<div><div class="card-title">شهریه ' + fmt.monthTitle(t.current.due.jy, t.current.due.jm) + '</div>' +
        '<div style="margin-top:6px">' + PAY_PILL[t.current.status] + '</div></div></div>' +
        '<div class="pay-amount"><b>' + fmt.money(t.current.amount) + '</b><span>تومان</span></div>' +
        '<div class="pay-rows">' +
        (t.current.paidOn ? '<div class="pay-row-mini">' + VB.icon('check') + '<span>تاریخ پرداخت:</span><b>' + fmt.dateShort(t.current.paidOn) + '</b></div>' : '') +
        '<div class="pay-row-mini">' + VB.icon('calendar') + '<span>پرداخت بعدی:</span><b>' + fmt.dateShort(t.nextDue) + '</b></div>' +
        '<div class="pay-row-mini">' + VB.icon('lock') + '<span>روش پرداخت:</span><b>درگاه پرداخت باشگاه</b></div>' +
        '</div>' +
        '<div class="pay-cta">' + (pending
          ? '<button type="button" class="btn btn-yellow btn-block" data-pay="' + t.current.id + '">' + VB.icon('tuition') + 'پرداخت شهریه</button>'
          : '<button type="button" class="btn btn-ghost btn-block" data-receipt="' + t.current.id + '">' + VB.icon('receipt') + 'مشاهده رسید پرداخت</button>') +
        '</div></section>' +
        '<section class="card"><div class="card-head"><div><div class="card-title">تاریخچه پرداخت</div><div class="card-sub">' + fmt.fa(t.list.length) + ' تراکنش اخیر</div></div></div>' +
        '<div class="pay-list">' + rows + '</div></section>' +
        '</div>';

      el.querySelectorAll('[data-pay]').forEach(function (b) {
        b.addEventListener('click', function () { VB.ui.payFlow(b.getAttribute('data-pay')); });
      });
      el.querySelectorAll('[data-receipt]').forEach(function (b) {
        b.addEventListener('click', function () {
          var p = t.list.filter(function (x) { return x.id === b.getAttribute('data-receipt'); })[0];
          VB.ui.receiptModal(p);
        });
      });
    }
  };

  /* ============================================================
     REGISTRATION
     ============================================================ */
  VB.pages.registration = {
    render: function (el) {
      var d = D(), r = d.registration;
      var days = jal.diffDays(d.TODAY, r.end);
      var total = jal.diffDays(r.start, r.end);
      var pct = Math.min(100, Math.max(0, Math.round(100 - (days / total) * 100)));
      el.innerHTML =
        '<div class="page-head"><div><div class="overline">عضویت باشگاه</div>' +
        '<h2 class="ph-title">ثبت‌نام</h2>' +
        '<p class="ph-sub">کارت عضویت، پکیج فعال و اعتبار زمانی شما</p></div></div>' +
        '<div class="reg-grid">' +
        '<section class="member-card" aria-label="کارت عضویت">' +
        '<div class="mc-watermark">VC</div>' +
        '<div class="mc-top"><div><div class="mc-club">باشگاه والیبال فراز · کارت عضویت</div>' +
        '<div class="mc-package">پکیج <span class="y">' + r.package + '</span></div></div>' +
        '<span class="pill pill-yellow" style="margin-inline-start:auto">' + VB.icon('check') + 'ثبت‌نام فعال</span></div>' +
        '<div class="mc-valid"><div style="font-size:var(--fs-xs);color:rgba(255,255,255,.65)">اعتبار عضویت · ' + fmt.fa(days) + ' روز مانده</div>' +
        '<div class="mv-bar"><i class="mv-fill" data-w="' + pct + '"></i></div>' +
        '<div class="mv-labels"><span>شروع ' + fmt.dateShort(r.start) + '</span><span>پایان ' + fmt.dateShort(r.end) + '</span></div></div>' +
        '<div class="mc-meta">' +
        '<div><small>گروه سنی</small><b>' + r.group + '</b></div>' +
        '<div><small>سطح</small><b>' + r.level + '</b></div>' +
        '<div><small>جلسات هفتگی</small><b>' + fmt.fa(r.sessionsPerWeek) + ' جلسه</b></div>' +
        '<div><small>مربی گروه</small><b>' + r.coach + '</b></div>' +
        '<div><small>شماره بازیکن</small><b>' + fmt.fa(d.player.number) + '</b></div>' +
        '<div><small>شناسه عضویت</small><b style="direction:ltr">' + d.player.playerId + '</b></div>' +
        '</div>' +
        '<div class="mc-actions">' +
        '<button type="button" class="btn btn-yellow" data-pkg>' + VB.icon('eye') + 'مشاهده جزئیات پکیج</button>' +
        '<button type="button" class="btn btn-onnavy" data-renew>' + VB.icon('renew') + 'تمدید ثبت‌نام</button>' +
        '</div></section>' +
        '<div class="stack-col">' +
        '<section class="card"><div class="card-head"><div><div class="card-title">امکانات پکیج</div><div class="card-sub">آنچه عضویت شما شامل می‌شود</div></div></div>' +
        '<div class="feat-list">' + r.features.map(function (f) {
          return '<div class="feat">' + VB.icon('check') + '<div><b style="font-size:var(--fs-sm)">' + f.t + '</b><div class="muted" style="font-size:var(--fs-micro)">' + f.s + '</div></div></div>';
        }).join('') + '</div></section>' +
        '<section class="card coach-card"><div class="coach-top"><div class="avatar" style="background:linear-gradient(140deg,#123C63,#0D2944)">' + d.coach.name[0] + '</div>' +
        '<div><div class="coach-name" style="font-size:var(--fs-md)">' + d.coach.name + '</div><div class="coach-role">' + d.coach.role + '</div></div>' +
        '<button type="button" class="btn btn-soft btn-sm" style="margin-inline-start:auto" data-coach>پروفایل مربی</button></div></section>' +
        '</div></div>';

      el.querySelectorAll('.mv-fill').forEach(function (b) {
        requestAnimationFrame(function () { b.style.width = b.getAttribute('data-w') + '%'; });
      });
      el.querySelector('[data-pkg]').addEventListener('click', function () {
        VB.modal.open({
          title: 'جزئیات پکیج ' + r.package,
          icon: 'registration', tone: 'blue', size: 'md',
          body: '<div class="detail-list">' +
            '<div class="dl-row">' + VB.icon('calendar') + '<span>بازه اعتبار</span><b>' + fmt.dateShort(r.start) + ' تا ' + fmt.dateShort(r.end) + '</b></div>' +
            '<div class="dl-row">' + VB.icon('schedule') + '<span>ریتم تمرین</span><b>' + fmt.fa(r.sessionsPerWeek) + ' جلسه در هفته</b></div>' +
            '<div class="dl-row">' + VB.icon('users') + '<span>گروه</span><b>' + r.group + ' · سطح ' + r.level + '</b></div>' +
            '</div><div class="feat-list" style="padding:12px 4px 4px">' +
            r.features.map(function (f) { return '<div class="feat">' + VB.icon('check') + '<div><b style="font-size:var(--fs-sm)">' + f.t + '</b><div class="muted" style="font-size:var(--fs-micro)">' + f.s + '</div></div></div>'; }).join('') +
            '</div>',
          actions: [{ label: 'بستن', class: 'btn-ghost' }]
        });
      });
      el.querySelector('[data-renew]').addEventListener('click', function () {
        VB.modal.confirm({
          title: 'تمدید ثبت‌نام',
          message: 'درخواست تمدید پکیج ' + r.package + ' برای دوره بعد ثبت می‌شود؛ کارشناس باشگاه پیش از پایان اعتبار (' + fmt.dateShort(r.end) + ') با شما تماس می‌گیرد.',
          confirmLabel: 'ثبت درخواست تمدید',
          icon: 'renew', tone: 'warning'
        }).then(function (ok) {
          if (ok) VB.toast('درخواست تمدید ثبت شد؛ منتظر تماس باشگاه باشید.', 'success', 'renew');
        });
      });
      el.querySelector('[data-coach]').addEventListener('click', function () { VB.ui.coachModal(); });
    }
  };

  /* ============================================================
     INSURANCE
     ============================================================ */
  VB.pages.insurance = {
    render: function (el) {
      var d = D(), ins = d.insurance;
      var pct = Math.min(100, Math.max(0, Math.round(100 - (ins.daysLeft / ins.totalDays) * 100)));
      var warn = ins.daysLeft < 45;
      el.innerHTML =
        '<div class="page-head"><div><div class="overline">پوشش ورزشی</div>' +
        '<h2 class="ph-title">بیمه</h2>' +
        '<p class="ph-sub">اعتبار بیمه ورزشی و پوشش‌های فعال شما</p></div></div>' +
        '<div class="ins-grid">' +
        '<section class="card ins-card">' +
        '<div class="ins-top"><div class="ic-tile ' + (warn ? 'warning' : 'success') + '" style="width:52px;height:52px;border-radius:16px">' + VB.icon('insurance') + '</div>' +
        '<div><div class="card-title">بیمه ورزشی</div><div style="margin-top:6px"><span class="pill ' + (warn ? 'pill-warning' : 'pill-success') + '">' + VB.icon('check') + (warn ? 'نزدیک انقضا' : 'فعال') + '</span></div></div>' +
        '<div class="ins-days"><b data-count="' + ins.daysLeft + '">۰</b><small>روز اعتبار باقی‌مانده</small></div></div>' +
        '<div class="ins-timeline" aria-label="خط زمان اعتبار بیمه">' +
        '<div class="it-line"></div><div class="it-fill" data-w="' + pct + '"></div>' +
        '<i class="it-node" style="inset-inline-start:0"></i>' +
        '<i class="it-node end" style="inset-inline-start:100%"></i>' +
        '<div class="it-today" style="inset-inline-start:' + pct + '%"><i class="ball"></i><small>امروز</small></div>' +
        '</div>' +
        '<div class="it-labels"><span>شروع ' + fmt.dateShort(ins.start) + '</span><span>پایان ' + fmt.dateShort(ins.end) + '</span></div>' +
        (warn
          ? '<div class="ins-warn">' + VB.icon('alert') + 'بیمه شما به‌زودی منقضی می‌شود؛ برای ادامه پوشش، تمدید را انجام دهید.</div>'
          : '<div class="ins-warn" style="background:var(--success-tint);color:var(--success)">' + VB.icon('info') + 'پوشش بیمه تا پایان اعتبار ثبت‌نام شما فعال است.</div>') +
        '<div style="margin-top:18px;display:flex;gap:10px;flex-wrap:wrap">' +
        '<button type="button" class="btn btn-soft" data-renew>' + VB.icon('renew') + 'تمدید بیمه</button>' +
        '<button type="button" class="btn btn-ghost" data-doc>' + VB.icon('receipt') + 'گواهی بیمه</button>' +
        '</div></section>' +
        '<section class="card"><div class="card-head"><div><div class="card-title">پوشش‌ها</div><div class="card-sub">تعهدات فعال بیمه ورزشی</div></div></div>' +
        '<div class="feat-list">' + ins.covers.map(function (c) {
          return '<div class="feat">' + VB.icon('insurance') + '<div style="font-size:var(--fs-sm)">' + c + '</div></div>';
        }).join('') + '</div></section>' +
        '</div>';

      el.querySelectorAll('.it-fill').forEach(function (b) {
        requestAnimationFrame(function () { b.style.width = b.getAttribute('data-w') + '%'; });
      });
      el.querySelectorAll('[data-count]').forEach(function (b) { VB.ui.countUp(b, +b.getAttribute('data-count')); });
      el.querySelector('[data-renew]').addEventListener('click', function () {
        VB.modal.confirm({
          title: 'تمدید بیمه ورزشی',
          message: 'درخواست تمدید بیمه برای دوره یک‌ساله بعد ثبت می‌شود. پیش از انقضای اعتبار (' + fmt.dateShort(ins.end) + ') با شما هماهنگ می‌شود.',
          confirmLabel: 'ثبت درخواست تمدید', icon: 'renew', tone: 'warning'
        }).then(function (ok) { if (ok) VB.toast('درخواست تمدید بیمه ثبت شد.', 'success', 'insurance'); });
      });
      el.querySelector('[data-doc]').addEventListener('click', function () {
        VB.modal.open({
          title: 'گواهی بیمه ورزشی', icon: 'insurance', tone: 'success',
          body: '<div class="detail-list">' +
            '<div class="dl-row">' + VB.icon('user') + '<span>بیمه‌شده</span><b>' + d.player.firstName + ' ' + d.player.lastName + '</b></div>' +
            '<div class="dl-row">' + VB.icon('registration') + '<span>شماره بازیکن</span><b>' + d.player.playerId + '</b></div>' +
            '<div class="dl-row">' + VB.icon('calendar') + '<span>اعتبار</span><b>' + fmt.dateShort(ins.start) + ' تا ' + fmt.dateShort(ins.end) + '</b></div>' +
            '<div class="dl-row">' + VB.icon('insurance') + '<span>وضعیت</span><b>فعال</b></div>' +
            '</div><p style="margin-top:12px">نسخه چاپی گواهی در دفتر باشگاه موجود است؛ برای دریافت حضوری با پشتیبانی هماهنگ کنید.</p>',
          actions: [{ label: 'بستن', class: 'btn-ghost' }]
        });
      });
    }
  };

  /* ============================================================
     PROGRESS
     ============================================================ */
  VB.pages.progress = {
    render: function (el) {
      var d = D(), a = d.attendance;
      /* this week dots */
      var start = new Date(d.TODAY.date.getTime() - jal.wdIndex(d.TODAY.date) * jal.DAY);
      var dots = '';
      var weekHeld = 0, weekPresent = 0, weekPlanned = 0;
      for (var i = 0; i < 7; i++) {
        var g = new Date(start.getTime() + i * jal.DAY);
        var j = jal.toJ(g);
        var s = d.sessionOn(j);
        if (!s) { dots += '<div class="dw-dot off"><i></i><span>' + jal.WEEKDAYS_SHORT[i] + '</span></div>'; continue; }
        weekPlanned++;
        var rec = d.attendance.record[jal.key(j.jy, j.jm, j.jd)];
        var cls = '', lbl = 'پیش‌رو';
        if (rec) { cls = rec.present ? 'present' : 'absent'; lbl = rec.present ? 'حاضر' : 'غایب'; weekHeld++; if (rec.present) weekPresent++; }
        else if (s.state === 'live') { cls = 'next'; lbl = 'اکنون'; }
        else { cls = 'next'; lbl = 'پیش‌رو'; }
        dots += '<div class="dw-dot ' + cls + '" title="' + jal.WEEKDAYS[i] + ': ' + lbl + '"><i></i><span>' + jal.WEEKDAYS_SHORT[i] + '</span></div>';
      }
      var bars = a.weeklyConsistency().map(function (w) {
        var h = Math.round((w.present / 3) * 100);
        return '<div class="bar-col' + (w.isCurrent ? ' is-current' : '') + '"><div class="bar" data-h="' + h + '" data-val="' + fmt.fa(w.present) + ' از ' + fmt.fa(3) + '"></div><small>' + w.label + '</small></div>';
      }).join('');

      el.innerHTML =
        '<div class="page-head"><div><div class="overline">عملکرد شما</div>' +
        '<h2 class="ph-title">پیشرفت من</h2>' +
        '<p class="ph-sub">نظم تمرینی، حضور و تداوم شما در یک نگاه</p></div></div>' +
        '<div class="prog-grid">' +
        '<section class="card card-pad">' +
        '<div class="overline">این هفته</div>' +
        '<div class="week-dots">' + dots + '</div>' +
        '<p style="text-align:center;font-size:var(--fs-sm);font-weight:700">' + fmt.fa(weekPresent) + ' از ' + fmt.fa(weekPlanned) + ' جلسه این هفته</p>' +
        '<div class="streak-row" style="margin-top:16px;border-top:1px solid var(--border);padding-top:16px">' + VB.icon('flame') +
        '<div><b>' + fmt.fa(a.streak) + '</b><p>جلسه پیاپی بدون غیبت؛ ادامه بده!</p></div></div>' +
        '</section>' +
        '<section class="card card-pad">' +
        '<div class="overline">نرخ‌های کلی فصل</div>' +
        '<div class="rings-row">' +
        '<div class="ring-block">' + VB.ui.ring(120, 10, a.rate, 'var(--success)', '<div><b style="font-size:20px">' + fmt.fa(a.rate) + '٪</b></div>') + '<small>حضور در تمرین</small></div>' +
        '<div class="ring-block">' + VB.ui.ring(120, 10, a.discipline, 'var(--primary)', '<div><b style="font-size:20px">' + fmt.fa(a.discipline) + '٪</b></div>') + '<small>نظم تمرینی</small></div>' +
        '</div>' +
        '<div class="stat-tiles" style="margin-top:16px">' +
        '<div class="stile s-success"><b>' + fmt.fa(a.present) + '</b><small>جلسه شرکت‌کرده</small></div>' +
        '<div class="stile s-danger"><b>' + fmt.fa(a.absent) + '</b><small>غیبت</small></div>' +
        '<div class="stile s-blue"><b>' + fmt.fa(a.remainingInMonth()) + '</b><small>باقی‌مانده این ماه</small></div>' +
        '</div></section>' +
        '<section class="card prog-wide"><div class="card-head"><div><div class="card-title">تداوم هفتگی</div><div class="card-sub">حضور هفتگی شما در ۸ هفته اخیر (از ۳ جلسه)</div></div></div>' +
        '<div class="bars-wrap">' + bars + '</div>' +
        '<div style="height:18px"></div></section>' +
        '</div>';

      VB.ui.animateRings(el);
      requestAnimationFrame(function () {
        el.querySelectorAll('.bar').forEach(function (b) { b.style.height = b.getAttribute('data-h') + '%'; });
      });
    }
  };

  /* ============================================================
     ANNOUNCEMENTS
     ============================================================ */
  VB.pages.announcements = {
    render: function (el) {
      var d = D();
      var cats = ['همه'].concat(d.announcements.map(function (a) { return a.cat; }).filter(function (v, i, s) { return s.indexOf(v) === i; }));
      var state = { cat: 'همه' };
      function listHTML() {
        var items = d.announcements.filter(function (a) { return state.cat === 'همه' || a.cat === state.cat; });
        if (!items.length) return '<div class="tl-empty">اعلانی در این دسته نیست.</div>';
        return items.map(function (a) {
          return '<article class="ann-item' + (a.important ? ' is-important' : '') + '" style="cursor:default">' +
            '<div class="ann-ic ic-tile ' + (a.important ? 'yellow' : a.cat === 'مسابقه' ? 'warning' : a.cat === 'پرداخت' ? 'success' : 'blue') + '" style="width:38px;height:38px;border-radius:12px">' + VB.icon(a.important ? 'zap' : a.cat === 'مسابقه' ? 'medal' : a.cat === 'پرداخت' ? 'tuition' : a.cat === 'تمرین' ? 'volleyball' : 'announcements') + '</div>' +
            '<div class="ann-body"><div class="ann-title">' + a.title + '</div>' +
            '<div class="ann-text">' + a.text + '</div>' +
            '<div class="ann-meta">' + (a.important ? '<span class="pill pill-yellow">مهم</span>' : '') + (a.important && a.cat === 'مهم' ? '' : '<span class="pill pill-muted">' + a.cat + '</span>') + '<span class="ann-date">' + fmt.dateLong(a.date) + '</span></div></div>' +
            '</article>';
        }).join('');
      }
      el.innerHTML =
        '<div class="page-head"><div><div class="overline">اخبار باشگاه</div>' +
        '<h2 class="ph-title">اعلانات</h2>' +
        '<p class="ph-sub">اطلاعیه‌های رسمی باشگاه برای بازیکنان</p></div></div>' +
        '<div class="sched-tools"><div class="filters" id="ann-filters">' +
        cats.map(function (c) { return '<button type="button" class="chip' + (c === 'همه' ? ' is-active' : '') + '" data-cat="' + c + '">' + c + '</button>'; }).join('') +
        '</div></div>' +
        '<section class="card"><div class="ann-list" id="ann-list" style="padding:10px 14px 16px">' + listHTML() + '</div></section>';

      el.querySelectorAll('#ann-filters .chip').forEach(function (c) {
        c.addEventListener('click', function () {
          state.cat = c.getAttribute('data-cat');
          el.querySelectorAll('#ann-filters .chip').forEach(function (x) { x.classList.toggle('is-active', x === c); });
          el.querySelector('#ann-list').innerHTML = listHTML();
        });
      });
    }
  };

  /* ============================================================
     PROFILE
     ============================================================ */
  VB.pages.profile = {
    render: function (el) {
      var d = D(), p = d.player, r = d.registration;
      el.innerHTML =
        '<div class="page-head"><div><div class="overline">حساب بازیکن</div>' +
        '<h2 class="ph-title">پروفایل</h2>' +
        '<p class="ph-sub">اطلاعات شخصی، ورزشی و عضویت شما</p></div>' +
        '<div class="ph-actions"><button type="button" class="btn btn-primary" data-edit>' + VB.icon('edit') + 'ویرایش اطلاعات</button></div></div>' +
        '<section class="prof-band">' +
        '<div class="id-num">' + p.number + '</div>' +
        '<div class="avatar xl avatar-ring">' + p.firstName[0] + '</div>' +
        '<div><div class="pb-name">' + p.firstName + ' ' + p.lastName + '</div>' +
        '<div class="pb-meta"><span class="pill pill-yellow">' + p.role + '</span><span class="pill pill-blue">سطح ' + p.level + '</span><span class="pill pill-muted" style="background:rgba(255,255,255,.12);color:#fff">گروه ' + p.group + '</span><span class="pill pill-muted" style="background:rgba(255,255,255,.12);color:#fff">' + p.playerId + '</span></div></div>' +
        '</section>' +
        '<div class="info-grid">' +
        '<section class="card"><div class="card-head"><div><div class="card-title">اطلاعات شخصی</div></div>' +
        '<button type="button" class="card-link" data-edit>' + VB.icon('edit') + 'ویرایش</button></div>' +
        '<div class="info-list">' +
        '<div class="info-row"><span class="ir-label">نام</span><b>' + p.firstName + '</b></div>' +
        '<div class="info-row"><span class="ir-label">نام خانوادگی</span><b>' + p.lastName + '</b></div>' +
        '<div class="info-row"><span class="ir-label">تاریخ تولد</span><b>' + fmt.dateShort(p.birth) + '</b></div>' +
        '<div class="info-row"><span class="ir-label">شماره تماس</span><b style="direction:ltr">' + p.phone + '</b></div>' +
        '<div class="info-row"><span class="ir-label">ایمیل</span><b style="direction:ltr">' + p.email + '</b></div>' +
        '<div class="info-row"><span class="ir-label">شهر</span><b>' + p.city + '</b></div>' +
        '</div></section>' +
        '<section class="card"><div class="card-head"><div><div class="card-title">اطلاعات ورزشی</div></div></div>' +
        '<div class="info-list">' +
        '<div class="info-row"><span class="ir-label">سطح</span><b>' + p.level + '</b></div>' +
        '<div class="info-row"><span class="ir-label">گروه</span><b>' + p.group + '</b></div>' +
        '<div class="info-row"><span class="ir-label">مربی</span><b>' + d.coach.name + '</b></div>' +
        '<div class="info-row"><span class="ir-label">شماره بازیکن</span><b>' + fmt.fa(p.number) + '</b></div>' +
        '<div class="info-row"><span class="ir-label">شناسه عضویت</span><b style="direction:ltr">' + p.playerId + '</b></div>' +
        '<div class="info-row"><span class="ir-label">ورود به باشگاه</span><b>پاییز ' + fmt.fa(p.joinedYear) + '</b></div>' +
        '</div></section>' +
        '<section class="card" style="grid-column:1/-1"><div class="card-head"><div><div class="card-title">خلاصه عضویت</div></div>' +
        '<button type="button" class="card-link" data-go="registration">جزئیات ثبت‌نام' + VB.icon('chevron-left') + '</button></div>' +
        '<div class="info-list" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:0 26px">' +
        '<div class="info-row"><span class="ir-label">پکیج</span><b>' + r.package + '</b></div>' +
        '<div class="info-row"><span class="ir-label">وضعیت</span><b style="color:var(--success)">فعال</b></div>' +
        '<div class="info-row"><span class="ir-label">اعتبار تا</span><b>' + fmt.dateShort(r.end) + '</b></div>' +
        '<div class="info-row"><span class="ir-label">بیمه</span><b style="color:var(--success)">معتبر تا ' + fmt.dateShort(d.insurance.end) + '</b></div>' +
        '</div></section>' +
        '</div>';
      el.querySelectorAll('[data-edit]').forEach(function (b) { b.addEventListener('click', editDrawer); });
    }
  };

  /* ============================================================
     SETTINGS
     ============================================================ */
  VB.pages.settings = {
    render: function (el) {
      var s = D().settings;
      function sw(key, label, sub) {
        return '<div class="set-row"><div class="sr-body"><div class="sr-title">' + label + '</div><div class="sr-sub">' + sub + '</div></div>' +
          '<label class="switch"><input type="checkbox" data-sw="' + key + '"' + (s[key] ? ' checked' : '') + ' aria-label="' + label + '"><i class="sw-track"></i><i class="sw-thumb"></i></label></div>';
      }
      el.innerHTML =
        '<div class="page-head"><div><div class="overline">ترجیحات</div>' +
        '<h2 class="ph-title">تنظیمات</h2>' +
        '<p class="ph-sub">حساب کاربری، اعلان‌ها، ظاهر و امنیت</p></div></div>' +
        '<div class="set-grid">' +
        '<section class="card"><div class="card-head"><div><div class="card-title">حساب کاربری</div><div class="card-sub">اطلاعات ورود و تماس</div></div></div>' +
        '<div class="set-list">' +
        '<div class="set-row"><div class="sr-body"><div class="sr-title">' + D().player.firstName + ' ' + D().player.lastName + '</div><div class="sr-sub" style="direction:ltr;text-align:start">' + D().player.email + '</div></div>' +
        '<button type="button" class="btn btn-soft btn-sm" data-edit>' + VB.icon('edit') + 'ویرایش</button></div>' +
        '<div class="set-row"><div class="sr-body"><div class="sr-title">شماره تماس</div><div class="sr-sub" style="direction:ltr;text-align:start">' + D().player.phone + '</div></div>' +
        '<button type="button" class="btn btn-ghost btn-sm" data-edit>' + VB.icon('phone') + 'تغییر</button></div>' +
        '<div class="set-row"><div class="sr-body"><div class="sr-title">زبان اپلیکیشن</div><div class="sr-sub">زبان رابط کاربری و تاریخ</div></div>' +
        '<select class="select" data-lang aria-label="زبان"><option value="fa" selected>فارسی</option><option value="en" disabled>English (به‌زودی)</option></select></div>' +
        '</div></section>' +
        '<section class="card"><div class="card-head"><div><div class="card-title">اعلان‌ها</div><div class="card-sub">چه چیزی برایتان ارسال شود</div></div></div>' +
        '<div class="set-list">' +
        sw('notifTraining', 'یادآور تمرین', 'یک روز قبل از هر جلسه') +
        sw('notifPayment', 'هشدار پرداخت', 'پیش از سررسید شهریه') +
        sw('notifAnnounce', 'اعلامیه‌های باشگاه', 'اخبار و برنامه‌ها') +
        sw('notifEmail', 'ارسال ایمیل', 'رونوشت ایمیلی اعلان‌ها') +
        '</div></section>' +
        '<section class="card"><div class="card-head"><div><div class="card-title">ظاهر</div><div class="card-sub">حالت رنگی اپلیکیشن</div></div></div>' +
        '<div class="set-list"><div class="set-row"><div class="sr-body"><div class="sr-title">پوسته</div><div class="sr-sub">تیره برای سالن‌های کم‌نور عالی است</div></div>' +
        '<div class="segmented" role="radiogroup" aria-label="پوسته">' +
        ['light', 'dark', 'system'].map(function (m) {
          var lbl = { light: 'روشن', dark: 'تیره', system: 'سیستم' }[m];
          var ic = { light: 'sun', dark: 'moon', system: 'monitor' }[m];
          return '<button type="button" role="radio" aria-checked="' + (VB.theme.get() === m) + '" class="seg-btn' + (VB.theme.get() === m ? ' is-active' : '') + '" data-theme-mode="' + m + '">' + VB.icon(ic) + lbl + '</button>';
        }).join('') + '</div></div></div></section>' +
        '<section class="card"><div class="card-head"><div><div class="card-title">امنیت</div><div class="card-sub">محافظت از حساب</div></div></div>' +
        '<div class="set-list">' +
        '<div class="set-row"><div class="sr-body"><div class="sr-title">رمز عبور</div><div class="sr-sub">آخرین تغییر: ' + fmt.fa(60) + ' روز پیش</div></div>' +
        '<button type="button" class="btn btn-soft btn-sm" data-pass>' + VB.icon('lock') + 'تغییر رمز</button></div>' +
        sw('twoFA', 'ورود دومرحله‌ای', 'کد تأیید پیامکی هنگام ورود') +
        '</div></section>' +
        '</div>';

      el.querySelectorAll('[data-sw]').forEach(function (inp) {
        inp.addEventListener('change', function () {
          s[inp.getAttribute('data-sw')] = inp.checked;
          D().saveSettings();
          VB.toast('تنظیمات اعلان‌ها ذخیره شد.', 'info', 'settings');
        });
      });
      el.querySelectorAll('[data-theme-mode]').forEach(function (b) {
        b.addEventListener('click', function () {
          VB.theme.set(b.getAttribute('data-theme-mode'));
          el.querySelectorAll('[data-theme-mode]').forEach(function (x) {
            var on = x === b;
            x.classList.toggle('is-active', on);
            x.setAttribute('aria-checked', on);
          });
        });
      });
      el.querySelectorAll('[data-edit]').forEach(function (b) { b.addEventListener('click', editDrawer); });
      el.querySelector('[data-pass]').addEventListener('click', function () {
        VB.modal.open({
          title: 'تغییر رمز عبور', icon: 'lock', tone: 'blue', size: 'sm',
          body: '<form id="pass-form" class="form-grid" novalidate>' +
            '<div class="field full"><label for="p-cur">رمز فعلی</label><input id="p-cur" type="password" name="cur"><span class="err">رمز فعلی لازم است.</span></div>' +
            '<div class="field full"><label for="p-new">رمز جدید</label><input id="p-new" type="password" name="new"><span class="err">حداقل ۸ کاراکتر.</span></div>' +
            '<div class="field full"><label for="p-rep">تکرار رمز جدید</label><input id="p-rep" type="password" name="rep"><span class="err">تکرار رمز یکسان نیست.</span></div>' +
            '</form>',
          actions: [{
            label: 'ثبت رمز جدید', class: 'btn-primary', icon: 'check', onClick: function (close, panel) {
              var f = panel.querySelector('#pass-form');
              var cur = f.querySelector('[name="cur"]'), nw = f.querySelector('[name="new"]'), rp = f.querySelector('[name="rep"]');
              var ok = true;
              function mark(inp, bad) { inp.closest('.field').classList.toggle('has-err', bad); if (bad) ok = false; }
              mark(cur, cur.value.length < 1);
              mark(nw, nw.value.length < 8);
              mark(rp, rp.value !== nw.value || rp.value.length < 8);
              if (!ok) return;
              close();
              VB.toast('رمز عبور با موفقیت تغییر کرد.', 'success', 'lock');
            }
          }, { label: 'انصراف', class: 'btn-ghost' }]
        });
      });
    }
  };

  /* ============================================================
     SUPPORT
     ============================================================ */
  VB.pages.support = {
    render: function (el) {
      var d = D();
      el.innerHTML =
        '<div class="page-head"><div><div class="overline">کمک و ارتباط</div>' +
        '<h2 class="ph-title">پشتیبانی</h2>' +
        '<p class="ph-sub">پاسخ سؤالات، ارتباط با باشگاه و ثبت درخواست</p></div></div>' +
        '<div class="sup-grid">' +
        '<div class="stack-col">' +
        '<section class="card"><div class="card-head"><div><div class="card-title">تماس با باشگاه</div><div class="card-sub">هر روز ۱۶ تا ۲۱</div></div></div>' +
        '<div class="contact-list">' +
        '<a class="contact-row" href="tel:02188776655"><div class="ic-tile blue" style="width:38px;height:38px;border-radius:12px">' + VB.icon('phone') + '</div><div><b>تلفن دفتر</b>شنبه تا چهارشنبه</div><span class="val">021-88776655</span></a>' +
        '<a class="contact-row" href="mailto:club@vc.ir"><div class="ic-tile success" style="width:38px;height:38px;border-radius:12px">' + VB.icon('mail') + '</div><div><b>ایمیل باشگاه</b>پاسخ تا ۲۴ ساعت</div><span class="val">club@vc.ir</span></a>' +
        '<div class="contact-row"><div class="ic-tile yellow" style="width:38px;height:38px;border-radius:12px">' + VB.icon('pin') + '</div><div><b>نشانی سالن</b><span class="val rtl">تهران، بلوار ورزش، مجموعه باشگاه والیبال فراز</span></div></div>' +
        '</div></section>' +
        '<section class="card card-pad">' +
        '<div class="overline">درخواست شما</div>' +
        '<p class="muted" style="font-size:var(--fs-sm);margin-bottom:14px">هر درخواست اداری، مالی یا فنی دارید اینجا ثبت کنید؛ کد پیگیری همان لحظه صادر می‌شود.</p>' +
        '<button type="button" class="btn btn-primary" data-ticket>' + VB.icon('send') + 'ارسال درخواست</button>' +
        '</section></div>' +
        '<section class="card"><div class="card-head"><div><div class="card-title">سؤالات متداول</div><div class="card-sub">پرسش‌های پرتکرار بازیکنان</div></div></div>' +
        '<div class="acc" id="faq-acc">' + d.faq.map(function (f, i) {
          return '<div class="acc-item"><button type="button" class="acc-head" aria-expanded="false" data-i="' + i + '">' + f.q + VB.icon('chevron-down') + '</button>' +
            '<div class="acc-body"><p>' + f.a + '</p></div></div>';
        }).join('') + '</div></section>' +
        '</div>';

      el.querySelectorAll('.acc-head').forEach(function (h) {
        h.addEventListener('click', function () {
          var item = h.parentElement;
          var body = item.querySelector('.acc-body');
          var open = item.classList.toggle('is-open');
          h.setAttribute('aria-expanded', open);
          body.style.maxHeight = open ? body.scrollHeight + 'px' : '0';
        });
      });
      el.querySelector('[data-ticket]').addEventListener('click', function () {
        VB.modal.open({
          title: 'ارسال درخواست', icon: 'send', tone: 'blue',
          body: '<form id="ticket-form" class="form-grid" novalidate>' +
            '<div class="field full"><label for="t-sub">موضوع</label><select id="t-sub" name="sub"><option value="مالی">مالی و شهریه</option><option value="اداری">اداری و ثبت‌نام</option><option value="فنی">فنی و تمرینات</option><option value="پزشکی">پزشکی و بیمه</option></select></div>' +
            '<div class="field full"><label for="t-msg">شرح درخواست</label><textarea id="t-msg" name="msg" placeholder="توضیح کوتاه و دقیق بنویسید…"></textarea><span class="err">حداقل ۱۰ کاراکتر بنویسید.</span></div>' +
            '</form>',
          actions: [{
            label: 'ثبت درخواست', class: 'btn-primary', icon: 'send', onClick: function (close, panel) {
              var msg = panel.querySelector('[name="msg"]');
              var bad = msg.value.trim().length < 10;
              msg.closest('.field').classList.toggle('has-err', bad);
              if (bad) return;
              close();
              VB.toast('درخواست ثبت شد؛ کد پیگیری ' + trackCode('t' + Date.now()) + '.', 'success', 'send');
            }
          }, { label: 'انصراف', class: 'btn-ghost' }]
        });
      });
    }
  };
})();
