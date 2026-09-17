/* ============================================================
   notifications.js — notification center (dropdown panel)
   ============================================================ */
(function () {
  'use strict';
  window.VB = window.VB || {};

  var jal = VB.jal, fmt = VB.fmt;
  var state = { filter: 'all' };
  var TYPE_ICON = { success: 'check', info: 'bell', warning: 'alert', match: 'medal' };

  function timeLabel(n) {
    var t = VB.data.TODAY;
    var d = jal.diffDays(n.time, t);
    if (d === 0) return 'امروز، ساعت ' + n.hour;
    if (d === 1) return 'دیروز، ساعت ' + n.hour;
    return fmt.dateShort(n.time) + '، ساعت ' + n.hour;
  }

  function unreadCount() {
    return VB.data.notifications.filter(function (n) { return !n.read; }).length;
  }

  function badge() {
    var c = unreadCount();
    document.querySelectorAll('[data-notif-badge]').forEach(function (b) {
      b.textContent = fmt.fa(c);
      b.classList.toggle('hidden', c === 0);
    });
  }

  function list() {
    var items = VB.data.notifications.slice().reverse();
    if (state.filter === 'unread') items = items.filter(function (n) { return !n.read; });
    if (!items.length) {
      return '<div class="np-empty">' + VB.icon('inbox') + '<div>اعلانی برای نمایش نیست.</div></div>';
    }
    return items.map(function (n) {
      return '<div class="np-item' + (n.read ? '' : ' unread') + '" data-id="' + n.id + '">' +
        '<div class="np-ic t-' + n.type + '">' + VB.icon(TYPE_ICON[n.type] || 'info') + '</div>' +
        '<div class="np-body"><p>' + n.text + '</p><div class="np-time">' + (n.read ? '' : '<i class="unread-dot"></i>') + timeLabel(n) + '</div></div>' +
        '<div class="np-actions">' +
        '<button type="button" class="np-mini" data-a="read" aria-label="' + (n.read ? 'علامت‌گذاری خوانده‌نشده' : 'خوانده شد') + '" title="' + (n.read ? 'خوانده‌نشده' : 'خوانده شد') + '">' + VB.icon(n.read ? 'bell' : 'check') + '</button>' +
        '<button type="button" class="np-mini del" data-a="del" aria-label="حذف اعلان" title="حذف">' + VB.icon('trash') + '</button>' +
        '</div></div>';
    }).join('');
  }

  function render() {
    var panel = document.getElementById('notif-panel');
    if (!panel) return;
    var unread = unreadCount();
    panel.innerHTML =
      '<div class="np-head"><b>اعلان‌ها</b>' +
      (unread ? '<span class="pill pill-yellow">' + fmt.fa(unread) + ' خوانده‌نشده</span>' : '') +
      '<button type="button" class="link-btn" data-a="all">خواندن همه</button></div>' +
      '<div class="np-filters">' +
      '<button type="button" class="chip' + (state.filter === 'all' ? ' is-active' : '') + '" data-f="all">همه</button>' +
      '<button type="button" class="chip' + (state.filter === 'unread' ? ' is-active' : '') + '" data-f="unread">خوانده‌نشده</button>' +
      '</div>' +
      '<div class="np-list">' + list() + '</div>';

    panel.querySelectorAll('.np-filters .chip').forEach(function (c) {
      c.addEventListener('click', function () { state.filter = c.getAttribute('data-f'); render(); });
    });
    panel.querySelector('[data-a="all"]').addEventListener('click', function () {
      VB.data.notifications.forEach(function (n) { n.read = true; });
      render(); badge();
      VB.toast('همه اعلان‌ها خوانده شد.', 'info');
    });
    panel.querySelectorAll('.np-item').forEach(function (item) {
      var id = item.getAttribute('data-id');
      item.querySelector('[data-a="read"]').addEventListener('click', function (e) {
        e.stopPropagation();
        var n = VB.data.notifications.filter(function (x) { return x.id === id; })[0];
        n.read = !n.read;
        render(); badge();
      });
      item.querySelector('[data-a="del"]').addEventListener('click', function (e) {
        e.stopPropagation();
        VB.data.notifications = VB.data.notifications.filter(function (x) { return x.id !== id; });
        render(); badge();
        VB.toast('اعلان حذف شد.', 'info', 'trash');
      });
    });
  }

  VB.notifications = { render: render, badge: badge, unread: unreadCount };
})();
