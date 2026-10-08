import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowUpLeft, Check, Clock3, MapPin, Phone, ShieldCheck, Star, Trophy } from 'lucide-react'
import { coaches, features, faqs, membershipSteps, pricingPlans, testimonials, WEEKDAYS } from '../data'
import { BrandLogo, ClubFooter, Icon, SectionHeading, ThemeToggle } from '../components'
import { useApp } from '../useApp'

const anchors = [
  ['about', 'دربارهٔ ما'], ['steps', 'شروع'], ['schedule', 'برنامه'], ['gallery', 'گالری'],
  ['coaches', 'مربیان'], ['pricing', 'تعرفه‌ها'], ['faq', 'سوالات']
]

function LandingHeader() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { loggedIn } = useApp()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    const onKey = (event) => { if (event.key === 'Escape') setMenuOpen(false) }
    window.addEventListener('scroll', onScroll, { passive: true })
    document.addEventListener('keydown', onKey)
    return () => { window.removeEventListener('scroll', onScroll); document.removeEventListener('keydown', onKey) }
  }, [])

  useEffect(() => {
    document.body.classList.toggle('drawer-open', menuOpen)
    return () => document.body.classList.remove('drawer-open')
  }, [menuOpen])

  const close = () => setMenuOpen(false)
  return (
    <>
      <header className={`landing-header${scrolled ? ' header-scrolled' : ''}`}>
        <div className="landing-header-inner">
          <BrandLogo />
          <nav className="landing-nav" aria-label="منوی اصلی">{anchors.map(([id, label]) => <a key={id} href={`#${id}`}>{label}</a>)}</nav>
          <div className="landing-header-actions">
            <ThemeToggle />
            <button className="icon-button landing-menu-button" type="button" aria-label="باز کردن منو" aria-expanded={menuOpen} onClick={() => setMenuOpen(true)}><Icon name="menu" size={20} /></button>
            {loggedIn ? <Link className="btn btn-outline header-login-secondary" to="/dashboard">داشبورد</Link> : <Link className="btn btn-outline header-login-secondary" to="/login">ورود بازیکنان</Link>}
            <Link className="btn btn-primary" to={loggedIn ? '/dashboard' : '/login'}>{loggedIn ? 'ورود به پنل' : 'ورود به پنل'}<Icon name="arrowLeft" size={16} /></Link>
          </div>
        </div>
      </header>
      {menuOpen && <div className="landing-drawer-wrap">
        <button className="landing-drawer-scrim" type="button" aria-label="بستن منو" onClick={close} />
        <aside className="landing-drawer" role="dialog" aria-modal="true" aria-label="منوی سایت">
          <div className="drawer-head"><BrandLogo onClick={close} /><button className="icon-button" type="button" onClick={close} aria-label="بستن منو"><Icon name="close" /></button></div>
          <nav>{anchors.map(([id, label]) => <a key={id} href={`#${id}`} onClick={close}>{label}<Icon name="arrowLeft" size={16} /></a>)}<a href="#contact" onClick={close}>تماس با ما<Icon name="arrowLeft" size={16} /></a></nav>
          <Link className="btn btn-primary btn-block" to={loggedIn ? '/dashboard' : '/login'} onClick={close}>{loggedIn ? 'رفتن به داشبورد' : 'ورود بازیکنان'}<Icon name="arrowLeft" size={16} /></Link>
          <p className="drawer-note">شنبه تا چهارشنبه، ۱۶ تا ۲۱<br /><bdi>۰۲۱-۸۸۷۷۶۶۵۵</bdi></p>
        </aside>
      </div>}
    </>
  )
}

function Hero() {
  const { loggedIn } = useApp()
  return (
    <section className="hero-section" aria-labelledby="hero-title">
      <div className="hero-glow" aria-hidden="true" />
      <div className="hero-grid">
        <div className="hero-copy">
          <div className="hero-kicker"><span className="live-pulse" />پذیرش فصل جدید · ظرفیت محدود</div>
          <h1 id="hero-title">جایی که <em>والیبال</em><br />جدی گرفته می‌شود.</h1>
          <p className="hero-lede">از اولین سرو تا اسپک حرفه‌ای؛ با مربیان باتجربه، برنامهٔ علمی و فضایی صمیمی، مسیر رشدت را کوتاه‌تر کن.</p>
          <div className="hero-actions"><Link className="btn btn-primary btn-lg" to={loggedIn ? '/dashboard' : '/login'}>{loggedIn ? 'ورود به داشبورد' : 'ورود بازیکنان'}<Icon name="arrowLeft" size={18} /></Link><a className="btn btn-soft btn-lg" href="#pricing">دیدن تعرفه‌ها<Icon name="arrowUpLeft" size={17} /></a></div>
          <div className="hero-social-proof"><div className="avatar-stack" aria-hidden="true"><span>س</span><span>م</span><span>ن</span><span>پ</span></div><div><b>مورد اعتماد +۴۵۰ خانواده</b><small><span className="stars">★★★★★</span> ۴٫۹ از ۵ · رضایت بازیکنان و والدین</small></div></div>
          <div className="hero-trust-note"><ShieldCheck size={15} /> عضویت حضوری با مشاورهٔ رایگان · مناسب نوجوانان تا بزرگسالان</div>
          <div className="hero-stats"><div><b>+۴۵۰</b><span>بازیکن فعال</span></div><div><b>۱۲</b><span>سال سابقه</span></div><div><b>۸</b><span>مربی رسمی</span></div><div><b>۴</b><span>ردهٔ سنی</span></div></div>
        </div>
        <div className="hero-visual">
          <div className="hero-image-frame"><img src="/assets/img/hero-bg.jpg" alt="بازیکن والیبال در حال اسپک در سالن" fetchPriority="high" /><div className="hero-image-shade" />
            <div className="image-label"><span className="image-label-dot" /><span><b>تمرین با هدف</b><small>مسیر رشدت از همین‌جا شروع می‌شود</small></span><Icon name="arrowUpLeft" size={18} /></div>
          </div>
          <div className="hero-float-card hero-next-card"><span className="float-icon"><Icon name="calendar" size={18} /></span><span><small>تمرین بعدی</small><b>شنبه · ساعت ۱۸:۰۰</b></span><span className="float-live">پیش‌رو</span></div>
          <div className="hero-float-card hero-rating-card"><span className="rating-number">۹۲٪</span><span><b>رضایت خانواده‌ها</b><small>بر پایهٔ بازخورد اعضا</small></span><span className="rating-star"><Star size={16} fill="currentColor" /></span></div>
          <div className="hero-corner-note"><span>F</span><small>FARAZ<br />VOLLEYBALL CLUB</small></div>
        </div>
      </div>
      <div className="hero-bottom-line"><span>خانهٔ والیبال تو</span><span className="hero-line" /><span>از اولین دریافت تا آخرین امتیاز</span></div>
    </section>
  )
}

function LandingPage() {
  const { notify } = useApp()
  const weekRows = [
    { day: 0, title: 'نوجوانان', time: '۱۶:۰۰ – ۱۷:۳۰', hall: 'سالن اصلی', coach: 'حسینی' },
    { day: 0, title: 'جوانان', time: '۱۸:۰۰ – ۱۹:۳۰', hall: 'سالن اصلی', coach: 'رضایی' },
    { day: 1, title: 'بانوان · پایه', time: '۱۶:۰۰ – ۱۷:۳۰', hall: 'سالن تمرینی', coach: 'موسوی' },
    { day: 2, title: 'نوجوانان', time: '۱۸:۰۰ – ۱۹:۳۰', hall: 'سالن اصلی', coach: 'حسینی' },
    { day: 3, title: 'جوانان و بزرگسالان', time: '۱۷:۳۰ – ۱۹:۳۰', hall: 'سالن اصلی', coach: 'رضایی' },
    { day: 4, title: 'مسابقهٔ درون‌باشگاهی', time: '۱۷:۰۰ – ۱۹:۰۰', hall: 'سالن اصلی', coach: 'کادر فنی' },
    { day: 5, title: 'تعطیل · اردو با اعلام قبلی', time: '—', hall: '—', coach: '—', off: true }
  ]
  return (
    <div className="landing-page">
      <LandingHeader />
      <main>
        <Hero />
        <section className="trust-strip" aria-label="همکاری‌ها و افتخارات"><span>همراه با مسیرهای حرفه‌ای ورزش</span><div><b>فدراسیون والیبال</b><b>هیئت والیبال تهران</b><b>لیگ‌های پایه</b><b>بیمهٔ ورزشی</b></div></section>

        <section className="site-section" id="about"><div className="section-container"><SectionHeading eyebrow="چرا فراز" title="بیشتر از یک سالن؛" highlight="یک مسیر رشد" description="تمرین، یادگیری و رفاقت کنار هم؛ با استاندارد حرفه‌ای و حال‌وهوای خانوادگی." />
          <div className="feature-grid">{features.map((feature, index) => <article className="feature-card" key={feature.title}><span className={`feature-icon feature-tone-${index}`}><Icon name={feature.icon} size={21} /></span><div className="feature-index">۰{index + 1}</div><h3>{feature.title}</h3><p>{feature.text}</p><a href={index === 0 ? '#coaches' : index === 1 ? '#schedule' : index === 2 ? '#gallery' : '#contact'}>بیشتر بدان <Icon name="arrowLeft" size={14} /></a></article>)}</div>
        </div></section>

        <section className="site-section section-alt" id="steps"><div className="section-container"><SectionHeading eyebrow="مسیر عضویت" title="در چهار قدم" highlight="به فراز بپیوند" description="بدون فرم‌های پیچیده؛ از اولین بازدید تا شروع تمرین، کنارت هستیم." />
          <div className="steps-grid">{membershipSteps.map((step, index) => <article className="step-card" key={step.n}><div className="step-top"><span>{step.n}</span>{index < membershipSteps.length - 1 && <i className="step-connector" />}</div><h3>{step.title}</h3><p>{step.text}</p></article>)}</div>
        </div></section>

        <section className="site-section" id="schedule"><div className="section-container"><SectionHeading eyebrow="برنامهٔ هفتگی" title="ساعت و" highlight="برنامهٔ تمرین" description="سانس‌ها با توجه به ردهٔ سنی و سطح بازیکنان برگزار می‌شوند." />
          <div className="schedule-preview"><div className="schedule-table"><div className="schedule-table-head"><span>روز و گروه</span><span>زمان</span></div>{weekRows.map((row, index) => <div className={`schedule-row${row.off ? ' schedule-row-off' : ''}`} key={`${row.day}-${index}`}><div className="schedule-session-day"><span className={`schedule-day-mark${row.off ? ' mark-muted' : ''}`}>{WEEKDAYS[row.day].slice(0, 1)}</span><span><b>{WEEKDAYS[row.day]} · {row.title}</b><small>{row.hall}{row.coach !== '—' ? ` · مربی ${row.coach}` : ''}</small></span></div><span className="schedule-time">{row.time}</span></div>)}</div>
            <aside className="schedule-aside"><span className="schedule-aside-icon"><Icon name="clock" size={21} /></span><div className="eyebrow eyebrow-light"><span className="eyebrow-line" />نکات مهم</div><h3>با آمادگی وارد زمین شو.</h3><p>۱۵ دقیقه زودتر حاضر باش؛ کفش سالنی، بطری آب و کارت بیمه را فراموش نکن.</p><ul><li><Check size={15} />تغییر سانس با هماهنگی پشتیبانی</li><li><Check size={15} />برنامهٔ به‌روز در پنل بازیکن</li><li><Check size={15} />تعطیلی رسمی پنجشنبه و جمعه</li></ul><a className="btn btn-white" href="#contact">مشاورهٔ سانس مناسب<Icon name="arrowLeft" size={15} /></a><small className="schedule-phone"><Phone size={13} />پاسخگویی: ۱۶ تا ۲۱ · <bdi>۰۲۱-۸۸۷۷۶۶۵۵</bdi></small></aside>
          </div>
        </div></section>

        <section className="achievement-section"><div className="section-container achievement-inner"><div className="achievement-copy"><div className="eyebrow eyebrow-light"><span className="eyebrow-line" />کارنامهٔ فراز</div><h2>۱۲ سال<br />ساختن <em>قهرمان</em></h2><p>از استعدادیابی تا سکوی قهرمانی؛ فراز فقط تمرین نمی‌دهد، برای هر بازیکن مسیر می‌سازد.</p><a className="btn btn-outline-light" href="#gallery">دیدن لحظه‌های فراز<Icon name="arrowLeft" size={16} /></a></div><div className="achievement-stats"><article><b>+۲۳</b><span>مقام استانی و کشوری</span><i><Trophy size={16} /></i></article><article><b>+۱۲۰</b><span>بازیکن در تیم‌های پایه</span><i><Icon name="users" size={17} /></i></article><article><b>۹۲٪</b><span>ماندگاری بازیکنان</span><i><Icon name="activity" size={17} /></i></article><article><b>۴</b><span>ردهٔ سنی فعال</span><i><Icon name="medal" size={17} /></i></article></div></div></section>

        <section className="site-section" id="gallery"><div className="section-container"><SectionHeading eyebrow="لحظه‌های فراز" title="هر قاب،" highlight="یک داستان" description="گوشه‌ای از تمرین‌ها، مسابقه‌ها و رفاقت‌هایی که در زمین شکل می‌گیرند." />
          <div className="gallery-grid">{['تمرین نوجوانان', 'مسابقهٔ جوانان', 'اردوی تیم', 'سالن اصلی', 'بدنسازی و پرش', 'جشن پایان فصل'].map((title, index) => <button className={`gallery-card gallery-card-${index + 1}`} type="button" key={title} onClick={() => notify(`تصویر «${title}» در گالری نمایشی انتخاب شد.`, 'info')} aria-label={`مشاهدهٔ تصویر ${title}`}><img src="/assets/img/hero-bg.jpg" alt="" loading="lazy" /><span className="gallery-overlay" /><span className="gallery-label"><b>{title}</b><small>{['تمرین هفتگی', 'لیگ تهران', 'اردوی تیمی', 'کفپوش استاندارد', 'قدرت و پرش', 'اهدای مدال'][index]}</small></span><span className="gallery-arrow"><ArrowUpLeft size={17} /></span></button>)}</div>
        </div></section>

        <section className="site-section section-alt" id="coaches"><div className="section-container"><SectionHeading eyebrow="کادر فنی" title="مربیان" highlight="همراه شما" description="کنار شما در هر سرویس، دریافت و امتیاز؛ با دانش روز و اخلاق حرفه‌ای." />
          <div className="coach-grid">{coaches.map((item) => <article className="coach-card" key={item.name}><div className={`coach-avatar coach-${item.tone}`}>{item.initials}<span className="coach-online" /></div><span className="coach-role">{item.role}</span><h3>{item.name}</h3><small className="coach-focus">{item.focus}</small><p>{item.text}</p><div className="coach-card-bottom"><span><Icon name="star" size={14} fill="currentColor" />امتیاز {item.score}</span><span><Icon name="award" size={14} />کادر رسمی فراز</span></div></article>)}</div>
        </div></section>

        <section className="site-section"><div className="section-container"><SectionHeading eyebrow="صدای بازیکنان" title="خانواده‌های فراز" highlight="چه می‌گویند؟" description="بازخوردهایی از بازیکنان و خانواده‌هایی که مسیر رشد را با ما شروع کرده‌اند." />
          <div className="testimonial-grid">{testimonials.map((item) => <article className="testimonial-card" key={item.name}><div className="testimonial-top"><div className="testimonial-stars" aria-label="۵ از ۵"><Star /><Star /><Star /><Star /><Star /></div><span className="quote-mark">“</span></div><p>{item.quote}</p><div className="testimonial-author"><span className={`author-avatar author-${item.tone}`}>{item.initials}</span><span><b>{item.name}</b><small>{item.group}</small></span><span className="verified-mark"><Check size={13} /></span></div></article>)}</div>
        </div></section>

        <section className="site-section section-alt" id="pricing"><div className="section-container"><SectionHeading eyebrow="شهریهٔ شفاف" title="یک انتخاب روشن برای" highlight="قدم بعدی" description="پرداخت ماهانه، برنامهٔ مشخص و بدون هزینهٔ پنهان؛ بیمهٔ ورزشی طبق شرایط باشگاه." />
          <div className="pricing-grid">{pricingPlans.map((plan) => <article className={`pricing-card${plan.popular ? ' pricing-popular' : ''}`} key={plan.title}>{plan.popular && <span className="popular-tag"><Star size={13} fill="currentColor" />محبوب‌ترین</span>}<div className="pricing-plan-eyebrow">{plan.audience}</div><h3>{plan.title}</h3><div className="pricing-price"><b>{plan.price}</b><span>تومان <small>/ {plan.cadence}</small></span></div><p className="pricing-detail">{plan.detail}</p><ul>{plan.features.map((feature) => <li key={feature}><Check size={15} />{feature}</li>)}</ul><a href="#contact" className={`btn ${plan.popular ? 'btn-primary' : 'btn-outline'} btn-block`}>مشاورهٔ ثبت‌نام<Icon name="arrowLeft" size={16} /></a><small className="pricing-note">ثبت‌نام حضوری · مشاورهٔ اولیه رایگان</small></article>)}</div>
          <p className="pricing-disclaimer">برای اطلاع از شرایط دقیق هر گروه با دفتر باشگاه تماس بگیر. <a href="#faq">پاسخ پرسش‌های پرتکرار<Icon name="arrowLeft" size={13} /></a></p>
        </div></section>

        <section className="site-section" id="faq"><div className="section-container"><SectionHeading eyebrow="سوالات متداول" title="پاسخ پرسش‌های" highlight="شما" description="چیزی که می‌خواهی بدانی اینجاست؛ اگر پاسخ را پیدا نکردی با ما تماس بگیر." /><div className="faq-list">{faqs.map((item, index) => <details className="faq-item" key={item.q} open={index === 0}><summary>{item.q}<span><Icon name="chevronDown" size={17} /></span></summary><p>{item.a}</p></details>)}</div></div></section>

        <section className="site-section section-alt" id="contact"><div className="section-container contact-grid"><div className="contact-copy"><div className="eyebrow"><span className="eyebrow-line" />تماس و آدرس</div><h2>بیا از نزدیک <em>ببین</em></h2><p>شنبه تا چهارشنبه از ساعت ۱۶ تا ۲۱ در سالن هستیم. قبل از مراجعه تماس بگیر تا سانس مناسب را هماهنگ کنیم.</p><div className="contact-cards"><div className="contact-card"><span><MapPin size={19} /></span><div><b>آدرس باشگاه</b><small>تهران، بلوار ورزش، مجموعهٔ والیبال فراز</small></div></div><div className="contact-card"><span><Phone size={19} /></span><div><b>تلفن دفتر</b><small><bdi>۰۲۱-۸۸۷۷۶۶۵۵</bdi> · پشتیبانی</small></div></div><div className="contact-card"><span><Icon name="mail" size={19} /></span><div><b>ایمیل</b><small><bdi>club@vc.ir</bdi></small></div></div><div className="contact-card"><span><Clock3 size={19} /></span><div><b>ساعت کاری</b><small>شنبه تا چهارشنبه، ۱۶ تا ۲۱</small></div></div></div><div className="contact-actions"><a href="tel:02188776655" className="btn btn-primary"><Phone size={16} />تماس با باشگاه</a><a className="btn btn-outline" href="https://maps.google.com/?q=Tehran+Volleyball" target="_blank" rel="noreferrer">مسیریابی<Icon name="external" size={15} /></a></div></div><div className="map-card"><div className="map-art" aria-hidden="true"><span className="map-street street-a" /><span className="map-street street-b" /><span className="map-street street-c" /><span className="map-park"><i /></span><span className="map-pin"><MapPin size={25} fill="currentColor" /></span><span className="map-chip">مجموعهٔ والیبال فراز</span></div><div className="map-caption"><span><b>سالن اصلی فراز</b><small>بلوار ورزش · ۵۰ متر بعد از پارک</small></span><a href="https://maps.google.com/?q=Tehran+Volleyball" target="_blank" rel="noreferrer" aria-label="باز کردن نقشه"><ArrowUpLeft size={18} /></a></div></div></div></section>

        <section className="cta-section"><div className="section-container"><div className="cta-card"><div className="cta-orbit cta-orbit-one" /><div className="cta-orbit cta-orbit-two" /><span className="cta-kicker"><Icon name="sparkles" size={15} />قدم اول، یک تماس ساده</span><h2>آماده‌ای به <em>فراز</em> بپیوندی؟</h2><p>برای بازدید از سالن و مشاورهٔ رایگان، همین حالا تماس بگیر یا حضوری سر بزن.</p><div className="cta-badges"><span><Check size={14} />مشاورهٔ رایگان</span><span><Check size={14} />ارزیابی سطح</span><span><Check size={14} />راهنمای انتخاب گروه</span></div><div className="cta-actions"><a href="tel:02188776655" className="btn btn-primary btn-lg"><Phone size={17} />۰۲۱-۸۸۷۷۶۶۵۵</a><Link to="/login" className="btn btn-outline-light btn-lg">ورود بازیکنان<Icon name="arrowLeft" size={16} /></Link></div></div></div></section>
      </main>
      <ClubFooter />
      <a href="#top" className="back-to-top" aria-label="رفتن به ابتدای صفحه" onClick={(event) => { event.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }) }}><Icon name="arrowLeft" size={17} /></a>
    </div>
  )
}

export default LandingPage
