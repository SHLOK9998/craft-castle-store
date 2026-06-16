from fastapi import APIRouter, HTTPException, status, Depends

from app.database import get_supabase, get_supabase_admin
from app.models import category as CategoryModel
from app.schemas.category import (
    CategoryCreate,
    CategoryUpdate,
    CategoryResponse,
    CategoryListResponse,
)
from app.auth.utils import get_current_admin

router = APIRouter(prefix="/categories", tags=["Categories"])


# ─────────────────────────────────────────────
#  PUBLIC ROUTES — no auth required
# ─────────────────────────────────────────────

@router.get("", response_model=CategoryListResponse)
def list_categories():
    """
    Returns all active categories.
    Used by frontend to render filter tabs.
    """
    db = get_supabase_admin()
    result = (
        db.table(CategoryModel.TABLE_NAME)
        .select("*")
        .eq(CategoryModel.IS_ACTIVE, True)
        .order(CategoryModel.SORT_ORDER)
        .execute()
    )
    return CategoryListResponse(
        total=len(result.data),
        categories=result.data,
    )


@router.get("/{category_id}", response_model=CategoryResponse)
def get_category(category_id: int):
    """Get a single category by ID."""
    db = get_supabase_admin()
    result = (
        db.table(CategoryModel.TABLE_NAME)
        .select("*")
        .eq(CategoryModel.ID, category_id)
        .single()
        .execute()
    )
    if not result.data:
        raise HTTPException(status_code=404, detail="Category not found")
    return result.data


# ─────────────────────────────────────────────
#  ADMIN ROUTES — JWT required
# ─────────────────────────────────────────────

@router.get("/admin/all", response_model=CategoryListResponse)
def admin_list_all_categories(_: str = Depends(get_current_admin)):
    """
    Admin: returns ALL categories including inactive ones.
    """
    db = get_supabase_admin()
    result = (
        db.table(CategoryModel.TABLE_NAME)
        .select("*")
        .order(CategoryModel.SORT_ORDER)
        .execute()
    )
    return CategoryListResponse(
        total=len(result.data),
        categories=result.data,
    )


@router.post("", response_model=CategoryResponse, status_code=status.HTTP_201_CREATED)
def create_category(body: CategoryCreate, _: str = Depends(get_current_admin)):
    """Admin: create a new category."""
    db = get_supabase_admin()

    # Check duplicate name
    existing = (
        db.table(CategoryModel.TABLE_NAME)
        .select(CategoryModel.ID)
        .eq(CategoryModel.NAME, body.name)
        .execute()
    )
    if existing.data:
        raise HTTPException(status_code=400, detail="Category with this name already exists")

    result = (
        db.table(CategoryModel.TABLE_NAME)
        .insert(body.to_db_dict())
        .execute()
    )
    return result.data[0]


@router.patch("/{category_id}", response_model=CategoryResponse)
def update_category(
    category_id: int,
    body: CategoryUpdate,
    _: str = Depends(get_current_admin),
):
    """Admin: update category fields."""
    db = get_supabase_admin()
    updates = body.to_db_dict()
    if not updates:
        raise HTTPException(status_code=400, detail="No fields to update")

    result = (
        db.table(CategoryModel.TABLE_NAME)
        .update(updates)
        .eq(CategoryModel.ID, category_id)
        .execute()
    )
    if not result.data:
        raise HTTPException(status_code=404, detail="Category not found")
    return result.data[0]


@router.delete("/{category_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_category(category_id: int, _: str = Depends(get_current_admin)):
    """
    Admin: delete a category.
    Products in this category will have category_id set to NULL (see model ON DELETE SET NULL).
    """
    db = get_supabase_admin()
    result = (
        db.table(CategoryModel.TABLE_NAME)
        .delete()
        .eq(CategoryModel.ID, category_id)
        .execute()
    )
    if not result.data:
        raise HTTPException(status_code=404, detail="Category not found")
