import { Hono } from 'hono';
import { cors } from 'hono/cors';

// ══════════════════════════════════════════
//  Types
// ══════════════════════════════════════════
type Env = {
  DB:      D1Database;
  GAS_URL?: string;   // Google Sheets webhook (اختياري)
};

type OrderBody = {
  fullname: string;
  phone:    string;
  wilaya:   string;
  commune:  string;
  quantity?: number;
};

// ══════════════════════════════════════════
//  App
// ══════════════════════════════════════════
const app = new Hono<{ Bindings: Env }>();

app.use('*', cors());

// ── Health check ──
app.get('/api/health', (c) => c.json({ ok: true }));

// ══════════════════════════════════════════
//  POST /api/order  — حفظ طلب جديد
// ══════════════════════════════════════════
app.post('/api/order', async (c) => {
  let body: OrderBody;

  try {
    body = await c.req.json<OrderBody>();
  } catch {
    return c.json({ error: 'بيانات غير صالحة' }, 400);
  }

  // ── Validation ──
  const { fullname, phone, wilaya, commune } = body;
  const errors: string[] = [];

  if (!fullname || fullname.trim().length < 3)  errors.push('fullname');
  if (!phone    || !/^(0\d{9})$/.test(phone.replace(/\s/g, ''))) errors.push('phone');
  if (!wilaya   || wilaya.trim() === '')         errors.push('wilaya');
  if (!commune  || commune.trim().length < 2)    errors.push('commune');

  if (errors.length) {
    return c.json({ error: 'حقول ناقصة', fields: errors }, 422);
  }

  // ── Build order ──
  const qty     = Math.min(body.quantity ?? 1, 10);
  const price   = 3500;   // ← غيّر السعر هنا إذا احتجت
  const total   = qty * price;
  const orderId = `ORD-${Date.now()}`;

  // ── Save to D1 ──
  try {
    await c.env.DB.prepare(`
      INSERT INTO orders (order_id, fullname, phone, wilaya, commune, quantity, price, total)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(orderId, fullname.trim(), phone.trim(), wilaya.trim(), commune.trim(), qty, price, total)
      .run();
  } catch (err) {
    console.error('[D1 Error]', err);
    return c.json({ error: 'خطأ في حفظ الطلب' }, 500);
  }

  // ── Forward to Google Sheets (اختياري) ──
  if (c.env.GAS_URL) {
    const payload = new FormData();
    payload.append('order_id', orderId);
    payload.append('fullname',  fullname.trim());
    payload.append('phone',     phone.trim());
    payload.append('wilaya',    wilaya.trim());
    payload.append('commune',   commune.trim());
    payload.append('quantity',  String(qty));
    payload.append('total',     String(total));
    payload.append('status',    'جديد');

    // نرسل لـ GAS بدون انتظار (fire and forget)
    c.executionCtx.waitUntil(
      fetch(c.env.GAS_URL, { method: 'POST', body: payload }).catch(console.error)
    );
  }

  return c.json({ success: true, orderId });
});

// ── Serve frontend ──
app.get('*', async (c) => {
  return c.env.ASSETS.fetch(c.req.raw);
});

export default app;
