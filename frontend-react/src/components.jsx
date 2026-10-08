import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Activity, ArrowLeft, ArrowRight, ArrowUpLeft, ArrowUpRight, Award, BarChart3, Bell, CalendarCheck2,
  CalendarDays, Check, CheckCircle2, ChevronDown, ChevronLeft, ChevronRight, CircleDot,
  CircleHelp, Clock3, CreditCard, Download, Dumbbell, ExternalLink, FileText, Flame, Headphones,
  Info, LockKeyhole, LogOut, Mail, MapPin, Medal, Menu, MessageCircle, Moon, Phone,
  Search, Send, Settings, ShieldCheck, Sparkles, Star, Sun, Target, TrendingUp, Trophy, User,
  Users, Wallet, X, Zap
} from 'lucide-react'
import { useApp } from './useApp'

const iconMap = {
  activity: Activity, arrowLeft: ArrowLeft, arrowRight: ArrowRight, arrowUpRight: ArrowUpRight,
  award: Award, chart: BarChart3, bell: Bell, calendarCheck: CalendarCheck2, calendar: CalendarDays,
  check: Check, checkCircle: CheckCircle2, chevronDown: ChevronDown, chevronLeft: ChevronLeft,
  chevronRight: ChevronRight, dot: CircleDot, help: CircleHelp, clock: Clock3, card: CreditCard,
  download: Download, dumbbell: Dumbbell, external: ExternalLink, file: FileText, flame: Flame, lock: LockKeyhole,
  support: Headphones, trending: TrendingUp, arrowUpLeft: ArrowUpLeft,
  info: Info, instagram: MessageCircle, logout: LogOut, mail: Mail, pin: MapPin, medal: Medal,
  menu: Menu, message: MessageCircle, moon: Moon, phone: Phone, search: Search, send: Send,
  settings: Settings, shield: ShieldCheck, sparkles: Sparkles, star: Star, sun: Sun,
  target: Target, trophy: Trophy, user: User, users: Users, wallet: Wallet, close: X, zap: Zap
}

export function Icon({ name, size = 18, strokeWidth = 1.8, className = '', ...props }) {
  const Component = iconMap[name] || CircleDot
  return <Component size={size} strokeWidth={strokeWidth} className={className} aria-hidden="true" {...props} />
}

export function BrandLogo({ to = '/', compact = false, onClick }) {
  return (
    <Link className={`brand-logo${compact ? ' brand-compact' : ''}`} to={to} onClick={onClick} aria-label="فراز، خانه">
      <span className="brand-mark" aria-hidden="true">
        <svg viewBox="0 0 40 40" fill="none">
          <circle cx="20" cy="20" r="16" stroke="currentColor" strokeWidth="1.6" />
          <path d="M20 20c-.4-6.6 1.8-11.6 6.1-15M20 20c-5.7 2.7-11.4 2.6-16.1-.1M20 20c3.6 5.1 4.7 10.5 3.5 16" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
          <circle cx="28.5" cy="11.5" r="2" fill="currentColor" />
        </svg>
      </span>
      <span className="brand-copy"><b>FARAZ</b><small>باشگاه والیبال فراز</small></span>
    </Link>
  )
}

export function ThemeToggle({ className = '' }) {
  const { theme, setTheme } = useApp()
  const next = theme === 'dark' ? 'light' : 'dark'
  return (
    <button className={`icon-button theme-toggle${className ? ` ${className}` : ''}`} type="button"
      aria-label={`تغییر به پوستهٔ ${next === 'dark' ? 'تیره' : 'روشن'}`} title="تغییر پوسته"
      onClick={() => setTheme(next)}>
      <Icon name={theme === 'dark' ? 'sun' : 'moon'} size={18} />
    </button>
  )
}

export function Button({ as: Component = 'button', variant = 'primary', size = '', className = '', children, ...props }) {
  return <Component className={`btn btn-${variant}${size ? ` btn-${size}` : ''}${className ? ` ${className}` : ''}`} {...props}>{children}</Component>
}

export function SectionHeading({ eyebrow, title, highlight, description, align = 'center', light = false }) {
  return (
    <div className={`section-heading text-${align}${light ? ' heading-light' : ''}`}>
      {eyebrow && <div className="eyebrow"><span className="eyebrow-line" />{eyebrow}</div>}
      <h2>{title}{highlight && <> <em>{highlight}</em></>}</h2>
      {description && <p>{description}</p>}
    </div>
  )
}

export function Pill({ tone = 'muted', children, icon, className = '' }) {
  return <span className={`pill pill-${tone}${className ? ` ${className}` : ''}`}>{icon && <Icon name={icon} size={13} />}{children}</span>
}

export function StatCard({ icon, label, value, change, tone = 'orange', footnote }) {
  return (
    <article className="stat-card">
      <div className={`stat-icon tone-${tone}`}><Icon name={icon} size={19} /></div>
      <div className="stat-copy"><span>{label}</span><b>{value}</b>
        {change && <small className="stat-change"><Icon name="arrowUpRight" size={13} />{change}</small>}
        {footnote && <small className="stat-footnote">{footnote}</small>}
      </div>
    </article>
  )
}

export function ProgressBar({ value = 0, tone = 'orange', label, showValue = false }) {
  return (
    <div className="progress-wrap">
      {(label || showValue) && <div className="progress-label"><span>{label}</span>{showValue && <b>{value}٪</b>}</div>}
      <div className="progress-track" role="progressbar" aria-valuenow={value} aria-valuemin="0" aria-valuemax="100">
        <span className={`progress-fill tone-${tone}`} style={{ width: `${Math.max(0, Math.min(100, value))}%` }} />
      </div>
    </div>
  )
}

export function Ring({ value = 0, label, detail, tone = 'orange', size = 'large' }) {
  const safe = Math.max(0, Math.min(100, value))
  return (
    <div className={`ring ring-${size} ring-${tone}`} style={{ '--ring-value': `${safe * 3.6}deg` }} role="img" aria-label={`${label || 'درصد'} ${safe} درصد`}>
      <div className="ring-inner"><strong>{label ?? `${safe}٪`}</strong>{detail && <small>{detail}</small>}</div>
    </div>
  )
}

export function PageHeader({ eyebrow, title, description, actions }) {
  return (
    <div className="page-header">
      <div><div className="eyebrow"><span className="eyebrow-line" />{eyebrow}</div><h1>{title}</h1>{description && <p>{description}</p>}</div>
      {actions && <div className="page-header-actions">{actions}</div>}
    </div>
  )
}

export function EmptyState({ icon = 'file', title, text, action }) {
  return <div className="empty-state"><div className="empty-icon"><Icon name={icon} size={23} /></div><b>{title}</b><p>{text}</p>{action}</div>
}

export function Modal({ open, onClose, title, subtitle, icon = 'info', children, footer, size = 'md' }) {
  const closeRef = useRef(null)
  const onCloseRef = useRef(onClose)
  useEffect(() => { onCloseRef.current = onClose }, [onClose])
  useEffect(() => {
    if (!open) return undefined
    const previous = document.activeElement
    const onKeyDown = (event) => { if (event.key === 'Escape') onCloseRef.current?.() }
    document.addEventListener('keydown', onKeyDown)
    document.body.classList.add('modal-open')
    closeRef.current?.focus()
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.classList.remove('modal-open')
      previous?.focus?.()
    }
  }, [open])
  if (!open) return null
  return (
    <div className="modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose?.() }}>
      <section className={`modal-card modal-${size}`} role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <div className="modal-head">
          <div className="modal-title-wrap"><span className="modal-icon"><Icon name={icon} size={19} /></span><div><h2 id="modal-title">{title}</h2>{subtitle && <p>{subtitle}</p>}</div></div>
          <button ref={closeRef} type="button" className="icon-button" onClick={onClose} aria-label="بستن پنجره"><Icon name="close" size={18} /></button>
        </div>
        <div className="modal-body">{children}</div>
        {footer && <div className="modal-footer">{footer}</div>}
      </section>
    </div>
  )
}

export function ClubFooter({ compact = false }) {
  const { notify } = useApp()
  const [email, setEmail] = useState('')
  const [done, setDone] = useState(false)
  const subscribe = (event) => {
    event.preventDefault()
    if (!email.trim() || !/^\S+@\S+\.\S+$/.test(email)) {
      notify('لطفاً یک ایمیل معتبر وارد کن.', 'error')
      return
    }
    setDone(true)
    setEmail('')
    notify('عضویت نمایشی با موفقیت ثبت شد.', 'success')
  }
  if (compact) return <footer className="app-footer"><span>© ۱۴۰۵ باشگاه والیبال فراز</span><span>این پنل فقط یک نمونهٔ فرانت‌اند است.</span></footer>
  return (
    <footer className="site-footer">
      <div className="footer-main">
        <div className="footer-brand-col">
          <BrandLogo />
          <p>خانهٔ والیبال شما؛ تمرین، رقابت و رفاقت زیر یک سقف. از ردهٔ نوجوانان تا سطح حرفه‌ای، مسیر رشدت را با فراز طی کن.</p>
          <div className="footer-socials"><a href="#contact" aria-label="اینستاگرام"><Icon name="instagram" /></a><a href="tel:02188776655" aria-label="تماس"><Icon name="phone" /></a><a href="mailto:club@vc.ir" aria-label="ایمیل"><Icon name="mail" /></a></div>
        </div>
        <div className="footer-col"><h3>دسترسی سریع</h3><Link to="/dashboard">داشبورد بازیکن</Link><Link to="/schedule">برنامهٔ تمرین</Link><Link to="/attendance">حضور و غیاب</Link><Link to="/progress">پیشرفت من</Link><Link to="/tuition">شهریه و پرداخت</Link></div>
        <div className="footer-col"><h3>باشگاه</h3><a href="#about">دربارهٔ ما</a><a href="#pricing">تعرفه‌ها</a><Link to="/insurance">بیمهٔ ورزشی</Link><Link to="/announcements">اخبار و اعلانات</Link><Link to="/support">پشتیبانی</Link></div>
        <div className="footer-col footer-contact"><h3>تماس با ما</h3><span><Icon name="pin" />تهران، بلوار ورزش، مجموعهٔ فراز</span><a href="tel:02188776655"><Icon name="phone" /><bdi>۰۲۱-۸۸۷۷۶۶۵۵</bdi></a><a href="mailto:club@vc.ir"><Icon name="mail" /><bdi>club@vc.ir</bdi></a><span><Icon name="clock" />شنبه تا چهارشنبه، ۱۶ تا ۲۱</span></div>
      </div>
      <div className="footer-newsletter"><div><b>خبرنامهٔ فراز</b><small>{done ? 'ممنون؛ ایمیل شما در این نسخهٔ نمایشی ثبت شد.' : 'برنامهٔ هفته، نتایج مسابقات و خبرهای باشگاه را دنبال کن.'}</small></div><form onSubmit={subscribe} noValidate><label className="sr-only" htmlFor="footer-email">ایمیل</label><input id="footer-email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="ایمیل شما…" autoComplete="email" /><button className="btn btn-primary btn-sm" type="submit">عضویت</button></form></div>
      <div className="footer-bottom"><span>© ۱۴۰۵ باشگاه والیبال فراز — همهٔ حقوق محفوظ است.</span><span>ساخته‌شده با <b>♥</b> برای والیبال ایران</span></div>
    </footer>
  )
}
