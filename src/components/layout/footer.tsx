import Link from 'next/link';

const quickLinks = [
  { name: 'Privacy Policy', href: '/legal/privacy' },
  { name: 'Refund Policy', href: '/legal/refund' },
  { name: 'Terms of Service', href: '/legal/terms' },
];

const contactDetails = [
  { label: 'Email', value: 'support@emporiotrading.in' },
  { label: 'WhatsApp', value: '+91 91500 12345' },
  { label: 'Office', value: 'Coimbatore, Tamil Nadu' },
];

export const Footer = () => (
  <footer className="border-t border-slate-200 bg-slate-50">
    <div className="mx-auto grid max-w-6xl gap-8 px-6 py-12 md:grid-cols-4">
      <div>
        <span className="rounded-full bg-sky-600/10 px-3 py-1 text-sm font-bold uppercase tracking-wide text-sky-600">
          ET
        </span>
        <p className="mt-4 text-sm text-slate-600">
          Emporio Trading equips Indian traders with Orderflow conviction, structured playbooks, and risk-first execution.
        </p>
      </div>
      <div>
        <h4 className="text-sm font-semibold text-slate-900">Quick Links</h4>
        <ul className="mt-3 space-y-2 text-sm text-slate-600">
          {quickLinks.map((link) => (
            <li key={link.name}>
              <Link href={link.href} className="transition hover:text-sky-600">
                {link.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h4 className="text-sm font-semibold text-slate-900">Follow</h4>
        <ul className="mt-3 space-y-2 text-sm text-slate-600">
          <li>
            <a href="https://www.youtube.com/@EmporioTrading" target="_blank" rel="noreferrer" className="hover:text-sky-600">
              YouTube
            </a>
          </li>
          <li>
            <a href="https://www.linkedin.com/company/emporiotrading" target="_blank" rel="noreferrer" className="hover:text-sky-600">
              LinkedIn
            </a>
          </li>
          <li>
            <a href="https://t.me/emporiotrading" target="_blank" rel="noreferrer" className="hover:text-sky-600">
              Telegram Community
            </a>
          </li>
        </ul>
      </div>
      <div>
        <h4 className="text-sm font-semibold text-slate-900">Contact</h4>
        <ul className="mt-3 space-y-2 text-sm text-slate-600">
          {contactDetails.map((detail) => (
            <li key={detail.label}>
              <span className="font-medium text-slate-700">{detail.label}: </span>
              {detail.value}
            </li>
          ))}
        </ul>
      </div>
    </div>
    <div className="border-t border-slate-200 bg-white py-6">
      <p className="text-center text-xs text-slate-500">
        © {new Date().getFullYear()} Emporio Trading. All rights reserved.
      </p>
    </div>
  </footer>
);
