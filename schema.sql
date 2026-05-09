-- ═══════════════════════════════════════
-- schema.sql — جدول الطلبات
-- شغّل: npm run db:init
-- ═══════════════════════════════════════

CREATE TABLE IF NOT EXISTS orders (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  order_id   TEXT    NOT NULL UNIQUE,
  created_at TEXT    NOT NULL DEFAULT (datetime('now')),

  -- بيانات العميل
  fullname   TEXT NOT NULL,
  phone      TEXT NOT NULL,
  wilaya     TEXT NOT NULL,
  commune    TEXT NOT NULL,

  -- بيانات الطلب
  product    TEXT NOT NULL DEFAULT 'HOCO J101B Astute 30000mAh',
  quantity   INTEGER NOT NULL DEFAULT 1,
  price      INTEGER NOT NULL DEFAULT 3500,
  total      INTEGER NOT NULL,

  -- الحالة
  status     TEXT NOT NULL DEFAULT 'جديد'
);

-- فهرس للبحث السريع
CREATE INDEX IF NOT EXISTS idx_orders_phone  ON orders(phone);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_wilaya ON orders(wilaya);
