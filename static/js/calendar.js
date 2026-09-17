/* ============================================================
   calendar.js — Jalali (Persian) date engine + calendar widget
   Uses Intl for authoritative Persian-calendar conversion.
   ============================================================ */
(function () {
  'use strict';
  window.VB = window.VB || {};

  var DAY = 86400000;
  var persianFmt = new Intl.DateTimeFormat('fa-IR-u-ca-persian-nu-latn', { year: 'numeric', month: 'numeric', day: 'numeric' });

  var MONTHS = ['فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور', 'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'];
  var WEEKDAYS = ['شنبه', 'یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنجشنبه', 'جمعه'];
  var WEEKDAYS_SHORT = ['ش', 'ی', 'د', 'س', 'چ', 'پ', 'ج'];

  /* ---------- conversion ---------- */
  function toJ(date) {
    var parts = persianFmt.formatToParts(date);
    var o = { jy: 0, jm: 0, jd: 0 };
    parts.forEach(function (p) {
      if (p.type === 'year') o.jy = +p.value;
      if (p.type === 'month') o.jm = +p.value;
      if (p.type === 'day') o.jd = +p.value;
    });
    return o;
  }
  function jDoy(jm, jd) {
    if (jm <= 6) return (jm - 1) * 31 + jd;
    if (jm <= 11) return 186 + (jm - 7) * 30 + jd;
    return 336 + jd;
  }
  function toG(jy, jm, jd) {
    var now = new Date();
    var tJ = toJ(now);
    var delta = (jy - tJ.jy) * 365 + (jDoy(jm, jd) - jDoy(tJ.jm, tJ.jd));
    var guess = new Date(now.getFullYear(), now.getMonth(), now.getDate() + delta);
    for (var i = 0; i < 5; i++) {
      var g = toJ(guess);
      var diff = (jy - g.jy) * 365 + (jDoy(jm, jd) - jDoy(g.jm, g.jd));
      if (diff === 0) return guess;
      guess = new Date(guess.getFullYear(), guess.getMonth(), guess.getDate() + diff);
    }
    return guess;
  }
  function monthLen(jy, jm) {
    var first = toG(jy, jm, 1);
    for (var d = 1; d <= 31; d++) {
      var j = toJ(new Date(first.getTime() + d * DAY));
      if (j.jm !== jm) return d;
    }
    return 31;
  }
  function todayJ() {
    var n = new Date();
    var j = toJ(n);
    j.date = new Date(n.getFullYear(), n.getMonth(), n.getDate());
    return j;
  }
  /* ---------- helpers ---------- */
  function jkey(jy, jm, jd) { return jy + '/' + jm + '/' + jd; }
  function addMonths(jy, jm, n) {
    var idx = jm - 1 + n;
    var y = jy + Math.floor(idx / 12);
    var m = ((idx % 12) + 12) % 12;
    return { jy: y, jm: m + 1 };
  }
  function addDays(j, n) {
    var g = toG(j.jy, j.jm, j.jd);
    return toJ(new Date(g.getTime() + n * DAY));
  }
  function diffDays(a, b) { /* b - a in days */
    var ga = toG(a.jy, a.jm, a.jd), gb = toG(b.jy, b.jm, b.jd);
    return Math.round((gb - ga) / DAY);
  }
  function wdIndex(date) { return (date.getDay() + 1) % 7; } /* 0 = شنبه */
  function cmp(a, b) { return (a.jy - b.jy) || (a.jm - b.jm) || (a.jd - b.jd); }

  VB.jal = {
    toJ: toJ, toG: toG, monthLen: monthLen, todayJ: todayJ, addMonths: addMonths,
    addDays: addDays, diffDays: diffDays, wdIndex: wdIndex, cmp: cmp,
    key: jkey, MONTHS: MONTHS, WEEKDAYS: WEEKDAYS, WEEKDAYS_SHORT: WEEKDAYS_SHORT, DAY: DAY
  };

  /* ---------- formatting ---------- */
  var FA = '۰۱۲۳۴۵۶۷۸۹';
  function fa(n) { return String(n).replace(/\d/g, function (d) { return FA[d]; }); }
  function money(n) { return fa(String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ',')).replace(/,/g, '٬'); }
  function pad2(n) { return (n < 10 ? '0' : '') + n; }
  function dateShort(j) { return fa(j.jy + '/' + pad2(j.jm) + '/' + pad2(j.jd)); }
  function dateLong(j, withWeekday) {
    var wd = WEEKDAYS[wdIndex(toG(j.jy, j.jm, j.jd))];
    return (withWeekday === false ? '' : wd + ' ') + fa(j.jd) + ' ' + MONTHS[j.jm - 1] + (withWeekday === false ? '' : ' ' + fa(j.jy));
  }
  function monthTitle(jy, jm) { return MONTHS[jm - 1] + ' ' + fa(jy); }

  VB.fmt = { fa: fa, money: money, dateShort: dateShort, dateLong: dateLong, monthTitle: monthTitle, pad2: pad2 };

  /* ============================================================
     Calendar widget
     ============================================================ */
  function Calendar(opts) {
    this.el = opts.el;
    this.jy = opts.jy; this.jm = opts.jm;
    this.dayState = opts.dayState || function () { return ''; };
    this.onSelect = opts.onSelect || function () {};
    this.selected = opts.selected || null;
    this.min = opts.min || null;
    this.max = opts.max || null;
    this.render();
  }
  Calendar.prototype.canPrev = function () {
    if (!this.min) return true;
    var p = addMonths(this.jy, this.jm, -1);
    return (p.jy * 12 + p.jm) >= (this.min.jy * 12 + this.min.jm);
  };
  Calendar.prototype.canNext = function () {
    if (!this.max) return true;
    var n = addMonths(this.jy, this.jm, 1);
    return (n.jy * 12 + n.jm) <= (this.max.jy * 12 + this.max.jm);
  };
  Calendar.prototype.shift = function (n) {
    var m = addMonths(this.jy, this.jm, n);
    this.jy = m.jy; this.jm = m.jm;
    this.render();
  };
  Calendar.prototype.select = function (j) {
    this.selected = j;
    this.el.querySelectorAll('.cal-cell').forEach(function (c) { c.classList.remove('is-selected'); });
    var cell = this.el.querySelector('[data-jd="' + jkey(j.jy, j.jm, j.jd) + '"]');
    if (cell) cell.classList.add('is-selected');
  };
  Calendar.prototype.render = function () {
    var self = this;
    var t = todayJ();
    var len = monthLen(this.jy, this.jm);
    var firstWd = wdIndex(toG(this.jy, this.jm, 1));
    var html = '';
    html += '<div class="cal-head">';
    html += '<div class="cal-title">' + monthTitle(this.jy, this.jm) + '</div>';
    html += '<div class="cal-nav">';
    html += '<button type="button" class="icon-btn cal-prev" style="width:34px;height:34px;border-radius:10px" aria-label="ماه قبل" ' + (this.canPrev() ? '' : 'disabled') + '>' + VB.icon('chevron-right') + '</button>';
    html += '<button type="button" class="icon-btn cal-next" style="width:34px;height:34px;border-radius:10px" aria-label="ماه بعد" ' + (this.canNext() ? '' : 'disabled') + '>' + VB.icon('chevron-left') + '</button>';
    html += '</div></div>';
    html += '<div class="cal-week" aria-hidden="true">' + WEEKDAYS_SHORT.map(function (w) { return '<span>' + w + '</span>'; }).join('') + '</div>';
    html += '<div class="cal-grid" role="grid" aria-label="تقویم ' + monthTitle(this.jy, this.jm) + '">';
    for (var b = 0; b < firstWd; b++) html += '<span class="cal-cell is-empty"></span>';
    for (var d = 1; d <= len; d++) {
      var j = { jy: this.jy, jm: this.jm, jd: d };
      var st = this.dayState(j);
      var cls = 'cal-cell';
      if (st) cls += ' d-' + st;
      if (t.jy === this.jy && t.jm === this.jm && t.jd === d) cls += ' is-today';
      if (this.selected && this.selected.jd === d && this.selected.jm === this.jm && this.selected.jy === this.jy) cls += ' is-selected';
      html += '<button type="button" class="' + cls + '" data-jd="' + jkey(this.jy, this.jm, d) + '" aria-label="' + dateLong(j) + '">' +
        '<span>' + fa(d) + '</span><i class="cal-dot"></i></button>';
    }
    html += '</div>';
    this.el.innerHTML = html;

    this.el.querySelector('.cal-prev').addEventListener('click', function () { if (self.canPrev()) self.shift(-1); });
    this.el.querySelector('.cal-next').addEventListener('click', function () { if (self.canNext()) self.shift(1); });
    this.el.querySelectorAll('.cal-cell:not(.is-empty)').forEach(function (cell) {
      cell.addEventListener('click', function () {
        var parts = cell.getAttribute('data-jd').split('/').map(Number);
        var j = { jy: parts[0], jm: parts[1], jd: parts[2] };
        self.select(j);
        self.onSelect(j);
      });
    });
  };

  VB.Calendar = Calendar;
})();
