import Link from "next/link";
import { notFound } from "next/navigation";
import { getServicePageBySlug } from "@/app/services/service-page-store";
import { SERVICE_OPTIONS, getServiceOptionById } from "@/app/services/service-catalog";
import {
  getCountry,
  getState,
  getCityInCountry,
  getStatesByCountry,
  getCitiesByState,
} from "@/app/services/location-data";
import Image from "next/image";
import {
  Code, ShoppingCart, Layout, Palette, Wrench, CheckCircle,
  Zap, Smartphone, Headphones, Globe, MapPin, Building2,
  ArrowRight, Star, Shield, Clock3,
} from "lucide-react";

// ─── SEO slug parsing ────────────────────────────────────────────────────────

const SORTED_SERVICE_IDS = [...SERVICE_OPTIONS.map((s) => s.id)].sort(
  (a, b) => b.length - a.length
);

function parseSemanticSlug(slug) {
  const inIdx = slug.lastIndexOf("-in-");
  if (inIdx === -1) return null;

  const locationSlug = slug.slice(inIdx + 4);
  const leftPart = slug.slice(0, inIdx);
  if (!locationSlug || !leftPart) return null;

  for (const serviceId of SORTED_SERVICE_IDS) {
    if (leftPart === serviceId) {
      // {serviceId}-in-{countrySlug}
      return { type: "country", serviceId, countrySlug: locationSlug };
    }
    if (leftPart.endsWith("-" + serviceId)) {
      const countrySlug = leftPart.slice(0, leftPart.length - serviceId.length - 1);
      if (countrySlug) {
        // {countrySlug}-{serviceId}-in-{stateOrCitySlug}
        return { type: "state-or-city", serviceId, countrySlug, locationSlug };
      }
    }
  }
  return null;
}

function buildCountryUrl(serviceId, countrySlug) {
  return `/${serviceId}-in-${countrySlug}`;
}
function buildStateUrl(countrySlug, serviceId, stateSlug) {
  return `/${countrySlug}-${serviceId}-in-${stateSlug}`;
}
function buildCityUrl(countrySlug, serviceId, citySlug) {
  return `/${countrySlug}-${serviceId}-in-${citySlug}`;
}

// ─── Metadata ────────────────────────────────────────────────────────────────

export async function generateMetadata({ params }) {
  const { servicePageSlug } = await params;
  const slug = decodeURIComponent(servicePageSlug);

  const storePage = await getServicePageBySlug(slug);
  if (storePage) {
    const loc = storePage.cityName ?? storePage.stateName ?? storePage.countryName;
    return {
      title: `${storePage.serviceName} in ${loc} | Local Experts`,
      description: storePage.serviceBlurb ?? `Professional ${storePage.serviceName} in ${loc}.`,
    };
  }

  const parsed = parseSemanticSlug(slug);
  if (!parsed) return { title: "Not Found" };

  const service = getServiceOptionById(parsed.serviceId);
  const country = await getCountry(parsed.countrySlug);
  if (!service || !country) return { title: "Not Found" };

  if (parsed.type === "country") {
    return {
      title: `${service.name} in ${country.countryName} | Professional Services`,
      description: `${service.blurb} Find expert ${service.shortName} professionals across ${country.countryName}.`,
    };
  }

  const state = await getState(parsed.countrySlug, parsed.locationSlug);
  if (state) {
    return {
      title: `${service.name} in ${state.stateName}, ${country.countryName}`,
      description: `${service.blurb} Expert ${service.shortName} services throughout ${state.stateName}.`,
    };
  }

  const city = await getCityInCountry(parsed.countrySlug, parsed.locationSlug);
  if (city) {
    return {
      title: `${service.name} in ${city.cityName}, ${country.countryName} | Local Experts`,
      description: `${service.blurb} Your trusted local ${service.shortName} experts in ${city.cityName}.`,
    };
  }

  return { title: "Not Found" };
}

// ─── Page router ─────────────────────────────────────────────────────────────

export default async function ServicePageSlug({ params }) {
  const { servicePageSlug } = await params;
  const slug = decodeURIComponent(servicePageSlug);

  // 1. Backward-compat: admin store pages
  const storePage = await getServicePageBySlug(slug);
  if (storePage) return <StoreLandingPage page={storePage} />;

  // 2. New SEO URL pattern
  const parsed = parseSemanticSlug(slug);
  if (!parsed) notFound();

  const service = getServiceOptionById(parsed.serviceId);
  if (!service) notFound();

  const country = await getCountry(parsed.countrySlug);
  if (!country) notFound();

  if (parsed.type === "country") {
    const states = await getStatesByCountry(country.countryId);
    return <CountryServicePage service={service} country={country} states={states} />;
  }

  // Resolve state vs city by slug
  const state = await getState(parsed.countrySlug, parsed.locationSlug);
  if (state) {
    const cities = await getCitiesByState(state.stateId);
    return (
      <StateServicePage
        service={service}
        country={country}
        state={state}
        cities={cities}
      />
    );
  }

  const city = await getCityInCountry(parsed.countrySlug, parsed.locationSlug);
  if (!city) notFound();

  return <CityServicePage service={service} city={city} />;
}

// ─── Shared UI primitives ─────────────────────────────────────────────────────

function Breadcrumb({ crumbs }) {
  return (
    <nav className="flex flex-wrap items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
      {crumbs.map((crumb, i) => (
        <span key={i} className="flex items-center gap-1.5">
          {i > 0 && <span className="text-slate-300">/</span>}
          {crumb.href ? (
            <Link href={crumb.href} className="hover:text-[#ca202f] transition-colors">
              {crumb.label}
            </Link>
          ) : (
            <span className="text-slate-600">{crumb.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}

function StatsRow() {
  return (
    <div className="flex flex-wrap gap-8 mt-10">
      {[
        { value: "150+", label: "Projects Delivered" },
        { value: "8 Yrs", label: "Industry Experience" },
        { value: "98%", label: "Client Satisfaction" },
        { value: "24/7", label: "Support Available" },
      ].map((s) => (
        <div key={s.label} className="flex flex-col gap-0.5">
          <span className="text-2xl font-bold text-slate-900">{s.value}</span>
          <span className="text-xs font-medium text-slate-500 uppercase tracking-widest">
            {s.label}
          </span>
        </div>
      ))}
    </div>
  );
}

function WhyUsSection({ locationName }) {
  return (
    <section className="px-6 py-20 lg:px-16">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
        <div>
          <h2 className="text-4xl font-bold">Why Partner With Us in {locationName}?</h2>
          <div className="w-16 h-1 bg-[#ca202f] mt-4 rounded" />
          <p className="mt-6 text-gray-600">
            We combine deep local market knowledge with enterprise-grade delivery so your project
            succeeds — on time, on budget, and built to scale.
          </p>
          <button className="mt-6 text-[#003985] font-semibold flex items-center gap-2 hover:gap-3 transition-all">
            Discuss Your Project <ArrowRight size={16} />
          </button>
        </div>
        <div className="grid sm:grid-cols-2 gap-6">
          {[
            { title: "Local Expertise", icon: <MapPin size={20} /> },
            { title: "SEO-Optimised Work", icon: <CheckCircle size={20} /> },
            { title: "Fast Turnaround", icon: <Zap size={20} /> },
            { title: "Mobile-First Design", icon: <Smartphone size={20} /> },
            { title: "Transparent Pricing", icon: <Shield size={20} /> },
            { title: "Dedicated Support", icon: <Headphones size={20} /> },
          ].map((item) => (
            <div
              key={item.title}
              className="bg-white p-5 rounded-2xl shadow-sm hover:shadow-md transition border border-slate-100"
            >
              <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-blue-50 text-[#003985] mb-3">
                {item.icon}
              </div>
              <h4 className="font-semibold text-slate-800">{item.title}</h4>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTASection({ serviceName, locationName }) {
  return (
    <section className="bg-[#ca202f] text-white py-20 text-center">
      <p className="text-sm font-semibold uppercase tracking-widest opacity-80 mb-3">
        Get Started Today
      </p>
      <h2 className="text-4xl font-bold max-w-2xl mx-auto px-6">
        Ready for Expert {serviceName} in {locationName}?
      </h2>
      <p className="mt-4 text-white/80 max-w-xl mx-auto px-6">
        Talk to our team — free consultation, no commitment.
      </p>
      <div className="mt-8 flex justify-center gap-4 flex-wrap px-6">
        <button className="bg-white text-[#ca202f] px-7 py-3 rounded-xl font-semibold hover:bg-slate-50 transition">
          Get Free Consultation
        </button>
        <button className="border border-white/40 text-white px-7 py-3 rounded-xl font-semibold hover:bg-white/10 transition">
          View Our Work
        </button>
      </div>
    </section>
  );
}

// ─── Country-level page ───────────────────────────────────────────────────────

function CountryServicePage({ service, country, states }) {
  const hasStates = states.length > 0;

  return (
    <main className="bg-white text-[#0f172a]">
      {/* Hero */}
      <section className="px-6 py-20 lg:px-16 bg-linear-to-b from-white to-[#f1f5f9]">
        <div className="max-w-7xl mx-auto">
          <Breadcrumb
            crumbs={[
              { label: "Services", href: "/" },
              { label: country.countryName },
              { label: service.shortName },
            ]}
          />
          <div className="mt-6 grid lg:grid-cols-2 gap-10 items-center">
            <div>
              <span className="inline-flex items-center gap-2 bg-red-50 text-[#ca202f] px-4 py-1.5 rounded-full text-sm font-semibold">
                <Globe size={14} /> Nationwide Coverage
              </span>
              <h1 className="mt-5 text-5xl font-bold leading-tight">
                {service.name}
                <br />
                <span className="text-[#003985]">in {country.countryName}</span>
              </h1>
              <p className="mt-5 text-lg text-gray-600 max-w-xl">
                {service.blurb} We serve businesses across every major state and city in{" "}
                {country.countryName} with consistent quality and local understanding.
              </p>
              <div className="mt-8 flex gap-4 flex-wrap">
                <button className="bg-[#ca202f] text-white px-6 py-3 rounded-xl font-semibold hover:opacity-90 transition">
                  Get Free Consultation
                </button>
                <button className="border border-slate-200 px-6 py-3 rounded-xl font-semibold hover:bg-slate-50 transition">
                  View Our Work
                </button>
              </div>
              <StatsRow />
            </div>
            <div className="relative w-full h-100 hidden lg:block">
              <Image
                src="/images/hero-img.png"
                alt={`${service.name} in ${country.countryName}`}
                fill
                priority
                className="object-contain object-center"
              />
            </div>
          </div>
        </div>
      </section>

      {/* States grid */}
      <section className="px-6 py-20 lg:px-16 bg-[#f8fafc]">
        <div className="max-w-7xl mx-auto">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#ca202f]">
            Browse by State
          </p>
          <h2 className="mt-2 text-3xl font-bold">
            {service.shortName} Services Across {country.countryName}
          </h2>
          <p className="mt-3 text-gray-500 max-w-2xl">
            Select a state to explore our {service.shortName.toLowerCase()} offerings in specific
            cities.
          </p>
          {hasStates ? (
            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {states.map((state) => (
                <Link
                  key={state.id}
                  href={buildStateUrl(country.countrySlug, service.id, state.slug)}
                  className="group flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4 hover:border-[#ca202f]/40 hover:shadow-md transition"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-[#003985]">
                      <MapPin size={15} />
                    </div>
                    <span className="font-medium text-slate-800 text-sm">{state.name}</span>
                  </div>
                  <ArrowRight
                    size={14}
                    className="text-slate-400 group-hover:text-[#ca202f] group-hover:translate-x-0.5 transition-all"
                  />
                </Link>
              ))}
            </div>
          ) : (
            <p className="mt-8 text-slate-500">No state pages available yet.</p>
          )}
        </div>
      </section>

      <WhyUsSection locationName={country.countryName} />
      <CTASection serviceName={service.shortName} locationName={country.countryName} />
    </main>
  );
}

// ─── State-level page ─────────────────────────────────────────────────────────

function StateServicePage({ service, country, state, cities }) {
  const hasCities = cities.length > 0;

  return (
    <main className="bg-white text-[#0f172a]">
      {/* Hero */}
      <section className="px-6 py-20 lg:px-16 bg-linear-to-b from-white to-[#f1f5f9]">
        <div className="max-w-7xl mx-auto">
          <Breadcrumb
            crumbs={[
              { label: "Services", href: "/" },
              {
                label: country.countryName,
                href: buildCountryUrl(service.id, country.countrySlug),
              },
              { label: state.stateName },
              { label: service.shortName },
            ]}
          />
          <div className="mt-6 grid lg:grid-cols-2 gap-10 items-center">
            <div>
              <span className="inline-flex items-center gap-2 bg-red-50 text-[#ca202f] px-4 py-1.5 rounded-full text-sm font-semibold">
                <MapPin size={14} /> {state.stateName}, {country.countryName}
              </span>
              <h1 className="mt-5 text-5xl font-bold leading-tight">
                {service.name}
                <br />
                <span className="text-[#003985]">in {state.stateName}</span>
              </h1>
              <p className="mt-5 text-lg text-gray-600 max-w-xl">
                {service.blurb} We deliver professional {service.shortName.toLowerCase()} services
                across all major cities in {state.stateName}, {country.countryName}.
              </p>
              <div className="mt-8 flex gap-4 flex-wrap">
                <button className="bg-[#ca202f] text-white px-6 py-3 rounded-xl font-semibold hover:opacity-90 transition">
                  Get Free Consultation
                </button>
                <button className="border border-slate-200 px-6 py-3 rounded-xl font-semibold hover:bg-slate-50 transition">
                  View Our Work
                </button>
              </div>
              <StatsRow />
            </div>
            <div className="relative w-full h-100 hidden lg:block">
              <Image
                src="/images/hero-img.png"
                alt={`${service.name} in ${state.stateName}`}
                fill
                priority
                className="object-contain object-center"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Cities grid */}
      <section className="px-6 py-20 lg:px-16 bg-[#f8fafc]">
        <div className="max-w-7xl mx-auto">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#ca202f]">
            Browse by City
          </p>
          <h2 className="mt-2 text-3xl font-bold">
            {service.shortName} Services Across {state.stateName}
          </h2>
          <p className="mt-3 text-gray-500 max-w-2xl">
            Select a city for dedicated {service.shortName.toLowerCase()} experts near you.
          </p>
          {hasCities ? (
            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {cities.map((city) => (
                <Link
                  key={city.id}
                  href={buildCityUrl(country.countrySlug, service.id, city.slug)}
                  className="group flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4 hover:border-[#ca202f]/40 hover:shadow-md transition"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-[#003985]">
                      <Building2 size={15} />
                    </div>
                    <span className="font-medium text-slate-800 text-sm">{city.name}</span>
                  </div>
                  <ArrowRight
                    size={14}
                    className="text-slate-400 group-hover:text-[#ca202f] group-hover:translate-x-0.5 transition-all"
                  />
                </Link>
              ))}
            </div>
          ) : (
            <div className="mt-8 rounded-2xl border border-dashed border-slate-200 bg-white p-10 text-center">
              <Building2 size={32} className="mx-auto text-slate-300 mb-3" />
              <p className="text-slate-500 font-medium">No cities listed for this state yet.</p>
              <p className="text-slate-400 text-sm mt-1">
                Contact us directly for {service.shortName} services in {state.stateName}.
              </p>
            </div>
          )}
        </div>
      </section>

      <WhyUsSection locationName={`${state.stateName}, ${country.countryName}`} />
      <CTASection
        serviceName={service.shortName}
        locationName={`${state.stateName}, ${country.countryName}`}
      />
    </main>
  );
}

// ─── City-level page ──────────────────────────────────────────────────────────

function CityServicePage({ service, city }) {
  const locationName = `${city.cityName}, ${city.countryName}`;

  const serviceItems = [
    { title: "Custom Development", icon: <Code />, desc: `Tailored ${service.shortName.toLowerCase()} solutions for businesses in ${city.cityName}.` },
    { title: "E-commerce Solutions", icon: <ShoppingCart />, desc: "Secure, scalable online stores built for growth." },
    { title: "UI/UX Design", icon: <Palette />, desc: "Conversion-focused design that keeps users engaged." },
    { title: "WordPress & CMS", icon: <Layout />, desc: "Flexible content management tailored to your workflow." },
    { title: "Performance Optimisation", icon: <Zap />, desc: "Fast load times and core web vitals tuned for ranking." },
    { title: "Ongoing Maintenance", icon: <Wrench />, desc: "Updates, monitoring, and support long after launch." },
  ];

  return (
    <main className="bg-white text-[#0f172a]">
      {/* Hero */}
      <section className="px-6 py-20 lg:px-16 bg-linear-to-b from-white to-[#f1f5f9]">
        <div className="max-w-7xl mx-auto">
          <Breadcrumb
            crumbs={[
              { label: "Services", href: "/" },
              {
                label: city.countryName,
                href: buildCountryUrl(service.id, city.countrySlug),
              },
              {
                label: city.stateName,
                href: buildStateUrl(city.countrySlug, service.id, city.stateSlug),
              },
              { label: city.cityName },
              { label: service.shortName },
            ]}
          />
          <div className="mt-6 grid lg:grid-cols-2 gap-10 items-center">
            <div>
              <span className="inline-flex items-center gap-2 bg-red-50 text-[#ca202f] px-4 py-1.5 rounded-full text-sm font-semibold">
                <Building2 size={14} /> Local Experts in {city.cityName}
              </span>
              <h1 className="mt-5 text-5xl font-bold leading-tight">
                {service.name}
                <br />
                <span className="text-[#003985]">in {city.cityName}</span>
              </h1>
              <p className="mt-5 text-lg text-gray-600 max-w-xl">
                {service.blurb} We help businesses in {locationName} with practical delivery,
                clear timelines, and ongoing support.
              </p>
              <div className="mt-8 flex gap-4 flex-wrap">
                <button className="bg-[#ca202f] text-white px-6 py-3 rounded-xl font-semibold hover:opacity-90 transition">
                  Get Free Consultation
                </button>
                <button className="border border-slate-200 px-6 py-3 rounded-xl font-semibold hover:bg-slate-50 transition">
                  View Our Work
                </button>
              </div>
              <StatsRow />
            </div>
            <div className="relative w-full h-100 hidden lg:block">
              <Image
                src="/images/hero-img.png"
                alt={`${service.name} in ${city.cityName}`}
                fill
                priority
                className="object-contain object-center"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Services grid */}
      <section className="px-6 py-20 lg:px-16 bg-[#f8fafc]">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#ca202f]">
            What We Offer
          </p>
          <h2 className="mt-2 text-4xl font-bold">
            Comprehensive {service.shortName} Solutions
          </h2>
          <p className="mt-4 text-gray-500 max-w-2xl mx-auto">
            End-to-end {service.shortName.toLowerCase()} services tailored for {locationName}.
          </p>
          <div className="grid md:grid-cols-3 gap-8 mt-14">
            {serviceItems.map((item) => (
              <div
                key={item.title}
                className="bg-white p-8 rounded-2xl hover:shadow-xl transition border border-slate-100"
              >
                <div className="w-14 h-14 flex items-center justify-center rounded-xl bg-blue-50 text-[#003985] mb-6 mx-auto">
                  {item.icon}
                </div>
                <h3 className="text-xl font-semibold">{item.title}</h3>
                <p className="mt-3 text-gray-500 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="px-6 py-20 lg:px-16">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#ca202f]">
            Client Stories
          </p>
          <h2 className="mt-2 text-4xl font-bold">Trusted by Businesses in {city.cityName}</h2>
          <div className="grid md:grid-cols-3 gap-8 mt-14">
            {[
              { name: "Rahul Sharma", role: "Founder, TechGrow", text: "Outstanding delivery. Our online presence transformed completely within weeks." },
              { name: "Priya Desai", role: "Marketing Director", text: "Professional team that actually understands local markets. Highly recommended." },
              { name: "Amit Patel", role: "CEO, Nexa Group", text: "Clean code, great communication, and solid post-launch support." },
            ].map((t) => (
              <div
                key={t.name}
                className="bg-[#f8fafc] p-8 rounded-2xl text-left border border-slate-100"
              >
                <div className="flex gap-0.5 text-yellow-400 mb-4">
                  {Array(5).fill(0).map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
                </div>
                <p className="text-gray-600 italic">"{t.text}"</p>
                <div className="mt-6">
                  <h4 className="font-semibold">{t.name}</h4>
                  <p className="text-sm text-gray-400">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <WhyUsSection locationName={locationName} />
      <CTASection serviceName={service.shortName} locationName={locationName} />
    </main>
  );
}

// ─── Store-based legacy page (backward compat) ────────────────────────────────

function getLocationCopy(page) {
  const level = page.locationLevel ?? "city";
  const locationName =
    page.locationName ??
    (level === "country"
      ? page.countryName
      : level === "state"
      ? `${page.stateName}, ${page.countryName}`
      : `${page.cityName}, ${page.countryName}`);
  return {
    level,
    locationName,
    scope:
      level === "country"
        ? page.countryName
        : level === "state"
        ? `${page.stateName}, ${page.countryName}`
        : page.cityName,
    footerLocation:
      level === "country"
        ? page.countryName
        : level === "state"
        ? `${page.stateName}, ${page.countryName}`
        : `${page.cityName}, ${page.countryName}`,
  };
}

function StoreLandingPage({ page }) {
  const location = getLocationCopy(page);

  return (
    <main className="bg-white text-[#0f172a]">
      <section className="px-6 py-20 lg:px-16 bg-linear-to-b from-white to-[#f1f5f9]">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <span className="inline-block bg-red-100 text-[#ca202f] px-4 py-1 rounded-full text-sm font-semibold">
              Premium Agency in {location.footerLocation}
            </span>
            <h1 className="mt-6 text-5xl font-bold leading-tight">
              {page.serviceName}
              <br />
              Services in{" "}
              <span className="text-[#003985]">{location.locationName}</span>
            </h1>
            <p className="mt-6 text-lg text-gray-600 max-w-xl">
              We build scalable, modern and high-performance solutions for businesses in{" "}
              {location.scope}. Transform your digital presence today.
            </p>
            <div className="mt-8 flex gap-4">
              <button className="bg-[#ca202f] text-white px-6 py-3 rounded-xl font-semibold hover:opacity-90">
                Get Free Consultation
              </button>
              <button className="border px-6 py-3 rounded-xl font-semibold">
                View Our Work
              </button>
            </div>
          </div>
          <div className="relative w-full h-112.5">
            <Image
              src="/images/hero-img.png"
              alt="Hero Image"
              fill
              priority
              className="object-contain object-center"
            />
          </div>
        </div>
      </section>
      <WhyUsSection locationName={location.locationName} />
      <CTASection serviceName={page.serviceShortName ?? page.serviceName} locationName={location.locationName} />
    </main>
  );
}
