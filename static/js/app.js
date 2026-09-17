/* ============================================================
   app.js — bootstrap
   ============================================================ */
(function () {
  'use strict';

  function injectIcons() {
    document.getElementById('ic-search').innerHTML = VB.icon('search');
    document.getElementById('ic-bell').innerHTML = VB.icon('bell');
    document.getElementById('ic-chev').innerHTML = VB.icon('chevron-down');
    document.getElementById('ic-menu').innerHTML = VB.icon('menu');
  }

  function boot() {
    injectIcons();
    VB.theme.init();
    VB.navigation.init();
    VB.notifications.render();
    VB.notifications.badge();
    var act = document.querySelector('.page.is-active');
    var initial = act ? act.id.replace('page-', '') : 'dashboard';
    VB.navigate(initial);
    /* cross-page attendance date handoff */
    try {
      var sel = sessionStorage.getItem('vb-att-select');
      if (sel) {
        sessionStorage.removeItem('vb-att-select');
        if (initial === 'attendance' && VB.pages.attendance && VB.pages.attendance.selectDate) VB.pages.attendance.selectDate(sel);
      }
    } catch (e) { /* ignore */ }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
