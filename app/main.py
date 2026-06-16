from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import get_settings
from app.auth.router import router as auth_router
from app.routes.categories import router as categories_router
from app.routes.products import router as products_router
from app.routes.media import router as media_router
from app.routes.dashboard import router as dashboard_router
from app.routes.whatsapp import router as whatsapp_router

settings = get_settings()

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="Backend API for Craft Castle — Handmade Rakhi Store 🎀",
    docs_url="/docs",
    redoc_url="/redoc",
)

# ── CORS ──────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:3000",
        # "https://your-app.vercel.app",  ← uncomment after deploy
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Routers ───────────────────────────────────
app.include_router(auth_router)
app.include_router(categories_router)
app.include_router(products_router)
app.include_router(media_router)
app.include_router(dashboard_router)
app.include_router(whatsapp_router)


# ── Health ────────────────────────────────────
@app.get("/", tags=["Health"])
def root():
    return {
        "app": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "status": "running 🎀",
        "docs": "/docs",
    }

@app.get("/health", tags=["Health"])
def health():
    return {"status": "ok"}
