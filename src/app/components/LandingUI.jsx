'use client';

import { useEffect, useState } from 'react';
import { Menu, X, Code2, ShoppingCart, Layout, MonitorSmartphone, Palette, Wrench } from 'lucide-react';

const serviceCards = [
  { title: 'Website Development', icon: MonitorSmartphone },
  { title: 'E-commerce Development', icon: ShoppingCart },
  { title: 'Custom Web Applications', icon: Code2 },
  { title: 'WordPress Development', icon: Layout },
  { title: 'UI/UX Design', icon: Palette },
  { title: 'Website Maintenance', icon: Wrench },
];

export default function LandingUI({ page }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!page) {
    return null;
  }

  return (
    <div className="min-h-screen bg-white text-[#0f172a]">
      <header className={`fixed z-50 w-full transition ${isScrolled ? 'bg-white shadow' : ''}`}>
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <h1 className="text-xl font-bold">
            Agency<span className="text-[#cb2034]">X</span>
          </h1>

          <button onClick={() => setIsMobileMenuOpen((open) => !open)} aria-label="Toggle menu">
            {isMobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </header>

      <section className="mx-auto grid max-w-7xl items-center gap-10 px-6 pb-20 pt-32 lg:grid-cols-2">
        <div>
          <h1 className="text-5xl font-bold leading-tight">
            {page.serviceName}
            <br />
            Services in <span className="text-[#003985]">{page.cityName}</span>
          </h1>

          <p className="mt-6 text-gray-600">
            {page.serviceBlurb} We build scalable, modern websites in {page.cityName}, {page.stateName}.
          </p>

          <button className="mt-6 rounded-lg bg-[#cb2034] px-6 py-3 text-white">
            Get Consultation
          </button>
        </div>

        <div className="rounded-xl bg-gray-100 p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gray-500">Page URL</p>
          <p className="mt-4 break-all rounded-lg bg-[#0f172a] p-4 font-mono text-sm text-white">
            /{page.slug}
          </p>
          <div className="mt-6 space-y-3 text-sm text-gray-600">
            <p>Country: {page.countryName}</p>
            <p>State: {page.stateName}</p>
            <p>City: {page.cityName}</p>
          </div>
        </div>
      </section>

      <section className="bg-[#f8fafc] px-6 py-20">
        <div className="mx-auto grid max-w-7xl gap-6 md:grid-cols-3">
          {serviceCards.map((service) => (
            <div key={service.title} className="rounded-xl bg-white p-6 shadow">
              <service.icon className="text-[#003985]" />
              <h3 className="mt-3 font-semibold">{service.title}</h3>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20">
        <h2 className="text-3xl font-bold">Why Choose Us</h2>
        <p className="mt-4 text-gray-600">
          We deliver premium {page.serviceShortName} services in {page.cityName}, {page.countryName}.
        </p>
      </section>

      <section className="bg-[#f8fafc] px-6 py-20">
        <div className="mx-auto grid max-w-7xl gap-6 md:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((step) => (
            <div key={step} className="rounded-xl bg-white p-6 shadow">
              Step {step}
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-6 px-6 py-20 md:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((item) => (
          <div key={item} className="h-60 rounded-xl bg-gray-200" />
        ))}
      </section>

      <section className="bg-[#f8fafc] px-6 py-20 text-center">
        <h2 className="text-3xl font-bold">Client Stories</h2>
      </section>

      <section className="bg-[#cb2034] py-20 text-center text-white">
        <h2 className="text-3xl font-bold">Ready to Build Your Website?</h2>
      </section>

      <footer className="bg-[#003985] py-10 text-center text-white">
        &copy; 2026 AgencyX
      </footer>
    </div>
  );
}
