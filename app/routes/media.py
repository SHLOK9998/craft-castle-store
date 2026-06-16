import uuid
import io
from fastapi import APIRouter, HTTPException, UploadFile, File, Depends, Form
from typing import Optional

import cloudinary
import cloudinary.uploader

from app.database import get_supabase, get_supabase_admin
from app.models import media as MediaModel
from app.models import product as ProductModel
from app.schemas.media import MediaResponse, MediaReorderRequest
from app.auth.utils import get_current_admin
from app.config import get_settings

router = APIRouter(prefix="/media", tags=["Media"])
settings = get_settings()

cloudinary.config(
    cloud_name=settings.CLOUDINARY_CLOUD_NAME,
    api_key=settings.CLOUDINARY_API_KEY,
    api_secret=settings.CLOUDINARY_API_SECRET,
    secure=True
)


# ── Helpers ───────────────────────────────────

def validate_file(file: UploadFile, is_video: bool = False):
    """Validate file type and size before upload."""
    if is_video:
        if file.content_type not in MediaModel.ALLOWED_VIDEO_TYPES:
            raise HTTPException(
                status_code=400,
                detail=f"Invalid video type. Allowed: {MediaModel.ALLOWED_VIDEO_TYPES}",
            )
    else:
        if file.content_type not in MediaModel.ALLOWED_IMAGE_TYPES:
            raise HTTPException(
                status_code=400,
                detail=f"Invalid image type. Allowed: {MediaModel.ALLOWED_IMAGE_TYPES}",
            )


def build_storage_path(product_id: int, filename: str) -> str:
    """Build the storage path: products/{product_id}/{uuid}.ext"""
    ext = filename.rsplit(".", 1)[-1] if "." in filename else "jpg"
    unique_name = f"{uuid.uuid4().hex}.{ext}"
    return f"products/{product_id}/{unique_name}"


def get_public_url(storage_path: str) -> str:
    """Build the public CDN URL for a Supabase Storage file."""
    return (
        f"{settings.SUPABASE_URL}/storage/v1/object/public/"
        f"{settings.SUPABASE_STORAGE_BUCKET}/{storage_path}"
    )


# ─────────────────────────────────────────────
#  PUBLIC ROUTES
# ─────────────────────────────────────────────

@router.get("/product/{product_id}", response_model=list[MediaResponse])
def get_product_media(product_id: int):
    """Get all media for a product, ordered by sort_order."""
    db = get_supabase()
    result = (
        db.table(MediaModel.TABLE_NAME)
        .select("*")
        .eq(MediaModel.PRODUCT_ID, product_id)
        .order(MediaModel.SORT_ORDER)
        .execute()
    )
    return result.data


# ─────────────────────────────────────────────
#  ADMIN ROUTES
# ─────────────────────────────────────────────

@router.post("/upload/{product_id}", response_model=MediaResponse)
async def upload_media(
    product_id: int,
    file: UploadFile = File(...),
    is_primary: bool = Form(False),
    sort_order: int = Form(0),
    _: str = Depends(get_current_admin),
):
    """
    Admin: upload an image or video for a product.

    - Detects image vs video from content_type automatically
    - If is_primary=True, clears the previous primary image first
    - Returns the saved media record with public URL
    """
    db = get_supabase_admin()

    # Validate product exists
    product_check = (
        db.table(ProductModel.TABLE_NAME)
        .select(ProductModel.ID)
        .eq(ProductModel.ID, product_id)
        .execute()
    )
    if not product_check.data:
        raise HTTPException(status_code=404, detail="Product not found")

    # Detect media type
    is_video = file.content_type in MediaModel.ALLOWED_VIDEO_TYPES
    validate_file(file, is_video=is_video)

    # Read file bytes
    file_bytes = await file.read()

    # Check size limit
    max_bytes = (
        MediaModel.MAX_VIDEO_SIZE_MB * 1024 * 1024
        if is_video
        else MediaModel.MAX_IMAGE_SIZE_MB * 1024 * 1024
    )
    if len(file_bytes) > max_bytes:
        limit = MediaModel.MAX_VIDEO_SIZE_MB if is_video else MediaModel.MAX_IMAGE_SIZE_MB
        raise HTTPException(status_code=400, detail=f"File too large. Max size: {limit}MB")

    # Upload to Cloudinary
    resource_type = "video" if is_video else "image"
    try:
        upload_result = cloudinary.uploader.upload(
            file_bytes,
            resource_type=resource_type,
            folder=f"craft-castle/products/{product_id}"
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Cloudinary upload failed: {str(e)}"
        )

    secure_url = upload_result.get("secure_url")
    public_id = upload_result.get("public_id")

    if not secure_url or not public_id:
        raise HTTPException(
            status_code=500,
            detail="Cloudinary did not return a valid secure URL or public ID"
        )

    # If setting as primary, clear the old primary first
    if is_primary:
        db.table(MediaModel.TABLE_NAME).update(
            {MediaModel.IS_PRIMARY: False}
        ).eq(MediaModel.PRODUCT_ID, product_id).execute()

    # Save record to DB
    media_record = {
        MediaModel.PRODUCT_ID: product_id,
        MediaModel.MEDIA_URL: secure_url,
        MediaModel.STORAGE_PATH: public_id,
        MediaModel.MEDIA_TYPE: "video" if is_video else "image",
        MediaModel.IS_PRIMARY: is_primary,
        MediaModel.SORT_ORDER: sort_order,
    }

    result = db.table(MediaModel.TABLE_NAME).insert(media_record).execute()
    return result.data[0]


@router.patch("/{media_id}/set-primary", response_model=MediaResponse)
def set_primary_media(
    media_id: int,
    _: str = Depends(get_current_admin),
):
    """
    Admin: set an image as the primary (main display) image for its product.
    Automatically un-sets any existing primary for that product.
    """
    db = get_supabase_admin()

    # Get the media record to find its product_id
    media_result = (
        db.table(MediaModel.TABLE_NAME)
        .select("*")
        .eq(MediaModel.ID, media_id)
        .single()
        .execute()
    )
    if not media_result.data:
        raise HTTPException(status_code=404, detail="Media not found")

    product_id = media_result.data[MediaModel.PRODUCT_ID]

    # Clear existing primary
    db.table(MediaModel.TABLE_NAME).update(
        {MediaModel.IS_PRIMARY: False}
    ).eq(MediaModel.PRODUCT_ID, product_id).execute()

    # Set new primary
    result = (
        db.table(MediaModel.TABLE_NAME)
        .update({MediaModel.IS_PRIMARY: True})
        .eq(MediaModel.ID, media_id)
        .execute()
    )
    return result.data[0]


@router.patch("/reorder", status_code=200)
def reorder_media(
    body: MediaReorderRequest,
    _: str = Depends(get_current_admin),
):
    """
    Admin: update display order of multiple media items at once.
    Send a list of {media_id, sort_order} pairs.
    """
    db = get_supabase_admin()
    for item in body.items:
        db.table(MediaModel.TABLE_NAME).update(
            {MediaModel.SORT_ORDER: item.sort_order}
        ).eq(MediaModel.ID, item.media_id).execute()
    return {"message": f"Reordered {len(body.items)} items"}


@router.delete("/{media_id}", status_code=204)
def delete_media(media_id: int, _: str = Depends(get_current_admin)):
    """
    Admin: delete a media record AND remove the file from Supabase Storage.
    If the deleted item was primary, the next image becomes primary automatically.
    """
    db = get_supabase_admin()

    # Get record first to get storage_path and product_id
    media_result = (
        db.table(MediaModel.TABLE_NAME)
        .select("*")
        .eq(MediaModel.ID, media_id)
        .single()
        .execute()
    )
    if not media_result.data:
        raise HTTPException(status_code=404, detail="Media not found")

    media = media_result.data
    storage_path = media[MediaModel.STORAGE_PATH]
    product_id = media[MediaModel.PRODUCT_ID]
    was_primary = media[MediaModel.IS_PRIMARY]
    media_type = media[MediaModel.MEDIA_TYPE]

    # Delete from Cloudinary
    resource_type = "video" if media_type == "video" else "image"
    try:
        cloudinary.uploader.destroy(storage_path, resource_type=resource_type)
    except Exception as e:
        print(f"Cloudinary deletion failed for {storage_path}: {e}")

    # Delete DB record
    db.table(MediaModel.TABLE_NAME).delete().eq(MediaModel.ID, media_id).execute()

    # If deleted item was primary, promote the next image to primary
    if was_primary:
        remaining = (
            db.table(MediaModel.TABLE_NAME)
            .select(MediaModel.ID)
            .eq(MediaModel.PRODUCT_ID, product_id)
            .eq(MediaModel.MEDIA_TYPE, "image")
            .order(MediaModel.SORT_ORDER)
            .limit(1)
            .execute()
        )
        if remaining.data:
            db.table(MediaModel.TABLE_NAME).update(
                {MediaModel.IS_PRIMARY: True}
            ).eq(MediaModel.ID, remaining.data[0]["id"]).execute()
