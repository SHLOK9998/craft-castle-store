import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Header } from '../components/customer/Header'
import { Footer } from '../components/customer/Footer'
import { Icon } from '../components/shared/Icon'

export function HowToOrderPage() {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
    document.title = 'How to Order — CraftCastle'
    return () => { document.title = 'CraftCastle' }
  }, [])

  const steps = [
    {
      step: '01',
      title: 'Browse & Choose',
      description: 'Explore our catalog of authentic, handcrafted Rakhis, Lumba collections, and designer gift sets. Select the quantity you need.',
      icon: 'search',
    },
    {
      step: '02',
      title: 'Add to Cart',
      description: 'Click "Add to Cart" or "Buy Now" on the items you wish to purchase. You can review your selected items in the Cart drawer at any time.',
      icon: 'shopping_bag',
    },
    {
      step: '03',
      title: 'Connect on WhatsApp',
      description: 'Click "Checkout via WhatsApp" from your cart. You will be redirected to our WhatsApp Support (+91 99989 31393) with a pre-filled message of your order details.',
      icon: 'chat',
    },
    {
      step: '04',
      title: 'Confirm & Customise',
      description: 'Share your delivery address, request custom gift notes, or add personalized card tags directly with our friendly support team on chat.',
      icon: 'edit_note',
    },
    {
      step: '05',
      title: 'Make Secure Payment',
      description: 'We will confirm stock availability and share a secure UPI / Bank Transfer payment option. Once paid, your booking is confirmed.',
      icon: 'qr_code_scanner',
    },
    {
      step: '06',
      title: 'Gift Packaging & Dispatch',
      description: 'Your Rakhis are packaged in festive, eco-friendly gift boxes and dispatched. We will send the courier tracking link directly to your WhatsApp.',
      icon: 'local_shipping',
    },
  ]

  return (
    <div className="min-h-screen bg-[#FAF5EC] dark:bg-[#1e1210] transition-colors duration-200">
      <Header />

      {/* Hero Banner */}
      <div className="bg-[#f5eae6] dark:bg-[#1f1514] border-b border-cf-gold/20">
        <div className="max-w-container mx-auto px-4 sm:px-6 py-10 sm:py-14">
          <div className="flex items-center gap-2 text-xs text-cf-outline mb-3">
            <Link to="/" className="hover:text-cf-primary transition-colors">Home</Link>
            <span>›</span>
            <span>How to Order</span>
          </div>
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-cf-primary/10 flex items-center justify-center shrink-0 mt-1">
              <Icon name="help_center" size={22} className="text-cf-primary" />
            </div>
            <div>
              <h1 className="font-playfair font-bold text-cf-primary text-2xl sm:text-3xl mb-2">
                How to Order
              </h1>
              <p className="text-cf-outline text-xs leading-relaxed max-w-xl">
                We believe in a personalized, direct connection. Since all our products are handcrafted in limited batches, we process all orders seamlessly via WhatsApp.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-container mx-auto px-4 sm:px-6 py-10">
        <div className="bg-white dark:bg-[#2c1e1b] rounded-xl border border-cf-gold/20 p-6 md:p-10 mb-8">
          <h2 className="font-playfair font-bold text-cf-primary text-lg sm:text-xl text-center mb-8">
            Simple 6-Step Checkout Flow
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {steps.map((s, idx) => (
              <div 
                key={idx}
                className="bg-[#FAF5EC] dark:bg-[#1e1210]/50 rounded-xl p-6 border border-cf-gold/10 hover:border-cf-gold/30 hover:shadow-md transition-all group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-full bg-cf-primary/5 flex items-center justify-center">
                      <Icon name={s.icon} size={18} className="text-cf-primary" />
                    </div>
                    <span className="font-playfair font-bold text-cf-gold/35 text-2xl select-none group-hover:text-cf-gold/60 transition-colors">
                      {s.step}
                    </span>
                  </div>
                  <h3 className="font-playfair font-bold text-cf-on-surface text-sm sm:text-base mb-2">
                    {s.title}
                  </h3>
                  <p className="text-xs text-cf-outline/90 leading-relaxed font-light">
                    {s.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Support Section */}
        <div className="bg-[#f5eae6] dark:bg-[#1f1514] border border-cf-gold/20 rounded-xl p-6 text-center">
          <p className="font-playfair font-bold text-cf-primary mb-2">Need immediate assistance with placing an order?</p>
          <p className="text-xs text-cf-outline mb-4">
            Skip the checkout flow and speak directly to our customer relationship manager.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <a
              href="https://wa.me/919998931393?text=Hi%20CraftCastle%2C%20I%27d%20like%20to%20place%20an%20order%20directly."
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 py-2.5 bg-[#25D366] text-white text-xs font-semibold rounded-lg hover:bg-green-600 transition-colors shadow-sm"
            >
              <Icon name="chat" size={14} />
              Message us on WhatsApp
            </a>
            <Link
              to="/"
              className="flex items-center gap-2 px-5 py-2.5 border border-cf-gold/40 text-cf-primary text-xs font-semibold rounded-lg hover:bg-cf-primary/5 transition-colors"
            >
              <Icon name="arrow_back" size={14} />
              Return to Catalog
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
