import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getCountry, getStatesByCountry } from '@/app/services/location-data';

export async function generateMetadata({ params }) {
  const { country } = await params;
  const countryData = await getCountry(country);

  if (!countryData) {
    return { title: 'Not Found' };
  }

  return {
    title: `Services in ${countryData.countryName} | States and Locations`,
    description: `Browse all available state and city service pages for ${countryData.countryName}.`,
  };
}

export default async function CountryPage({ params }) {
  const { country } = await params;
  const countryData = await getCountry(country);

  if (!countryData) {
    notFound();
  }

  const states = await getStatesByCountry(countryData.countryId);

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,_#f8fafc_0%,_#ffffff_100%)] px-5 py-10 text-slate-900 sm:px-8 lg:px-10">
      <div className="mx-auto max-w-6xl">
        <section className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-sm sm:p-10">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-sky-500">
            Country Page
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-slate-900">
            {countryData.countryName}
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600">
            Explore all service coverage across states in {countryData.countryName}. Choose a state
            to see its available city pages.
          </p>
        </section>

        <section className="mt-8 rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-2xl font-semibold text-slate-900">Available states</h2>
              <p className="mt-1 text-sm text-slate-500">
                {states.length} {states.length === 1 ? 'state' : 'states'} linked to this country
              </p>
            </div>
          </div>

          {states.length === 0 ? (
            <div className="mt-6 rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-5 py-10 text-center text-sm text-slate-500">
              No state pages available for this country yet.
            </div>
          ) : (
            <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {states.map((state) => {
                const href = `/services/${countryData.countrySlug}/${state.slug}`;

                return (
                  <Link
                    key={href}
                    href={href}
                    className="group rounded-2xl border border-slate-200 bg-[linear-gradient(180deg,_#fff,_#f8fafc)] p-5 transition hover:-translate-y-0.5 hover:border-sky-200 hover:shadow-lg"
                  >
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
                      State
                    </p>
                    <h3 className="mt-3 text-xl font-semibold text-slate-900">{state.name}</h3>
                    <p className="mt-2 text-sm text-slate-500">Open state page and browse city routes.</p>
                    <div className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-sky-600">
                      View state
                      <span className="transition group-hover:translate-x-0.5">→</span>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
