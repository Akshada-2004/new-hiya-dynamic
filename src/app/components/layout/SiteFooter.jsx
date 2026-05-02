// components/SiteFooter.tsx
import Link from 'next/link';
import { MapPin, Mail, Phone } from 'lucide-react';

const pageLinks = [
  { href: '/',         label: 'Home' },
  { href: '/about',    label: 'About' },
  { href: '/services', label: 'Services' },
  { href: '/contact',  label: 'Contact' },
];

const serviceLinks = [
  { href: '/services#web',      label: 'Web Design' },
  { href: '/services#seo',      label: 'SEO & Growth' },
  { href: '/services#strategy', label: 'Digital Strategy' },
  { href: '/services#branding', label: 'Branding' },
];

export default function SiteFooter() {
  return (
    <footer className="mt-16 bg-[#0d1117] text-slate-400">
      <div className="mx-auto grid w-full max-w-7xl gap-10 px-5 py-14 lg:grid-cols-4 lg:px-10">
        {/* Brand */}
        <div>
          <div className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-[#ca202f] text-base font-bold text-white">
            H
          </div>
          <h3 className="mt-4 text-lg font-semibold leading-snug text-white">
            Complete web solutions for business growth.
          </h3>
          <p className="mt-3 text-sm leading-relaxed text-slate-500">
            We build fast websites, SEO-ready pages, and conversion-focused experiences.
          </p>
          <div className="mt-5 flex gap-2">
            {['𝕏', 'in', 'ig'].map((s) => (
              <a key={s} href="#" className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 text-xs font-semibold text-slate-500 transition hover:border-white/25 hover:text-white">
                {s}
              </a>
            ))}
          </div>
        </div>

        {/* Pages */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-white">Pages</p>
          <div className="mt-4 flex flex-col gap-2.5">
            {pageLinks.map((l) => (
              <Link key={l.href} href={l.href} className="flex items-center gap-1.5 text-sm text-slate-500 transition hover:text-white">
                <span className="text-[#ca202f] opacity-60">›</span> {l.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Services */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-white">Services</p>
          <div className="mt-4 flex flex-col gap-2.5">
            {serviceLinks.map((l) => (
              <Link key={l.href} href={l.href} className="flex items-center gap-1.5 text-sm text-slate-500 transition hover:text-white">
                <span className="text-[#ca202f] opacity-60">›</span> {l.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Contact */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-white">Contact</p>
          <div className="mt-4 space-y-3">
            {[
              { Icon: MapPin, text: 'India' },
              { Icon: Mail,   text: 'hello@hiyadigital.com' },
              { Icon: Phone,  text: '+91 90000 00000' },
            ].map(({ Icon, text }) => (
              <div key={text} className="flex items-center gap-3 text-sm text-slate-500">
                <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#ca202f]/15">
                  <Icon size={12} className="text-[#ca202f]" />
                </span>
                {text}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-white/[0.07] px-5 py-4 lg:px-10">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between">
          <p className="text-xs text-slate-600">
            © {new Date().getFullYear()} Hiya Digital. All rights reserved.
          </p>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-white/[0.07] px-2.5 py-1 text-[11px] text-slate-600">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            Built with Next.js
          </span>
        </div>
      </div>
    </footer>
  );
}