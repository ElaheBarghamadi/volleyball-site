import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { AppContext } from './AppContext'
import { announcementsSeed, notificationsSeed, paymentSeed, playerSeed } from './data'

function readStored(key, fallback) {
  try {
    const value = localStorage.getItem(key)
    return value ? JSON.parse(value) : fallback
  } catch {
    return fallback
  }
}

export function AppProvider({ children }) {
  const [theme, setTheme] = useState(() => readStored('faraz-theme', 'dark'))
  const [profile, setProfile] = useState(() => ({ ...playerSeed, ...readStored('faraz-profile', {}) }))
  const [preferences, setPreferences] = useState(() => ({
    trainingReminder: true,
    paymentReminder: true,
    newsReminder: true,
    emailCopy: false,
    twoFactor: false,
    ...readStored('faraz-preferences', {})
  }))
  const [loggedIn, setLoggedIn] = useState(() => Boolean(readStored('faraz-demo-user', null)))
  const [payments, setPayments] = useState(() => readStored('faraz-payments', paymentSeed))
  const [announcements, setAnnouncements] = useState(() => readStored('faraz-announcements', announcementsSeed))
  const [notifications, setNotifications] = useState(() => readStored('faraz-notifications', notificationsSeed))
  const [toast, setToast] = useState(null)
  const toastTimer = useRef(null)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'dark' ? '#080b10' : '#f4f5f7')
    localStorage.setItem('faraz-theme', JSON.stringify(theme))
  }, [theme])

  useEffect(() => localStorage.setItem('faraz-profile', JSON.stringify(profile)), [profile])
  useEffect(() => localStorage.setItem('faraz-preferences', JSON.stringify(preferences)), [preferences])
  useEffect(() => localStorage.setItem('faraz-payments', JSON.stringify(payments)), [payments])
  useEffect(() => localStorage.setItem('faraz-announcements', JSON.stringify(announcements)), [announcements])
  useEffect(() => localStorage.setItem('faraz-notifications', JSON.stringify(notifications)), [notifications])

  useEffect(() => () => clearTimeout(toastTimer.current), [])

  const notify = useCallback((message, type = 'success') => {
    clearTimeout(toastTimer.current)
    setToast({ id: Date.now(), message, type })
    toastTimer.current = setTimeout(() => setToast(null), 3600)
  }, [])

  const login = useCallback((name) => {
    const account = { name: name || `${profile.firstName} ${profile.lastName}`, at: Date.now() }
    localStorage.setItem('faraz-demo-user', JSON.stringify(account))
    setLoggedIn(true)
  }, [profile.firstName, profile.lastName])

  const logout = useCallback(() => {
    localStorage.removeItem('faraz-demo-user')
    setLoggedIn(false)
  }, [])

  const updateProfile = useCallback((next) => setProfile((current) => ({ ...current, ...next })), [])
  const updatePreference = useCallback((key, value) => setPreferences((current) => ({ ...current, [key]: value })), [])
  const markAllRead = useCallback(() => setNotifications((items) => items.map((item) => ({ ...item, unread: false }))), [])

  const value = useMemo(() => ({
    theme, setTheme, profile, updateProfile, preferences, updatePreference,
    loggedIn, login, logout, payments, setPayments, announcements, setAnnouncements,
    notifications, setNotifications, markAllRead, notify
  }), [theme, profile, updateProfile, preferences, updatePreference, loggedIn, login, logout,
    payments, announcements, setAnnouncements, notifications, markAllRead, notify])

  return (
    <AppContext.Provider value={value}>
      {children}
      {toast && (
        <div className={`toast toast-${toast.type}`} role="status" aria-live="polite" key={toast.id}>
          <span className="toast-dot" aria-hidden="true" />
          <span>{toast.message}</span>
          <button className="toast-close" type="button" aria-label="بستن پیام" onClick={() => setToast(null)}>×</button>
        </div>
      )}
    </AppContext.Provider>
  )
}

