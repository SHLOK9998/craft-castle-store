import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { getProduct, getProducts } from '../api/products'
import { getCategories } from '../api/categories'
import { Header } from '../components/customer/Header'
import { PageLoader } from '../components/shared/LoadingSpinner'
import { Icon } from '../components/shared/Icon'
import { useWishlist } from '../context/WishlistContext'
import { useCart } from '../context/CartContext'
import { ProductCard } from '../components/customer/ProductCard'
import { Footer } from '../components/customer/Footer'
import { toast } from 'react-hot-toast'

export function ProductDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [product, setProduct] = useState(null)
  const [recommendations, setRecommendations] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeImg, setActiveImg] = useState(0)
  const [qty, setQty] = useState(1)
  const { toggleWishlist, isFavorited } = useWishlist()
  const { addToCart } = useCart()
  const favorited = product ? isFavorited(product.id) : false

  const handleBack = () => {
    if (window.history.state && window.history.state.idx > 0) {
      navigate(-1)
    } else {
      navigate('/')
    }
  }

  useEffect(() => {
    setLoading(true)
    getProduct(id)
      .then(r => { 
        setProduct(r.data)
        setLoading(false) 
      })
      .catch(() => setLoading(false))
  }, [id])

  useEffect(() => {
    getCategories()
      .then(res => setCategories(res.data.categories || []))
      .catch(err => console.error('Failed to load categories', err))
  }, [])

  useEffect(() => {
    if (!product?.category_id) return

    // Load recommendations: prioritize same category
    getProducts({ category_id: product.category_id, page_size: 7 })
      .then(res => {
        const sameCategoryList = (res.data.products || []).filter(p => p.id !== product.id)
        
        if (sameCategoryList.length >= 6) {
          setRecommendations(sameCategoryList.slice(0, 6))
        } else {
          // Fetch general products as a fallback/fill-in
          getProducts({ page_size: 7 })
            .then(generalRes => {
              const generalList = (generalRes.data.products || []).filter(
                p => p.id !== product.id && !sameCategoryList.some(item => item.id === p.id)
              )
              const combined = [...sameCategoryList, ...generalList].slice(0, 6)
              setRecommendations(combined)
            })
            .catch(err => {
              console.error('Failed to load fill-in recommendations', err)
              setRecommendations(sameCategoryList)
            })
        }
      })
      .catch(err => console.error('Failed to load recommendations', err))
  }, [product?.category_id, product?.id, id])

  if (loading) return <PageLoader />
  if (!product) return (
    <div className="min-h-screen bg-[#FAF5EC] dark:bg-[#1e1210]">
      <Header />
      <div className="max-w-container mx-auto px-4 py-20 text-center">
        <p className="text-cf-outline">Product not found.</p>
        <Link to="/" className="text-cf-primary underline text-sm mt-2 inline-block">← Back to catalogue</Link>
      </div>
    </div>
  )

  const media = product.media || []
  const hasDiscount = product.discounted_price && product.discounted_price < product.price
  const discountPct = hasDiscount ? Math.round(((product.price - product.discounted_price) / product.price) * 100) : 0
  const effectivePrice = hasDiscount ? product.discounted_price : product.price
  const matchedCategory = categories.find(c => c.id === product.category_id)
  const categoryName = matchedCategory ? matchedCategory.name : 'Designer Collection'

  const handleAddToCart = () => {
    addToCart(product, qty)
    toast.success('Added to cart! 🛒')
  }

  const handleBuyNow = () => {
    addToCart(product, qty)
    window.dispatchEvent(new CustomEvent('open-cart'))
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: product.name, url: window.location.href })
    } else {
      navigator.clipboard.writeText(window.location.href)
      toast.success('Product link copied! 🔗')
    }
  }

  return (
    <div className="min-h-screen bg-[#FAF5EC] dark:bg-[#1e1210] transition-colors duration-200">
      <Header />
      
      <div className="max-w-container mx-auto px-4 sm:px-6 pt-3.5 pb-6 sm:pb-8">
        
        {/* Back Button */}
        <button
          onClick={handleBack}
          className="mb-4 sm:mb-6 flex items-center gap-1.5 text-xs font-semibold text-cf-outline hover:text-cf-primary dark:text-[#FAF5EC]/85 dark:hover:text-cf-saffron transition-colors group focus:outline-none"
          title="Go back"
        >
          <Icon name="arrow_back" size={16} className="transition-transform group-hover:-translate-x-0.5" />
          <span>Back</span>
        </button>
        
        {/* Main Grid: Gallery & Details */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-10 lg:gap-16 mb-6 md:mb-12 items-start">
          
          {/* Left: Gallery (md:col-span-5) */}
          <div className="md:col-span-5">
            {/* Large Main Image Container with elegant gold border frame */}
            <div className="relative w-full max-w-[280px] md:max-w-[420px] aspect-square rounded-2xl overflow-hidden bg-white dark:bg-[#2c1e1b] border-2 border-cf-gold/15 p-1.5 shadow-sm mx-auto">
              {media.length > 0 ? (
                media[activeImg]?.media_type === 'video' ? (
                  <video src={media[activeImg].media_url} controls className="w-full h-full object-cover rounded-xl" />
                ) : (
                  <img src={media[activeImg]?.media_url} alt={product.name} className="w-full h-full object-cover rounded-xl animate-fade-in" />
                )
              ) : (
                <div className="w-full h-full flex items-center justify-center text-8xl">🎀</div>
              )}

              {/* Floating Action Buttons top right on image */}
              <div className="absolute top-4 right-4 flex flex-col gap-2.5 z-20">
                {/* Wishlist Button */}
                <button
                  type="button"
                  onClick={() => {
                    toggleWishlist(product.id)
                    toast.success(favorited ? 'Removed from wishlist' : 'Saved to wishlist! ❤️')
                  }}
                  className="w-9 h-9 bg-white/95 dark:bg-black/75 backdrop-blur-sm shadow-md rounded-full flex items-center justify-center text-cf-outline hover:text-cf-primary transition-all duration-200 focus:outline-none"
                  title={favorited ? "Remove from wishlist" : "Add to wishlist"}
                >
                  <span className={`material-symbols-outlined text-base ${favorited ? 'text-red-500' : 'text-cf-outline dark:text-gray-300'}`} style={{ fontVariationSettings: favorited ? "'FILL' 1" : "'FILL' 0" }}>
                    favorite
                  </span>
                </button>

                {/* Share Button */}
                <button
                  type="button"
                  onClick={handleShare}
                  className="w-9 h-9 bg-white/95 dark:bg-black/75 backdrop-blur-sm shadow-md rounded-full flex items-center justify-center text-cf-outline hover:text-cf-primary transition-all duration-200 focus:outline-none"
                  title="Share product"
                >
                  <Icon name="share" size={15} className="text-cf-outline dark:text-gray-300" />
                </button>
              </div>

              {/* Bestseller Badge bottom left on main image */}
              {product.is_featured && (
                <span className="absolute bottom-6 left-6 bg-[#FF9933] text-white text-[10px] font-bold px-3 py-1.5 rounded-lg shadow uppercase tracking-wider z-10">
                  Bestseller
                </span>
              )}
            </div>
          </div>

          {/* Right: Details column (md:col-span-7) */}
          <div className="md:col-span-7 flex flex-col justify-start">
            
            {/* Breadcrumb */}
            <div className="text-[10px] sm:text-[11px] text-cf-outline/85 tracking-wider uppercase font-semibold mb-1">
              Rakhi <span className="mx-1.5 text-cf-gold">›</span> {categoryName}
            </div>

            {/* Product Title */}
            <h1 className="font-playfair text-2xl sm:text-4xl font-extrabold text-cf-on-surface mb-2 leading-tight">
              {product.name}
            </h1>

            {/* Price Details */}
            <div className="flex items-center gap-3.5 mb-4 sm:mb-5">
              <span className="text-cf-primary dark:text-cf-gold font-bold text-2xl sm:text-3xl">₹{effectivePrice}</span>
              {hasDiscount && (
                <>
                  <span className="text-cf-outline text-lg line-through">₹{product.price}</span>
                  <span className="bg-[#D4AF37]/20 dark:bg-[#725a1b]/40 text-[#725a1b] dark:text-[#f3d673] text-[10px] font-bold px-2 py-1 rounded">
                    {discountPct}% OFF
                  </span>
                </>
              )}
            </div>

            {/* Horizontal Extra Images above the price */}
            {media.length > 1 && (
              <div className="flex gap-2.5 overflow-x-auto pb-2 mb-4 scrollbar-hide">
                {media.map((m, i) => (
                  <button
                    key={m.id}
                    onClick={() => setActiveImg(i)}
                    className={`shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-lg overflow-hidden border-2 p-0.5 transition-all duration-150 ${
                      i === activeImg 
                        ? 'border-[#D4AF37] shadow-sm bg-white dark:bg-[#2c1e1b]' 
                        : 'border-cf-gold/15 dark:border-cf-gold/5 hover:border-cf-gold/40'
                    }`}
                  >
                    {m.media_type === 'video' ? (
                      <div className="w-full h-full bg-[#FAF5EC] dark:bg-[#2c1e1b] flex items-center justify-center text-cf-primary rounded">
                        <Icon name="play_circle" size={18} />
                      </div>
                    ) : (
                      <img src={m.media_url} alt="" className="w-full h-full object-cover rounded" />
                    )}
                  </button>
                ))}
              </div>
            )}

            {/* Quantity Selector & Add to Cart Row */}
            <div className="flex items-center gap-3.5 mb-3">
              {product.stock_quantity > 0 && (
                <div className="flex items-center border border-[#e8dcd8] dark:border-cf-gold/20 rounded-lg overflow-hidden h-11 bg-white dark:bg-[#2c1e1b] shrink-0">
                  <button 
                    type="button"
                    onClick={() => setQty(q => Math.max(1, q - 1))} 
                    className="px-3 h-full hover:bg-cf-surface text-cf-primary dark:text-cf-gold font-bold text-sm"
                  >
                    −
                  </button>
                  <span className="px-2 text-sm font-semibold text-cf-on-surface w-6 text-center select-none">
                    {qty}
                  </span>
                  <button 
                    type="button"
                    onClick={() => setQty(q => Math.min(product.stock_quantity, q + 1))} 
                    className="px-3 h-full hover:bg-cf-surface text-cf-primary dark:text-cf-gold font-bold text-sm"
                  >
                    +
                  </button>
                </div>
              )}

              <button
                type="button"
                onClick={handleAddToCart}
                disabled={product.stock_quantity === 0}
                className="flex-1 h-11 bg-cf-primary hover:bg-cf-primary-c text-white font-semibold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-xs uppercase tracking-wider"
              >
                <Icon name="shopping_bag" size={16} />
                Add to Cart
              </button>
            </div>

            {/* Buy Now Button */}
            <button
              type="button"
              onClick={handleBuyNow}
              disabled={product.stock_quantity === 0}
              className="w-full h-11 bg-transparent hover:bg-cf-surface dark:hover:bg-white/5 text-cf-primary dark:text-cf-gold font-bold border border-[#D4AF37] rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed mb-6 text-xs uppercase tracking-wider"
            >
              Buy Now
            </button>

            {product.stock_quantity === 0 && (
              <p className="text-red-600 text-xs font-semibold mb-4 text-center">
                Out of Stock. Message us below for restocking alerts.
              </p>
            )}


            {/* Product Description */}
            {product.description && (
              <div className="border-t border-[#e8dcd8] dark:border-cf-gold/15 pt-4">
                <h4 className="text-[11px] font-bold uppercase tracking-wider text-cf-primary mb-2">Description</h4>
                <p className="text-cf-outline text-xs sm:text-sm font-light leading-relaxed whitespace-pre-line">
                  {product.description}
                </p>
              </div>
            )}

          </div>

        </div>

        {/* Ornate Divider with leaf */}
        <div className="flex items-center justify-center mt-12 mb-8 sm:mt-16 sm:mb-10">
          <div className="h-[1px] bg-cf-gold/15 flex-1"></div>
          <div className="mx-4 text-xs text-[#D4AF37] select-none">✦ 🪷 ✦</div>
          <div className="h-[1px] bg-cf-gold/15 flex-1"></div>
        </div>

        {/* Recommendations Grid ("You May Also Like") */}
        {recommendations.length > 0 && (
          <section className="mb-4">
            <div className="flex items-baseline justify-between mb-6">
              <div>
                <h3 className="font-playfair text-xl sm:text-2xl font-bold text-cf-on-surface mb-1">
                  You May Also Like
                </h3>
                <p className="text-[11px] sm:text-xs text-cf-outline">
                  Handpicked recommendations for your loved ones
                </p>
              </div>
            </div>

            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory lg:grid lg:grid-cols-6 lg:overflow-visible lg:pb-0">
              {recommendations.map(p => (
                <div key={p.id} className="w-[155px] shrink-0 snap-start lg:w-auto">
                  <ProductCard product={p} variant="minimal" />
                </div>
              ))}
            </div>
          </section>
        )}

      </div>

      <Footer />
    </div>
  )
}

