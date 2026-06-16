# ─────────────────────────────────────────────
#  MEDIA MODEL
#  Table: product_media
#  Storage: Cloudinary Service
# ─────────────────────────────────────────────
#
#  Run this SQL in Supabase SQL Editor:
#
#  CREATE TYPE media_type_enum AS ENUM ('image', 'video');
#
#  CREATE TABLE product_media (
#      id           BIGSERIAL PRIMARY KEY,
#      product_id   BIGINT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
#      media_url    TEXT NOT NULL,               -- secure Cloudinary URL
#      storage_path TEXT NOT NULL,               -- Cloudinary public_id (for deletion)
#      media_type   media_type_enum DEFAULT 'image',
#      is_primary   BOOLEAN DEFAULT FALSE,       -- main display image
#      sort_order   INT DEFAULT 0,               -- display order
#      created_at   TIMESTAMPTZ DEFAULT NOW()
#  );
#
#  -- Only one primary image per product
#  CREATE UNIQUE INDEX idx_one_primary_per_product
#  ON product_media(product_id)
#  WHERE is_primary = TRUE;
#
#  -- Fast lookup by product
#  CREATE INDEX idx_media_product_id ON product_media(product_id);
#
#  -- RLS: public can read all media
#  ALTER TABLE product_media ENABLE ROW LEVEL SECURITY;
#
#  CREATE POLICY "Public can view product media"
#  ON product_media FOR SELECT
#  USING (TRUE);
#
# ─────────────────────────────────────────────
#  SUPABASE STORAGE BUCKET SETUP
#  Run this SQL or do it via Supabase Dashboard → Storage:
#
#  -- Create the bucket (public so images load without auth)
#  INSERT INTO storage.buckets (id, name, public)
#  VALUES ('craft-castle-media', 'craft-castle-media', true);
#
#  -- Allow public to view files
#  CREATE POLICY "Public can view media files"
#  ON storage.objects FOR SELECT
#  USING (bucket_id = 'craft-castle-media');
#
#  -- Only service role (admin) can upload/delete
#  CREATE POLICY "Admin can upload media"
#  ON storage.objects FOR INSERT
#  WITH CHECK (bucket_id = 'craft-castle-media');
#
#  CREATE POLICY "Admin can delete media"
#  ON storage.objects FOR DELETE
#  USING (bucket_id = 'craft-castle-media');
#
#  File path convention inside bucket:
#  products/{product_id}/{uuid}.jpg   ← images
#  products/{product_id}/{uuid}.mp4   ← videos
# ─────────────────────────────────────────────

TABLE_NAME   = "product_media"
BUCKET_NAME  = "craft-castle-media"

# Column constants
ID           = "id"
PRODUCT_ID   = "product_id"
MEDIA_URL    = "media_url"
STORAGE_PATH = "storage_path"
MEDIA_TYPE   = "media_type"
IS_PRIMARY   = "is_primary"
SORT_ORDER   = "sort_order"
CREATED_AT   = "created_at"

# Allowed file types
ALLOWED_IMAGE_TYPES = {"image/jpeg", "image/png", "image/webp"}
ALLOWED_VIDEO_TYPES = {"video/mp4", "video/quicktime"}
MAX_IMAGE_SIZE_MB   = 5
MAX_VIDEO_SIZE_MB   = 50
