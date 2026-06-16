import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Header } from '../components/customer/Header'
import { Footer } from '../components/customer/Footer'
import { Icon } from '../components/shared/Icon'

const LAST_UPDATED = 'June 16, 2026'
const EFFECTIVE_DATE = 'June 16, 2026'

const sections = [
  {
    id: 'information-we-collect',
    icon: 'database',
    title: '1. Information We Collect',
    content: [
      {
        subtitle: '1.1 Information You Provide Directly',
        text: `When you browse CraftCastle, contact us via WhatsApp or email, or place an order, you may voluntarily share:`,
        list: [
          'Full name and shipping/billing address',
          'Phone number and email address',
          'Order details, product preferences, and special requests',
          'Any messages or queries you send us via WhatsApp (+91 87340 42595) or email (craftcastle2404@gmail.com)',
        ],
      },
      {
        subtitle: '1.2 Information Collected Automatically',
        text: 'When you visit our website we may automatically collect:',
        list: [
          'Device and browser type, operating system',
          'Pages viewed, time spent on pages, and click patterns',
          'IP address and approximate geographic location (city/state level)',
          'Referring website or search query that brought you to us',
        ],
      },
      {
        subtitle: '1.3 Information from Third Parties',
        text: 'We may receive limited information from:',
        list: [
          'WhatsApp Business Platform when you initiate a conversation with us',
          'Payment gateway partners if you complete a purchase through their platform',
          'Social media platforms (e.g., Instagram @craft_castle_12) if you interact with our posts',
        ],
      },
    ],
  },
  {
    id: 'how-we-use',
    icon: 'manage_search',
    title: '2. How We Use Your Information',
    content: [
      {
        text: 'CraftCastle uses your information exclusively to operate, improve, and protect our services:',
        list: [
          'Processing and fulfilling your handcraft orders (Rakhis, accessories, etc.)',
          'Communicating order status, shipping updates, and delivery confirmations',
          'Responding to customer support inquiries via WhatsApp or email',
          'Sending promotional offers, new collection launches, or seasonal greetings — only with your consent',
          'Improving our product catalogue and website experience based on usage patterns',
          'Preventing fraudulent orders or misuse of our platform',
          'Complying with applicable Indian laws and regulations',
        ],
      },
      {
        subtitle: 'Legal Basis',
        text: 'We process your data based on: (a) your consent, (b) contract performance (fulfilling your order), (c) legitimate business interests, and (d) legal obligations under applicable Indian law.',
      },
    ],
  },
  {
    id: 'sharing',
    icon: 'share',
    title: '3. Sharing Your Information',
    content: [
      {
        text: 'We do not sell, rent, or trade your personal information. We share data only in limited circumstances:',
        list: [
          'Delivery & Logistics Partners: Courier services require your name, address, and phone number to deliver orders.',
          'Payment Processors: If applicable, payment partners receive transaction details under strict data security agreements.',
          'Technology Providers: Our hosting and analytics providers may process anonymised usage data under confidentiality agreements.',
          'Legal Compliance: We may disclose information if required by law, court order, or government authority in India.',
          'Business Transfers: If CraftCastle is merged or acquired, your data may transfer to the new entity under the same privacy commitments.',
        ],
      },
    ],
  },
  {
    id: 'data-security',
    icon: 'security',
    title: '4. Data Security',
    content: [
      {
        text: `We take the security of your personal information seriously. Our safeguards include:`,
        list: [
          'HTTPS encryption for all data transmitted between your browser and our servers',
          'Restricted access to personal data — only authorised CraftCastle team members can access customer records',
          'Regular security reviews of our systems and third-party integrations',
          'Secure deletion of data that is no longer needed',
        ],
      },
      {
        text: 'While we strive to protect your data, no method of transmission over the internet is 100% secure. In the unlikely event of a data breach that affects your rights, we will notify you as required by law.',
      },
    ],
  },
  {
    id: 'cookies',
    icon: 'cookie',
    title: '5. Cookies & Local Storage',
    content: [
      {
        text: 'Our website uses browser storage to enhance your experience:',
        list: [
          'Cart & Wishlist Persistence: Items you add to your cart or wishlist are saved locally in your browser so your selections are not lost on refresh.',
          'Theme Preference: Your chosen light/dark mode preference is stored locally.',
          'Session Management: Admin authentication tokens are stored securely for admin users.',
          'Analytics Cookies: We may use anonymised analytics to understand page traffic patterns.',
        ],
      },
      {
        text: 'You can clear browser storage at any time through your browser settings. This will reset your cart, wishlist, and theme preference.',
      },
    ],
  },
  {
    id: 'retention',
    icon: 'schedule',
    title: '6. Data Retention',
    content: [
      {
        text: 'We retain your personal information only as long as necessary:',
        list: [
          'Order records are retained for a minimum of 3 years to comply with Indian tax and accounting regulations.',
          'Customer support communications are retained for 12 months.',
          'Marketing consent records are retained until you withdraw consent.',
          'Website analytics data is anonymised after 26 months.',
        ],
      },
      {
        text: 'You may request deletion of your data at any time (subject to legal retention requirements) by contacting us at craftcastle2404@gmail.com.',
      },
    ],
  },
  {
    id: 'your-rights',
    icon: 'verified_user',
    title: '7. Your Rights',
    content: [
      {
        text: 'As a user of CraftCastle, you have the right to:',
        list: [
          'Access: Request a copy of the personal data we hold about you.',
          'Correction: Ask us to correct inaccurate or incomplete information.',
          'Deletion: Request erasure of your data where no legal obligation requires us to retain it.',
          'Objection: Object to us processing your data for direct marketing purposes.',
          'Withdrawal of Consent: Unsubscribe from promotional messages at any time.',
          'Complaint: Lodge a complaint with relevant data protection authorities if you believe we have mishandled your data.',
        ],
      },
      {
        text: 'To exercise any of these rights, please email us at craftcastle2404@gmail.com or message us on WhatsApp at +91 87340 42595. We will respond within 30 days.',
      },
    ],
  },
  {
    id: 'third-party',
    icon: 'open_in_new',
    title: '8. Third-Party Links',
    content: [
      {
        text: 'Our website may contain links to third-party platforms such as Instagram and WhatsApp. Once you leave our site, this Privacy Policy no longer applies. We encourage you to review the privacy policies of any external websites you visit. CraftCastle is not responsible for the privacy practices of third-party services.',
      },
    ],
  },
  {
    id: 'children',
    icon: 'child_care',
    title: '9. Children\'s Privacy',
    content: [
      {
        text: 'CraftCastle\'s services are not directed to children under the age of 13. We do not knowingly collect personal information from children. If you believe a child has provided us with personal information, please contact us immediately and we will take steps to delete such information.',
      },
    ],
  },
  {
    id: 'changes',
    icon: 'update',
    title: '10. Changes to This Policy',
    content: [
      {
        text: `We may update this Privacy Policy periodically to reflect changes in our practices or applicable laws. When we make material changes, we will update the "Last Updated" date at the top of this page. We encourage you to review this policy regularly. Continued use of CraftCastle after changes are posted constitutes your acceptance of the revised policy.`,
      },
    ],
  },
  {
    id: 'contact',
    icon: 'contact_support',
    title: '11. Contact Us',
    content: [
      {
        text: 'If you have any questions, concerns, or requests regarding this Privacy Policy or how we handle your data, please reach out:',
        list: [
          'Email: craftcastle2404@gmail.com',
          'WhatsApp: +91 87340 42595',
          'Phone: +91 87340 42595',
          'Location: Ahmedabad, Gujarat, India',
        ],
      },
    ],
  },
]

export function PrivacyPolicyPage() {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
    document.title = 'Privacy Policy — CraftCastle'
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
            <span>Privacy Policy</span>
          </div>
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-cf-primary/10 flex items-center justify-center shrink-0 mt-1">
              <Icon name="privacy_tip" size={22} className="text-cf-primary" />
            </div>
            <div>
              <h1 className="font-playfair font-bold text-cf-primary text-2xl sm:text-3xl mb-2">
                Privacy Policy
              </h1>
              <p className="text-cf-outline text-xs leading-relaxed max-w-xl">
                At CraftCastle, your trust is our most valued craft. This policy explains how we collect,
                use, and protect your personal information when you shop for our handmade Indian handicrafts.
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
              <p className="font-semibold text-cf-primary mb-1">Our Commitment to You</p>
              <p>
                CraftCastle is a boutique Indian handicraft store based in Ahmedabad, Gujarat. We are
                committed to preserving the privacy and security of your personal information. We collect
                only what is necessary, use it responsibly, and never sell your data to third parties.
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
              <p className="font-playfair font-bold text-cf-primary mb-2">Questions about your privacy?</p>
              <p className="text-xs text-cf-outline mb-4">
                We're here to help. Reach out to our team — we respond within 24 hours.
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
                  to="/"
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
