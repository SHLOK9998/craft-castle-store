# Craft Castle — Frontend 🎀

React frontend for the Craft Castle handmade rakhi store.
**Stack:** React 18 · Vite · Tailwind CSS · React Router · Axios

Design system from Stitch by Google:
- **Customer UI** — Heritage Festive (cream, deep red, gold, saffron)
- **Admin UI** — Heritage Craft Admin (clean white, deep red accents)

---

## 🚀 Setup

```bash
cd craft-castle-frontend
npm install

cp .env.example .env
# Set VITE_API_URL to your FastAPI backend URL

npm run dev
# Runs at http://localhost:5173
```

---

## 📁 Pages

### Customer
| Route | Page |
|---|---|
| `/` | Product catalogue with filters, search, pagination |
| `/product/:id` | Product detail with image gallery + WhatsApp order |

### Admin (JWT protected)
| Route | Page |
|---|---|
| `/admin/login` | Login page |
| `/admin` | Dashboard with stats and low stock alerts |
| `/admin/products` | Product list with inline stock editing |
| `/admin/products/new` | Add new product |
| `/admin/products/:id/edit` | Edit product + manage media |
| `/admin/categories` | Manage categories |

---

## 🌐 Deploy to Vercel

1. Push to GitHub
2. Import repo in [vercel.com](https://vercel.com)
3. Add environment variable: `VITE_API_URL=https://your-render-backend.onrender.com`
4. Deploy!
