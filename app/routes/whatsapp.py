from fastapi import APIRouter, Query
from typing import Optional
import urllib.parse

from config import get_settings
from database import get_supabase
from models import product as ProductModel

router = APIRouter(prefix="/whatsapp", tags=["WhatsApp"])
settings = get_settings()


@router.get("/order-url/{product_id}")
def get_order_url(product_id: int, quantity: Optional[int] = Query(1, ge=1)):
    """
    Generate a WhatsApp click-to-chat URL for ordering a product.
    Frontend uses this URL for the 'Order on WhatsApp' button.

    Returns:
        whatsapp_url: Direct link that opens WhatsApp with pre-filled message
        message: The pre-filled message text (for preview)
    """
    db = get_supabase()
    result = (
        db.table(ProductModel.TABLE_NAME)
        .select(
            f"{ProductModel.ID},"
            f"{ProductModel.NAME},"
            f"{ProductModel.PRICE},"
            f"{ProductModel.DISCOUNTED_PRICE},"
            f"{ProductModel.WHATSAPP_MESSAGE}"
        )
        .eq(ProductModel.ID, product_id)
        .single()
        .execute()
    )

    if not result.data:
        return {"whatsapp_url": None, "message": None}

    product = result.data
    effective_price = product["discounted_price"] or product["price"]

    # Fetch product primary image or first image
    from models import media as MediaModel
    media_result = (
        db.table(MediaModel.TABLE_NAME)
        .select("media_url")
        .eq(MediaModel.PRODUCT_ID, product_id)
        .eq(MediaModel.IS_PRIMARY, True)
        .limit(1)
        .execute()
    )
    if not media_result.data:
        media_result = (
            db.table(MediaModel.TABLE_NAME)
            .select("media_url")
            .eq(MediaModel.PRODUCT_ID, product_id)
            .limit(1)
            .execute()
        )
    
    image_url = media_result.data[0]["media_url"] if media_result.data else "No image"

    # Build message
    if product["whatsapp_message"]:
        message = product["whatsapp_message"]
    else:
        subtotal = effective_price * quantity
        view_part = f"\n   • View: {image_url}" if image_url != "No image" else ""

        def format_item_name(name: str) -> str:
            import re
            clean = re.sub(r'(?i)\s+Rakhi$', '', name).strip()
            if len(clean) > 18:
                clean = clean[:15] + "..."
            return clean.ljust(18)

        def format_qty(qty: int) -> str:
            return str(qty).rjust(3).ljust(5)

        def format_price(price: float) -> str:
            p_str = f"₹{int(price)}"
            return f" {p_str}".ljust(7)

        def format_total(total: float) -> str:
            return f" ₹{int(total)}"

        item_row = f"{format_item_name(product['name'])}|{format_qty(quantity)}|{format_price(effective_price)}|{format_total(subtotal)}"

        message = (
            f"Namaste! I would like to order this Rakhi:\n\n"
            f"*— ORDER DETAILS —*\n"
            f"-----------------------------\n"
            f"*{product['name']}*\n"
            f"   • Qty: {quantity} | ₹{int(effective_price)} each\n"
            f"   • Item Total: *₹{int(subtotal)}*{view_part}\n"
            f"-----------------------------\n"
            f"*BILL SUMMARY*\n"
            f"```\n"
            f"Item              | Qty | Each  | Total\n"
            f"{item_row}\n"
            f"```\n"
            f"-----------------------------\n"
            f"*Grand Total: ₹{int(subtotal)}*\n"
            f"-----------------------------\n"
            f"Please confirm availability & share payment details.\n"
            f"_Love and light!_"
        )

    encoded = urllib.parse.quote(message)
    whatsapp_url = f"https://wa.me/{settings.WHATSAPP_NUMBER}?text={encoded}"

    return {
        "whatsapp_url": whatsapp_url,
        "message": message,
        "product_name": product["name"],
        "price": effective_price,
    }


@router.get("/contact-url")
def get_contact_url(message: Optional[str] = Query(None)):
    """
    General WhatsApp contact URL — for the sticky contact button.
    Used when customer wants to ask a question, not order a specific product.
    """
    default_message = "Namaste! I visited your store and have a question about your Rakhi products. Could you please help me?"
    text = message or default_message
    encoded = urllib.parse.quote(text)
    return {
        "whatsapp_url": f"https://wa.me/{settings.WHATSAPP_NUMBER}?text={encoded}",
        "number": settings.WHATSAPP_NUMBER,
    }
