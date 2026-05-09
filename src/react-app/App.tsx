import { useState, useRef } from 'react';

// ══════════════════════════════════════════════════
//  ✏️  PRODUCT CONFIG — كل شيء تعدله من هنا
// ══════════════════════════════════════════════════
const PRODUCT = {
  name:     'HOCO J101B Astute',
  capacity: '30000mAh',
  power:    '22.5W',
  price:    3500,
  oldPrice: 5500,
  currency: 'دج',
  stock:    47,
};

const FEATURES = [
  { icon: '⚡', title: 'شحن سريع 22.5W',    desc: 'من 0 إلى 100% في وقت قياسي' },
  { icon: '🔋', title: 'طاقة 30000mAh',      desc: 'أكثر من 6 شحنات كاملة لهاتفك' },
  { icon: '📱', title: '3 منافذ شحن',        desc: 'USB-C + USB-A × 2 في نفس الوقت' },
  { icon: '🛡️', title: 'حماية ذكية',        desc: 'من الشحن الزائد والحرارة' },
  { icon: '💡', title: 'شاشة LED رقمية',     desc: 'تعرض نسبة الشحن بدقة' },
  { icon: '✈️', title: 'مثالي للسفر',        desc: 'خفيف ومتين لكل مناسبة' },
];

const WILAYAS = [
  'أدرار','الشلف','الأغواط','أم البواقي','باتنة','بجاية','بسكرة','بشار',
  'البليدة','البويرة','تمنراست','تبسة','تلمسان','تيارت','تيزي وزو','الجزائر',
  'الجلفة','جيجل','سطيف','سعيدة','سكيكدة','سيدي بلعباس','عنابة','قالمة',
  'قسنطينة','المدية','مستغانم','المسيلة','معسكر','ورقلة','وهران','البيض',
  'إليزي','برج بوعريريج','بومرداس','الطارف','تندوف','تيسمسيلت','الوادي',
  'خنشلة','سوق أهراس','تيبازة','ميلة','عين الدفلى','النعامة','عين تموشنت',
  'غرداية','غليزان','تيميمون','برج باجي مختار','أولاد جلال','بني عباس',
  'عين صالح','عين قزام','توقرت','جانت','المغير','المنيعة',
];

// ══════════════════════════════════════════════════

type FormState = 'idle' | 'loading' | 'success' | 'error';

export default function App() {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, setState] = useState<FormState>('idle');
  const [orderId, setOrderId] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  // ── Validation ──
  function validate(data: Record<string, string>) {
    const e: Record<string, string> = {};
    if (!data.fullname || data.fullname.trim().length < 3)
      e.fullname = 'أدخل اسمك الكامل';
    if (!data.phone || !/^(0\d{9})$/.test(data.phone.replace(/\s/g, '')))
      e.phone = 'رقم الهاتف يجب أن يكون 10 أرقام يبدأ بـ 0';
    if (!data.wilaya || data.wilaya === '')
      e.wilaya = 'اختر ولايتك';
    if (!data.commune || data.commune.trim().length < 2)
      e.commune = 'أدخل البلدية';
    return e;
  }

  // ── Submit ──
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!formRef.current) return;

    const fd = new FormData(formRef.current);
    const data = Object.fromEntries(fd) as Record<string, string>;

    const errs = validate(data);
    setErrors(errs);
    if (Object.keys(errs).length) return;

    setState('loading');
    try {
      const res = await fetch('/api/order', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ ...data, quantity: 1 }),
      });
      const json = await res.json() as { success?: boolean; orderId?: string };
      if (res.ok && json.success) {
        setOrderId(json.orderId ?? '');
        setState('success');
      } else {
        setState('error');
      }
    } catch {
      setState('error');
    }
  }

  return (
    <>
      {/* ── Ticker ── */}
      <div className="ticker" aria-label="إعلان">
        <div className="ticker-track">
          {Array(2).fill(['🚚 توصيل لجميع الولايات', '💳 الدفع عند الاستلام', '✅ منتج أصلي مضمون', '⚡ شحن سريع 22.5W', '📦 تغليف محكم']).flat().map((t, i) => (
            <span key={i} className="ticker-item">{t}</span>
          ))}
        </div>
      </div>

      {/* ── Header ── */}
      <header style={{ background: 'rgba(7,9,15,.95)', borderBottom: '1px solid var(--border)', position: 'sticky', top: 0, zIndex: 50, backdropFilter: 'blur(12px)', padding: '13px 0' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {/* ✏️ غيّر اسم المتجر هنا */}
          <span style={{ fontWeight: 900, fontSize: 20, color: 'var(--gold)' }}>⚡ متجرك</span>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <span className="badge badge-green">✓ دفع عند الاستلام</span>
            <span className="badge badge-gold">🚚 توصيل سريع</span>
          </div>
        </div>
      </header>

      {/* ── Hero ── */}
      <section className="section" style={{ paddingBottom: 52, paddingTop: 56 }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 48, alignItems: 'center' }}>

            {/* Text */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20, animation: 'fadeUp .6s ease' }}>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <span className="badge badge-red">🔥 عرض محدود</span>
                <span className="badge badge-gold">⚡ {PRODUCT.power}</span>
              </div>

              <h1>
                باور بانك{' '}
                <span style={{ background: 'linear-gradient(135deg,var(--gold),#f97316)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                  {PRODUCT.name}
                </span>
                <br />
                <span style={{ fontSize: '0.6em', color: 'var(--text)' }}>{PRODUCT.capacity} — بطاقة خرافية!</span>
              </h1>

              <p style={{ color: '#9ca3af', fontSize: 16, lineHeight: 1.8 }}>
                يشحن هاتفك أكثر من <strong style={{ color: 'var(--gold)' }}>6 مرات</strong> متتالية بتقنية الشحن السريع.
                منتج أصلي مضمون، يوصلك لكل ولايات الجزائر.
              </p>

              {/* Price */}
              <div className="card" style={{ border: '1px solid var(--gold-bdr)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap', marginBottom: 10 }}>
                  <span style={{ fontSize: 42, fontWeight: 900, color: 'var(--gold)' }}>
                    {PRODUCT.price.toLocaleString('ar-DZ')} {PRODUCT.currency}
                  </span>
                  <del style={{ fontSize: 20, color: 'var(--muted)' }}>{PRODUCT.oldPrice.toLocaleString('ar-DZ')} {PRODUCT.currency}</del>
                  <span className="badge badge-red" style={{ fontSize: 13 }}>
                    وفر {Math.round((1 - PRODUCT.price / PRODUCT.oldPrice) * 100)}%
                  </span>
                </div>
                <p style={{ fontSize: 13, color: 'var(--green)', fontWeight: 700 }}>
                  💳 الدفع نقداً عند استلام الطرد — لا بطاقة بنكية
                </p>
              </div>

              {/* Stock */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'rgba(232,69,69,.07)', border: '1px solid rgba(232,69,69,.2)', borderRadius: 10, padding: '11px 15px', fontSize: 14 }}>
                <span style={{ width: 9, height: 9, borderRadius: '50%', background: 'var(--red)', flexShrink: 0, animation: 'pulse-ring 1.8s infinite', display: 'inline-block' }}></span>
                متبقي <strong style={{ color: 'var(--red)', margin: '0 4px' }}>{PRODUCT.stock} قطعة</strong> فقط — اطلب قبل النفاد!
              </div>

              <a href="#order" className="btn-cta" style={{ animation: 'pulse-ring 2.5s infinite' }}>
                🛒 اطلب الآن — الدفع عند الاستلام
              </a>
            </div>

            {/* Image */}
            <div style={{ display: 'flex', justifyContent: 'center', position: 'relative' }}>
              {/*
                ✏️ IMAGE — ضع صورة المنتج هنا:
                <img
                  src="/product.webp"
                  alt="باور بانك HOCO J101B Astute 30000mAh"
                  style={{ width: '100%', maxWidth: 420, animation: 'float 5s ease-in-out infinite', filter: 'drop-shadow(0 20px 50px rgba(245,166,35,.2))' }}
                />
              */}
              <div style={{
                width: 320, height: 320, border: '2px dashed var(--gold-bdr)', borderRadius: 20,
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                gap: 12, color: '#6b7280', background: 'var(--bg2)', animation: 'float 5s ease-in-out infinite',
                textAlign: 'center', padding: 20,
              }}>
                <span style={{ fontSize: 72 }}>🔋</span>
                <p style={{ fontSize: 13 }}>ضع صورة المنتج هنا<br /><code style={{ fontSize: 11, opacity: .6 }}>/public/product.webp</code></p>
              </div>
              <div style={{ position: 'absolute', top: '8%', right: 0, background: 'var(--gold)', color: '#000', fontWeight: 900, fontSize: 13, padding: '7px 16px', borderRadius: 99, boxShadow: '0 4px 16px rgba(245,166,35,.4)' }}>⚡ {PRODUCT.power}</div>
              <div style={{ position: 'absolute', bottom: '8%', left: 0, background: 'var(--gold)', color: '#000', fontWeight: 900, fontSize: 13, padding: '7px 16px', borderRadius: 99, boxShadow: '0 4px 16px rgba(245,166,35,.4)' }}>{PRODUCT.capacity}</div>
            </div>

          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="section" style={{ background: 'var(--bg2)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 44 }}>
            <p className="eyebrow">لماذا تختاره؟</p>
            <h2>مميزات تجعله الأفضل</h2>
            <div className="divider" />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
            {FEATURES.map((f) => (
              <div key={f.title} className="card" style={{ display: 'flex', flexDirection: 'column', gap: 10, transition: 'border-color .2s', cursor: 'default' }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--gold-bdr)')}
                onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border)')}>
                <span style={{ fontSize: 32 }}>{f.icon}</span>
                <strong style={{ fontSize: 15 }}>{f.title}</strong>
                <p style={{ fontSize: 13, color: '#9ca3af', lineHeight: 1.7 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Order Form ── */}
      <section className="section" id="order">
        <div className="container">
          <div style={{ maxWidth: 560, margin: '0 auto' }}>

            <div style={{ textAlign: 'center', marginBottom: 36 }}>
              <p className="eyebrow">🚀 خطوة واحدة فقط</p>
              <h2>أكمل طلبك الآن</h2>
              <div className="divider" />
              <p style={{ color: '#9ca3af', fontSize: 15, marginTop: 10 }}>
                أملأ البيانات ونتصل بك لتأكيد الطلب — الدفع عند الاستلام 💳
              </p>
            </div>

            {/* ── Success ── */}
            {state === 'success' && (
              <div style={{ background: 'rgba(34,197,94,.07)', border: '1.5px solid rgba(34,197,94,.3)', borderRadius: var(--radius), padding: 36, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14, animation: 'fadeUp .4s ease' } as React.CSSProperties}>
                <span style={{ fontSize: 56 }}>🎉</span>
                <h3 style={{ color: 'var(--green)', fontSize: 22 }}>تم استلام طلبك بنجاح!</h3>
                <p style={{ color: '#9ca3af' }}>سيتصل بك فريقنا قريباً لتأكيد الطلب والتوصيل</p>
                {orderId && <code style={{ fontSize: 12, color: 'var(--muted)', background: 'var(--bg2)', padding: '4px 10px', borderRadius: 6 }}>#{orderId}</code>}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 14, color: '#9ca3af', background: 'var(--bg2)', padding: '14px 20px', borderRadius: 10, width: '100%', textAlign: 'right' }}>
                  <span>📦 {PRODUCT.name} {PRODUCT.capacity}</span>
                  <span>💰 {PRODUCT.price.toLocaleString('ar-DZ')} {PRODUCT.currency}</span>
                  <span>🚚 التوصيل خلال 24-72 ساعة</span>
                  <span>💳 الدفع نقداً عند الاستلام</span>
                </div>
              </div>
            )}

            {/* ── Form ── */}
            {state !== 'success' && (
              <form ref={formRef} onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

                {/* الاسم الكامل */}
                <div className="field">
                  <label>👤 الاسم الكامل <span>*</span></label>
                  <input
                    name="fullname"
                    type="text"
                    placeholder="مثال: أحمد بن علي"
                    maxLength={80}
                    autoComplete="name"
                    className={errors.fullname ? 'err' : ''}
                    onFocus={() => setErrors(p => ({ ...p, fullname: '' }))}
                  />
                  <span className={`err-msg ${errors.fullname ? 'show' : ''}`}>⚠ {errors.fullname}</span>
                </div>

                {/* رقم الهاتف */}
                <div className="field">
                  <label>📱 رقم الهاتف <span>*</span></label>
                  <input
                    name="phone"
                    type="tel"
                    placeholder="0X XX XX XX XX"
                    maxLength={13}
                    inputMode="numeric"
                    autoComplete="tel"
                    className={errors.phone ? 'err' : ''}
                    onFocus={() => setErrors(p => ({ ...p, phone: '' }))}
                    onChange={e => { e.target.value = e.target.value.replace(/[^0-9\s]/g, ''); }}
                  />
                  <span className={`err-msg ${errors.phone ? 'show' : ''}`}>⚠ {errors.phone}</span>
                </div>

                {/* الولاية */}
                <div className="field">
                  <label>📍 الولاية <span>*</span></label>
                  <select
                    name="wilaya"
                    defaultValue=""
                    className={errors.wilaya ? 'err' : ''}
                    onFocus={() => setErrors(p => ({ ...p, wilaya: '' }))}
                  >
                    <option value="" disabled>اختر ولايتك</option>
                    {WILAYAS.map((w, i) => (
                      <option key={w} value={w}>{String(i + 1).padStart(2, '0')} — {w}</option>
                    ))}
                  </select>
                  <span className={`err-msg ${errors.wilaya ? 'show' : ''}`}>⚠ {errors.wilaya}</span>
                </div>

                {/* البلدية */}
                <div className="field">
                  <label>🏙️ البلدية <span>*</span></label>
                  <input
                    name="commune"
                    type="text"
                    placeholder="مثال: باب الوادي، الدويرة..."
                    maxLength={80}
                    className={errors.commune ? 'err' : ''}
                    onFocus={() => setErrors(p => ({ ...p, commune: '' }))}
                  />
                  <span className={`err-msg ${errors.commune ? 'show' : ''}`}>⚠ {errors.commune}</span>
                </div>

                {/* ملخص */}
                <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 9, fontSize: 14 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--muted)' }}>المنتج</span>
                    <strong>{PRODUCT.name} {PRODUCT.capacity}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--muted)' }}>السعر</span>
                    <strong style={{ color: 'var(--gold)' }}>{PRODUCT.price.toLocaleString('ar-DZ')} {PRODUCT.currency}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--muted)' }}>التوصيل</span>
                    <strong style={{ color: 'var(--green)' }}>مجاني 🚚</strong>
                  </div>
                  <div style={{ borderTop: '1px solid var(--border)', paddingTop: 9, display: 'flex', justifyContent: 'space-between', fontSize: 16 }}>
                    <span>المجموع</span>
                    <strong style={{ color: 'var(--gold)', fontSize: 20 }}>{PRODUCT.price.toLocaleString('ar-DZ')} {PRODUCT.currency}</strong>
                  </div>
                </div>

                {/* Error */}
                {state === 'error' && (
                  <div style={{ background: 'rgba(232,69,69,.08)', border: '1px solid rgba(232,69,69,.3)', borderRadius: 10, padding: '12px 16px', fontSize: 14, color: 'var(--red)' }}>
                    ❌ حدث خطأ. حاول مرة أخرى.
                  </div>
                )}

                {/* Submit */}
                <button type="submit" className="btn-cta" disabled={state === 'loading'}>
                  {state === 'loading' ? (
                    <><span style={{ width: 18, height: 18, border: '2px solid rgba(0,0,0,.3)', borderTopColor: '#000', borderRadius: '50%', display: 'inline-block', animation: 'spin .7s linear infinite' }} /> جاري الإرسال...</>
                  ) : '✅ أتمم طلبي — الدفع عند الاستلام'}
                </button>

                <p style={{ textAlign: 'center', fontSize: 12, color: 'var(--muted)' }}>
                  🔒 بياناتك محمية — سيتصل بك فريقنا للتأكيد
                </p>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer style={{ background: 'var(--bg2)', borderTop: '1px solid var(--border)', padding: '32px 0', textAlign: 'center' }}>
        <div className="container" style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center' }}>
          <span style={{ fontWeight: 900, fontSize: 18, color: 'var(--gold)' }}>⚡ متجرك</span>
          <p style={{ fontSize: 13, color: 'var(--muted)', maxWidth: 420 }}>
            إكسسوارات إلكترونية أصلية — دفع عند الاستلام لجميع ولايات الجزائر
          </p>
          <p style={{ fontSize: 12, color: 'var(--muted)' }}>© {new Date().getFullYear()} متجرك — جميع الحقوق محفوظة</p>
        </div>
      </footer>
    </>
  );
}
