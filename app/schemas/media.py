from pydantic import BaseModel
from typing import Optional, Literal
from datetime import datetime


class MediaResponse(BaseModel):
    id: int
    product_id: int
    media_url: str
    storage_path: str
    media_type: Literal["image", "video"]
    is_primary: bool
    sort_order: int
    created_at: datetime

    class Config:
        from_attributes = True


class MediaSetPrimary(BaseModel):
    media_id: int
    product_id: int


class MediaReorder(BaseModel):
    """Used to update display order of media items"""
    media_id: int
    sort_order: int


class MediaReorderRequest(BaseModel):
    items: list[MediaReorder]
