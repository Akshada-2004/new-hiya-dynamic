import { notFound } from 'next/navigation';
import { getCity } from '@/app/services/location-data';
import { getServiceOptionById } from '@/app/services/service-catalog';

export async function generateMetadata({ params }) {
  const { country, state, city, service } = await params;
  const location = await getCity(country, state, city);
  const serviceData = getServiceOptionById(service);

  if (!location || !serviceData) return { title: 'Not Found' };

  return {
    title: `${serviceData.name} in ${location.cityName}, ${location.countryName} | Expert Agency`,
    description: `${serviceData.blurb} Serving businesses in ${location.cityName}, ${location.stateName}, ${location.countryName}.`,
  };
}

export default async function ServiceLocationPage({ params }) {
  const { country, state, city, service } = await params;
  const location = await getCity(country, state, city);
  const serviceData = getServiceOptionById(service);

  if (!location || !serviceData) notFound();

  const { cityName, stateName, countryName } = location;

  const benefits = [
    {
      title: `Local ${serviceData.shortName} expertise`,
      desc: `Deep understanding of the ${cityName} market means strategies built for your specific audience and competition.`,
    },
    {
      title: 'Fast turnaround',
      desc: `From brief to delivery, we keep ${serviceData.shortName.toLowerCase()} projects moving with clear milestones and no delays.`,
    },
    {
      title: 'Ongoing support',
      desc: `Post-launch monitoring and maintenance keeps your ${serviceData.shortName.toLowerCase()} setup reliable long-term.`,
    },
  ];

  return (
    <main className="bg-gray-50 min-h-screen font-sans">

      {/* Hero */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-7 pt-14 pb-12">
          <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-5 flex-wrap">
            <span>{countryName}</span>
            <span className="opacity-40">›</span>
            <span>{stateName}</span>
            <span className="opacity-40">›</span>
            <span>{cityName}</span>
            <span className="opacity-40">›</span>
            <span className="text-blue-600 font-medium">{serviceData.name}</span>
          </div>

          <span className="inline-flex items-center gap-1.5 bg-green-50 text-green-700 text-xs font-medium px-3 py-1 rounded-full mb-4">
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
            Serving {cityName}
          </span>

          <h1 className="text-3xl font-medium text-gray-900 leading-snug mb-3">
            {serviceData.name} in{' '}
            <span className="text-blue-600">{cityName}</span>
          </h1>

          <p className="text-sm text-gray-500 leading-relaxed mb-6 max-w-2xl">
            {serviceData.blurb} We help businesses across {stateName}, {countryName} with practical delivery, clear timelines, and dedicated support.
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
      </div>

      {/* Stats */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 divide-x divide-gray-100">
          {[
            { n: '150+', l: 'Projects delivered' },
            { n: '8 yrs', l: `In ${stateName} market` },
            { n: '98%', l: 'Client satisfaction' },
            { n: '24h', l: 'Support response' },
          ].map((s) => (
            <div key={s.l} className="py-5 text-center">
              <span className="block text-xl font-medium text-gray-900">{s.n}</span>
              <span className="block text-xs text-gray-400 mt-1">{s.l}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 pb-16">

        {/* Why us */}
        <p className="text-xs font-medium text-gray-400 tracking-widest uppercase mt-10 mb-4">
          Why choose us
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
          {benefits.map((b) => (
            <div
              key={b.title}
              className="bg-white border border-gray-100 rounded-xl p-5 hover:border-gray-200 transition-colors"
            >
              <h3 className="text-sm font-medium text-gray-900 mb-2">{b.title}</h3>
              <p className="text-xs text-gray-400 leading-relaxed">{b.desc}</p>
            </div>
          ))}
        </div>

        {/* Highlight */}
        <div className="bg-blue-50 border border-blue-100 rounded-xl px-6 py-5 mb-3 flex gap-4 items-start mt-3">
          <div className="w-10 h-10 min-w-[40px] bg-blue-100 rounded-xl flex items-center justify-center text-blue-700 text-lg">
            ★
          </div>
          <p className="text-sm font-medium text-blue-800 leading-relaxed">
            Investing in professional {serviceData.name.toLowerCase()} in {cityName} builds credibility,
            generates leads, and drives measurable revenue for your business.
          </p>
        </div>

        {/* Process */}
        <p className="text-xs font-medium text-gray-400 tracking-widest uppercase mt-10 mb-4">
          Our process
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
          {[
            { n: '1', title: 'Discovery', desc: `We learn your goals and market in ${cityName}` },
            { n: '2', title: 'Strategy', desc: `A tailored plan for ${stateName} audiences` },
            { n: '3', title: 'Execution', desc: `Clean, fast delivery using modern tooling` },
            { n: '4', title: 'Launch & grow', desc: 'Deploy, monitor, and optimise continuously' },
          ].map((p) => (
            <div key={p.n} className="bg-white border border-gray-100 rounded-xl p-4 text-center">
              <div className="w-7 h-7 rounded-full bg-blue-50 text-blue-700 text-xs font-medium flex items-center justify-center mx-auto mb-3">
                {p.n}
              </div>
              <h4 className="text-xs font-medium text-gray-900 mb-1.5">{p.title}</h4>
              <p className="text-xs text-gray-400 leading-relaxed">{p.desc}</p>
            </div>
          ))}
        </div>

        {/* Content cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
          <div className="bg-white border border-gray-100 rounded-xl p-6">
            <h2 className="text-base font-medium text-gray-900 mb-3">
              Why {cityName} businesses choose us
            </h2>
            <p className="text-sm text-gray-500 leading-relaxed">
              We understand the local market in {stateName}. Our team delivers {serviceData.name.toLowerCase()} that
              resonates with your {cityName} audience while driving measurable results.
            </p>
            <p className="text-sm text-gray-500 leading-relaxed mt-3">
              From startups to established enterprises in {countryName}, we've helped businesses of
              every size grow their online presence.
            </p>
          </div>
          <div className="bg-white border border-gray-100 rounded-xl p-6">
            <h2 className="text-base font-medium text-gray-900 mb-3">
              Ongoing support included
            </h2>
            <p className="text-sm text-gray-500 leading-relaxed">
              We provide regular updates, performance tuning, and 24-hour support so your
              {' '}{serviceData.shortName.toLowerCase()} setup stays effective and secure.
            </p>
            <p className="text-sm text-gray-500 leading-relaxed mt-3">
              Businesses in {cityName} trust us to keep their digital presence running without
              downtime or surprises.
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-white border border-gray-100 rounded-xl p-10 text-center mt-3">
          <h2 className="text-xl font-medium text-gray-900 mb-2">
            Ready to get started in {cityName}?
          </h2>
          <p className="text-sm text-gray-400 mb-5">
            Let's build a {serviceData.name.toLowerCase()} solution that works as hard as you do.
            Free consultation, no commitment.
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
