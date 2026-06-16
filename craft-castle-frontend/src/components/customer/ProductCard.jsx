import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Icon } from '../shared/Icon'
import { useCart } from '../../context/CartContext'
import { useWishlist } from '../../context/WishlistContext'
import { toast } from 'react-hot-toast'

// Helper to generate elegant subtitles/attributes dynamically matching mockups
function getSubtext(name, description) {
  const n = name.toLowerCase()
  if (n.includes('zardosi') || n.includes('saffron')) {
    return 'Pure Silk & Hand-knotted'
  }
  if (n.includes('kundan') || n.includes('pearl') || n.includes('duo')) {
    return 'Semi-precious stones & Pearl'
  }
  if (n.includes('ganesha') || n.includes('krishna') || n.includes('l\'il')) {
    return 'Clay-friendly Colors'
  }
  if (n.includes('silver') || n.includes('motif') || n.includes('floral')) {
    return '925 Silver Plated'
  }
  if (n.includes('lumba') || n.includes('peacock')) {
    return 'Royal Peacock Collection'
  }
  
  if (description) {
    const parts = description.split(/[•|\n.]/)
    if (parts[0] && parts[0].length < 35) return parts[0].trim()
  }
  return 'Handcrafted with Love'
}

export function ProductCard({ product, variant = 'default' }) {
  const { addToCart } = useCart()
  const { toggleWishlist, isFavorited } = useWishlist()
  const favorited = isFavorited(product.id)

  const primaryMedia = product.media?.find(m => m.is_primary) || product.media?.[0]
  const hasDiscount = product.discounted_price && product.discounted_price < product.price
  const discountPct = hasDiscount
    ? Math.round(((product.price - product.discounted_price) / product.price) * 100)
    : 0

  const handleAddToCart = (e) => {
    e.preventDefault()
    e.stopPropagation()
    addToCart(product, 1)
    toast.success('Added to cart! 🛒')
  }

  const handleToggleWishlist = (e) => {
    e.preventDefault()
    e.stopPropagation()
    toggleWishlist(product.id)
    toast.success(favorited ? 'Removed from wishlist' : 'Saved to wishlist! ❤️')
  }

  // --- MINIMAL VARIANT ("You May Also Like") ---
  if (variant === 'minimal') {
    return (
      <Link to={`/product/${product.id}`} className="block group relative bg-white dark:bg-[#2c1e1b] rounded-xl border border-cf-gold/15 p-2.5 transition-all hover:shadow-md">
        <div className="relative aspect-square overflow-hidden rounded-lg bg-white dark:bg-[#1e1210] mb-2 p-1 border border-cf-gold/10">
          {primaryMedia ? (
            <img
              src={primaryMedia.media_url}
              alt={product.name}
              className="w-full h-full object-cover rounded-md group-hover:scale-102 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-4xl">🎀</div>
          )}
        </div>
        
        <div className="pr-10">
          <h3 className="font-medium text-cf-on-surface text-xs leading-tight line-clamp-1 mb-0.5">
            {product.name}
          </h3>
          <p className="text-cf-primary font-bold text-xs">
            ₹{hasDiscount ? product.discounted_price : product.price}
          </p>
        </div>

        {/* Floating Add to Cart circle button */}
        <button
          type="button"
          onClick={handleAddToCart}
          disabled={product.stock_quantity === 0}
          className="absolute bottom-2.5 right-2.5 w-8 h-8 rounded-full bg-white dark:bg-[#2c1e1b] border border-cf-gold/20 flex items-center justify-center text-cf-primary dark:text-cf-gold hover:bg-cf-surface dark:hover:bg-cf-saffron/20 transition-colors shadow-sm disabled:opacity-50"
          title="Add to cart"
        >
          <Icon name="shopping_cart" size={15} />
        </button>
      </Link>
    )
  }

  // --- DEFAULT VARIANT (Home page grid) ---
  const isBestseller = product.is_featured
  const isLimited = product.stock_quantity > 0 && product.stock_quantity <= 5

  return (
    <Link to={`/product/${product.id}`} className="block overflow-hidden rounded-xl bg-white dark:bg-[#2c1e1b] border border-[#e8dcd8] dark:border-cf-gold/20 transition-all hover:-translate-y-0.5 hover:shadow-lg group">
      {/* Image Container with elegant card border */}
      <div className="relative aspect-square bg-white dark:bg-[#1e1210] overflow-hidden p-1.5 border-b border-[#e8dcd8] dark:border-cf-gold/15">
        {primaryMedia ? (
          <img
            src={primaryMedia.media_url}
            alt={product.name}
            className="w-full h-full object-cover rounded-lg group-hover:scale-102 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-6xl">🎀</div>
        )}

        {/* Floating Wishlist Button */}
        <button
          type="button"
          onClick={handleToggleWishlist}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/95 dark:bg-black/75 backdrop-blur-sm shadow flex items-center justify-center text-cf-outline hover:text-cf-primary transition-all duration-200 z-20 focus:outline-none"
          title={favorited ? "Remove from wishlist" : "Add to wishlist"}
        >
          <span className={`material-symbols-outlined text-sm ${favorited ? 'text-red-500' : 'text-cf-outline dark:text-gray-300'}`} style={{ fontVariationSettings: favorited ? "'FILL' 1" : "'FILL' 0" }}>
            favorite
          </span>
        </button>

        {/* Badges top-left */}
        <div className="absolute top-3 left-3 flex flex-col gap-1 z-10 pointer-events-none">
          {isBestseller && (
            <span className="bg-[#FF9933] text-white text-[9px] font-bold px-1.5 py-0.5 rounded tracking-wide uppercase">
              Bestseller
            </span>
          )}
          {isLimited && (
            <span className="bg-[#D4AF37] text-white text-[9px] font-bold px-1.5 py-0.5 rounded tracking-wide uppercase">
              Limited Edition
            </span>
          )}
          {hasDiscount && (
            <span className="bg-cf-primary text-white text-[9px] font-bold px-1.5 py-0.5 rounded tracking-wide uppercase">
              {discountPct}% OFF
            </span>
          )}
        </div>
      </div>

      {/* Info Section */}
      <div className="p-3">
        <h3 className="font-playfair font-bold text-cf-on-surface text-sm leading-tight line-clamp-1 mb-0.5">
          {product.name}
        </h3>
        <p className="text-[10px] text-cf-outline line-clamp-1 mb-2">
          {getSubtext(product.name, product.description)}
        </p>

        {/* Price & Add Row */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-baseline gap-1.5 min-w-0">
            <span className="text-cf-primary dark:text-cf-gold font-bold text-sm shrink-0">
              ₹{hasDiscount ? product.discounted_price : product.price}
            </span>
            {hasDiscount && (
              <span className="text-[10px] text-cf-outline line-through truncate">
                ₹{product.price}
              </span>
            )}
          </div>
          <button
            onClick={handleAddToCart}
            disabled={product.stock_quantity === 0}
            className="bg-cf-primary hover:bg-cf-primary-c text-white text-xs px-3.5 py-1.5 rounded font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
          >
            Add
          </button>
        </div>
      </div>
    </Link>
  )
}

