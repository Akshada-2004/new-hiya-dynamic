import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getState, getCitiesByState } from '@/app/services/location-data';

export async function generateMetadata({ params }) {
  const { country, state } = await params;
  const stateData = await getState(country, state);

  if (!stateData) {
    return { title: 'Not Found' };
  }

  return {
    title: `Services in ${stateData.stateName}, ${stateData.countryName} | City Pages`,
    description: `Browse all available city service pages for ${stateData.stateName}, ${stateData.countryName}.`,
  };
}

export default async function StatePage({ params }) {
  const { country, state } = await params;
  const stateData = await getState(country, state);

  if (!stateData) {
    notFound();
  }

  const cities = await getCitiesByState(stateData.stateId);

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,_#f8fafc_0%,_#ffffff_100%)] px-5 py-10 text-slate-900 sm:px-8 lg:px-10">
      <div className="mx-auto max-w-6xl">
        <section className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-sm sm:p-10">
          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
            <Link href={`/services/${stateData.countrySlug}`} className="hover:text-sky-600">
              {stateData.countryName}
            </Link>
            <span>/</span>
            <span className="font-medium text-sky-600">{stateData.stateName}</span>
          </div>

          <p className="mt-4 text-xs font-semibold uppercase tracking-[0.28em] text-indigo-500">
            State Page
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-slate-900">
            {stateData.stateName}, {stateData.countryName}
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600">
            Browse city-level service pages available under {stateData.stateName}. Each city opens
            its own public route.
          </p>
        </section>

        <section className="mt-8 rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-2xl font-semibold text-slate-900">Available cities</h2>
              <p className="mt-1 text-sm text-slate-500">
                {cities.length} {cities.length === 1 ? 'city page' : 'city pages'} available
              </p>
            </div>
          </div>

          {cities.length === 0 ? (
            <div className="mt-6 rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-5 py-10 text-center text-sm text-slate-500">
              No city pages available for this state yet.
            </div>
          ) : (
            <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {cities.map((city) => {
                const href = `/services/${stateData.countrySlug}/${stateData.stateSlug}/${city.slug}`;

                return (
                  <Link
                    key={href}
                    href={href}
                    className="group rounded-2xl border border-slate-200 bg-[linear-gradient(180deg,_#fff,_#f8fafc)] p-5 transition hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-lg"
                  >
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
                      City
                    </p>
                    <h3 className="mt-3 text-xl font-semibold text-slate-900">{city.name}</h3>
                    <p className="mt-2 text-sm text-slate-500">Open the city service landing page.</p>
                    <div className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-indigo-600">
                      View city
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
