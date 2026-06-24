import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Header } from '../components/customer/Header'
import { Footer } from '../components/customer/Footer'
import { Icon } from '../components/shared/Icon'

const LAST_UPDATED = 'June 16, 2026'
const EFFECTIVE_DATE = 'June 16, 2026'

const sections = [
  {
    id: 'acceptance',
    icon: 'handshake',
    title: '1. Acceptance of Terms',
    content: [
      {
        text: `By accessing or using CraftCastle's website (craftcastle.in or any associated domain), browsing our product catalogue, placing an order, or contacting us via WhatsApp or email, you confirm that you have read, understood, and agree to be bound by these Terms of Service and our Privacy Policy.`,
      },
      {
        text: `If you do not agree to these terms, please refrain from using our website or services. We reserve the right to update these Terms at any time. Continued use of CraftCastle after changes are posted constitutes your acceptance of the revised terms.`,
      },
    ],
  },
  {
    id: 'about-craftcastle',
    icon: 'store',
    title: '2. About CraftCastle',
    content: [
      {
        text: 'CraftCastle is a boutique handcraft e-commerce store specialising in authentic Indian handicrafts — primarily handmade Rakhis, decorative accessories, and gift sets. We are based in Ahmedabad, Gujarat, India.',
      },
      {
        list: [
          'Business Name: CraftCastle Boutique',
          'Location: Ahmedabad, Gujarat, India',
          'Contact Email: craftcastle2404@gmail.com',
          'WhatsApp: +91 87340 42595 (Primary order channel)',
          'Instagram: @craft_castle_12',
        ],
      },
      {
        text: 'Our products are handmade by skilled artisans. Slight variations in colour, texture, or design from the displayed photographs are natural characteristics of handcrafted goods and are not considered defects.',
      },
    ],
  },
  {
    id: 'products-ordering',
    icon: 'shopping_bag',
    title: '3. Products & Ordering',
    content: [
      {
        subtitle: '3.1 Product Listings',
        text: 'We make every effort to display our products accurately. However:',
        list: [
          'Colours may appear slightly different due to screen calibration differences.',
          'Each handmade item is unique; minor variations in design, thread, or beadwork are expected and add to the artisanal character.',
          'Product availability is subject to change without prior notice.',
          'Prices are listed in Indian Rupees (INR) and are inclusive of applicable taxes unless stated otherwise.',
        ],
      },
      {
        subtitle: '3.2 Order Placement',
        text: 'Orders are primarily placed through our WhatsApp channel (+91 87340 42595). When placing an order:',
        list: [
          'You must provide accurate personal, delivery, and payment details.',
          'An order is confirmed only upon written acknowledgement from our team.',
          'We reserve the right to refuse or cancel orders at our discretion (e.g., stock unavailability, suspected fraud).',
          'Bulk orders or custom Rakhi orders may require additional lead time and an advance payment.',
        ],
      },
      {
        subtitle: '3.3 Customisation',
        text: 'CraftCastle offers customised and personalised Rakhi orders. For custom orders:',
        list: [
          'Share your requirements via WhatsApp before placing the order.',
          'A design preview or description will be shared for approval before production.',
          'Custom orders are non-refundable once production has commenced, unless there is a defect in craftsmanship.',
          'Additional charges may apply for premium customisation.',
        ],
      },
    ],
  },
  {
    id: 'pricing-payment',
    icon: 'payments',
    title: '4. Pricing & Payment',
    content: [
      {
        subtitle: '4.1 Pricing',
        text: 'All prices displayed on our website and communicated via WhatsApp are in Indian Rupees (INR). Prices include applicable GST unless stated otherwise. We reserve the right to change prices at any time without prior notice. The price at the time of order confirmation is the binding price.',
      },
      {
        subtitle: '4.2 Payment Methods',
        text: 'CraftCastle accepts the following payment methods:',
        list: [
          'UPI transfers (Google Pay, PhonePe, Paytm, etc.)',
          'Bank transfers / NEFT / RTGS',
          'Cash on delivery (available for select pin codes)',
          'Other payment modes as communicated by our team',
        ],
      },
      {
        subtitle: '4.3 Advance Payment',
        text: 'Custom orders and bulk orders (10+ units) require a minimum 50% advance payment before production begins. The remaining balance is due before dispatch.',
      },
    ],
  },
  {
    id: 'shipping-delivery',
    icon: 'local_shipping',
    title: '5. Shipping & Delivery',
    content: [
      {
        subtitle: '5.1 Delivery Areas',
        text: 'We ship across India. International shipping is available on request — please contact us via WhatsApp for international shipping rates and timelines.',
      },
      {
        subtitle: '5.2 Delivery Timeline',
        text: 'Estimated delivery times are:',
        list: [
          'Standard orders: 5–8 business days after dispatch',
          'Custom/personalised orders: 7–12 business days (including production time)',
          'Bulk orders (50+ units): 15–21 business days',
          'Express delivery (where available): 2–3 business days at additional charge',
        ],
      },
      {
        subtitle: '5.3 Shipping Charges',
        text: 'Shipping charges are calculated based on order weight, destination, and selected courier partner. Charges will be communicated at the time of order confirmation. Free shipping may be available for orders above a specified cart value (as communicated during promotional periods).',
      },
      {
        subtitle: '5.4 Delivery Responsibility',
        text: 'Once the order is dispatched and a tracking number is shared:',
        list: [
          'CraftCastle is not liable for delays caused by the courier partner.',
          'The customer is responsible for ensuring someone is available to receive the delivery.',
          'In case of a missed delivery, please coordinate with the courier partner directly.',
          'Risk of loss or damage passes to the customer upon delivery.',
        ],
      },
    ],
  },
  {
    id: 'returns-refunds',
    icon: 'replay',
    title: '6. Returns, Refunds & Cancellations',
    content: [
      {
        subtitle: '6.1 Return Eligibility',
        text: 'We accept returns only under the following conditions:',
        list: [
          'The product received is significantly different from what was ordered.',
          'The product arrives visibly damaged or broken (photographic evidence required within 24 hours of delivery).',
          'A manufacturing defect is identified (not variations inherent to handmade items).',
        ],
      },
      {
        subtitle: '6.2 Non-Returnable Items',
        list: [
          'Customised or personalised orders (once production has begun)',
          'Products that have been used, washed, or altered',
          'Items returned beyond 7 days of delivery without prior approval',
          'Perishable or seasonal items (e.g., festival combo packs)',
        ],
      },
      {
        subtitle: '6.3 Refund Process',
        text: 'Approved refunds will be processed within 7–10 business days via the original payment method. We do not process refunds for UPI/cash payments as cash — please share your bank account details for bank transfer refunds.',
      },
      {
        subtitle: '6.4 Order Cancellations',
        text: 'Orders may be cancelled by the customer within 12 hours of placement by contacting us on WhatsApp. After 12 hours, cancellation is subject to our discretion based on production status. Custom orders cannot be cancelled once production has commenced.',
      },
    ],
  },
  {
    id: 'intellectual-property',
    icon: 'copyright',
    title: '7. Intellectual Property',
    content: [
      {
        text: `All content on the CraftCastle website — including but not limited to product photographs, descriptions, graphics, logos, brand name, and design — is the intellectual property of CraftCastle Boutique and is protected under applicable Indian copyright and trademark laws.`,
      },
      {
        text: 'You may not:',
        list: [
          'Copy, reproduce, or distribute our product images or descriptions without written permission.',
          'Use our brand name, logo, or trademarks in any manner that implies endorsement.',
          'Scrape, crawl, or extract data from our website for commercial purposes.',
          'Create derivative works based on our product designs without authorisation.',
        ],
      },
    ],
  },
  {
    id: 'user-conduct',
    icon: 'gavel',
    title: '8. User Conduct',
    content: [
      {
        text: 'By using CraftCastle, you agree not to:',
        list: [
          'Provide false, misleading, or fraudulent information during ordering.',
          'Misuse our WhatsApp or email channels for spam, abuse, or harassment of our team.',
          'Attempt to reverse-engineer, hack, or disrupt any part of our website.',
          'Place orders with no intent to pay or with fraudulent payment details.',
          'Impersonate another person or entity when contacting us.',
        ],
      },
      {
        text: 'We reserve the right to refuse service, cancel orders, or block users who violate these conduct standards.',
      },
    ],
  },
  {
    id: 'limitation-liability',
    icon: 'info',
    title: '9. Limitation of Liability',
    content: [
      {
        text: 'To the maximum extent permitted by applicable law, CraftCastle and its team members shall not be liable for:',
        list: [
          'Indirect, incidental, or consequential damages arising from the use of our products or website.',
          'Delays in delivery caused by courier partners, natural disasters, or government restrictions.',
          'Loss of data or damage to devices caused by accessing our website.',
          'Dissatisfaction with products that match the order specifications but differ from subjective expectations.',
        ],
      },
      {
        text: "In all cases, CraftCastle's maximum liability to you shall not exceed the amount paid by you for the specific order in dispute.",
      },
    ],
  },
  {
    id: 'governing-law',
    icon: 'balance',
    title: '10. Governing Law & Dispute Resolution',
    content: [
      {
        text: `These Terms of Service are governed by the laws of India. Any disputes arising from or related to your use of CraftCastle shall be subject to the exclusive jurisdiction of the courts in Ahmedabad, Gujarat, India.`,
      },
      {
        text: 'We encourage amicable resolution of disputes. If you have a complaint:',
        list: [
          'First, contact us via email (craftcastle2404@gmail.com) or WhatsApp (+91 87340 42595).',
          'We will attempt to resolve your concern within 10 business days.',
          'If unresolved, formal legal proceedings may be initiated as per applicable law.',
        ],
      },
    ],
  },
  {
    id: 'changes',
    icon: 'update',
    title: '11. Changes to These Terms',
    content: [
      {
        text: `CraftCastle reserves the right to update or modify these Terms of Service at any time without prior notice. The updated Terms will be effective immediately upon posting on our website with a revised "Last Updated" date. Your continued use of CraftCastle following any changes constitutes your acceptance of the new terms. We recommend reviewing this page periodically.`,
      },
    ],
  },
  {
    id: 'contact',
    icon: 'contact_support',
    title: '12. Contact Information',
    content: [
      {
        text: 'For any questions, concerns, or feedback regarding these Terms of Service, please contact us:',
        list: [
          'Email: craftcastle2404@gmail.com',
          'WhatsApp: +91 87340 42595',
          'Phone: +91 87340 42595',
          'Instagram: @craft_castle_12',
          'Location: Ahmedabad, Gujarat, India',
        ],
      },
    ],
  },
]

export function TermsOfServicePage() {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
    document.title = 'Terms of Service — CraftCastle'
    return () => { document.title = 'CraftCastle' }
  }, [])

  return (
    <div className="min-h-screen bg-[#FAF5EC] dark:bg-[#1e1210] transition-colors duration-200">
      <Header />

      {/* Hero Banner */}
      <div className="bg-[#f5eae6] dark:bg-[#1f1514] border-b border-cf-gold/20">
        <div className="max-w-container mx-auto px-4 sm:px-6 py-10 sm:py-14">
          <div className="flex items-center gap-2 text-xs text-cf-outline mb-3">
            <Link to="/" className="hover:text-cf-primary transition-colors">Home</Link>
            <span>›</span>
            <span>Terms of Service</span>
          </div>
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-cf-primary/10 flex items-center justify-center shrink-0 mt-1">
              <Icon name="gavel" size={22} className="text-cf-primary" />
            </div>
            <div>
              <h1 className="font-playfair font-bold text-cf-primary text-2xl sm:text-3xl mb-2">
                Terms of Service
              </h1>
              <p className="text-cf-outline text-xs leading-relaxed max-w-xl">
                Please read these terms carefully before using CraftCastle's website or placing an order.
                By engaging with our services, you agree to the following terms.
              </p>
              <div className="flex flex-wrap gap-4 mt-3 text-[11px] text-cf-outline">
                <span className="flex items-center gap-1">
                  <Icon name="event" size={12} className="text-cf-primary" />
                  Effective: {EFFECTIVE_DATE}
                </span>
                <span className="flex items-center gap-1">
                  <Icon name="update" size={12} className="text-cf-primary" />
                  Last Updated: {LAST_UPDATED}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-container mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

          {/* Table of Contents – sticky sidebar */}
          <aside className="hidden lg:block">
            <div className="sticky top-24 bg-white dark:bg-[#2c1e1b] rounded-xl border border-cf-gold/30 p-5 space-y-1">
              <p className="font-playfair font-bold text-cf-primary text-sm mb-3">Contents</p>
              {sections.map(s => (
                <a
                  key={s.id}
                  href={`#${s.id}`}
                  className="block text-[11px] text-cf-outline hover:text-cf-primary transition-colors py-0.5 pl-2 border-l-2 border-transparent hover:border-cf-primary"
                >
                  {s.title}
                </a>
              ))}
            </div>
          </aside>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            {/* Intro card */}
            <div className="bg-cf-primary/5 border border-cf-primary/15 rounded-xl p-5 text-xs text-cf-outline leading-relaxed">
              <p className="font-semibold text-cf-primary mb-1">Agreement Summary</p>
              <p>
                These Terms govern your use of CraftCastle's website and services. They cover how we handle
                orders, payments, shipping, returns, and your rights as a customer. By using our services,
                you agree to these terms. If you have questions, contact us before placing an order.
              </p>
            </div>

            {sections.map(section => (
              <section
                key={section.id}
                id={section.id}
                className="bg-white dark:bg-[#2c1e1b] rounded-xl border border-cf-gold/20 p-6 scroll-mt-24"
              >
                {/* Section Header */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-full bg-cf-primary/10 flex items-center justify-center shrink-0">
                    <Icon name={section.icon} size={16} className="text-cf-primary" />
                  </div>
                  <h2 className="font-playfair font-bold text-cf-primary text-base">
                    {section.title}
                  </h2>
                </div>

                <div className="space-y-4 text-xs text-cf-outline leading-relaxed">
                  {section.content.map((block, i) => (
                    <div key={i}>
                      {block.subtitle && (
                        <p className="font-semibold text-cf-on-surface mb-1">{block.subtitle}</p>
                      )}
                      {block.text && <p className="mb-2">{block.text}</p>}
                      {block.list && (
                        <ul className="space-y-1.5 ml-2">
                          {block.list.map((item, j) => (
                            <li key={j} className="flex items-start gap-2">
                              <span className="text-cf-gold mt-0.5 shrink-0">♦</span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            ))}

            {/* Footer CTA */}
            <div className="bg-[#f5eae6] dark:bg-[#1f1514] border border-cf-gold/20 rounded-xl p-6 text-center">
              <p className="font-playfair font-bold text-cf-primary mb-2">Questions about our terms?</p>
              <p className="text-xs text-cf-outline mb-4">
                Our team is happy to clarify anything before you place your order.
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <a
                  href="mailto:craftcastle2404@gmail.com"
                  className="flex items-center gap-2 px-4 py-2 bg-cf-primary text-white text-xs font-semibold rounded-lg hover:bg-cf-primary/90 transition-colors"
                >
                  <Icon name="mail" size={14} />
                  Email Us
                </a>
                <Link
                  to="/privacy-policy"
                  className="flex items-center gap-2 px-4 py-2 border border-cf-gold/40 text-cf-primary text-xs font-semibold rounded-lg hover:bg-cf-primary/5 transition-colors"
                >
                  <Icon name="privacy_tip" size={14} />
                  Privacy Policy
                </Link>
                <Link
                  to="/#catalogue"
                  className="flex items-center gap-2 px-4 py-2 border border-cf-gold/40 text-cf-primary text-xs font-semibold rounded-lg hover:bg-cf-primary/5 transition-colors"
                >
                  <Icon name="arrow_back" size={14} />
                  Back to Shop
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
