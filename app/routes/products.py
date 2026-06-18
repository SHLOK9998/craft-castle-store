from fastapi import APIRouter, HTTPException, status, Depends, Query
from typing import Optional

from database import get_supabase, get_supabase_admin
from models import product as ProductModel
from models import media as MediaModel
from schemas.product import (
    ProductCreate,
    ProductUpdate,
    StockUpdate,
    ProductResponse,
    ProductDetailResponse,
    ProductListResponse,
)
from schemas.media import MediaResponse
from auth.utils import get_current_admin
from config import get_settings

router = APIRouter(prefix="/products", tags=["Products"])
settings = get_settings()


# ── Helper ────────────────────────────────────

def build_whatsapp_url(product_name: str, product_id: int, custom_message: Optional[str]) -> str:
    """Generate a WhatsApp click-to-chat URL with a pre-filled order message."""
    message = custom_message or f"Namaste! ✨ I would like to order this blessed item: {product_name} (ID: #{product_id})"
    import urllib.parse
    encoded = urllib.parse.quote(message)
    return f"https://wa.me/{settings.WHATSAPP_NUMBER}?text={encoded}"


def attach_media(product: dict, db) -> dict:
    """Fetch and attach media list to a product dict."""
    media_result = (
        db.table(MediaModel.TABLE_NAME)
        .select("*")
        .eq(MediaModel.PRODUCT_ID, product["id"])
        .order(MediaModel.SORT_ORDER)
        .execute()
    )
    product["media"] = media_result.data or []
    return product


# ─────────────────────────────────────────────
#  PUBLIC ROUTES
# ─────────────────────────────────────────────

@router.get("", response_model=ProductListResponse)
def list_products(
    page: int = Query(1, ge=1, description="Page number"),
    page_size: int = Query(12, ge=1, le=48, description="Items per page"),
    category_id: Optional[str] = Query(None, description="Filter by category ID(s), comma-separated"),
    in_stock_only: bool = Query(False, description="Show only in-stock items"),
    featured_only: bool = Query(False, description="Show only featured items"),
    search: Optional[str] = Query(None, description="Search by product name"),
    min_price: Optional[float] = Query(None, description="Minimum price filter"),
    max_price: Optional[float] = Query(None, description="Maximum price filter"),
):
    """
    Public product catalogue with filtering, search, and pagination.
    Only returns active products (RLS handles this automatically).
    """
    db = get_supabase()

    query = db.table(ProductModel.TABLE_NAME).select("*", count="exact")

    if category_id:
        try:
            ids = [int(x.strip()) for x in category_id.split(",") if x.strip()]
            if len(ids) == 1:
                query = query.eq(ProductModel.CATEGORY_ID, ids[0])
            elif len(ids) > 1:
                query = query.in_(ProductModel.CATEGORY_ID, ids)
        except ValueError:
            pass
    if in_stock_only:
        query = query.gt(ProductModel.STOCK_QUANTITY, 0)
    if featured_only:
        query = query.eq(ProductModel.IS_FEATURED, True)
    if search:
        query = query.ilike(ProductModel.NAME, f"%{search}%")
    if min_price is not None:
        query = query.gte(ProductModel.PRICE, min_price)
    if max_price is not None:
        query = query.lte(ProductModel.PRICE, max_price)

    # Pagination
    offset = (page - 1) * page_size
    query = query.range(offset, offset + page_size - 1).order(ProductModel.CREATED_AT, desc=True)

    result = query.execute()
    products = result.data or []

    if products:
        product_ids = [p["id"] for p in products]
        media_result = (
            db.table(MediaModel.TABLE_NAME)
            .select("*")
            .in_(MediaModel.PRODUCT_ID, product_ids)
            .order(MediaModel.SORT_ORDER)
            .execute()
        )
        media_by_product = {}
        for m in (media_result.data or []):
            pid = m[MediaModel.PRODUCT_ID]
            if pid not in media_by_product:
                media_by_product[pid] = []
            media_by_product[pid].append(m)
        for p in products:
            p["media"] = media_by_product.get(p["id"], [])

    return ProductListResponse(
        total=result.count or 0,
        page=page,
        page_size=page_size,
        products=products,
    )


@router.get("/featured", response_model=list[ProductResponse])
def get_featured_products(limit: int = Query(8, ge=1, le=20)):
    """Returns featured products for the homepage hero section."""
    db = get_supabase()
    result = (
        db.table(ProductModel.TABLE_NAME)
        .select("*")
        .eq(ProductModel.IS_FEATURED, True)
        .gt(ProductModel.STOCK_QUANTITY, 0)
        .limit(limit)
        .execute()
    )
    return result.data


@router.get("/{product_id}", response_model=ProductDetailResponse)
def get_product(product_id: int):
    """
    Get full product details including all media.
    Also returns the WhatsApp order URL.
    """
    db = get_supabase()
    result = (
        db.table(ProductModel.TABLE_NAME)
        .select("*")
        .eq(ProductModel.ID, product_id)
        .single()
        .execute()
    )
    if not result.data:
        raise HTTPException(status_code=404, detail="Product not found")

    product = attach_media(result.data, db)

    # Inject WhatsApp URL
    product["whatsapp_url"] = build_whatsapp_url(
        product["name"],
        product["id"],
        product.get("whatsapp_message"),
    )
    return product


@router.get("/slug/{slug}", response_model=ProductDetailResponse)
def get_product_by_slug(slug: str):
    """Get product by slug — useful for SEO-friendly URLs."""
    db = get_supabase()
    result = (
        db.table(ProductModel.TABLE_NAME)
        .select("*")
        .eq(ProductModel.SLUG, slug)
        .single()
        .execute()
    )
    if not result.data:
        raise HTTPException(status_code=404, detail="Product not found")

    product = attach_media(result.data, db)
    product["whatsapp_url"] = build_whatsapp_url(
        product["name"],
        product["id"],
        product.get("whatsapp_message"),
    )
    return product


# ─────────────────────────────────────────────
#  ADMIN ROUTES
# ─────────────────────────────────────────────

@router.get("/admin/all", response_model=ProductListResponse)
def admin_list_all_products(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    search: Optional[str] = Query(None),
    category_id: Optional[int] = Query(None),
    is_active: Optional[bool] = Query(None),
    low_stock_only: bool = Query(False, description="Show items with stock <= 5"),
    _: str = Depends(get_current_admin),
):
    """Admin: list ALL products with full filters including inactive."""
    db = get_supabase_admin()

    query = db.table(ProductModel.TABLE_NAME).select("*", count="exact")

    if search:
        query = query.ilike(ProductModel.NAME, f"%{search}%")
    if category_id:
        query = query.eq(ProductModel.CATEGORY_ID, category_id)
    if is_active is not None:
        query = query.eq(ProductModel.IS_ACTIVE, is_active)
    if low_stock_only:
        query = query.lte(ProductModel.STOCK_QUANTITY, 5)

    offset = (page - 1) * page_size
    result = (
        query
        .range(offset, offset + page_size - 1)
        .order(ProductModel.CREATED_AT, desc=True)
        .execute()
    )
    products = result.data or []

    if products:
        product_ids = [p["id"] for p in products]
        media_result = (
            db.table(MediaModel.TABLE_NAME)
            .select("*")
            .in_(MediaModel.PRODUCT_ID, product_ids)
            .order(MediaModel.SORT_ORDER)
            .execute()
        )
        media_by_product = {}
        for m in (media_result.data or []):
            pid = m[MediaModel.PRODUCT_ID]
            if pid not in media_by_product:
                media_by_product[pid] = []
            media_by_product[pid].append(m)
        for p in products:
            p["media"] = media_by_product.get(p["id"], [])

    return ProductListResponse(
        total=result.count or 0,
        page=page,
        page_size=page_size,
        products=products,
    )


@router.post("", response_model=ProductDetailResponse, status_code=status.HTTP_201_CREATED)
def create_product(body: ProductCreate, _: str = Depends(get_current_admin)):
    """Admin: create a new product (without media — upload media separately)."""
    db = get_supabase_admin()

    # Check for duplicate slug
    slug_check = (
        db.table(ProductModel.TABLE_NAME)
        .select(ProductModel.ID)
        .eq(ProductModel.SLUG, body.to_db_dict()["slug"])
        .execute()
    )
    if slug_check.data:
        raise HTTPException(status_code=400, detail="Product with this name already exists")

    result = (
        db.table(ProductModel.TABLE_NAME)
        .insert(body.to_db_dict())
        .execute()
    )
    product = result.data[0]
    product["media"] = []
    return product


@router.patch("/{product_id}", response_model=ProductResponse)
def update_product(
    product_id: int,
    body: ProductUpdate,
    _: str = Depends(get_current_admin),
):
    """Admin: update product details."""
    db = get_supabase_admin()
    updates = body.to_db_dict()
    if not updates:
        raise HTTPException(status_code=400, detail="No fields to update")

    result = (
        db.table(ProductModel.TABLE_NAME)
        .update(updates)
        .eq(ProductModel.ID, product_id)
        .execute()
    )
    if not result.data:
        raise HTTPException(status_code=404, detail="Product not found")
    return result.data[0]


@router.patch("/{product_id}/stock", response_model=ProductResponse)
def update_stock(
    product_id: int,
    body: StockUpdate,
    _: str = Depends(get_current_admin),
):
    """
    Admin: quick stock update.
    Used for the inline editable stock field in admin product list.
    """
    db = get_supabase_admin()
    result = (
        db.table(ProductModel.TABLE_NAME)
        .update({ProductModel.STOCK_QUANTITY: body.stock_quantity})
        .eq(ProductModel.ID, product_id)
        .execute()
    )
    if not result.data:
        raise HTTPException(status_code=404, detail="Product not found")
    return result.data[0]


@router.delete("/{product_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_product(product_id: int, _: str = Depends(get_current_admin)):
    """
    Admin: delete a product.
    All associated media rows are deleted automatically (CASCADE).
    Storage files must be cleaned up via the /media routes.
    """
    db = get_supabase_admin()
    result = (
        db.table(ProductModel.TABLE_NAME)
        .delete()
        .eq(ProductModel.ID, product_id)
        .execute()
    )
    if not result.data:
        raise HTTPException(status_code=404, detail="Product not found")
