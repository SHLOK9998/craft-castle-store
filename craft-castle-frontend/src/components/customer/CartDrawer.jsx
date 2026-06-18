import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { useCart } from '../../context/CartContext'
import { Icon } from '../shared/Icon'
import { getContactUrl } from '../../api/whatsapp'

// Helper to generate matching subtitles
function getSubtext(name) {
  const n = name.toLowerCase()
  if (n.includes('zardosi') || n.includes('saffron')) return 'Pure Silk · Hand-knotted'
  if (n.includes('kundan') || n.includes('pearl') || n.includes('duo')) return 'Semi-precious · Pearl'
  if (n.includes('ganesha') || n.includes('krishna') || n.includes('l\'il')) return 'Eco-friendly · Clay-based'
  return 'Handmade · Designer Collection'
}

export function CartDrawer({ isOpen, onClose }) {
  const { cart, updateQuantity, removeFromCart, clearCart, cartSubtotal } = useCart()
  const [waNumber, setWaNumber] = useState('919998931393')

  // Fetch the WhatsApp number from backend on mount
  useEffect(() => {
    getContactUrl()
      .then(res => {
        if (res.data.number) {
          setWaNumber(res.data.number)
        }
      })
      .catch(err => console.error('Failed to load WhatsApp contact:', err))
  }, [])

  if (!isOpen) return null

  const handleCheckout = () => {
    if (cart.length === 0) return

    const formatItemName = (name) => {
      let clean = name.replace(/\s+Rakhi$/i, '').trim();
      if (clean.length > 18) {
        clean = clean.slice(0, 15) + '...';
      }
      return clean.padEnd(18, ' ');
    };

    const formatQty = (qty) => {
      return String(qty).padStart(3, ' ').padEnd(5, ' ');
    };

    const formatPrice = (price) => {
      const pStr = `₹${price}`;
      return ` ${pStr}`.padEnd(7, ' ');
    };

    const formatTotal = (total) => {
      return ` ₹${total}`;
    };

    let message = ''

    if (cart.length === 1) {
      const item = cart[0]
      const price = item.product.discounted_price || item.product.price
      const subtotal = price * item.quantity
      const primaryMedia = item.product.media?.find(m => m.is_primary) || item.product.media?.[0]
      const imageUrl = primaryMedia ? primaryMedia.media_url : 'No image'
      const viewPart = imageUrl !== 'No image' ? `\n   • View: ${imageUrl}` : ''

      message = 
`Namaste! I would like to order this Rakhi:

*— ORDER DETAILS —*
-----------------------------
*${item.product.name}*
   • Qty: ${item.quantity} | ₹${price} each
   • Item Total: *₹${subtotal}*${viewPart}
-----------------------------
*BILL SUMMARY*
\`\`\`
Item              | Qty | Each  | Total
${formatItemName(item.product.name)}|${formatQty(item.quantity)}|${formatPrice(price)}|${formatTotal(subtotal)}
\`\`\`
-----------------------------
*Grand Total: ₹${subtotal}*
-----------------------------
Please confirm availability & share payment details.
_Love and light!_`
    } else {
      let itemDetails = ''
      let tableRows = ''
      
      cart.forEach((item, index) => {
        const price = item.product.discounted_price || item.product.price
        const subtotal = price * item.quantity
        const primaryMedia = item.product.media?.find(m => m.is_primary) || item.product.media?.[0]
        const imageUrl = primaryMedia ? primaryMedia.media_url : 'No image'

        itemDetails += `*${index + 1}. ${item.product.name}*\n`
        itemDetails += `   • Qty: ${item.quantity} | ₹${price} each\n`
        itemDetails += `   • Item Total: *₹${subtotal}*\n`
        if (imageUrl !== 'No image') {
          itemDetails += `   • View: ${imageUrl}\n`
        }
        itemDetails += `\n`

        tableRows += `${formatItemName(item.product.name)}|${formatQty(item.quantity)}|${formatPrice(price)}|${formatTotal(subtotal)}\n`
      })

      tableRows = tableRows.trim()

      message = 
`Namaste! I would like to place an order for these Rakhis:

*— MY ORDER DETAILS —*
-----------------------------
${itemDetails}-----------------------------
*BILL SUMMARY*
\`\`\`
Item              | Qty | Each  | Total
${tableRows}
\`\`\`
-----------------------------
*Grand Total: ₹${cartSubtotal}*
-----------------------------
Please confirm availability & share payment details.
_Love and light!_`
    }

    const encodedText = encodeURIComponent(message)
    const url = `https://wa.me/${waNumber}?text=${encodedText}`
    window.open(url, '_blank')
    clearCart()
    onClose()
  }

  return createPortal(
    <div className="fixed inset-0 z-[100] overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity animate-fade-in"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#FAF5EC] dark:bg-[#1e1210] text-cf-on-surface border-l border-cf-gold/20 flex flex-col shadow-2xl animate-slide-in-right">
          
          {/* Header */}
          <div className="px-5 py-5 border-b border-[#e8dcd8] dark:border-cf-gold/20 flex items-center justify-between">
            <div className="flex items-center gap-2 text-cf-primary dark:text-cf-gold">
              <Icon name="shopping_bag" size={20} />
              <h2 className="font-playfair text-base font-bold">Your Cart</h2>
            </div>
            <button 
              onClick={onClose}
              className="p-1 rounded-full text-cf-outline hover:opacity-85 transition-opacity"
              title="Close cart"
            >
              <Icon name="close" size={20} />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 py-5 overflow-y-auto px-5 scrollbar-hide">
            {cart.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
                <span className="text-5xl opacity-40">🎀</span>
                <p className="text-sm font-semibold text-cf-outline">Your cart is empty</p>
                <button 
                  onClick={onClose}
                  className="text-xs bg-cf-primary text-white font-semibold px-5 py-2.5 rounded-lg hover:bg-cf-primary-c transition-colors"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              cart.map((item, index) => {
                const primaryMedia = item.product.media?.find(m => m.is_primary) || item.product.media?.[0]
                const price = item.product.discounted_price || item.product.price

                return (
                  <div key={item.product.id}>
                    {/* Item Row */}
                    <div className="flex gap-4 py-3 items-center">
                      {/* Thumbnail */}
                      <div className="w-16 h-16 rounded-lg overflow-hidden bg-white dark:bg-[#2c1e1b] border border-[#e8dcd8] dark:border-cf-gold/15 shrink-0">
                        {primaryMedia ? (
                          <img 
                            src={primaryMedia.media_url} 
                            alt={item.product.name} 
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-2xl">🎀</div>
                        )}
                      </div>

                      {/* Product details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="font-playfair text-sm font-bold text-cf-on-surface line-clamp-1">
                            {item.product.name}
                          </h4>
                          <span className="font-bold text-sm text-cf-primary dark:text-[#ffb4a9] shrink-0">
                            ₹{price * item.quantity}
                          </span>
                        </div>
                        
                        <p className="text-[10px] text-cf-outline mb-2">
                          {getSubtext(item.product.name)}
                        </p>

                        <div className="flex items-center justify-between">
                          {/* Double-digit display quantity selector */}
                          <div className="flex items-center border border-[#e8dcd8] dark:border-cf-gold/20 rounded-lg overflow-hidden h-7 bg-white dark:bg-[#2c1e1b]">
                            <button 
                              onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                              className="px-2.5 text-cf-primary dark:text-cf-gold font-bold text-xs hover:bg-cf-surface"
                            >
                              −
                            </button>
                            <span className="px-2 text-xs font-semibold select-none w-5 text-center">
                              {String(item.quantity).padStart(2, '0')}
                            </span>
                            <button 
                              onClick={() => updateQuantity(item.product.id, Math.min(item.product.stock_quantity, item.quantity + 1))}
                              className="px-2.5 text-cf-primary dark:text-cf-gold font-bold text-xs hover:bg-cf-surface"
                            >
                              +
                            </button>
                          </div>

                          <button 
                            onClick={() => removeFromCart(item.product.id)}
                            className="text-cf-outline hover:text-red-500 text-xs flex items-center gap-1 transition-colors"
                          >
                            <Icon name="delete" size={13} /> Remove
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Ornate Divider with gold dot */}
                    {index < cart.length - 1 && (
                      <div className="flex items-center justify-center my-2.5">
                        <div className="h-[1px] bg-cf-gold/15 flex-1"></div>
                        <div className="mx-2.5 text-[10px] text-[#D4AF37] select-none">✦ 🪷 ✦</div>
                        <div className="h-[1px] bg-cf-gold/15 flex-1"></div>
                      </div>
                    )}
                  </div>
                )
              })
            )}
          </div>

          {/* Footer Bill & Checkout */}
          {cart.length > 0 && (
            <div className="border-t border-[#e8dcd8] dark:border-cf-gold/20 px-5 py-5 bg-[#f5eae6] dark:bg-[#1e1210] space-y-4">
              <div className="space-y-2 text-xs">
                <div className="flex justify-between font-bold text-cf-on-surface text-sm">
                  <span>Total</span>
                  <span className="text-cf-primary dark:text-cf-gold text-base">₹{cartSubtotal}</span>
                </div>
              </div>

              {/* Checkout Buttons */}
              <div>
                <button
                  onClick={handleCheckout}
                  className="w-full bg-[#25D366] hover:bg-[#20ba56] text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 text-xs uppercase tracking-wider transition-colors shadow-sm"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  Order on WhatsApp
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  )
}
