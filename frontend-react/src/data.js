export const WEEKDAYS = ['شنبه', 'یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنجشنبه', 'جمعه']
export const WEEKDAYS_SHORT = ['ش', 'ی', 'د', 'س', 'چ', 'پ', 'ج']

export const playerSeed = {
  firstName: 'احمد',
  lastName: 'احمدی',
  role: 'بازیکن',
  position: 'دریافت‌کننده قدرتی',
  level: 'پیشرفته',
  group: 'نوجوانان',
  birth: '۱۳۸۸/۰۴/۱۲',
  phone: '0912 345 6789',
  email: 'ahmad.ahmadi@vc.ir',
  city: 'تهران',
  playerId: 'VC-1405-023',
  number: '۲۳',
  joined: '۱۴۰۲'
}

export const coach = {
  name: 'سارا احمدی',
  role: 'مربی گروه پیشرفته',
  phone: '0912 118 4477',
  email: 's.ahmadi@vc.ir',
  experience: '۱۲ سال سابقه مربی‌گری',
  certificate: 'مدرک درجه ۲ مربی‌گری فدراسیون والیبال',
  bio: 'تمرکز اصلی سارا روی تکنیک دریافت، سرویس پرشی و ساختن نظم تیمی است. برنامه تمرینی هر هفته با توجه به نیاز بازیکنان تنظیم می‌شود.',
  note: 'تمرکز این هفته: دریافت سرویس و انتقال سریع به ضدحمله.'
}

export const weekSessions = [
  { id: 'saturday', day: 0, start: '۱۸:۰۰', end: '۱۹:۳۰', title: 'تمرین تکنیک و دریافت', group: 'نوجوانان', hall: 'سالن اصلی باشگاه', coach: 'سارا احمدی', color: 'orange', spots: 4 },
  { id: 'monday', day: 2, start: '۱۸:۰۰', end: '۱۹:۳۰', title: 'تمرین تیمی و تاکتیک', group: 'نوجوانان', hall: 'سالن اصلی باشگاه', coach: 'سارا احمدی', color: 'blue', spots: 6 },
  { id: 'wednesday', day: 4, start: '۱۹:۰۰', end: '۲۰:۳۰', title: 'بدنسازی و آمادگی جسمانی', group: 'نوجوانان', hall: 'سالن بدنسازی', coach: 'محمد رضایی', color: 'green', spots: 8 },
  { id: 'women', day: 1, start: '۱۶:۰۰', end: '۱۷:۳۰', title: 'تمرین پایه بانوان', group: 'بانوان', hall: 'سالن تمرینی', coach: 'مریم موسوی', color: 'pink', spots: 3 },
  { id: 'youth', day: 2, start: '۱۹:۴۵', end: '۲۱:۱۵', title: 'تمرین جوانان', group: 'جوانان', hall: 'سالن اصلی باشگاه', coach: 'محمد رضایی', color: 'blue', spots: 5 },
  { id: 'match', day: 3, start: '۱۷:۰۰', end: '۱۹:۰۰', title: 'مسابقه درون‌باشگاهی', group: 'همه گروه‌ها', hall: 'سالن اصلی باشگاه', coach: 'کادر فنی', color: 'violet', spots: 0 }
]

export const features = [
  { icon: 'users', title: 'مربیان باتجربه', text: 'کادری حرفه‌ای با مدارک رسمی فدراسیون و تجربهٔ کار در لیگ و استعدادیابی.' },
  { icon: 'calendar', title: 'برنامهٔ منظم', text: 'سانس‌های شفاف، حضور و غیاب دقیق و گزارش پیشرفت ماهانه برای هر بازیکن.' },
  { icon: 'trophy', title: 'مسیر رشد واقعی', text: 'از یادگیری پایه تا تیم مسابقاتی؛ با بدنسازی، آنالیز و هدف‌گذاری مرحله‌به‌مرحله.' },
  { icon: 'shield', title: 'سالن امن و استاندارد', text: 'کفپوش مناسب، رختکن مرتب و سانس‌بندی مجزا برای بانوان و آقایان.' }
]

export const membershipSteps = [
  { n: '۰۱', title: 'بازدید و مشاوره', text: 'حضوری بیا تا سطح و هدف ورزشی‌ات را با هم بررسی کنیم.' },
  { n: '۰۲', title: 'انتخاب گروه', text: 'بر اساس سن، تجربه و زمان مناسب، گروه تمرینی‌ات را انتخاب می‌کنیم.' },
  { n: '۰۳', title: 'شروع تمرین', text: 'با برنامهٔ مشخص و مربی همراه، تمرین‌ها را شروع کن.' },
  { n: '۰۴', title: 'رشد و رقابت', text: 'پیشرفتت را دنبال کن و برای حضور در مسابقات آماده شو.' }
]

export const pricingPlans = [
  { title: 'پایه', audience: 'نوجوانان', price: '۱٬۲۹۰٬۰۰۰', cadence: 'ماهانه', detail: '۳ جلسه در هفته · ۹۰ دقیقه', features: ['گروه حداکثر ۱۴ نفره', 'گزارش پیشرفت ماهانه', 'بیمهٔ ورزشی', 'مسابقهٔ درون‌باشگاهی'] },
  { title: 'پیشرفته', audience: 'جوانان', price: '۱٬۵۹۰٬۰۰۰', cadence: 'ماهانه', detail: '۳ جلسه + ۱ جلسه بدنسازی', popular: true, features: ['گروه حداکثر ۱۲ نفره', 'آنالیز ویدیویی', 'اعزام به مسابقه', 'برنامهٔ بدنسازی اختصاصی'] },
  { title: 'حرفه‌ای', audience: 'بزرگسالان', price: '۱٬۸۹۰٬۰۰۰', cadence: 'ماهانه', detail: '۴ جلسه · تیم مسابقاتی', features: ['تمرین تاکتیکی', 'بدنسازی اختصاصی', 'لیگ و تورنمنت', 'پشتیبانی تغذیه'] }
]

export const faqs = [
  { q: 'برای شروع باید والیبال بلد باشم؟', a: 'خیر؛ گروه‌های پایه از سطح مقدماتی شروع می‌شوند. جلسهٔ مشاوره برای ارزیابی سطح و انتخاب گروه مناسب در نظر گرفته شده است.' },
  { q: 'سانس بانوان و آقایان جداست؟', a: 'بله. سانس‌ها جداگانه برگزار می‌شوند و مربی هر گروه متناسب با برنامهٔ باشگاه انتخاب می‌شود.' },
  { q: 'شهریه را چطور پرداخت کنم؟', a: 'پرداخت شهریه طبق روال باشگاه و با هماهنگی دفتر انجام می‌شود. اطلاعات پنل فقط در این نسخهٔ نمایشی و به‌صورت محلی است.' },
  { q: 'اگر یک جلسه را از دست بدهم چه می‌شود؟', a: 'برای هماهنگی جلسهٔ جبرانی با مربی یا پشتیبانی تماس بگیر؛ امکان جبران به ظرفیت و برنامهٔ همان هفته بستگی دارد.' },
  { q: 'چطور وارد پنل بازیکن شوم؟', a: 'در نسخهٔ فرانت‌اند، ورود صرفاً نمایشی است و به سرویس یا سرور وصل نمی‌شود. برای استفادهٔ واقعی به بک‌اند نیاز خواهد بود.' }
]

export const coaches = [
  { initials: 'ح', name: 'استاد حسینی', role: 'سرمربی · درجهٔ ۱', focus: 'نوجوانان · استعدادیابی', text: '۱۵ سال سابقهٔ لیگ و پایه‌سازی تکنیک؛ با تمرکز بر یادگیری درست و پایدار.', tone: 'orange', score: '۴٫۹' },
  { initials: 'ر', name: 'مربی رضایی', role: 'مربی جوانان · بدنساز', focus: 'بدنسازی · آنالیز ویدیویی', text: 'متخصص پرش و اسپک؛ کمک به ارتقای آمادگی و تاکتیک تیمی.', tone: 'blue', score: '۵٫۰' },
  { initials: 'م', name: 'مربی موسوی', role: 'مربی بانوان', focus: 'بانوان · پایه تا پیشرفته', text: 'قهرمان سابق و مربی پایه با رویکردی مدرن، امن و انگیزشی.', tone: 'pink', score: '۴٫۹' }
]

export const testimonials = [
  { initials: 'م', name: 'مادر سامیار', group: '۲ ترم حضور', quote: '«پسرم از پایه شروع کرد و بعد از یک ترم اعتمادبه‌نفس و مهارتش واقعاً بیشتر شد.»', tone: 'orange' },
  { initials: 'آ', name: 'آرش', group: 'جوانان · کاپیتان تیم', quote: '«جو تیم صمیمی است، اما تمرین‌ها هدفمند و حرفه‌ای‌اند. آنالیز و بدنسازی خیلی کمکم کرد.»', tone: 'blue' },
  { initials: 'ن', name: 'نگار', group: 'بانوان · یک سال حضور', quote: '«کیفیت سالن و توجه مربی‌ها برایم مهم بود؛ از انتخاب فراز راضی‌ام.»', tone: 'pink' }
]

export const announcementsSeed = [
  { id: 'a1', category: 'مهم', important: true, date: 'دیروز', title: 'برنامهٔ تمرینات هفتهٔ آینده منتشر شد', text: 'برنامهٔ کامل هفته شامل تمرین تکنیک، تمرین تیمی و بدنسازی در بخش برنامه تمرین قابل مشاهده است.' },
  { id: 'a2', category: 'مسابقه', important: false, date: '۳ روز پیش', title: 'مسابقهٔ دوستانه با باشگاه آرمان', text: 'مسابقهٔ دوستانهٔ این ماه در سالن اصلی برگزار می‌شود. جزئیات ساعت و فهرست بازیکنان را از مربی گروه دریافت کنید.' },
  { id: 'a3', category: 'پرداخت', important: false, date: '۶ روز پیش', title: 'یادآوری مهلت شهریهٔ ماه جاری', text: 'برای حفظ وضعیت عضویت، لطفاً پرداخت را طبق موعد درج‌شده در پنل پیگیری کنید.' },
  { id: 'a4', category: 'تمرین', important: false, date: '۱۰ روز پیش', title: 'کارگاه تخصصی سرویس پرشی', text: 'کارگاه سرویس پرشی با ظرفیت محدود و اولویت اعضای گروه پیشرفته برگزار خواهد شد.' },
  { id: 'a5', category: 'عمومی', important: false, date: '۲ هفته پیش', title: 'به‌روزرسانی سالن بدنسازی', text: 'تجهیزات جدید بدنسازی در دسترس گروه‌های ثبت‌نام‌شده قرار گرفته است.' }
]

export const notificationsSeed = [
  { id: 'n1', type: 'calendar', title: 'یادآوری تمرین', text: 'تمرین تکنیک، شنبه ساعت ۱۸:۰۰ برگزار می‌شود.', time: 'امروز · ۰۹:۰۰', unread: true },
  { id: 'n2', type: 'megaphone', title: 'اطلاعیهٔ باشگاه', text: 'برنامهٔ هفتهٔ آینده منتشر شد.', time: 'دیروز · ۱۸:۲۰', unread: true },
  { id: 'n3', type: 'wallet', title: 'شهریهٔ ماه جاری', text: 'موعد پرداخت بعدی را در بخش شهریه ببین.', time: '۳ روز پیش', unread: false }
]

export const paymentSeed = [
  { id: 'p1', title: 'شهریهٔ مهر ۱۴۰۵', kind: 'شهریهٔ ماهانه', amount: 1590000, due: '۱۵ مهر ۱۴۰۵', status: 'pending' },
  { id: 'p2', title: 'شهریهٔ شهریور ۱۴۰۵', kind: 'شهریهٔ ماهانه', amount: 1590000, due: '۱۵ شهریور ۱۴۰۵', status: 'paid', paidOn: '۱۲ شهریور ۱۴۰۵' },
  { id: 'p3', title: 'هزینهٔ مسابقهٔ دوستانه', kind: 'مسابقه', amount: 450000, due: '۲۰ شهریور ۱۴۰۵', status: 'paid', paidOn: '۱۸ شهریور ۱۴۰۵' },
  { id: 'p4', title: 'کارگاه سرویس پرشی', kind: 'کارگاه', amount: 380000, due: '۱۰ مرداد ۱۴۰۵', status: 'expired' }
]

export const skillStats = [
  { name: 'دریافت', value: 82, color: 'orange' },
  { name: 'سرویس', value: 76, color: 'blue' },
  { name: 'دفاع', value: 88, color: 'green' },
  { name: 'اسپک', value: 71, color: 'violet' },
  { name: 'پاس', value: 79, color: 'pink' },
  { name: 'پرش', value: 68, color: 'yellow' }
]

export const achievementList = [
  { icon: 'flame', title: 'استریک ۵ جلسه', subtitle: '۵ جلسهٔ پیاپی بدون غیبت', unlocked: true },
  { icon: 'medal', title: 'بازیکن منظم', subtitle: 'حضور بالاتر از ۸۰٪', unlocked: true },
  { icon: 'target', title: 'سرویس هدفمند', subtitle: 'تکمیل چالش سرویس', unlocked: false },
  { icon: 'trophy', title: 'عضو تیم مسابقات', subtitle: 'دعوت به ترکیب مسابقه', unlocked: false }
]

export function money(value) {
  return new Intl.NumberFormat('fa-IR').format(value)
}

export function faNumber(value) {
  return new Intl.NumberFormat('fa-IR').format(value)
}

export function persianDate(date = new Date(), options = { year: 'numeric', month: 'long', day: 'numeric' }) {
  return new Intl.DateTimeFormat('fa-IR-u-ca-persian', options).format(date)
}

export function getDayIndex(date) {
  return (date.getDay() + 1) % 7
}

export function getWeekStart(offset = 0) {
  const today = new Date()
  today.setHours(12, 0, 0, 0)
  today.setDate(today.getDate() - getDayIndex(today) + offset * 7)
  return today
}

export function addDays(date, amount) {
  const next = new Date(date)
  next.setDate(next.getDate() + amount)
  return next
}

export function sessionDate(weekOffset, day) {
  return addDays(getWeekStart(weekOffset), day)
}

export function isSameDate(a, b) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
}
