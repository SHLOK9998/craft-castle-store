# Craft Castle — Backend API 🎀

FastAPI backend for the Craft Castle handmade rakhi store.
**Stack:** FastAPI · Supabase (PostgreSQL + Storage) · JWT Auth

---

## 🚀 Quick Setup

### 1. Install dependencies
```bash
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r app/requirements.txt
```

### 2. Setup Supabase
1. Create a free project at [supabase.com](https://supabase.com)
2. Open **SQL Editor** and run the SQL blocks from these files **in order**:
   - `app/models/category.py`
   - `app/models/product.py`
   - `app/models/media.py`
3. Go to **Project Settings → API** → copy URL + anon key + service_role key

### 3. Configure .env
```bash
cp .env.example .env
# Fill in your values
```

### 4. Generate your admin password hash
```bash
cd app
uvicorn main:app --reload
# POST http://localhost:8000/auth/hash-password
# Body: {"password": "your_chosen_password"}
# Copy the returned hash into .env as ADMIN_PASSWORD
```

### 5. Generate SECRET_KEY
```bash
python -c "import secrets; print(secrets.token_hex(32))"
```

### 6. Run
```bash
cd app
uvicorn main:app --reload
# Swagger UI: http://localhost:8000/docs
```

---

## 📡 API Reference

### Auth
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/auth/login` | ❌ | Admin login → returns JWT token |
| POST | `/auth/hash-password` | ❌ | One-time: generate bcrypt hash |

### Categories
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/categories` | ❌ | List active categories |
| GET | `/categories/{id}` | ❌ | Get single category |
| GET | `/categories/admin/all` | ✅ | List all categories (incl. inactive) |
| POST | `/categories` | ✅ | Create category |
| PATCH | `/categories/{id}` | ✅ | Update category |
| DELETE | `/categories/{id}` | ✅ | Delete category |

### Products
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/products` | ❌ | Catalogue with filters + pagination |
| GET | `/products/featured` | ❌ | Featured products for homepage |
| GET | `/products/{id}` | ❌ | Product detail with media |
| GET | `/products/slug/{slug}` | ❌ | Product by slug (SEO URLs) |
| GET | `/products/admin/all` | ✅ | All products incl. inactive |
| POST | `/products` | ✅ | Create product |
| PATCH | `/products/{id}` | ✅ | Update product |
| PATCH | `/products/{id}/stock` | ✅ | Quick stock update |
| DELETE | `/products/{id}` | ✅ | Delete product |

### Media
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/media/product/{product_id}` | ❌ | Get all media for a product |
| POST | `/media/upload/{product_id}` | ✅ | Upload image or video |
| PATCH | `/media/{id}/set-primary` | ✅ | Set as primary image |
| PATCH | `/media/reorder` | ✅ | Reorder multiple media items |
| DELETE | `/media/{id}` | ✅ | Delete media (DB + Storage) |

### WhatsApp
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/whatsapp/order-url/{product_id}` | ❌ | Get order URL for a product |
| GET | `/whatsapp/contact-url` | ❌ | Get general contact URL |

### Dashboard
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/dashboard/stats` | ✅ | Summary stats for admin panel |

---

## 📁 Structure
```
app/
├── main.py              ← Entry point, all routers registered
├── config.py            ← Env settings (pydantic-settings)
├── database.py          ← Supabase client (public + admin)
├── models/              ← Table definitions + SQL to run in Supabase
│   ├── category.py
│   ├── product.py
│   └── media.py
├── schemas/             ← Pydantic request/response validation
│   ├── category.py
│   ├── product.py
│   └── media.py
├── routes/              ← All API endpoints
│   ├── categories.py
│   ├── products.py
│   ├── media.py
│   ├── dashboard.py
│   └── whatsapp.py
└── auth/
    ├── utils.py         ← JWT + password helpers
    └── router.py        ← Login endpoint
```

---

## 🌐 Deployment (Render.com — free)

1. Push code to GitHub
2. Go to [render.com](https://render.com) → New Web Service
3. Connect your repo
4. Set:
   - **Build command:** `pip install -r app/requirements.txt`
   - **Start command:** `uvicorn main:app --host 0.0.0.0 --port $PORT --app-dir app`
5. Add all `.env` values as Environment Variables in Render dashboard
6. Update CORS `allow_origins` in `main.py` with your Vercel frontend URL
