from pydantic import BaseModel, field_validator
from typing import Optional
from datetime import datetime
import re


# ── Helpers ──────────────────────────────────

def generate_slug(name: str) -> str:
    """Convert 'Thread Rakhi' → 'thread-rakhi'"""
    return re.sub(r'[^a-z0-9]+', '-', name.lower()).strip('-')


# ── Request Schemas (what API receives) ──────

class CategoryCreate(BaseModel):
    name: str
    description: Optional[str] = None
    sort_order: int = 0
    is_active: bool = True

    @field_validator("name")
    @classmethod
    def name_must_not_be_empty(cls, v):
        if not v.strip():
            raise ValueError("Category name cannot be empty")
        return v.strip()

    def to_db_dict(self) -> dict:
        return {
            "name": self.name,
            "slug": generate_slug(self.name),
            "description": self.description,
            "sort_order": self.sort_order,
            "is_active": self.is_active,
        }


class CategoryUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    sort_order: Optional[int] = None
    is_active: Optional[bool] = None

    def to_db_dict(self) -> dict:
        data = self.model_dump(exclude_none=True)
        if "name" in data:
            data["slug"] = generate_slug(data["name"])
        return data


# ── Response Schemas (what API returns) ──────

class CategoryResponse(BaseModel):
    id: int
    name: str
    slug: str
    description: Optional[str]
    is_active: bool
    sort_order: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class CategoryListResponse(BaseModel):
    total: int
    categories: list[CategoryResponse]
