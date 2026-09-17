/* ============================================================
   modal.js — modal / drawer / toast primitives
   Focus-trapped, ESC-closable, spring-animated.
   ============================================================ */
(function () {
  'use strict';
  window.VB = window.VB || {};

  var lastFocus = null;
  var openStack = [];

  function trap(root, e) {
    if (e.key !== 'Tab') return;
    var f = root.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    if (!f.length) return;
    var first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { last.focus(); e.preventDefault(); }
    else if (!e.shiftKey && document.activeElement === last) { first.focus(); e.preventDefault(); }
  }

  function buildShell(kind, opts) {
    lastFocus = document.activeElement;
    var rootEl = document.getElementById(kind + '-root');
    rootEl.innerHTML = '';
    var scrim = document.createElement('div');
    scrim.className = 'scrim';
    var panel = document.createElement('div');
    panel.className = kind + (opts.size ? ' ' + kind + '-' + opts.size : '');
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-modal', 'true');
    panel.setAttribute('aria-label', opts.title || 'پنجره');

    var head = '<div class="modal-head">' +
        (opts.icon ? '<div class="ic-tile ' + (opts.tone || 'blue') + '">' + VB.icon(opts.icon) + '</div>' : '') +
        '<b>' + (opts.title || '') + '</b>' +
        '<button type="button" class="icon-btn" data-close aria-label="بستن">' + VB.icon('x') + '</button>' +
        '</div>';
    panel.innerHTML = head +
      '<div class="modal-body">' + (opts.body || '') + '</div>' +
      (opts.actions && opts.actions.length
        ? '<div class="modal-foot">' + opts.actions.map(function (a, i) {
            return '<button type="button" class="btn ' + (a.class || 'btn-soft') + '" data-act="' + i + '">' + (a.icon ? VB.icon(a.icon) : '') + a.label + '</button>';
          }).join('') + '</div>'
        : '');

    rootEl.appendChild(scrim);
    rootEl.appendChild(panel);
    rootEl.classList.add('is-open');
    document.body.style.overflow = 'hidden';

    function close() {
      rootEl.classList.remove('is-open');
      rootEl.innerHTML = '';
      document.body.style.overflow = '';
      openStack = openStack.filter(function (r) { return r !== rootEl; });
      document.removeEventListener('keydown', onKey, true);
      if (lastFocus && lastFocus.focus) lastFocus.focus();
    }
    function onKey(e) {
      if (e.key === 'Escape') { e.stopPropagation(); close(); }
      trap(panel, e);
    }
    document.addEventListener('keydown', onKey, true);
    scrim.addEventListener('click', close);
    panel.querySelectorAll('[data-close]').forEach(function (b) { b.addEventListener('click', close); });
    (opts.actions || []).forEach(function (a, i) {
      var btn = panel.querySelector('[data-act="' + i + '"]');
      if (btn) btn.addEventListener('click', function () { a.onClick ? a.onClick(close, panel) : close(); });
    });

    openStack.push(rootEl);
    var focusTarget = panel.querySelector('input, textarea, select') || panel.querySelector('.modal-foot .btn, [data-close]');
    if (focusTarget) setTimeout(function () { focusTarget.focus(); }, 60);
    return { close: close, panel: panel };
  }

  VB.modal = {
    open: function (opts) { return buildShell('modal', opts); },
    confirm: function (opts) {
      return new Promise(function (resolve) {
        var done = false;
        var h = buildShell('modal', {
          size: 'sm',
          title: opts.title,
          icon: opts.icon || 'alert',
          tone: opts.tone || 'warning',
          body: '<p>' + opts.message + '</p>',
          actions: [
            {
              label: opts.confirmLabel || 'تأیید', class: opts.danger ? 'btn-danger' : 'btn-primary',
              onClick: function (close) { done = true; resolve(true); close(); }
            },
            { label: 'انصراف', class: 'btn-ghost', onClick: function (close) { done = true; resolve(false); close(); } }
          ]
        });
        /* resolve false if closed by esc/scrim */
        var obs = new MutationObserver(function () {
          if (!document.getElementById('modal-root').classList.contains('is-open') && !done) {
            resolve(false); obs.disconnect();
          }
        });
        obs.observe(document.getElementById('modal-root'), { attributes: true, attributeFilter: ['class'] });
        return h;
      });
    }
  };
  VB.drawer = { open: function (opts) { return buildShell('drawer', opts); } };

  /* ---------- toasts ---------- */
  var TOAST_ICON = { success: 'check', danger: 'alert', warning: 'alert', info: 'info' };
  VB.toast = function (msg, type, icon) {
    type = type || 'success';
    var root = document.getElementById('toast-root');
    var el = document.createElement('div');
    el.className = 'toast t-' + type;
    el.setAttribute('role', 'status');
    el.innerHTML = VB.icon(icon || TOAST_ICON[type]) + '<span>' + msg + '</span>';
    root.appendChild(el);
    setTimeout(function () {
      el.classList.add('leaving');
      setTimeout(function () { el.remove(); }, 260);
    }, 3400);
    return el;
  };
})();
