# ─────────────────────────────────────────────
#  PRODUCT MODEL
#  Table: products
# ─────────────────────────────────────────────
#
#  Run this SQL in Supabase SQL Editor:
#
#  CREATE TABLE products (
#      id                BIGSERIAL PRIMARY KEY,
#      name              VARCHAR(200) NOT NULL,
#      slug              VARCHAR(200) NOT NULL UNIQUE,
#      description       TEXT,
#      price             NUMERIC(10, 2) NOT NULL,
#      discounted_price  NUMERIC(10, 2),          -- NULL means no discount
#      stock_quantity    INT NOT NULL DEFAULT 0,
#      category_id       BIGINT REFERENCES categories(id) ON DELETE SET NULL,
#      is_featured       BOOLEAN DEFAULT FALSE,    -- show on homepage
#      is_active         BOOLEAN DEFAULT TRUE,     -- hide without deleting
#      whatsapp_message  TEXT,                     -- custom order message (optional)
#      created_at        TIMESTAMPTZ DEFAULT NOW(),
#      updated_at        TIMESTAMPTZ DEFAULT NOW()
#  );
#
#  CREATE TRIGGER products_updated_at
#  BEFORE UPDATE ON products
#  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
#
#  -- Index for fast filtering
#  CREATE INDEX idx_products_category    ON products(category_id);
#  CREATE INDEX idx_products_is_active   ON products(is_active);
#  CREATE INDEX idx_products_is_featured ON products(is_featured);
#  CREATE INDEX idx_products_stock       ON products(stock_quantity);
#
#  -- Row Level Security: public can only READ active products
#  ALTER TABLE products ENABLE ROW LEVEL SECURITY;
#
#  CREATE POLICY "Public can view active products"
#  ON products FOR SELECT
#  USING (is_active = TRUE);
#
#  -- Admins (service role key) bypass RLS automatically
# ─────────────────────────────────────────────

TABLE_NAME = "products"

# Column constants
ID                = "id"
NAME              = "name"
SLUG              = "slug"
DESCRIPTION       = "description"
PRICE             = "price"
DISCOUNTED_PRICE  = "discounted_price"
STOCK_QUANTITY    = "stock_quantity"
CATEGORY_ID       = "category_id"
IS_FEATURED       = "is_featured"
IS_ACTIVE         = "is_active"
WHATSAPP_MESSAGE  = "whatsapp_message"
CREATED_AT        = "created_at"
UPDATED_AT        = "updated_at"
