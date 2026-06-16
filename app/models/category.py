# ─────────────────────────────────────────────
#  CATEGORY MODEL
#  Table: categories
# ─────────────────────────────────────────────
#
#  This is the SQL you need to run in Supabase
#  SQL Editor to create this table:
#
#  CREATE TABLE categories (
#      id          BIGSERIAL PRIMARY KEY,
#      name        VARCHAR(100) NOT NULL UNIQUE,
#      slug        VARCHAR(100) NOT NULL UNIQUE,
#      description TEXT,
#      is_active   BOOLEAN DEFAULT TRUE,
#      sort_order  INT DEFAULT 0,
#      created_at  TIMESTAMPTZ DEFAULT NOW(),
#      updated_at  TIMESTAMPTZ DEFAULT NOW()
#  );
#
#  -- Auto-update updated_at on row change
#  CREATE OR REPLACE FUNCTION update_updated_at()
#  RETURNS TRIGGER AS $$
#  BEGIN
#      NEW.updated_at = NOW();
#      RETURN NEW;
#  END;
#  $$ LANGUAGE plpgsql;
#
#  CREATE TRIGGER categories_updated_at
#  BEFORE UPDATE ON categories
#  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
#
#  -- Sample categories for rakhi business
#  INSERT INTO categories (name, slug, sort_order) VALUES
#      ('Thread Rakhi',  'thread-rakhi',  1),
#      ('Designer Rakhi','designer-rakhi',2),
#      ('Kids Rakhi',    'kids-rakhi',    3),
#      ('Lumba Rakhi',   'lumba-rakhi',   4),
#      ('Combo Pack',    'combo-pack',    5),
#      ('Premium',       'premium',       6);
# ─────────────────────────────────────────────

TABLE_NAME = "categories"

# Column names — use these constants in queries
# to avoid hardcoded strings across the codebase
ID          = "id"
NAME        = "name"
SLUG        = "slug"
DESCRIPTION = "description"
IS_ACTIVE   = "is_active"
SORT_ORDER  = "sort_order"
CREATED_AT  = "created_at"
UPDATED_AT  = "updated_at"
