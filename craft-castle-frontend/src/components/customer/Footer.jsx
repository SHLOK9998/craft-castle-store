import { Link } from 'react-router-dom'
import { Icon } from '../shared/Icon'

export function Footer() {
  const handleShare = (e) => {
    e.preventDefault()
    if (navigator.share) {
      navigator.share({ title: 'CraftCastle', url: window.location.origin })
    } else {
      navigator.clipboard.writeText(window.location.origin)
      alert('CraftCastle link copied to clipboard!')
    }
  }

  return (
    <footer className="bg-[#f5eae6] dark:bg-[#1f1514] text-cf-on-surface pt-7 sm:pt-9 pb-3 sm:pb-5 border-t border-cf-gold/20">
      <div className="max-w-container mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-12 gap-y-8 md:gap-x-8 md:gap-y-0 mb-10 items-start">
          
          {/* Brand Column */}
          <div className="col-span-12 md:col-span-4 space-y-4">
            <div className="h-8 flex items-center">
              <h3 className="font-playfair font-bold text-cf-primary text-xl md:text-2xl leading-none">CraftCastle</h3>
            </div>
            <p className="text-xs text-cf-outline leading-relaxed max-w-sm">
              Preserving the timeless art of Indian handicrafts, delivered to your doorstep with love.
            </p>
            {/* Social Icons */}
            <div className="flex items-center gap-3 pt-2">
              <a 
                href="https://www.instagram.com/craft_castle_12/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-8 h-8 rounded-full border border-cf-gold/40 flex items-center justify-center text-cf-primary hover:bg-cf-primary/5 transition-colors"
                title="Instagram"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-cf-primary">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </a>
              <a
                href="https://wa.me/919998931393"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full border border-cf-gold/40 flex items-center justify-center hover:bg-[#25D366]/10 hover:border-[#25D366]/50 transition-colors"
                title="WhatsApp"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="text-[#25D366]">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
              </a>
              <button 
                onClick={handleShare}
                className="w-8 h-8 rounded-full border border-cf-gold/40 flex items-center justify-center text-cf-primary hover:bg-cf-primary/5 transition-colors"
                title="Share"
              >
                <Icon name="share" size={16} />
              </button>
            </div>
          </div>
 
          {/* Quick Links Column */}
          <div className="col-span-6 md:col-span-2">
            <div className="h-8 flex items-center mb-4">
              <h4 className="font-playfair font-bold text-xs uppercase tracking-wider text-cf-primary leading-none">Quick Links</h4>
            </div>
            <ul className="space-y-2.5 text-xs text-cf-outline">
              <li>
                <Link to="/" className="hover:text-cf-primary transition-all duration-200 flex items-center gap-1.5 group">
                  <span className="text-[10px] text-cf-gold/60 group-hover:translate-x-0.5 transition-transform duration-200">›</span>
                  <span>Home Catalog</span>
                </Link>
              </li>
              <li>
                <Link to="/how-to-order" className="hover:text-cf-primary transition-all duration-200 flex items-center gap-1.5 group">
                  <span className="text-[10px] text-cf-gold/60 group-hover:translate-x-0.5 transition-transform duration-200">›</span>
                  <span>How to Order</span>
                </Link>
              </li>
              <li>
                <Link to="/faqs" className="hover:text-cf-primary transition-all duration-200 flex items-center gap-1.5 group">
                  <span className="text-[10px] text-cf-gold/60 group-hover:translate-x-0.5 transition-transform duration-200">›</span>
                  <span>FAQs & Support</span>
                </Link>
              </li>
            </ul>
          </div>
 
          {/* Policies Column */}
          <div className="col-span-6 md:col-span-2">
            <div className="h-8 flex items-center mb-4">
              <h4 className="font-playfair font-bold text-xs uppercase tracking-wider text-cf-primary leading-none">Policies</h4>
            </div>
            <ul className="space-y-2.5 text-xs text-cf-outline">
              <li>
                <Link to="/privacy-policy" className="hover:text-cf-primary transition-all duration-200 flex items-center gap-1.5 group">
                  <span className="text-[10px] text-cf-gold/60 group-hover:translate-x-0.5 transition-transform duration-200">›</span>
                  <span>Privacy Policy</span>
                </Link>
              </li>
              <li>
                <Link to="/terms-of-service" className="hover:text-cf-primary transition-all duration-200 flex items-center gap-1.5 group">
                  <span className="text-[10px] text-cf-gold/60 group-hover:translate-x-0.5 transition-transform duration-200">›</span>
                  <span>Terms of Service</span>
                </Link>
              </li>
            </ul>
          </div>
 
          {/* Contact Column */}
          <div className="col-span-12 md:col-span-4">
            <div className="h-8 flex items-center mb-4">
              <h4 className="font-playfair font-bold text-xs uppercase tracking-wider text-cf-primary leading-none">Contact</h4>
            </div>
            <ul className="space-y-3 text-xs text-cf-outline">
              <li className="flex items-center gap-2.5">
                <Icon name="mail" size={14} className="text-cf-primary shrink-0" />
                <a href="mailto:craftcastle2404@gmail.com" className="hover:text-cf-primary transition-colors truncate block max-w-full">
                  craftcastle2404@gmail.com
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Icon name="call" size={14} className="text-cf-primary shrink-0" />
                <a href="tel:+918734042595" className="hover:text-cf-primary transition-colors">
                  +91 87340 42595
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Icon name="location_on" size={14} className="text-cf-primary shrink-0" />
                <span>Ahmedabad, Gujarat</span>
              </li>
            </ul>
          </div>
 
        </div>
 
        {/* Divider with simple leaf ornament */}
        <div className="flex items-center justify-center my-6">
          <div className="h-[1px] bg-cf-gold/30 flex-1"></div>
          <div className="mx-4 text-xs text-[#D4AF37] select-none">✦ 🪷 ✦</div>
          <div className="h-[1px] bg-cf-gold/30 flex-1"></div>
        </div>
 
        {/* Bottom Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-cf-outline">
          <p>© 2026 CraftCastle Boutique. All Rights Reserved.</p>
        </div>

      </div>

      {/* Sticky Help Button */}
      <a
        href="#"
        onClick={async (e) => {
          e.preventDefault()
          const customMsg = "Hello! I'm browsing your Rakhi store right now and need some guidance or help with a product."
          try {
            const res = await fetch(`/api/whatsapp/contact-url?message=${encodeURIComponent(customMsg)}`)
            const data = await res.json()
            window.open(data.whatsapp_url, '_blank')
          } catch {
            window.open(`https://wa.me/919998931393?text=${encodeURIComponent(customMsg)}`, '_blank')
          }
        }}
        className="fixed bottom-5 right-5 z-50 bg-[#25D366] text-white text-xs font-semibold px-4 py-2.5 rounded-full hover:bg-green-600 transition-colors shadow-lg flex items-center gap-2"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
        Need Help?
      </a>
    </footer>
  )
}
