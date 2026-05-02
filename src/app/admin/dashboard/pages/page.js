import Link from 'next/link';
import AdminPageRowActions from '@/app/components/admin-page-row-actions';
import { getAllServicePages } from '@/app/services/service-page-store';

export const metadata = {
  title: 'Admin Dashboard | All Pages',
  description: 'View generated country, state, and city service pages.',
};

async function getAllPages() {
  try {
    return {
      rows: await getAllServicePages(),
      error: null,
    };
  } catch (error) {
    console.error('Admin page list error:', error);
    return {
      rows: [],
      error: error.code || 'STORE_ERROR',
    };
  }
}

export default async function AdminAllPagesPage() {
  const { rows, error } = await getAllPages();

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1">
            <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
            <span className="text-xs font-semibold uppercase tracking-wide text-indigo-600">
              All Pages
            </span>
          </div>
          <h2 className="text-2xl font-bold leading-tight text-slate-900">
            Generated service pages
          </h2>
          <p className="mt-1.5 text-sm leading-relaxed text-slate-500">
            Country, state aur city teeno level ke generated pages yahan manage kar sakte ho.
          </p>
          <p className="mt-2 text-sm leading-relaxed text-slate-500">
            URL formats:{' '}
            <code className="rounded-md bg-slate-100 px-1.5 py-0.5 font-mono text-xs text-slate-700">
              /keyword-in-country
            </code>
            <span className="mx-1 text-slate-300">|</span>
            <code className="rounded-md bg-slate-100 px-1.5 py-0.5 font-mono text-xs text-slate-700">
              /country-keyword-in-state
            </code>
            <span className="mx-1 text-slate-300">|</span>
            <code className="rounded-md bg-slate-100 px-1.5 py-0.5 font-mono text-xs text-slate-700">
              /country-keyword-in-city
            </code>
          </p>
        </div>

        <Link
          href="/admin/dashboard"
          className="inline-flex shrink-0 items-center gap-2 self-start rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition hover:border-slate-300 hover:text-slate-900 hover:shadow-md"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 5v14M5 12h14" />
          </svg>
          Create new page
        </Link>
      </div>

      {error ? (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
          <p className="text-sm font-semibold text-amber-900">Page store error</p>
          <p className="mt-1 text-sm text-amber-700">
            Failed to load pages: <span className="font-mono font-semibold">{error}</span>
          </p>
        </div>
      ) : rows.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-white px-6 py-16 text-center">
          <p className="text-sm font-semibold text-slate-700">No service pages yet</p>
          <p className="mt-1 text-sm text-slate-400">
            Create your first service + location combination from the admin form.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/70 px-5 py-3.5">
            <span className="text-xs font-semibold text-slate-500">
              {rows.length} {rows.length === 1 ? 'page' : 'pages'} total
            </span>
            <span className="text-[11px] text-slate-400">Sorted by country - state - city</span>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="w-8 px-5 py-3.5 text-[11px] font-semibold uppercase tracking-widest text-slate-400">#</th>
                  <th className="px-5 py-3.5 text-[11px] font-semibold uppercase tracking-widest text-slate-400">Level</th>
                  <th className="px-5 py-3.5 text-[11px] font-semibold uppercase tracking-widest text-slate-400">Country</th>
                  <th className="px-5 py-3.5 text-[11px] font-semibold uppercase tracking-widest text-slate-400">State</th>
                  <th className="px-5 py-3.5 text-[11px] font-semibold uppercase tracking-widest text-slate-400">City</th>
                  <th className="px-5 py-3.5 text-[11px] font-semibold uppercase tracking-widest text-slate-400">Service</th>
                  <th className="px-5 py-3.5 text-[11px] font-semibold uppercase tracking-widest text-slate-400">Public URL</th>
                  <th className="px-5 py-3.5 text-[11px] font-semibold uppercase tracking-widest text-slate-400">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {rows.map((row, index) => (
                  <tr key={row.slug} className="group transition-colors duration-100 hover:bg-slate-50/80">
                    <td className="px-5 py-3.5 text-xs tabular-nums text-slate-300">{index + 1}</td>
                    <td className="px-5 py-3.5">
                      <span className="inline-flex rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-semibold capitalize text-indigo-700">
                        {row.locationLevel}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 font-medium text-slate-800">{row.countryName}</td>
                    <td className="px-5 py-3.5 text-slate-600">{row.stateName}</td>
                    <td className="px-5 py-3.5 font-medium text-slate-800">{row.cityName}</td>
                    <td className="px-5 py-3.5">
                      <span className="inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">
                        {row.serviceName}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <Link
                        href={row.publicPath}
                        className="inline-flex max-w-[320px] truncate font-mono text-xs text-indigo-600 transition-colors hover:text-indigo-800"
                      >
                        {row.publicPath}
                      </Link>
                    </td>
                    <td className="px-5 py-3.5">
                      <AdminPageRowActions href={row.publicPath} slug={row.slug} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </section>
  );
}
