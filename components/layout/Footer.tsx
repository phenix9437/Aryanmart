import Link from 'next/link';
import { Facebook, Linkedin, Twitter } from 'lucide-react';

const quickLinks = [
  { label: 'Products', href: '/products' },
  { label: 'Brands', href: '/products' },
  { label: 'RFQ', href: '/rfq' },
  { label: 'Tender Portal', href: '/tender' },
  { label: 'Blog', href: '/blog' },
  { label: 'Careers', href: '/careers' },
];

const supportLinks = [
  { label: 'Contact', href: '/contact' },
  { label: 'Track Order', href: '/account/orders' },
  { label: 'Returns', href: '/returns' },
  { label: 'FAQs', href: '/support' },
  { label: 'Technical Support', href: '/support' },
];

export function Footer() {
  return (
    <footer className="mt-16 bg-primary-dark text-primary-foreground">
      <div className="container-content grid gap-8 py-12 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="text-xl font-bold">ARYANMART</p>
          <p className="mt-2 text-body-md opacity-80">
            Enterprise procurement for telecom, networking, electrical, and defense infrastructure supplies.
          </p>
          <div className="mt-4 flex gap-3">
            <Facebook className="h-5 w-5 opacity-70 hover:opacity-100" />
            <Twitter className="h-5 w-5 opacity-70 hover:opacity-100" />
            <Linkedin className="h-5 w-5 opacity-70 hover:opacity-100" />
          </div>
          <p className="mt-4 font-mono text-body-sm opacity-70">GSTIN: 07AAAAA0000A1Z5</p>
          <p className="font-mono text-body-sm opacity-70">CIN: U51909DL2010PTC000000</p>
        </div>
        <div>
          <h4 className="text-heading-lg font-semibold">Quick Links</h4>
          <ul className="mt-4 space-y-2">
            {quickLinks.map((l) => (
              <li key={l.label}>
                <Link href={l.href} className="text-body-md opacity-80 hover:opacity-100 hover:underline">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="text-heading-lg font-semibold">Support</h4>
          <ul className="mt-4 space-y-2">
            {supportLinks.map((l) => (
              <li key={l.label}>
                <Link href={l.href} className="text-body-md opacity-80 hover:opacity-100 hover:underline">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="text-heading-lg font-semibold">Office</h4>
          <address className="mt-4 not-italic text-body-md opacity-80">
            AryanMart Pvt. Ltd.<br />
            Okhla Industrial Area, Phase III<br />
            New Delhi — 110020<br /><br />
            Phone: 1800-XXX-XXXX<br />
            Email: sales@aryanmart.com<br /><br />
            Mon–Sat: 9:00 AM – 6:00 PM IST
          </address>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="container-content flex flex-wrap items-center justify-between gap-4 py-4 text-body-sm opacity-70">
          <p>© {new Date().getFullYear()} AryanMart Pvt. Ltd. All rights reserved.</p>
          <div className="flex flex-wrap gap-4">
            <Link href="/privacy-policy">Privacy</Link>
            <Link href="/terms">Terms</Link>
            <Link href="/sitemap">Sitemap</Link>
            <span>ISO 9001:2015</span>
            <span>Make in India</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
