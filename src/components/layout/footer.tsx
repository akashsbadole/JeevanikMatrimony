import Link from 'next/link';
import { Heart, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Youtube } from 'lucide-react';

export function Footer() {
  const footerLinks = {
    company: [
      { name: 'About Us', href: '/about' },
      { name: 'Success Stories', href: '/success-stories' },
      { name: 'Careers', href: '/careers' },
      { name: 'Press', href: '/press' },
      { name: 'Blog', href: '/blog' },
    ],
    services: [
      { name: 'Search Profiles', href: '/search' },
      { name: 'Premium Plans', href: '/pricing' },
      { name: 'Horoscope Matching', href: '/horoscope' },
      { name: 'Wedding Services', href: '/wedding-services' },
      { name: 'Mobile App', href: '/mobile-app' },
    ],
    support: [
      { name: 'Help Center', href: '/help' },
      { name: 'Contact Us', href: '/contact' },
      { name: 'Safety Tips', href: '/safety' },
      { name: 'Report Profile', href: '/report' },
      { name: 'Feedback', href: '/feedback' },
    ],
    legal: [
      { name: 'Privacy Policy', href: '/privacy' },
      { name: 'Terms of Service', href: '/terms' },
      { name: 'Cookie Policy', href: '/cookies' },
      { name: 'Refund Policy', href: '/refund' },
      { name: 'Community Guidelines', href: '/guidelines' },
    ],
  };

  const socialLinks = [
    { name: 'Facebook', icon: Facebook, href: 'https://facebook.com/indianmatrimony' },
    { name: 'Twitter', icon: Twitter, href: 'https://twitter.com/indianmatrimony' },
    { name: 'Instagram', icon: Instagram, href: 'https://instagram.com/indianmatrimony' },
    { name: 'YouTube', icon: Youtube, href: 'https://youtube.com/indianmatrimony' },
  ];

  const cities = [
    'Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Kolkata', 'Hyderabad',
    'Pune', 'Ahmedabad', 'Jaipur', 'Surat', 'Lucknow', 'Kanpur'
  ];

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
            {/* Brand Section */}
            <div className="lg:col-span-2">
              <Link href="/" className="flex items-center space-x-2 mb-4">
                <Heart className="h-8 w-8 text-rose-500" />
                <span className="text-2xl font-bold">Indian Matrimony</span>
              </Link>
              
              <p className="text-gray-400 mb-6 leading-relaxed">
                India's most trusted matrimony platform connecting millions of families 
                to find their perfect life partner. Your journey to happiness starts here.
              </p>
              
              <div className="space-y-3">
                <div className="flex items-center text-gray-400">
                  <Mail className="h-4 w-4 mr-3 flex-shrink-0" />
                  <span className="text-sm">support@indianmatrimony.com</span>
                </div>
                <div className="flex items-center text-gray-400">
                  <Phone className="h-4 w-4 mr-3 flex-shrink-0" />
                  <span className="text-sm">+91 1800-123-4567</span>
                </div>
                <div className="flex items-center text-gray-400">
                  <MapPin className="h-4 w-4 mr-3 flex-shrink-0" />
                  <span className="text-sm">Mumbai, Maharashtra, India</span>
                </div>
              </div>
            </div>

            {/* Company Links */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Company</h3>
              <ul className="space-y-2">
                {footerLinks.company.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-gray-400 hover:text-white transition-colors text-sm"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Services Links */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Services</h3>
              <ul className="space-y-2">
                {footerLinks.services.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-gray-400 hover:text-white transition-colors text-sm"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support Links */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Support</h3>
              <ul className="space-y-2">
                {footerLinks.support.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-gray-400 hover:text-white transition-colors text-sm"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal Links */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Legal</h3>
              <ul className="space-y-2">
                {footerLinks.legal.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-gray-400 hover:text-white transition-colors text-sm"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Cities Section */}
        <div className="py-8 border-t border-gray-800">
          <h3 className="text-lg font-semibold mb-4">Popular Cities</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {cities.map((city) => (
              <Link
                key={city}
                href={`/search?city=${city.toLowerCase()}`}
                className="text-gray-400 hover:text-white transition-colors text-sm"
              >
                {city} Matrimony
              </Link>
            ))}
          </div>
        </div>

        {/* Social Media & Newsletter */}
        <div className="py-8 border-t border-gray-800">
          <div className="flex flex-col lg:flex-row justify-between items-center space-y-6 lg:space-y-0">
            {/* Social Media */}
            <div className="flex items-center space-x-6">
              <span className="text-gray-400 text-sm">Follow us:</span>
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors"
                  aria-label={social.name}
                >
                  <social.icon className="h-5 w-5" />
                </a>
              ))}
            </div>

            {/* Newsletter Signup */}
            <div className="flex items-center space-x-4">
              <span className="text-gray-400 text-sm">Stay updated:</span>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-l-md text-white placeholder-gray-400 focus:outline-none focus:border-rose-500 text-sm"
                />
                <button className="px-4 py-2 bg-rose-600 hover:bg-rose-700 rounded-r-md transition-colors text-sm">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-6 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-gray-400 text-sm">
              © 2024 Indian Matrimony. All rights reserved.
            </div>
            
            <div className="flex items-center space-x-6 text-gray-400 text-sm">
              <span>🔒 SSL Secured</span>
              <span>✓ Verified Platform</span>
              <span>⭐ 4.8/5 Rating</span>
            </div>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="py-6 border-t border-gray-800">
          <div className="text-center">
            <div className="text-gray-400 text-sm mb-4">
              Trusted by millions of families across India and worldwide
            </div>
            <div className="flex justify-center items-center space-x-8 opacity-60">
              <div className="text-xs">
                <div className="font-semibold text-white">2M+</div>
                <div className="text-gray-400">Active Members</div>
              </div>
              <div className="text-xs">
                <div className="font-semibold text-white">50K+</div>
                <div className="text-gray-400">Success Stories</div>
              </div>
              <div className="text-xs">
                <div className="font-semibold text-white">95%</div>
                <div className="text-gray-400">Verified Profiles</div>
              </div>
              <div className="text-xs">
                <div className="font-semibold text-white">15+</div>
                <div className="text-gray-400">Years Experience</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
