import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, LockKeyhole, Phone } from 'lucide-react'
import { BrandLogo, Button, Icon, Modal } from '../components'
import { useApp } from '../useApp'

function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [remember, setRemember] = useState(true)
  const [error, setError] = useState('')
  const [helpOpen, setHelpOpen] = useState(false)
  const { login, notify } = useApp()
  const navigate = useNavigate()

  const submit = (event) => {
    event.preventDefault()
    if (!username.trim() || !password.trim()) {
      setError('برای ورود نمایشی، نام کاربری و رمز عبور را وارد کن.')
      return
    }
    const label = username.trim() === 'player1' ? 'احمد' : username.trim().split(/[._\s-]/)[0]
    login(label || undefined)
    notify('ورود نمایشی با موفقیت انجام شد.', 'success')
    navigate('/dashboard')
  }

  return (
    <div className="login-page">
      <section className="login-form-side">
        <Link className="login-back" to="/"><Icon name="arrowLeft" size={16} />بازگشت به خانه</Link>
        <div className="login-form-wrap">
          <BrandLogo />
          <div className="login-heading"><span className="login-kicker"><LockKeyhole size={14} />پنل بازیکنان</span><h1>خوش برگشتی.</h1><p>برای دیدن برنامه و مسیر پیشرفتت، وارد پنل شو.</p></div>
          <div className="demo-notice"><span><Icon name="info" size={17} /></span><p><b>نسخهٔ نمایشی فرانت‌اند</b><small>این فرم به بک‌اند وصل نیست؛ هر نام کاربری و رمز غیرخالی وارد پنل نمایشی می‌شود.</small></p></div>
          {error && <div className="form-alert" role="alert">{error}</div>}
          <form className="login-form" onSubmit={submit} noValidate>
            <div className="form-field"><label htmlFor="username">نام کاربری</label><div className="input-wrap"><Icon name="user" size={17} /><input id="username" type="text" value={username} onChange={(event) => { setUsername(event.target.value); setError('') }} placeholder="مثال: player1" autoComplete="username" autoFocus /></div></div>
            <div className="form-field"><label htmlFor="password">رمز عبور</label><div className="input-wrap"><Icon name="shield" size={17} /><input id="password" type={showPassword ? 'text' : 'password'} value={password} onChange={(event) => { setPassword(event.target.value); setError('') }} placeholder="رمز عبور نمایشی" autoComplete="current-password" /><button type="button" className="password-eye" onClick={() => setShowPassword((show) => !show)} aria-label={showPassword ? 'پنهان کردن رمز' : 'نمایش رمز'}>{showPassword ? <EyeOff size={16} /> : <Eye size={16} />}</button></div></div>
            <div className="login-options"><label className="check-control"><input type="checkbox" checked={remember} onChange={(event) => setRemember(event.target.checked)} /><span className="custom-check"><Icon name="check" size={12} /></span>مرا به خاطر بسپار</label><button type="button" className="text-button" onClick={() => setHelpOpen(true)}>فراموشی رمز؟</button></div>
            <Button type="submit" className="btn-block btn-lg">ورود به پنل نمایشی<Icon name="arrowLeft" size={17} /></Button>
          </form>
          <div className="login-divider"><span>راهنما</span></div>
          <div className="login-help-box"><b>بازیکن جدید هستی؟</b><p>برای عضویت حضوری و دریافت اطلاعات ورود واقعی، با دفتر باشگاه تماس بگیر.</p><a href="tel:02188776655"><Phone size={15} /><bdi>۰۲۱-۸۸۷۷۶۶۵۵</bdi></a></div>
          <p className="login-legal">با ورود به نسخهٔ نمایشی، اطلاعات فقط در مرورگر همین دستگاه ذخیره می‌شود.</p>
        </div>
      </section>
      <aside className="login-visual"><img src="/assets/img/hero-bg.jpg" alt="تمرین والیبال در سالن فراز" /><div className="login-visual-overlay" /><Link to="/" className="login-visual-logo"><BrandLogo /></Link><div className="login-visual-content"><span className="login-quote-mark">“</span><div className="eyebrow eyebrow-light"><span className="eyebrow-line" />تمرین امروز، قهرمانی فردا</div><h2>هر جلسه،<br />یک قدم <em>جلوتر.</em></h2><p>در فراز هر تمرین با هدف برگزار می‌شود؛ از گرم‌کردن علمی تا بازی تاکتیکی. اینجا مسیر رشدت را دنبال کن.</p><div className="login-visual-stats"><span><b>۰۹–۲۱</b><small>پاسخگویی پشتیبانی</small></span><span><b>۳+</b><small>جلسه در هفته</small></span><span><b>۱۰۰٪</b><small>پیگیری مربی</small></span></div></div><div className="login-visual-bottom"><span>FARAZ VOLLEYBALL CLUB</span><span>EST. ۲۰۱۴</span></div></aside>
      <Modal open={helpOpen} onClose={() => setHelpOpen(false)} title="بازیابی رمز عبور" subtitle="این فرم به سامانهٔ واقعی وصل نیست." icon="help" size="sm" footer={<Button variant="primary" onClick={() => setHelpOpen(false)}>متوجه شدم</Button>}><div className="help-modal-content"><p>برای بازیابی اطلاعات ورود واقعی با پشتیبانی باشگاه تماس بگیر.</p><a href="tel:02188776655" className="btn btn-soft"><Phone size={16} /><bdi>۰۲۱-۸۸۷۷۶۶۵۵</bdi></a></div></Modal>
    </div>
  )
}

export default LoginPage
