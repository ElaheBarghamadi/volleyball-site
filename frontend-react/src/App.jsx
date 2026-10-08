import { StrictMode, useEffect, useState } from 'react'
import { BrowserRouter, NavLink, Outlet, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import { AppProvider } from './context'
import { useApp } from './useApp'
import { Icon, BrandLogo, ThemeToggle, Button, ClubFooter, Modal } from './components'
import {
  LandingPage, LoginPage, DashboardPage, SchedulePage, AttendancePage, TuitionPage,
  InsurancePage, ProgressPage, AnnouncementsPage, ProfilePage, SettingsPage, SupportPage,
  NotFoundPage
} from './pages'

const initialDateLabel = new Intl.DateTimeFormat('fa-IR-u-ca-persian', { weekday: 'long', day: 'numeric', month: 'long' }).format(new Date())

const navigationItems = [
  { to: '/dashboard', label: 'داشبورد', icon: 'activity', group: 'main' },
  { to: '/schedule', label: 'برنامهٔ تمرین', icon: 'calendar', group: 'main' },
  { to: '/attendance', label: 'حضور و غیاب', icon: 'calendarCheck', group: 'main' },
  { to: '/tuition', label: 'شهریه و پرداخت', icon: 'wallet', group: 'main', badge: 'payment' },
  { to: '/insurance', label: 'بیمهٔ ورزشی', icon: 'shield', group: 'main' },
  { to: '/progress', label: 'پیشرفت من', icon: 'chart', group: 'main' },
  { to: '/announcements', label: 'اعلانات', icon: 'zap', group: 'main', badge: 'news' },
  { to: '/profile', label: 'پروفایل', icon: 'user', group: 'account' },
  { to: '/settings', label: 'تنظیمات', icon: 'settings', group: 'account' },
  { to: '/support', label: 'پشتیبانی', icon: 'support', group: 'account' }
]

function Sidebar({ mobile = false, onNavigate, onLogout }) {
  const { profile, payments, announcements } = useApp()
  const pendingPayments = payments.filter((item) => item.status === 'pending').length
  const importantNews = announcements.filter((item) => item.important).length
  const handleLogout = () => {
    onNavigate?.()
    onLogout?.()
  }
  const links = navigationItems.map((item) => {
    const badgeValue = item.badge === 'payment' ? pendingPayments : item.badge === 'news' ? importantNews : 0
    return (
      <NavLink key={item.to} to={item.to} onClick={onNavigate} className={({ isActive }) => `nav-link${isActive ? ' is-active' : ''}`}>
        <Icon name={item.icon} size={19} /><span>{item.label}</span>{badgeValue > 0 && <small className={`nav-badge${item.badge === 'news' ? ' badge-soft' : ''}`}>{badgeValue.toLocaleString('fa-IR')}</small>}
      </NavLink>
    )
  })
  return (
    <aside className={`sidebar${mobile ? ' sidebar-mobile' : ''}`} aria-label="ناوبری پنل" role={mobile ? 'dialog' : undefined} aria-modal={mobile ? 'true' : undefined}>
      <div className="sidebar-top"><BrandLogo onClick={onNavigate} /><button className="sidebar-close icon-button" type="button" onClick={onNavigate} aria-label="بستن منو"><Icon name="close" /></button></div>
      <div className="sidebar-user">
        <span className="avatar avatar-sm">{profile.firstName.slice(0, 1)}</span>
        <span className="sidebar-user-copy"><b>{profile.firstName} {profile.lastName}</b><small>بازیکن · گروه {profile.group}</small></span>
        <span className="online-dot" aria-label="حساب فعال" />
      </div>
      <nav className="sidebar-nav">
        <span className="nav-caption">پنل بازیکن</span>{links.slice(0, 7)}
        <span className="nav-caption nav-caption-account">حساب کاربری</span>{links.slice(7)}
      </nav>
      <div className="sidebar-promo">
        <span className="promo-icon"><Icon name="trophy" size={18} /></span>
        <b>قدم بعدی: سطح حرفه‌ای</b>
        <p>تمرین اختصاصی، آنالیز ویدیویی و آماده‌سازی مسابقه.</p>
        <a href="/#pricing" onClick={onNavigate}>دیدن مسیر رشد <Icon name="arrowLeft" size={14} /></a>
      </div>
      <div className="sidebar-bottom"><span className="sidebar-id">شناسهٔ بازیکن <bdi>{profile.playerId}</bdi></span><button type="button" className="sidebar-logout" onClick={handleLogout}><Icon name="logout" size={17} />خروج از پنل</button></div>
    </aside>
  )
}

function DashboardLayout() {
  const { profile, notifications, markAllRead, notify, logout: clearDemoSession } = useApp()
  const navigate = useNavigate()
  const location = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [notificationOpen, setNotificationOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [logoutOpen, setLogoutOpen] = useState(false)
  const unread = notifications.filter((item) => item.unread).length
  const dateLabel = initialDateLabel
  const matches = navigationItems.filter((item) => !query || item.label.includes(query.trim()))

  useEffect(() => {
    if (!location.hash) window.scrollTo({ top: 0, behavior: 'auto' })
  }, [location.pathname, location.hash])

  useEffect(() => {
    if (!mobileOpen && !notificationOpen && !profileOpen && !searchOpen) return undefined
    const close = (event) => {
      if (event.key === 'Escape') {
        setMobileOpen(false); setNotificationOpen(false); setProfileOpen(false); setSearchOpen(false)
      }
    }
    document.addEventListener('keydown', close)
    return () => document.removeEventListener('keydown', close)
  }, [mobileOpen, notificationOpen, profileOpen, searchOpen])

  const openRoute = (to) => {
    navigate(to)
    setSearchOpen(false)
    setQuery('')
  }

  const handleSearch = (event) => {
    event.preventDefault()
    const target = matches[0]
    if (target) openRoute(target.to)
    else notify('صفحه‌ای با این عنوان پیدا نشد.', 'info')
  }

  const logout = () => {
    setLogoutOpen(false)
    // Keep the mock profile and its local data; only clear the demo session.
    clearDemoSession()
    navigate('/login')
    notify('از پنل نمایشی خارج شدی.', 'info')
  }

  return (
    <div className="dashboard-shell">
      <Sidebar onLogout={() => setLogoutOpen(true)} />
      {mobileOpen && <button type="button" className="mobile-scrim" aria-label="بستن منو" onClick={() => setMobileOpen(false)} />}
      {mobileOpen && <Sidebar mobile onNavigate={() => setMobileOpen(false)} onLogout={() => setLogoutOpen(true)} />}
      <div className="dashboard-main">
        <header className="app-topbar">
          <button type="button" className="icon-button mobile-menu-button" onClick={() => setMobileOpen(true)} aria-label="باز کردن منو"><Icon name="menu" size={21} /></button>
          <div className="topbar-greeting"><span>{dateLabel}</span><b>سلام، {profile.firstName} <i aria-hidden="true">✦</i></b></div>
          <div className="topbar-actions">
            <form className={`topbar-search${searchOpen ? ' search-active' : ''}`} onSubmit={handleSearch} role="search">
              <Icon name="search" size={17} />
              <input aria-label="جستجو در پنل" placeholder="جستجو در پنل…" value={query} onFocus={() => setSearchOpen(true)} onChange={(event) => { setQuery(event.target.value); setSearchOpen(true) }} />
              {query && <button type="button" className="search-clear" aria-label="پاک کردن جستجو" onClick={() => setQuery('')}><Icon name="close" size={15} /></button>}
              {searchOpen && query && <div className="search-popover">{matches.length ? matches.slice(0, 5).map((item) => <button type="button" key={item.to} onClick={() => openRoute(item.to)}><Icon name={item.icon} size={16} /><span>{item.label}</span><Icon name="arrowLeft" size={14} /></button>) : <p>نتیجه‌ای پیدا نشد.</p>}</div>}
            </form>
            <div className="topbar-pop-wrap">
              <button className={`icon-button${notificationOpen ? ' is-selected' : ''}`} type="button" aria-label="اعلان‌ها" aria-expanded={notificationOpen} onClick={() => { setNotificationOpen((open) => !open); setProfileOpen(false); setSearchOpen(false) }}><Icon name="bell" size={18} />{unread > 0 && <i className="notification-dot" />}</button>
              {notificationOpen && <div className="popover notification-popover"><div className="popover-head"><div><b>اعلان‌ها</b><small>{unread ? `${unread.toLocaleString('fa-IR')} پیام خوانده‌نشده` : 'همه پیام‌ها خوانده شده‌اند'}</small></div>{unread > 0 && <button type="button" className="text-button" onClick={markAllRead}>خواندن همه</button>}</div><div className="notification-list">{notifications.map((item) => <div className={`notification-item${item.unread ? ' notification-unread' : ''}`} key={item.id}><span className="notification-icon"><Icon name={item.type} size={16} /></span><span><b>{item.title}</b><small>{item.text}</small><em>{item.time}</em></span></div>)}</div><button type="button" className="popover-link" onClick={() => openRoute('/announcements')}>رفتن به اعلانات <Icon name="arrowLeft" size={14} /></button></div>}
            </div>
            <ThemeToggle />
            <div className="topbar-pop-wrap profile-pop-wrap">
              <button className="profile-trigger" type="button" aria-label="منوی حساب کاربری" aria-expanded={profileOpen} onClick={() => { setProfileOpen((open) => !open); setNotificationOpen(false); setSearchOpen(false) }}><span className="avatar avatar-xs">{profile.firstName.slice(0, 1)}</span><Icon name="chevronDown" size={14} /></button>
              {profileOpen && <div className="popover profile-popover"><div className="profile-pop-head"><span className="avatar">{profile.firstName.slice(0, 1)}</span><span><b>{profile.firstName} {profile.lastName}</b><small>{profile.playerId}</small></span></div><button type="button" onClick={() => openRoute('/profile')}><Icon name="user" size={16} />پروفایل من</button><button type="button" onClick={() => openRoute('/settings')}><Icon name="settings" size={16} />تنظیمات</button><button type="button" onClick={() => openRoute('/support')}><Icon name="support" size={16} />پشتیبانی</button><div className="popover-divider" /><button type="button" className="danger-link" onClick={() => { setLogoutOpen(true); setProfileOpen(false) }}><Icon name="logout" size={16} />خروج از پنل</button></div>}
            </div>
          </div>
        </header>
        {(notificationOpen || profileOpen || searchOpen) && <button className="popover-dismiss" aria-label="بستن منو" onClick={() => { setNotificationOpen(false); setProfileOpen(false); setSearchOpen(false) }} />}
        <main className="app-content"><Outlet /></main>
        <ClubFooter compact />
      </div>
      <Modal open={logoutOpen} onClose={() => setLogoutOpen(false)} title="خروج از پنل" subtitle="حساب آزمایشی فقط در همین مرورگر نگه داشته می‌شود." icon="logout" size="sm" footer={<><Button variant="ghost" onClick={() => setLogoutOpen(false)}>انصراف</Button><Button variant="danger" onClick={logout}>بله، خارج شو</Button></>}>
        <p className="modal-copy">از نسخهٔ نمایشی پنل بازیکن خارج می‌شوی. اطلاعات نمایشی ذخیره‌شده حذف نمی‌شوند.</p>
      </Modal>
    </div>
  )
}

function AppRoutes() {
  const location = useLocation()
  useEffect(() => {
    if (location.hash && location.pathname === '/') {
      requestAnimationFrame(() => document.getElementById(location.hash.slice(1))?.scrollIntoView({ behavior: 'smooth', block: 'start' }))
    }
  }, [location.hash, location.pathname])

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route element={<DashboardLayout key={location.pathname} />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/schedule" element={<SchedulePage />} />
        <Route path="/attendance" element={<AttendancePage />} />
        <Route path="/tuition" element={<TuitionPage />} />
        <Route path="/insurance" element={<InsurancePage />} />
        <Route path="/progress" element={<ProgressPage />} />
        <Route path="/announcements" element={<AnnouncementsPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/support" element={<SupportPage />} />
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}

export default function App() {
  return <StrictMode><AppProvider><BrowserRouter><AppRoutes /></BrowserRouter></AppProvider></StrictMode>
}
