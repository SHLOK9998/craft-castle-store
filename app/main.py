from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware

from config import get_settings
from auth.router import router as auth_router
from routes.categories import router as categories_router
from routes.products import router as products_router
from routes.media import router as media_router
from routes.dashboard import router as dashboard_router
from routes.whatsapp import router as whatsapp_router
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from limiter import limiter
from fastapi import Response
settings = get_settings()

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="Backend API for Craft Castle — Handmade Rakhi Store 🎀",
    docs_url="/docs",
    redoc_url="/redoc",
)

# ── Security Headers ──────────────────────────
@app.middleware("http")
async def add_security_headers(request: Request, call_next):
    response = await call_next(request)
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
    return response

# ── Rate Limiter ──────────────────────────────
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# ── CORS ──────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:3000",
        "https://craft-castle-store.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PATCH", "DELETE", "HEAD"],
    allow_headers=["Authorization", "Content-Type"],
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

@app.head("/health")
def health_head():
    return Response(status_code=200)

@app.get("/health", tags=["Health"])
def health():
    return {"status": "ok"}
