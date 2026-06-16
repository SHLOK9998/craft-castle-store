import { useState, useEffect, useCallback } from 'react'
import { useSearchParams, useLocation } from 'react-router-dom'
import { Header } from '../components/customer/Header'
import { ProductCard } from '../components/customer/ProductCard'
import { CategoryFilter } from '../components/customer/CategoryFilter'
import { LoadingSpinner } from '../components/shared/LoadingSpinner'
import { EmptyState } from '../components/shared/EmptyState'
import { getProducts, getFeaturedProducts } from '../api/products'
import { getCategories } from '../api/categories'
import { Icon } from '../components/shared/Icon'
import { useWishlist } from '../context/WishlistContext'
import { Footer } from '../components/customer/Footer'
import { toast } from 'react-hot-toast'

export function HomePage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const location = useLocation()
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [selectedCategories, setSelectedCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState(searchParams.get('search') || '')
  const [inStockOnly, setInStockOnly] = useState(false)
  const { wishlist } = useWishlist()
  const PAGE_SIZE = 12

  // Load categories on mount
  useEffect(() => {
    getCategories()
      .then(r => setCategories(r.data.categories || []))
      .catch(e => console.error('Error fetching categories:', e))
  }, [])

  // Handle hash scrolling on mount/load/route change
  useEffect(() => {
    if (location.hash === '#catalogue') {
      const el = document.getElementById('catalogue')
      if (el) {
        const timer = setTimeout(() => {
          el.scrollIntoView({ behavior: 'smooth' })
        }, 150)
        return () => clearTimeout(timer)
      }
    }
  }, [location])

  // Load products on filter change
  const loadProducts = useCallback(async () => {
    setLoading(true)
    try {
      const params = { page, page_size: PAGE_SIZE }
      if (selectedCategories.length > 0) {
        params.category_id = selectedCategories.join(',')
      }
      if (search) params.search = search
      if (inStockOnly) params.in_stock_only = true
      const res = await getProducts(params)
      setProducts(res.data.products || [])
      setTotal(res.data.total || 0)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }, [page, selectedCategories, search, inStockOnly])

  useEffect(() => { loadProducts() }, [loadProducts])

  const handleSearch = (q) => { setSearch(q); setPage(1) }

  const handleInStockToggle = () => {
    setInStockOnly(prev => !prev)
    setPage(1)
  }

  const handleClearFilters = () => {
    setSearch('')
    setSelectedCategories([])
    setInStockOnly(false)
    setPage(1)
  }

  const totalPages = Math.ceil(total / PAGE_SIZE)

  return (
    <div className="min-h-screen bg-[#FAF5EC] dark:bg-[#1e1210] transition-colors duration-200">
      <Header />

      {/* Search Bar Container above Hero */}
      <div className="max-w-container mx-auto px-4 sm:px-6 pt-2 sm:pt-3 flex justify-center">
        <div className="relative w-full max-w-xl">
          <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-cf-outline/70">
            <Icon name="search" size={18} />
          </span>
          <input
            type="text"
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search for your perfect Rakhi..."
            className="w-full bg-white dark:bg-[#2c1e1b] text-cf-on-surface placeholder-cf-outline/65 border border-[#e8dcd8] dark:border-cf-gold/25 rounded-full pl-10 pr-4 py-3 text-sm outline-none focus:border-cf-primary/50 focus:shadow-md transition-all duration-300"
          />
        </div>
      </div>

      {/* Hero Banner Container */}
      <div className="max-w-container mx-auto px-4 sm:px-6 pt-1.5 pb-0.5 sm:pt-2 sm:pb-1">
        <div 
          className="relative overflow-hidden rounded-2xl text-white flex flex-col justify-center min-h-[140px] sm:min-h-[220px] lg:min-h-[240px] px-4 sm:px-12 py-4 sm:py-6 lg:py-8 gap-2.5 sm:gap-3 bg-cover bg-center"
          style={{ backgroundImage: "url('/hero-rakhi.png')" }}
        >
          {/* Dark overlay for readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent z-0" />
          
          <div className="relative z-10 max-w-lg space-y-1 sm:space-y-2.5">
            <span className="inline-block bg-[#c3e6cb] dark:bg-[#1b4327] text-[#155724] dark:text-[#8fdfa1] text-[9px] sm:text-[10px] font-extrabold px-2 py-0.5 sm:px-3 sm:py-1 rounded uppercase tracking-wider">
              HANDMADE WITH LOVE
            </span>
            <h1 className="font-playfair text-lg sm:text-2xl lg:text-3xl font-bold leading-tight">
              Celebrate Eternal Bonds with Artistry
            </h1>
            <p className="hidden sm:block text-white/90 text-xs font-light leading-relaxed">
              Discover our exclusive heritage collection of handcrafted Rakhis, woven with tradition and modern elegance.
            </p>
            
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <button
                onClick={async (e) => {
                  e.preventDefault()
                  const customMsg = "Namaste! I saw your beautiful collection on the home page and want to know more about ordering your Rakhi products."
                  try {
                    const res = await fetch(`/api/whatsapp/contact-url?message=${encodeURIComponent(customMsg)}`)
                    const data = await res.json()
                    window.open(data.whatsapp_url, '_blank')
                  } catch {
                    window.open(`https://wa.me/919998931393?text=${encodeURIComponent(customMsg)}`, '_blank')
                  }
                }}
                className="bg-[#25D366] hover:bg-[#20ba56] text-white text-[10px] sm:text-xs font-bold px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg flex items-center gap-1.5 sm:gap-2 shadow-md transition-colors"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Order on WhatsApp
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Catalogue Section */}
      <div id="catalogue" className="max-w-container mx-auto px-4 sm:px-6 pt-1 pb-6 sm:pt-2 sm:pb-6 scroll-mt-20">
        
        {/* Categories Filter Row */}
        <div className="flex items-center gap-2 mb-3.5 sm:mb-6 overflow-x-auto scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0 flex-nowrap pb-1">
          {/* In Stock Pill Button */}
          <button
            onClick={handleInStockToggle}
            className={`shrink-0 px-3 py-1.5 sm:px-4 sm:py-2.5 rounded-lg text-xs sm:text-sm font-medium border transition-colors flex items-center gap-1.5 ${
              inStockOnly
                ? 'bg-cf-primary text-white border-cf-primary'
                : 'bg-white dark:bg-[#2c1e1b] text-cf-primary dark:text-cf-gold border-[#e8dcd8] dark:border-cf-gold/20 hover:bg-cf-surface'
            }`}
          >
            <Icon name={inStockOnly ? "check_circle" : "check"} size={14} />
            In Stock
          </button>

          <CategoryFilter
            categories={categories}
            selected={selectedCategories}
            onChange={(newSelected) => {
              setSelectedCategories(newSelected)
              setPage(1)
            }}
          />
        </div>

        {/* Custom gold dot divider line */}
        <div className="flex items-center justify-center my-3 sm:my-6">
          <div className="h-[1px] bg-cf-gold/15 flex-1"></div>
          <div className="w-1.5 h-1.5 rounded-full bg-cf-gold/70 mx-3"></div>
          <div className="h-[1px] bg-cf-gold/15 flex-1"></div>
        </div>

        {/* Active Filters Summary */}
        <div className="flex items-center justify-between mb-4 sm:mb-6 text-xs text-cf-outline">
          <div className="flex items-center gap-2">
            <span>{total} rakhis found</span>
            {(search || selectedCategories.length > 0 || inStockOnly) && (
              <>
                <span>•</span>
                <button
                  onClick={handleClearFilters}
                  className="text-cf-primary underline hover:opacity-85 font-semibold"
                >
                  Clear all filters
                </button>
              </>
            )}
          </div>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="flex justify-center py-20"><LoadingSpinner size="lg" /></div>
        ) : products.length === 0 ? (
          <EmptyState
            icon="search_off"
            title="No rakhis found"
            message="Try a different filter or search term"
            action={
              <button onClick={handleClearFilters} className="text-cf-primary text-sm underline">
                Show all
              </button>
            }
          />
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {products.map(p => <ProductCard key={p.id} product={p} />)}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-10">
                <button
                  disabled={page === 1}
                  onClick={() => setPage(p => p - 1)}
                  className="px-4 py-2 rounded-lg border border-cf-gold/30 text-xs font-semibold disabled:opacity-40 hover:bg-[#FAF5EC] dark:hover:bg-[#2c1e1b] transition-colors"
                >
                  ← Prev
                </button>
                <span className="px-3 py-2 text-xs text-cf-outline">
                  Page {page} of {totalPages}
                </span>
                <button
                  disabled={page === totalPages}
                  onClick={() => setPage(p => p + 1)}
                  className="px-4 py-2 rounded-lg border border-cf-gold/30 text-xs font-semibold disabled:opacity-40 hover:bg-[#FAF5EC] dark:hover:bg-[#2c1e1b] transition-colors"
                >
                  Next →
                </button>
              </div>
            )}
          </>
         )}

      </div>

      <Footer />
    </div>
  )
}

