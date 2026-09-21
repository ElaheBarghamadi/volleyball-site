/* ============================================================
   navigation.js — rail, mobile nav, dropdowns, search, router
   ============================================================ */
(function () {
  'use strict';
  window.VB = window.VB || {};
  VB.state = { current: null };

  var jal = VB.jal, fmt = VB.fmt;
  var D = function () { return VB.data; };

  var PAGES = [
    { id: 'dashboard', label: 'داشبورد', icon: 'dashboard', group: 'main', url: '/dashboard/' },
    { id: 'schedule', label: 'برنامه تمرین', icon: 'schedule', group: 'main', url: '/schedule/' },
    { id: 'attendance', label: 'حضور و غیاب', icon: 'attendance', group: 'main', url: '/attendance/' },
    { id: 'tuition', label: 'شهریه', icon: 'tuition', group: 'main', url: '/tuition/' },
    { id: 'insurance', label: 'بیمه', icon: 'insurance', group: 'main', url: '/insurance/' },
    { id: 'progress', label: 'پیشرفت من', icon: 'progress', group: 'main', url: '/progress/' },
    { id: 'announcements', label: 'اعلانات', icon: 'announcements', group: 'main', url: '/announcements/' },
    { id: 'profile', label: 'پروفایل', icon: 'user', group: 'foot', url: '/profile/' },
    { id: 'settings', label: 'تنظیمات', icon: 'settings', group: 'foot', url: '/settings/' },
    { id: 'support', label: 'پشتیبانی', icon: 'support', group: 'foot', url: '/support/' }
  ];

  var LOGO = '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true">' +
    '<circle cx="12" cy="12" r="9.2" stroke="#14181F" stroke-width="1.6"/>' +
    '<path d="M12 12c-.4-3.9 1.2-7.3 4-8.9M12 12c-3.2 2.3-7 2.8-9.9 1.3M12 12c2.3 3.2 2.9 7 1.7 10" stroke="#14181F" stroke-width="1.6" stroke-linecap="round"/>' +
    '<circle cx="16.6" cy="6.4" r="1.5" fill="#39A0FF"/></svg>';

  /* ---------- rail ---------- */
  /* ---------- shared sidebar markup ---------- */
  function navBadge(id) {
    if (id === 'tuition') {
      var n = D().tuition.list.filter(function (p) { return p.status === 'pending'; }).length;
      return n ? '<span class="bdg">' + fmt.fa(n) + '</span>' : '';
    }
    if (id === 'announcements') {
      var m = D().announcements.filter(function (x) { return x.important; }).length;
      return m ? '<span class="bdg y">' + fmt.fa(m) + '</span>' : '';
    }
    return '';
  }
  function sideHTML() {
    var main = PAGES.filter(function (p) { return p.group === 'main'; });
    var foot = PAGES.filter(function (p) { return p.group === 'foot'; });
    function item(p) {
      return '<a class="nv" href="' + p.url + '" data-page="' + p.id + '" title="' + p.label + '">' +
        VB.icon(p.icon) + '<span>' + p.label + '</span>' + navBadge(p.id) + '</a>';
    }
    return '<div class="brand">' +
      '<span class="ball" aria-hidden="true"></span>' +
      '<div class="btxt"><b class="brand-en">FARAZ</b><small>باشگاه والیبال فراز</small></div>' +
      '</div>' +
      '<nav class="nv-list" aria-label="ناوبری اصلی">' +
      '<span class="nv-cap">منوی اصلی</span>' + main.map(item).join('') +
      '<span class="nv-cap">حساب کاربری</span>' + foot.map(item).join('') +
      '<a class="nv danger" href="#" data-logout>' + VB.icon('logout') + '<span>خروج</span></a>' +
      '</nav>' +
      '<div class="up">' +
      '<div class="up-ic">' + VB.icon('medal') + '</div>' +
      '<b>ارتقا به سطح حرفه‌ای</b>' +
      '<small>تمرین اختصاصی، آنالیز ویدیویی و بدنسازی ویژه</small>' +
      '<a href="/#pricing" class="btn y w100" style="display:block;text-align:center;text-decoration:none">مشاهده تعرفه‌ها</a>' +
      '</div>';
  }
  function bindNav(scope, beforeNavigate) {
    scope.querySelectorAll('button[data-page]').forEach(function (b) {
      b.addEventListener('click', function (e) {
        e.preventDefault();
        if (beforeNavigate) beforeNavigate();
        VB.navigate(b.getAttribute('data-page'));
      });
    });
    scope.querySelector('[data-logout]').addEventListener('click', function (e) {
      e.preventDefault();
      if (beforeNavigate) beforeNavigate();
      logout();
    });
  }

  /* ---------- desktop sidebar ---------- */
  function buildRail() {
    var rail = document.getElementById('rail');
    rail.innerHTML = sideHTML();
    bindNav(rail, null);
  }

  /* ---------- mobile: minimal side menu + hamburger ---------- */
  var mm = null;
  function buildMobileMenu() {
    var btn = document.getElementById('menu-btn');
    var root = document.createElement('div');
    root.id = 'mm-root';
    root.innerHTML =
      '<div class="mm-scrim"></div>' +
      '<aside class="mm-panel" role="dialog" aria-modal="true" aria-label="منوی باشگاه">' +
      '<div class="sidepanel"></div>' +
      '</aside>';
    document.body.appendChild(root);

    var panel = root.querySelector('.mm-panel');
    var scrim = root.querySelector('.mm-scrim');
    var lastFocus = null;

    function isOpen() { return root.classList.contains('is-open'); }
    function onKey(e) {
      if (e.key === 'Escape') { close(); return; }
      if (e.key !== 'Tab') return;
      var f = panel.querySelectorAll('a[href], button');
      if (!f.length) return;
      var first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { last.focus(); e.preventDefault(); }
      else if (!e.shiftKey && document.activeElement === last) { first.focus(); e.preventDefault(); }
    }
    function open() {
      panel.querySelector('.sidepanel').innerHTML = sideHTML();
      bindNav(panel, close);
      var cur = panel.querySelector('[data-page="' + VB.state.current + '"]');
      if (cur) { cur.classList.add('is-active'); cur.setAttribute('aria-current', 'page'); }
      lastFocus = document.activeElement;
      root.classList.add('is-open');
      document.body.style.overflow = 'hidden';
      btn.setAttribute('aria-expanded', 'true');
      document.addEventListener('keydown', onKey, true);
      setTimeout(function () {
        var t = panel.querySelector('.nv');
        if (t) t.focus();
      }, 80);
    }
    function close() {
      if (!isOpen()) return;
      root.classList.remove('is-open');
      document.body.style.overflow = '';
      btn.setAttribute('aria-expanded', 'false');
      document.removeEventListener('keydown', onKey, true);
      if (lastFocus && lastFocus.focus) lastFocus.focus();
    }
    scrim.addEventListener('click', close);
    btn.addEventListener('click', function () { isOpen() ? close() : open(); });
    mm = { open: open, close: close, isOpen: isOpen };
  }
  function closeMobileMenu() { if (mm && mm.isOpen()) mm.close(); }

  /* ---------- dropdowns ---------- */
  var openName = null;
  function closeDropdowns() {
    ['notif-panel', 'profile-menu', 'search-results'].forEach(function (id) {
      var el = document.getElementById(id);
      if (el) el.classList.add('hidden');
    });
    var ab = document.getElementById('avatar-btn');
    if (ab) ab.setAttribute('aria-expanded', 'false');
    openName = null;
  }
  function toggleDropdown(name) {
    var wasOpen = openName === name;
    closeDropdowns();
    if (wasOpen) return;
    openName = name;
    if (name === 'notif') {
      VB.notifications.render();
      document.getElementById('notif-panel').classList.remove('hidden');
    } else if (name === 'profile') {
      document.getElementById('profile-menu').classList.remove('hidden');
      document.getElementById('avatar-btn').setAttribute('aria-expanded', 'true');
    }
  }

  function buildProfileMenu() {
    var menu = document.getElementById('profile-menu');
    var p = D().player;
    menu.innerHTML =
      '<div class="menu-head"><b>' + p.firstName + ' ' + p.lastName + '</b><small>' + p.playerId + '</small></div>' +
      '<button type="button" class="menu-item" data-page="profile">' + VB.icon('user') + 'پروفایل من</button>' +
      '<button type="button" class="menu-item" data-page="settings">' + VB.icon('settings') + 'تنظیمات</button>' +
      '<button type="button" class="menu-item" data-page="support">' + VB.icon('support') + 'پشتیبانی</button>' +
      '<button type="button" class="menu-item danger" data-logout>' + VB.icon('logout') + 'خروج از حساب</button>';
    menu.querySelectorAll('[data-page]').forEach(function (b) {
      b.addEventListener('click', function () { closeDropdowns(); VB.navigate(b.getAttribute('data-page')); });
    });
    menu.querySelector('[data-logout]').addEventListener('click', function () { closeDropdowns(); logout(); });
  }

  function logout() {
    VB.modal.confirm({
      title: 'خروج از حساب',
      message: 'از حساب خود خارج می‌شوید؟',
      confirmLabel: 'خروج', danger: true, icon: 'logout', tone: 'danger'
    }).then(function (ok) {
      if (!ok) return;
      window.location.href = '/logout/';
    });
  }

  /* ---------- search ---------- */
  function searchIndex() {
    var idx = [];
    PAGES.forEach(function (p) { idx.push({ g: 'صفحه‌ها', label: p.label, icon: p.icon, run: function () { VB.navigate(p.id); } }); });
    D().slots.filter(function (s) { return s.state === 'upcoming' || s.state === 'live'; }).slice(0, 6).forEach(function (s) {
      idx.push({ g: 'جلسات پیش‌رو', label: s.type + ' · ' + fmt.dateLong(s.j), icon: 'volleyball', run: function () { VB.ui.sessionModal(s); } });
    });
    D().announcements.forEach(function (a) {
      idx.push({ g: 'اعلامیه‌ها', label: a.title, icon: 'announcements', run: function () { VB.navigate('announcements'); } });
    });
    return idx;
  }
  var INDEX = null;
  function bindSearch() {
    var box = document.getElementById('search-box');
    var input = document.getElementById('search-input');
    var res = document.getElementById('search-results');
    function draw(q) {
      if (!q.trim()) { res.classList.add('hidden'); return; }
      INDEX = INDEX || searchIndex();
      var hits = INDEX.filter(function (x) { return x.label.indexOf(q.trim()) !== -1; }).slice(0, 8);
      if (!hits.length) {
        res.innerHTML = '<div class="np-empty" style="padding:20px">نتیجه‌ای برای «' + q + '» پیدا نشد.</div>';
      } else {
        var groups = {};
        hits.forEach(function (h) { (groups[h.g] = groups[h.g] || []).push(h); });
        var html = '';
        Object.keys(groups).forEach(function (g) {
          html += '<div class="sr-group">' + g + '</div>';
          groups[g].forEach(function (h) {
            html += '<button type="button" class="sr-item" data-i="' + INDEX.indexOf(h) + '">' + VB.icon(h.icon) + '<span>' + h.label + '</span></button>';
          });
        });
        res.innerHTML = html;
        res.querySelectorAll('.sr-item').forEach(function (b) {
          b.addEventListener('click', function () {
            res.classList.add('hidden'); input.value = ''; box.classList.remove('is-open');
            INDEX[+b.getAttribute('data-i')].run();
          });
        });
      }
      res.classList.remove('hidden');
      openName = 'search';
    }
    input.addEventListener('input', function () { draw(input.value); });
    input.addEventListener('focus', function () { if (input.value) draw(input.value); });
    box.addEventListener('click', function (e) {
      e.stopPropagation();
      if (window.matchMedia('(max-width: 960px)').matches && !box.classList.contains('is-open')) {
        box.classList.add('is-open');
        setTimeout(function () { input.focus(); }, 40);
      }
    });
    input.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { input.value = ''; res.classList.add('hidden'); box.classList.remove('is-open'); input.blur(); }
      if (e.key === 'Enter') { var first = res.querySelector('.sr-item'); if (first) first.click(); }
    });
  }

  /* ---------- greeting ---------- */
  function refreshGreeting() {
    var d = D();
    var hr = new Date().getHours();
    var greet = hr < 12 ? 'صبح بخیر' : hr < 18 ? 'عصر بخیر' : 'شبت بخیر';
    document.getElementById('tb-hello').innerHTML = greet + '، <em>' + d.player.firstName + '</em> <span style="font-weight:500; color:var(--muted); font-size:14px;">— خوش آمدی</span>';
    document.getElementById('tb-date').innerHTML =
      VB.icon('calendar') + '<span class="weekday">' + jal.WEEKDAYS[jal.wdIndex(d.TODAY.date)] + '، </span>' +
      '<span>' + fmt.fa(d.TODAY.jd) + ' ' + jal.MONTHS[d.TODAY.jm - 1] + ' ' + fmt.fa(d.TODAY.jy) + '</span>' +
      '<span style="display:inline-flex; align-items:center; gap:6px; margin-inline-start:8px; background:var(--success-tint); color:var(--success); font-size:11px; font-weight:800; padding:3px 9px; border-radius:999px; border:1px solid color-mix(in srgb, var(--success) 16%, transparent)"><i class="live-dot" style="width:6px;height:6px;background:var(--success);"></i>آنلاین</span>';
    var ab = document.getElementById('avatar-btn');
    ab.querySelector('.avatar').textContent = d.player.firstName[0];
    ab.querySelector('.ab-name').textContent = d.player.firstName + ' ' + d.player.lastName;
    ab.querySelector('.ab-role').textContent = d.player.role + ' · ' + d.player.group;
  }

  /* ---------- router ---------- */
  var rendered = {};
  function navigate(id, opts) {
    opts = opts || {};
    if (!PAGES.filter(function (p) { return p.id === id; })[0]) id = 'dashboard';
    /* MPA: section not in this document -> real navigation to its url */
    if (!document.getElementById('page-' + id)) {
      if (opts.select) { try { sessionStorage.setItem('vb-att-select', String(opts.select)); } catch (e) { /* ignore */ } }
      var tgt = PAGES.filter(function (p) { return p.id === id; })[0];
      window.location.href = tgt ? tgt.url : '/';
      return;
    }
    var prev = VB.state.current;
    if (prev && VB.pages[prev] && VB.pages[prev].destroy) VB.pages[prev].destroy();

    document.querySelectorAll('.page').forEach(function (s) { s.classList.toggle('is-active', s.id === 'page-' + id); });
    var el = document.getElementById('page-' + id);
    if (!rendered[id] || opts.force) {
      VB.pages[id].render(el);
      rendered[id] = true;
    } else if (VB.pages[id].resume) {
      VB.pages[id].resume();
    }
    VB.state.current = id;

    closeMobileMenu();
    document.querySelectorAll('#rail [data-page]').forEach(function (b) {
      b.classList.toggle('is-active', b.getAttribute('data-page') === id);
    });
    var activeLink = document.querySelector('#rail [data-page="' + id + '"]');
    if (activeLink && activeLink.scrollIntoView) {
      activeLink.scrollIntoView({ block: 'nearest' });
    }
    document.querySelectorAll('#rail [data-page]').forEach(function (b) {
      if (b.getAttribute('data-page') === id) b.setAttribute('aria-current', 'page');
      else b.removeAttribute('aria-current');
    });
    document.title = 'باشگاه والیبال فراز | ' + (PAGES.filter(function (p) { return p.id === id; })[0].label);
    window.scrollTo({ top: 0, behavior: 'instant' in document.documentElement.style ? 'instant' : 'auto' });

    if (id === 'attendance' && opts.select && VB.pages.attendance.selectDate) {
      VB.pages.attendance.selectDate(opts.select);
    }
    closeDropdowns();
  }

  VB.navigate = navigate;
  VB.rerenderCurrent = function () {
    if (VB.state.current) {
      rendered[VB.state.current] = false;
      navigate(VB.state.current, { force: true });
    }
  };
  VB.navigation = { refreshGreeting: refreshGreeting, PAGES: PAGES, closeDropdowns: closeDropdowns, toggleDropdown: toggleDropdown, isOpen: function () { return openName; } };

  VB.navigation.init = function () {
    buildRail();
    buildMobileMenu();
    buildProfileMenu();
    bindSearch();
    refreshGreeting();

    document.getElementById('bell-btn').addEventListener('click', function (e) { e.stopPropagation(); toggleDropdown('notif'); });
    document.getElementById('avatar-btn').addEventListener('click', function (e) { e.stopPropagation(); toggleDropdown('profile'); });
    document.getElementById('notif-panel').addEventListener('click', function (e) { e.stopPropagation(); });
    document.getElementById('profile-menu').addEventListener('click', function (e) { e.stopPropagation(); });
    document.addEventListener('click', function () { closeDropdowns(); });
    document.addEventListener('keydown', function (e) {
      if (e.key === '/' && !/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName)) {
        e.preventDefault();
        document.getElementById('search-input').focus();
      }
    });

    /* delegated navigation + card links */
    document.getElementById('content').addEventListener('click', function (e) {
      var go = e.target.closest('[data-go]');
      if (go) { navigate(go.getAttribute('data-go')); return; }
    });
    document.getElementById('content').addEventListener('keydown', function (e) {
      var go = e.target.closest('[data-go]');
      if (go && e.target === go && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); navigate(go.getAttribute('data-go')); }
    });
  };
})();
