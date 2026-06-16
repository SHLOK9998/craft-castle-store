import { createContext, useContext, useEffect, useState } from 'react'

const WishlistContext = createContext(null)

export function WishlistProvider({ children }) {
  const [wishlist, setWishlist] = useState(() => {
    try {
      const saved = localStorage.getItem('cc_wishlist')
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })

  useEffect(() => {
    localStorage.setItem('cc_wishlist', JSON.stringify(wishlist))
  }, [wishlist])

  const toggleWishlist = (productId) => {
    setWishlist(prev => {
      if (prev.includes(productId)) {
        return prev.filter(id => id !== productId)
      } else {
        return [...prev, productId]
      }
    })
  }

  const isFavorited = (productId) => wishlist.includes(productId)

  return (
    <WishlistContext.Provider value={{ wishlist, toggleWishlist, isFavorited }}>
      {children}
    </WishlistContext.Provider>
  )
}

export const useWishlist = () => useContext(WishlistContext)
