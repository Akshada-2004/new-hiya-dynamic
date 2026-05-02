import Link from 'next/link';
import { notFound } from 'next/navigation';
import AdminPageRowActions from '@/app/components/admin-page-row-actions';
import { getServicePagesByLocation } from '@/app/services/service-page-store';

export async function generateMetadata({ params }) {
  const { countrySlug, stateSlug, citySlug } = await params;
  const pages = await getServicePagesByLocation(countrySlug, stateSlug, citySlug);
  const firstPage = pages[0];

  if (!firstPage) {
    return {
      title: 'City Service Pages | Not Found',
    };
  }

  return {
    title: `${firstPage.cityName} Service Pages | Admin Dashboard`,
    description: `Manage all generated service pages for ${firstPage.cityName}, ${firstPage.stateName}, ${firstPage.countryName}.`,
  };
}

export default async function AdminCityServicePagesPage({ params }) {
  const { countrySlug, stateSlug, citySlug } = await params;
  const pages = await getServicePagesByLocation(countrySlug, stateSlug, citySlug);
  const firstPage = pages[0];

  if (!firstPage) {
    notFound();
  }

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1">
            <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
            <span className="text-xs font-semibold uppercase tracking-wide text-indigo-600">
              City Pages
            </span>
          </div>
          <h2 className="text-2xl font-bold leading-tight text-slate-900">
            {firstPage.cityName}, {firstPage.stateName}
          </h2>
          <p className="mt-1.5 text-sm leading-relaxed text-slate-500">
            Yahan is city ke liye saari generated service pages dikh rahi hain.
          </p>
        </div>

        <Link
          href="/admin/dashboard/pages"
          className="inline-flex shrink-0 items-center gap-2 self-start rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition hover:border-slate-300 hover:text-slate-900 hover:shadow-md"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Back to cities
        </Link>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/70 px-5 py-3.5">
          <span className="text-xs font-semibold text-slate-500">
            {pages.length} {pages.length === 1 ? 'service page' : 'service pages'} in this city
          </span>
          <span className="text-[11px] text-slate-400">
            {firstPage.countryName} - {firstPage.stateName} - {firstPage.cityName}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="w-8 px-5 py-3.5 text-[11px] font-semibold uppercase tracking-widest text-slate-400">#</th>
                <th className="px-5 py-3.5 text-[11px] font-semibold uppercase tracking-widest text-slate-400">Service</th>
                <th className="px-5 py-3.5 text-[11px] font-semibold uppercase tracking-widest text-slate-400">Public URL</th>
                <th className="px-5 py-3.5 text-[11px] font-semibold uppercase tracking-widest text-slate-400">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {pages.map((page, index) => (
                <tr key={page.slug} className="group transition-colors duration-100 hover:bg-slate-50/80">
                  <td className="px-5 py-3.5 text-xs tabular-nums text-slate-300">{index + 1}</td>
                  <td className="px-5 py-3.5">
                    <span className="inline-flex rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-700">
                      {page.serviceName}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <Link
                      href={page.publicPath}
                      className="inline-flex items-center gap-1.5 font-mono text-xs text-indigo-600 transition-colors hover:text-indigo-800"
                    >
                      <span className="max-w-[320px] truncate">{page.publicPath}</span>
                    </Link>
                  </td>
                  <td className="px-5 py-3.5">
                    <AdminPageRowActions href={page.publicPath} slug={page.slug} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
