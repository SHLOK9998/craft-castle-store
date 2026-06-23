import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Header } from '../components/customer/Header'
import { Footer } from '../components/customer/Footer'
import { Icon } from '../components/shared/Icon'

export function FAQPage() {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
    document.title = 'Frequently Asked Questions — CraftCastle'
    return () => { document.title = 'CraftCastle' }
  }, [])

  const [activeCategory, setActiveCategory] = useState('all')

  const faqCategories = [
    { id: 'all', label: 'All Questions' },
    { id: 'ordering', label: 'Ordering & Booking' },
    { id: 'payment', label: 'Payments' },
    { id: 'shipping', label: 'Shipping & Delivery' },
    { id: 'products', label: 'Products & Customisation' },
  ]

  const faqs = [
    {
      category: 'ordering',
      question: 'How do I place an order?',
      answer: 'Browse our collection, add your favorite products to the cart, and click "Checkout via WhatsApp". It will redirect you to our chat window with your cart items pre-filled. We will then verify availability and guide you through payment.',
    },
    {
      category: 'ordering',
      question: 'Can I place an order directly on WhatsApp without using the website?',
      answer: 'Yes, absolutely! You can send screenshot images of products you like or simply list the items you wish to purchase directly to our WhatsApp support number: +91 87340 42595.',
    },
    {
      category: 'payment',
      question: 'What payment methods do you accept?',
      answer: 'We support all major payment methods in India, including UPI (GPay, PhonePe, Paytm, BHIM) and Cash. We will provide our secure payment credentials during our WhatsApp chat.',
    },
    {
      category: 'payment',
      question: 'Is Cash on Delivery (COD) available?',
      answer: 'Currently, we only accept prepaid bookings to prevent package rejections, as our products are handcrafted and custom-made for auspicious festivals.',
    },
    {
      category: 'shipping',
      question: 'What are the shipping charges?',
      answer: 'That will be calculated and informed to you on the time of booking on whatsapp according to your address .',
    },
    {
      category: 'shipping',
      question: 'How long does shipping and delivery take?',
      answer: 'It is purely depends on the courier or post-office availability in your location .',
    },
    {
      category: 'shipping',
      question: 'Do you ship internationally?',
      answer: 'Yes, we do ship globally. Shipping charges and delivery timelines for international orders vary based on weight and country. Please message us on WhatsApp to get a customized international shipping quote.',
    },
    {
      category: 'products',
      question: 'Can I customize my Rakhi or add a personal gift note?',
      answer: 'Yes! We offer personalization services. You can add customization in the design like add more beads or color etc according to your requirements. Let us know your requirements on WhatsApp during booking.',
    },
    {
      category: 'products',
      question: 'Are the materials eco-friendly and skin-safe?',
      answer: 'Absolutely. We use high-quality materials including pure cotton threads, semi-precious beads, and non-toxic dyes. They are entirely skin-friendly and safe for kids.',
    },
    {
      category: 'products',
      question: 'Do you accept returns or exchanges?',
      answer: 'Since our products are festive items and handmade in limited runs, we do not accept returns or exchanges. However, if a product is delivered damaged, send us an unboxing video on WhatsApp within 24 hours of delivery and we will ship a replacement immediately.',
    },
  ]

  const filteredFaqs = activeCategory === 'all' 
    ? faqs 
    : faqs.filter(f => f.category === activeCategory)

  return (
    <div className="min-h-screen bg-[#FAF5EC] dark:bg-[#1e1210] transition-colors duration-200">
      <Header />

      {/* Hero Banner */}
      <div className="bg-[#f5eae6] dark:bg-[#1f1514] border-b border-cf-gold/20">
        <div className="max-w-container mx-auto px-4 sm:px-6 py-10 sm:py-14">
          <div className="flex items-center gap-2 text-xs text-cf-outline mb-3">
            <Link to="/" className="hover:text-cf-primary transition-colors">Home</Link>
            <span>›</span>
            <span>FAQs</span>
          </div>
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-cf-primary/10 flex items-center justify-center shrink-0 mt-1">
              <Icon name="live_help" size={22} className="text-cf-primary" />
            </div>
            <div>
              <h1 className="font-playfair font-bold text-cf-primary text-2xl sm:text-3xl mb-2">
                Frequently Asked Questions
              </h1>
              <p className="text-cf-outline text-xs leading-relaxed max-w-xl">
                Have questions about ordering, custom batches, payments, or delivery? Find quick answers below or ping us directly.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-container mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* FAQ Sidebar Category Filters */}
          <aside className="space-y-2 lg:sticky lg:top-24 h-fit">
            <p className="font-playfair font-bold text-cf-primary text-sm mb-3 px-2">Categories</p>
            <div className="flex flex-wrap lg:flex-col gap-1.5 bg-white dark:bg-[#2c1e1b] rounded-xl border border-cf-gold/20 p-3">
              {faqCategories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`text-left text-xs px-3.5 py-2 rounded-lg transition-all w-fit lg:w-full font-medium ${
                    activeCategory === cat.id
                      ? 'bg-cf-primary text-white shadow-sm'
                      : 'text-cf-outline hover:bg-cf-primary/5 hover:text-cf-primary'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </aside>

          {/* FAQ Accordion List */}
          <div className="lg:col-span-3 space-y-4">
            {filteredFaqs.length > 0 ? (
              filteredFaqs.map((faq, i) => (
                <div 
                  key={i} 
                  className="bg-white dark:bg-[#2c1e1b] rounded-xl border border-cf-gold/15 p-5 sm:p-6 transition-all hover:border-cf-gold/30 hover:shadow-sm"
                >
                  <h3 className="font-playfair font-bold text-cf-on-surface text-sm sm:text-base mb-2 flex items-start gap-2.5">
                    <span className="text-cf-primary font-sans select-none">Q.</span>
                    <span>{faq.question}</span>
                  </h3>
                  <div className="text-xs sm:text-sm text-cf-outline leading-relaxed font-light pl-6 border-l border-cf-gold/20 flex items-start gap-2.5">
                    <p>{faq.answer}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12 bg-white dark:bg-[#2c1e1b] rounded-xl border border-cf-gold/15 text-cf-outline text-sm">
                No questions found.
              </div>
            )}
          </div>

        </div>

        {/* Still Have Questions Box */}
        <div className="bg-[#f5eae6] dark:bg-[#1f1514] border border-cf-gold/20 rounded-xl p-6 text-center mt-10">
          <p className="font-playfair font-bold text-cf-primary mb-2">Still have questions?</p>
          <p className="text-xs text-cf-outline mb-4">
            We are online! Send us your query on WhatsApp and get an answer in minutes.
          </p>
          <a
            href="https://wa.me/918734042595?text=Hi%20CraftCastle%2C%20I%20have%20a%20question%20regarding%20my%20order."
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#25D366] text-white text-xs font-semibold rounded-lg hover:bg-green-600 transition-colors shadow-sm"
          >
            <Icon name="chat" size={14} />
            Ask us on WhatsApp
          </a>
        </div>
      </div>

      <Footer />
    </div>
  )
}
