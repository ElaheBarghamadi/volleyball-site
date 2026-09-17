/* ============================================================
   icons.js — inline SVG icon system (no external dependency)
   ============================================================ */
(function () {
  'use strict';
  window.VB = window.VB || {};

  var P = {
    dashboard: '<rect x="3" y="3" width="7.2" height="7.2" rx="2"/><rect x="13.8" y="3" width="7.2" height="7.2" rx="2"/><rect x="3" y="13.8" width="7.2" height="7.2" rx="2"/><rect x="13.8" y="13.8" width="7.2" height="7.2" rx="2"/>',
    schedule: '<rect x="3" y="4.5" width="18" height="16.5" rx="3.5"/><path d="M8 2.5v4M16 2.5v4M3 9.8h18"/><path d="M7.5 13.5h.01M12 13.5h.01M16.5 13.5h.01M7.5 17h.01M12 17h.01"/>',
    attendance: '<circle cx="12" cy="12" r="9"/><path d="m8.4 12.3 2.5 2.5 4.7-5.2"/>',
    tuition: '<path d="M21 12V7.5H5a2 2 0 0 1 0-4h14v4"/><path d="M3 5.5v13a2 2 0 0 0 2 2h16v-5"/><path d="M18 12.2a2 2 0 0 0 0 3.6h4v-3.6Z"/>',
    registration: '<rect x="2.5" y="4.8" width="19" height="14.4" rx="3.2"/><circle cx="8.3" cy="10.6" r="2"/><path d="M5.2 16.2c.6-1.8 1.7-2.7 3.1-2.7s2.5.9 3.1 2.7"/><path d="M14.5 9.6H19M14.5 13.2h3.2"/>',
    insurance: '<path d="M12 2.6 4.6 5.5v6.1c0 4.6 3.1 8 7.4 9.9 4.3-1.9 7.4-5.3 7.4-9.9V5.5Z"/><path d="m9.1 11.7 2.2 2.2 3.9-4.3"/>',
    progress: '<path d="M3 17.5 9 11l4 4 8-8.5"/><path d="M15.5 6.5H21V12"/>',
    announcements: '<path d="m3.2 10.8 17.6-5.3v12.4L3.2 13.4Z"/><path d="M11.4 15.6a3 3 0 1 1-5.6-1.7"/><path d="M18 5.5V3M21 9h2"/>',
    bell: '<path d="M6.2 8.6a5.8 5.8 0 0 1 11.6 0c0 6.2 2.4 7.8 2.4 7.8H3.8s2.4-1.6 2.4-7.8"/><path d="M10.4 20.4a1.9 1.9 0 0 0 3.2 0"/>',
    user: '<circle cx="12" cy="8" r="4"/><path d="M4.6 20.6c1.2-3.4 4-5.1 7.4-5.1s6.2 1.7 7.4 5.1"/>',
    settings: '<path d="M4 7.2h5.2M15 7.2h5M4 16.8h9.4M19 16.8h1"/><circle cx="12.2" cy="7.2" r="2.3"/><circle cx="16.4" cy="16.8" r="2.3"/>',
    logout: '<path d="M9.5 21H5.8a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.7"/><path d="m15.5 16.5 4.5-4.5-4.5-4.5"/><path d="M20 12H9.5"/>',
    support: '<circle cx="12" cy="12" r="9"/><path d="M9.5 9.2a2.6 2.6 0 0 1 5.1.7c0 1.7-2.5 2.2-2.5 3.4"/><path d="M12.1 16.8h.01"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="m20.6 20.6-4.5-4.5"/>',
    'chevron-down': '<path d="m6.5 9.5 5.5 5.5 5.5-5.5"/>',
    'chevron-left': '<path d="m14.5 6.5-5.5 5.5 5.5 5.5"/>',
    'chevron-right': '<path d="m9.5 6.5 5.5 5.5-5.5 5.5"/>',
    x: '<path d="m6.5 6.5 11 11M17.5 6.5l-11 11"/>',
    check: '<path d="m5.5 12.6 4.3 4.4L18.5 7"/>',
    clock: '<circle cx="12" cy="12" r="8.6"/><path d="M12 7.2v5l3.1 1.8"/>',
    pin: '<path d="M12 21.2s6.8-5.4 6.8-10.8a6.8 6.8 0 1 0-13.6 0C5.2 15.8 12 21.2 12 21.2Z"/><circle cx="12" cy="10.2" r="2.5"/>',
    coach: '<circle cx="9.2" cy="8" r="3.6"/><path d="M2.9 19.8c1-3 3.4-4.6 6.3-4.6 2.8 0 5.2 1.6 6.2 4.6"/><path d="m15.4 10.2 2 2 4-4.4"/>',
    phone: '<path d="M5.2 3.6h3.6l1.5 4.3-2.1 1.6a12.6 12.6 0 0 0 6.3 6.3l1.6-2.1 4.3 1.5v3.6a2 2 0 0 1-2.2 2A17.4 17.4 0 0 1 3.2 5.8a2 2 0 0 1 2-2.2Z"/>',
    mail: '<rect x="3" y="5" width="18" height="14" rx="2.6"/><path d="m3.6 7.2 8.4 6 8.4-6"/>',
    send: '<path d="m21.5 2.5-7 19.6-3.9-8.7-8.7-3.9Z"/><path d="M21.5 2.5 10.6 13.4"/>',
    edit: '<path d="M16.8 3.2a2.8 2.8 0 1 1 4 4L7.6 20.4 2.2 21.8l1.4-5.4Z"/>',
    trash: '<path d="M3.8 6.2h16.4"/><path d="M8.2 6.2V4.4a1.6 1.6 0 0 1 1.6-1.6h4.4a1.6 1.6 0 0 1 1.6 1.6v1.8"/><path d="m6.2 6.2.9 13.6a2 2 0 0 0 2 1.9h5.8a2 2 0 0 0 2-1.9l.9-13.6"/>',
    alert: '<path d="M12 3.6 2.6 19.8h18.8Z"/><path d="M12 9.6v4.6M12 17.2h.01"/>',
    info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5.2M12 7.8h.01"/>',
    volleyball: '<circle cx="12" cy="12" r="8.8"/><path d="M12 12c-.4-3.9 1.2-7.3 4-8.9"/><path d="M12 12c-3.2 2.3-7 2.8-9.9 1.3"/><path d="M12 12c2.3 3.2 2.9 7 1.7 10"/>',
    flame: '<path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.07-2.14-.22-4.05 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.15.43-2.29 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>',
    medal: '<circle cx="12" cy="9" r="5.4"/><path d="m8.9 13.4-1.9 7.8 5-2.9 5 2.9-1.9-7.8"/>',
    renew: '<path d="M20.5 12a8.5 8.5 0 1 1-8.5-8.5c2.4 0 4.6.95 6.2 2.5l2.3 2.2"/><path d="M20.5 3.4v4.8h-4.8"/>',
    filter: '<path d="M4 5.2h16L13.6 13v5.8l-3.2 2V13Z"/>',
    menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2.6v2M12 19.4v2M2.6 12h2M19.4 12h2M5.2 5.2l1.4 1.4M17.4 17.4l1.4 1.4M5.2 18.8l1.4-1.4M17.4 6.6l1.4-1.4"/>',
    moon: '<path d="M20.4 14.3A8.4 8.4 0 1 1 9.7 3.6a6.9 6.9 0 1 0 10.7 10.7Z"/>',
    monitor: '<rect x="3" y="4" width="18" height="12.4" rx="2.2"/><path d="M9 20.4h6M12 16.4v4"/>',
    lock: '<rect x="4.6" y="10.4" width="14.8" height="10.4" rx="2.6"/><path d="M8.2 10.4V7.6a3.8 3.8 0 0 1 7.6 0v2.8"/>',
    globe: '<circle cx="12" cy="12" r="8.8"/><path d="M3.2 12h17.6"/><path d="M12 3.2a13.6 13.6 0 0 1 0 17.6 13.6 13.6 0 0 1 0-17.6Z"/>',
    receipt: '<path d="M14 2.8H6.2a2 2 0 0 0-2 2v14.4a2 2 0 0 0 2 2h11.6a2 2 0 0 0 2-2V8.6Z"/><path d="M14 2.8v5.8h5.8"/><path d="M8.8 13h6.4M8.8 16.6h4.2"/>',
    eye: '<path d="M2.6 12S6.2 5.6 12 5.6 21.4 12 21.4 12 17.8 18.4 12 18.4 2.6 12 2.6 12Z"/><circle cx="12" cy="12" r="3"/>',
    target: '<circle cx="12" cy="12" r="8.8"/><circle cx="12" cy="12" r="4.8"/><circle cx="12" cy="12" r="1.2"/>',
    inbox: '<path d="M3.4 13.4h4.8l1.9 2.8h3.8l1.9-2.8h4.8"/><path d="M5.4 5.4h13.2l2 8v5.2H3.4v-5.2Z"/>',
    zap: '<path d="M13 2.4 4.2 14h6.2l-1 7.6L18.2 10H12Z"/>',
    calendar: '<rect x="3" y="4.5" width="18" height="16.5" rx="3.5"/><path d="M8 2.5v4M16 2.5v4M3 9.8h18"/>',
    users: '<circle cx="9" cy="8.4" r="3.4"/><path d="M2.8 19.6c.9-2.9 3.3-4.5 6.2-4.5s5.3 1.6 6.2 4.5"/><circle cx="17.2" cy="9.4" r="2.7"/><path d="M17.6 15.2c2.1.3 3.6 1.6 4.3 3.8"/>'
  };

  VB.icon = function (name, cls) {
    var body = P[name] || P.info;
    return '<svg class="ic' + (cls ? ' ' + cls : '') + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + body + '</svg>';
  };

  VB.iconNames = Object.keys(P);
})();
