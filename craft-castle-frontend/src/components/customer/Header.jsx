import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Icon } from '../shared/Icon'
import { useTheme } from '../../context/ThemeContext'
import { useCart } from '../../context/CartContext'
import { useWishlist } from '../../context/WishlistContext'
import { CartDrawer } from './CartDrawer'
import { WishlistDrawer } from './WishlistDrawer'

export function Header({ onSearch }) {
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isWishlistOpen, setIsWishlistOpen] = useState(false)
  const navigate = useNavigate()
  const { theme, toggleTheme } = useTheme()
  const { cartCount } = useCart()
  const { wishlist } = useWishlist()

  useEffect(() => {
    const handler = () => setIsCartOpen(true)
    window.addEventListener('open-cart', handler)
    return () => window.removeEventListener('open-cart', handler)
  }, [])


  return (
    <header className="sticky top-0 z-50 bg-[#FAF5EC]/95 dark:bg-[#1e1210]/95 backdrop-blur-[10px] border-b border-cf-gold/20 shadow-sm transition-colors duration-200">
      <div className="max-w-container mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Left: Logo */}
          <div className="flex items-center gap-3">
            <Link 
              to="/" 
              onClick={(e) => {
                if (window.location.pathname === '/') {
                  e.preventDefault()
                  window.location.reload()
                }
              }}
              className="flex items-center shrink-0"
            >
              <span className="font-playfair font-bold text-cf-primary dark:text-cf-gold hover:text-cf-secondary dark:hover:text-cf-saffron text-xl leading-tight tracking-wide transition-colors">
                CraftCastle
              </span>
            </Link>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-4">
            {/* Theme Toggle Button */}
            <button
              type="button"
              onClick={toggleTheme}
              className="flex items-center justify-center p-2 text-cf-primary dark:text-cf-gold hover:text-cf-secondary dark:hover:text-cf-saffron transition-colors"
              title="Toggle theme"
            >
              <Icon name={theme === 'dark' ? 'light_mode' : 'dark_mode'} size={20} />
            </button>

            {/* Wishlist Button */}
            <button
              type="button"
              onClick={() => setIsWishlistOpen(true)}
              className="relative flex items-center justify-center p-2 text-cf-primary dark:text-cf-gold hover:text-cf-secondary dark:hover:text-cf-saffron transition-colors"
              title="Open wishlist"
            >
              <Icon name="favorite" size={20} className={wishlist.length > 0 ? "text-red-500 fill-current" : ""} />
              {wishlist.length > 0 && (
                <span key={wishlist.length} className="nav-badge">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Cart Button */}
            <button
              type="button"
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center justify-center p-2 text-cf-primary dark:text-cf-gold hover:text-cf-secondary dark:hover:text-cf-saffron transition-colors"
              title="Open cart"
            >
              <Icon name="shopping_bag" size={20} />
              {cartCount > 0 && (
                <span key={cartCount} className="nav-badge">
                  {cartCount}
                </span>
              )}
            </button>
          </div>

        </div>
      </div>

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      <WishlistDrawer isOpen={isWishlistOpen} onClose={() => setIsWishlistOpen(false)} />
    </header>
  )
}

