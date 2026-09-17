/* ============================================================
   theme.js — light / dark / system with persistence
   ============================================================ */
(function () {
  'use strict';
  window.VB = window.VB || {};

  var mq = window.matchMedia('(prefers-color-scheme: dark)');
  var mode = VB.data.settings.theme || 'dark';

  function effective() {
    if (mode === 'system') return mq.matches ? 'dark' : 'light';
    return mode;
  }
  function apply() {
    document.documentElement.setAttribute('data-theme', effective());
  }
  function set(m) {
    mode = m;
    VB.data.settings.theme = m;
    VB.data.saveSettings();
    apply();
    document.dispatchEvent(new CustomEvent('vb:theme', { detail: { mode: m, effective: effective() } }));
  }

  mq.addEventListener('change', function () {
    if (mode === 'system') apply();
  });

  VB.theme = {
    init: apply,
    set: set,
    get: function () { return mode; },
    effective: effective
  };
})();
