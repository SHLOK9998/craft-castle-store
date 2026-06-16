import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { useWishlist } from '../../context/WishlistContext'
import { useCart } from '../../context/CartContext'
import { getProduct } from '../../api/products'
import { Icon } from '../shared/Icon'
import { toast } from 'react-hot-toast'

function getSubtext(name) {
  const n = name.toLowerCase()
  if (n.includes('zardosi') || n.includes('saffron')) return 'Pure Silk · Hand-knotted'
  if (n.includes('kundan') || n.includes('pearl') || n.includes('duo')) return 'Semi-precious · Pearl'
  if (n.includes('ganesha') || n.includes('krishna') || n.includes('l\'il')) return 'Eco-friendly · Clay-based'
  return 'Handmade · Designer Collection'
}

export function WishlistDrawer({ isOpen, onClose }) {
  const { wishlist, toggleWishlist } = useWishlist()
  const { addToCart } = useCart()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)

  // Fetch details for all wishlisted product IDs
  useEffect(() => {
    if (!isOpen || wishlist.length === 0) {
      setProducts([])
      return
    }

    setLoading(true)
    const fetchPromises = wishlist.map(id =>
      getProduct(id)
        .then(res => res.data)
        .catch(err => {
          console.error(`Failed to load product #${id} for wishlist:`, err)
          return null
        })
    )

    Promise.all(fetchPromises)
      .then(results => {
        // Filter out any failed product fetches
        setProducts(results.filter(p => p !== null))
      })
      .finally(() => {
        setLoading(false)
      })
  }, [isOpen, wishlist])

  if (!isOpen) return null

  const handleAddToCart = (product) => {
    addToCart(product, 1)
    toast.success(`${product.name} added to cart! 🛒`)
  }

  const handleRemove = (productId, productName) => {
    toggleWishlist(productId)
    toast.success(`${productName} removed from wishlist`)
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
              <Icon name="favorite" size={20} className="fill-current text-red-500" />
              <h2 className="font-playfair text-base font-bold">Your Wishlist</h2>
            </div>
            <button 
              onClick={onClose}
              className="p-1 rounded-full text-cf-outline hover:opacity-85 transition-opacity"
              title="Close wishlist"
            >
              <Icon name="close" size={20} />
            </button>
          </div>

          {/* Items List */}
          <div className="flex-1 py-5 overflow-y-auto px-5 scrollbar-hide">
            {loading ? (
              <div className="flex flex-col items-center justify-center h-full space-y-3">
                <div className="w-8 h-8 border-4 border-cf-primary border-t-transparent rounded-full animate-spin"></div>
                <p className="text-xs text-cf-outline font-semibold">Loading your favorites...</p>
              </div>
            ) : wishlist.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
                <span className="text-5xl opacity-40">❤️</span>
                <p className="text-sm font-semibold text-cf-outline">Your wishlist is empty</p>
                <button 
                  onClick={onClose}
                  className="text-xs bg-cf-primary hover:bg-cf-primary-c text-white font-semibold px-5 py-2.5 rounded-lg transition-colors"
                >
                  Find some Rakhis
                </button>
              </div>
            ) : (
              products.map((product, index) => {
                const primaryMedia = product.media?.find(m => m.is_primary) || product.media?.[0]
                const price = product.discounted_price || product.price

                return (
                  <div key={product.id}>
                    {/* Item Row */}
                    <div className="flex gap-4 py-3 items-center">
                      {/* Thumbnail */}
                      <div className="w-16 h-16 rounded-lg overflow-hidden bg-white dark:bg-[#2c1e1b] border border-[#e8dcd8] dark:border-cf-gold/15 shrink-0">
                        {primaryMedia ? (
                          <img 
                            src={primaryMedia.media_url} 
                            alt={product.name} 
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
                            {product.name}
                          </h4>
                          <span className="font-bold text-sm text-cf-primary dark:text-cf-gold shrink-0">
                            ₹{price}
                          </span>
                        </div>
                        
                        <p className="text-[10px] text-cf-outline mb-2">
                          {getSubtext(product.name)}
                        </p>

                        <div className="flex items-center justify-between">
                          {/* Quick Add to Cart */}
                          <button
                            type="button"
                            onClick={() => handleAddToCart(product)}
                            disabled={product.stock_quantity === 0}
                            className="bg-cf-primary hover:bg-cf-primary-c disabled:opacity-50 text-white font-semibold text-[10px] uppercase tracking-wider px-3 py-1.5 rounded flex items-center gap-1 transition-colors"
                          >
                            <Icon name="shopping_bag" size={12} />
                            Add to Cart
                          </button>

                          <button 
                            onClick={() => handleRemove(product.id, product.name)}
                            className="text-cf-outline hover:text-red-500 text-xs flex items-center gap-1 transition-colors"
                          >
                            <Icon name="delete" size={13} /> Remove
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Ornate Divider with gold dot */}
                    {index < products.length - 1 && (
                      <div className="flex items-center justify-center my-2.5">
                        <div className="h-[1px] bg-cf-gold/15 flex-1"></div>
                        <div className="w-1 h-1 rounded-full bg-[#D4AF37]/80 mx-2"></div>
                        <div className="h-[1px] bg-cf-gold/15 flex-1"></div>
                      </div>
                    )}
                  </div>
                )
              })
            )}
          </div>
        </div>
      </div>
    </div>,
    document.body
  )
}
