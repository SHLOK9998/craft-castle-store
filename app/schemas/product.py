from pydantic import BaseModel, field_validator, model_validator
from typing import Optional
from datetime import datetime
from decimal import Decimal
import re

from schemas.media import MediaResponse


# ── Helpers ──────────────────────────────────

def generate_slug(name: str) -> str:
    return re.sub(r'[^a-z0-9]+', '-', name.lower()).strip('-')


# ── Request Schemas ───────────────────────────

class ProductCreate(BaseModel):
    name: str
    description: str
    price: Decimal
    discounted_price: Optional[Decimal] = None
    stock_quantity: int = 0
    category_id: int
    is_featured: bool = False
    is_active: bool = True
    whatsapp_message: Optional[str] = None

    @field_validator("name")
    @classmethod
    def name_not_empty(cls, v):
        if not v.strip():
            raise ValueError("Product name cannot be empty")
        return v.strip()

    @field_validator("description")
    @classmethod
    def description_not_empty(cls, v):
        if not v.strip():
            raise ValueError("Product description cannot be empty")
        return v.strip()

    @field_validator("category_id")
    @classmethod
    def category_id_must_be_positive(cls, v):
        if v <= 0:
            raise ValueError("A valid category must be selected")
        return v

    @field_validator("price")
    @classmethod
    def price_must_be_positive(cls, v):
        if v <= 0:
            raise ValueError("Price must be greater than 0")
        return v

    @field_validator("stock_quantity")
    @classmethod
    def stock_not_negative(cls, v):
        if v < 0:
            raise ValueError("Stock quantity cannot be negative")
        return v

    @model_validator(mode="after")
    def discounted_less_than_price(self):
        if self.discounted_price and self.discounted_price >= self.price:
            raise ValueError("Discounted price must be less than original price")
        return self

    def to_db_dict(self) -> dict:
        return {
            "name": self.name,
            "slug": generate_slug(self.name),
            "description": self.description,
            "price": float(self.price),
            "discounted_price": float(self.discounted_price) if self.discounted_price else None,
            "stock_quantity": self.stock_quantity,
            "category_id": self.category_id,
            "is_featured": self.is_featured,
            "is_active": self.is_active,
            "whatsapp_message": self.whatsapp_message,
        }


class ProductUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    price: Optional[Decimal] = None
    discounted_price: Optional[Decimal] = None
    stock_quantity: Optional[int] = None
    category_id: Optional[int] = None
    is_featured: Optional[bool] = None
    is_active: Optional[bool] = None
    whatsapp_message: Optional[str] = None

    def to_db_dict(self) -> dict:
        data = self.model_dump(exclude_none=True)
        if "name" in data:
            data["slug"] = generate_slug(data["name"])
        if "price" in data:
            data["price"] = float(data["price"])
        if "discounted_price" in data:
            data["discounted_price"] = float(data["discounted_price"])
        return data


class StockUpdate(BaseModel):
    """Quick stock quantity update — used from admin panel"""
    stock_quantity: int

    @field_validator("stock_quantity")
    @classmethod
    def stock_not_negative(cls, v):
        if v < 0:
            raise ValueError("Stock quantity cannot be negative")
        return v


# ── Response Schemas ──────────────────────────

class ProductResponse(BaseModel):
    id: int
    name: str
    slug: str
    description: Optional[str]
    price: float
    discounted_price: Optional[float]
    stock_quantity: int
    category_id: Optional[int]
    is_featured: bool
    is_active: bool
    whatsapp_message: Optional[str]
    created_at: datetime
    updated_at: datetime

    # Computed fields
    @property
    def is_in_stock(self) -> bool:
        return self.stock_quantity > 0

    @property
    def discount_percentage(self) -> Optional[int]:
        if self.discounted_price:
            return int(((self.price - self.discounted_price) / self.price) * 100)
        return None

    class Config:
        from_attributes = True


class ProductDetailResponse(ProductResponse):
    """Full product with media — used on product detail page"""
    media: list[MediaResponse] = []


class ProductListResponse(BaseModel):
    total: int
    page: int
    page_size: int
    products: list[ProductDetailResponse]
