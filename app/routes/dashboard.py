from fastapi import APIRouter, Depends
from database import get_supabase_admin
from models import product as ProductModel
from models import category as CategoryModel
from models import media as MediaModel
from auth.utils import get_current_admin

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])


@router.get("/stats")
def get_dashboard_stats(_: str = Depends(get_current_admin)):
    """
    Admin: returns summary stats for the dashboard home page.
    - Total products, active/inactive counts
    - In stock vs out of stock
    - Total categories
    - Low stock items (qty <= 5)
    """
    db = get_supabase_admin()

    # All products
    all_products = db.table(ProductModel.TABLE_NAME).select(
        ProductModel.ID,
        ProductModel.STOCK_QUANTITY,
        ProductModel.IS_ACTIVE,
        ProductModel.IS_FEATURED,
    ).execute().data

    total = len(all_products)
    active = sum(1 for p in all_products if p["is_active"])
    inactive = total - active
    in_stock = sum(1 for p in all_products if p["stock_quantity"] > 0)
    out_of_stock = sum(1 for p in all_products if p["stock_quantity"] == 0)
    featured = sum(1 for p in all_products if p["is_featured"])
    low_stock = sum(1 for p in all_products if 0 < p["stock_quantity"] <= 5)

    # Total categories
    categories = db.table(CategoryModel.TABLE_NAME).select(
        CategoryModel.ID
    ).execute().data

    # Low stock product details
    low_stock_products = db.table(ProductModel.TABLE_NAME).select(
        f"{ProductModel.ID},"
        f"{ProductModel.NAME},"
        f"{ProductModel.STOCK_QUANTITY},"
        f"{ProductModel.IS_ACTIVE}"
    ).lte(ProductModel.STOCK_QUANTITY, 5).gt(
        ProductModel.STOCK_QUANTITY, 0
    ).order(ProductModel.STOCK_QUANTITY).execute().data

    return {
        "products": {
            "total": total,
            "active": active,
            "inactive": inactive,
            "in_stock": in_stock,
            "out_of_stock": out_of_stock,
            "featured": featured,
            "low_stock": low_stock,
        },
        "categories": {
            "total": len(categories),
        },
        "low_stock_items": low_stock_products,
    }
