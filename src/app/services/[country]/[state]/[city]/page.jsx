import { notFound } from 'next/navigation';
import { getCity as getLocation } from '@/app/services/location-data';

export async function generateMetadata({ params }) {
  const { country, state, city } = await params;
  const location = await getLocation(country, state, city);
  if (!location) return { title: 'Not Found' };
  return {
    title: `Web Development Services in ${location.cityName}, ${location.countryName} | Best Agency`,
    description: `Professional React, Next.js & WordPress development in ${location.cityName}. Serving businesses across ${location.stateName}.`,
  };
}

export default async function LocationServicePage({ params }) {
  const { country, state, city } = await params;
  const location = await getLocation(country, state, city);
  if (!location) notFound();
  const { cityName, stateName, countryName } = location;

  const services = [
    {
      tag: 'Most popular', tagColor: 'bg-blue-50 text-blue-800',
      imgBg: 'bg-blue-50', title: 'Custom website development',
      desc: `Tailored business websites built with React and Next.js, optimised for speed and SEO in the ${cityName} market.`
    },
    {
      tag: 'E-commerce', tagColor: 'bg-green-50 text-green-800',
      imgBg: 'bg-green-50', title: 'Online store development',
      desc: `Full-featured shops with payment gateways, inventory systems, and dashboards for ${cityName} businesses.`
    },
    {
      tag: 'Mobile-first', tagColor: 'bg-amber-50 text-amber-800',
      imgBg: 'bg-amber-50', title: 'Responsive design',
      desc: `Pixel-perfect across all screens — mobile, tablet, desktop — to reach every customer in ${stateName}.`
    },
    {
      tag: 'SEO & growth', tagColor: 'bg-purple-50 text-purple-800',
      imgBg: 'bg-purple-50', title: 'SEO optimisation',
      desc: `Rank higher on Google for ${cityName} searches and attract more local organic traffic that converts.`
    },
  ];

  const techStack = [
    { name: 'React', desc: 'UI components', bg: 'bg-blue-50' },
    { name: 'Next.js', desc: 'Full-stack framework', bg: 'bg-gray-100' },
    { name: 'Node.js', desc: 'Backend & APIs', bg: 'bg-green-50' },
    { name: 'WordPress', desc: 'CMS solutions', bg: 'bg-blue-50' },
    { name: 'Tailwind CSS', desc: 'Styling system', bg: 'bg-amber-50' },
    { name: 'SSL & Security', desc: 'Enterprise-grade', bg: 'bg-purple-50' },
  ];

  const process = [
    { n: '1', title: 'Discovery', desc: `We learn your goals, audience, and market in ${cityName}` },
    { n: '2', title: 'Design', desc: `Wireframes and UI tailored for ${stateName} users` },
    { n: '3', title: 'Build', desc: 'Clean, fast code using modern web technologies' },
    { n: '4', title: 'Launch & grow', desc: 'Deploy, monitor, and optimise continuously' },
  ];

  return (
    <main className="bg-gray-50 min-h-screen font-sans">

      {/* ── Hero ── */}
      <div className="bg-white border-b border-gray-100 overflow-hidden">
        <div className="max-w-5xl mx-auto px-7 pt-14 pb-0 grid grid-cols-1 md:grid-cols-2 gap-10 items-end">

          <div className="pb-12">
            <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-5 flex-wrap">
              <span>{countryName}</span><span className="opacity-40">›</span>
              <span>{stateName}</span><span className="opacity-40">›</span>
              <span className="text-blue-600 font-medium">{cityName}</span>
            </div>
            <span className="inline-flex items-center gap-1.5 bg-green-50 text-green-700 text-xs font-medium px-3 py-1 rounded-full mb-4">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
              Serving {cityName}
            </span>
            <h1 className="text-3xl font-medium text-gray-900 leading-snug mb-3">
              Professional web development in{' '}
              <span className="text-blue-600">{cityName}</span>
            </h1>
            <p className="text-sm text-gray-500 leading-relaxed mb-6">
              We build fast, scalable, and SEO-optimised websites for businesses across {stateName},
              {countryName} — using React, Next.js, and modern web technologies.
            </p>
            <div className="flex gap-3 flex-wrap">
              <button className="bg-blue-700 text-white text-sm font-medium px-5 py-2.5 rounded-lg">
                Get a free quote
              </button>
              <button className="border border-gray-200 text-gray-700 text-sm font-medium px-5 py-2.5 rounded-lg">
                View our work
              </button>
            </div>
          </div>

          {/* Browser mockup */}
          <div className="hidden md:block h-72 bg-gray-50 rounded-t-xl border border-b-0 border-gray-100 overflow-hidden">
            <div className="bg-white border-b border-gray-100 px-3 py-2 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-red-400" />
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              <span className="w-2 h-2 rounded-full bg-green-400" />
              <span className="flex-1 bg-gray-50 border border-gray-100 rounded text-xs text-gray-400 px-2 py-0.5 mx-2">
                www.yourbusiness-{cityName.toLowerCase().replace(/\s/g,'-')}.com
              </span>
            </div>
            <div className="p-4 flex flex-col gap-3">
              <div className="h-16 bg-blue-50 rounded-lg flex items-center justify-center">
                <div className="w-full h-full bg-blue-100 rounded-lg opacity-50" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                {['bg-blue-50','bg-green-50','bg-amber-50','bg-purple-50'].map((c, i) => (
                  <div key={i} className={`${c} rounded-lg p-2.5`}>
                    <div className="h-2 bg-white rounded mb-1.5 opacity-60 w-3/4" />
                    <div className="h-1.5 bg-white rounded opacity-40" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Stats ── */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 divide-x divide-gray-100">
          {[
            { n: '150+', l: 'Projects delivered' },
            { n: '8 yrs', l: `In ${stateName} market` },
            { n: '98%', l: 'Client satisfaction' },
            { n: '24h', l: 'Support response' },
          ].map(s => (
            <div key={s.l} className="py-5 text-center">
              <span className="block text-xl font-medium text-gray-900">{s.n}</span>
              <span className="block text-xs text-gray-400 mt-1">{s.l}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 pb-16">

        {/* ── Services ── */}
        <p className="text-xs font-medium text-gray-400 tracking-widest uppercase mt-10 mb-4">Our services</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
          {services.map(s => (
            <div key={s.title} className="bg-white border border-gray-100 rounded-xl overflow-hidden hover:border-gray-200 transition-colors">
              <div className={`h-24 ${s.imgBg} flex items-center justify-center`}>
                <div className="w-48 h-12 bg-white/40 rounded-lg" />
              </div>
              <div className="p-4">
                <span className={`inline-block text-xs font-medium px-2.5 py-0.5 rounded-full mb-2 ${s.tagColor}`}>
                  {s.tag}
                </span>
                <h3 className="text-sm font-medium text-gray-900 mb-1">{s.title}</h3>
                <p className="text-xs text-gray-400 leading-relaxed">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ── Tech Stack ── */}
        <p className="text-xs font-medium text-gray-400 tracking-widest uppercase mt-10 mb-4">Our tech stack</p>
        <div className="bg-white border border-gray-100 rounded-xl p-6 mb-3">
          <h2 className="text-base font-medium text-gray-900 mb-5">Built with modern technologies</h2>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
            {techStack.map(t => (
              <div key={t.name} className="bg-gray-50 rounded-lg p-3 text-center">
                <div className={`w-9 h-9 ${t.bg} rounded-lg mx-auto mb-2`} />
                <div className="text-xs font-medium text-gray-800">{t.name}</div>
                <div className="text-xs text-gray-400 mt-0.5">{t.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Highlight ── */}
        <div className="bg-blue-50 border border-blue-100 rounded-xl px-6 py-5 mb-3 flex gap-4 items-start">
          <div className="w-10 h-10 min-w-[40px] bg-blue-100 rounded-xl flex items-center justify-center text-blue-700 text-lg">
            ★
          </div>
          <p className="text-sm font-medium text-blue-800 leading-relaxed">
            Investing in professional web development in {cityName} is a smart decision. A well-designed,
            fast website builds credibility, generates leads, and drives revenue — all from one
            platform your business owns.
          </p>
        </div>

        {/* ── Process ── */}
        <p className="text-xs font-medium text-gray-400 tracking-widest uppercase mt-10 mb-4">Our process</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
          {process.map(p => (
            <div key={p.n} className="bg-white border border-gray-100 rounded-xl p-4 text-center">
              <div className="w-7 h-7 rounded-full bg-blue-50 text-blue-700 text-xs font-medium flex items-center justify-center mx-auto mb-3">
                {p.n}
              </div>
              <h4 className="text-xs font-medium text-gray-900 mb-1.5">{p.title}</h4>
              <p className="text-xs text-gray-400 leading-relaxed">{p.desc}</p>
            </div>
          ))}
        </div>

        {/* ── Content cards ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
          <div className="bg-white border border-gray-100 rounded-xl p-6">
            <h2 className="text-base font-medium text-gray-900 mb-3">Why {cityName} businesses choose us</h2>
            <p className="text-sm text-gray-500 leading-relaxed">
              We understand the local market in {stateName}. Our team designs experiences that resonate
              with your {cityName} audience while ensuring your site ranks for high-intent local searches.
            </p>
            <p className="text-sm text-gray-500 leading-relaxed mt-3">
              From startups to established enterprises in {countryName}, we've helped businesses of every
              size build a stronger online presence.
            </p>
          </div>
          <div className="bg-white border border-gray-100 rounded-xl p-6">
            <h2 className="text-base font-medium text-gray-900 mb-3">Ongoing support included</h2>
            <p className="text-sm text-gray-500 leading-relaxed">
              A website is not a one-time project. We provide regular updates, security patches,
              performance tuning, and 24-hour support so your site stays fast and secure.
            </p>
            <p className="text-sm text-gray-500 leading-relaxed mt-3">
              Businesses in {cityName} trust us to keep their digital presence running without
              downtime or surprises.
            </p>
          </div>
        </div>

        {/* ── CTA ── */}
        <div className="bg-white border border-gray-100 rounded-xl p-10 text-center mt-3">
          <h2 className="text-xl font-medium text-gray-900 mb-2">Ready to grow in {cityName}?</h2>
          <p className="text-sm text-gray-400 mb-5">
            Let's build a website that works as hard as you do. Free consultation, no commitment.
          </p>
          <div className="flex justify-center gap-3 flex-wrap">
            <button className="bg-blue-700 text-white text-sm font-medium px-6 py-2.5 rounded-lg">
              Start your project
            </button>
            <button className="border border-gray-200 text-gray-700 text-sm font-medium px-6 py-2.5 rounded-lg">
              See case studies
            </button>
          </div>
        </div>

      </div>
    </main>
  );
}
