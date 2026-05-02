// import Link from 'next/link';
// import db, { getDbStatus } from '@/lib/db';

// async function getAdminCounts() {
//   try {
//     const [[countryRows], [stateRows], [cityRows]] = await Promise.all([
//       db.execute('SELECT COUNT(*) AS total FROM countries'),
//       db.execute('SELECT COUNT(*) AS total FROM states'),
//       db.execute('SELECT COUNT(*) AS total FROM cities'),
//     ]);

//     return {
//       countries: countryRows[0]?.total ?? 0,
//       states: stateRows[0]?.total ?? 0,
//       cities: cityRows[0]?.total ?? 0,
//       error: null,
//     };
//   } catch (error) {
//     console.error('Admin dashboard counts error:', error);
//     return {
//       countries: 0,
//       states: 0,
//       cities: 0,
//       error: error.code || 'DB_ERROR',
//     };
//   }
// }

// const navItems = [
//   { href: '/admin/dashboard', label: 'Create Page' },
//   { href: '/admin/dashboard/pages', label: 'All Pages' },
// ];

// export default async function AdminDashboardLayout({ children }) {
//   const counts = await getAdminCounts();
//   const dbStatus = getDbStatus();

//   return (
//     <div className="min-h-screen bg-[linear-gradient(180deg,_#f8fafc_0%,_#eef2ff_100%)] text-slate-900">
//       <div className="mx-auto flex min-h-screen max-w-7xl gap-6 px-4 py-4 sm:px-6 lg:px-8">
//         <aside className="hidden w-72 shrink-0 rounded-[28px] border border-slate-200 bg-slate-950 p-6 text-white shadow-[0_24px_80px_rgba(15,23,42,0.22)] lg:flex lg:flex-col">
//           <Link href="/" className="text-sm font-semibold uppercase tracking-[0.35em] text-slate-400">
//             Hiya Admin
//           </Link>
//           <h1 className="mt-6 text-3xl font-semibold leading-tight">
//             Page management made simple
//           </h1>
//           <p className="mt-3 text-sm leading-6 text-slate-300">
//             Create location pages and track everything from one place.
//           </p>

//           <nav className="mt-8 space-y-2">
//             {navItems.map((item) => (
//               <Link
//                 key={item.href}
//                 href={item.href}
//                 className="block rounded-2xl border border-white/8 px-4 py-3 text-sm font-medium text-slate-200 transition hover:border-white/20 hover:bg-white/6"
//               >
//                 {item.label}
//               </Link>
//             ))}
//           </nav>

//           <div className="mt-auto grid gap-3 pt-8">
//             {[
//               ['Countries', counts.countries],
//               ['States', counts.states],
//               ['Pages', counts.cities],
//             ].map(([label, value]) => (
//               <div key={label} className="rounded-2xl border border-white/8 bg-white/5 px-4 py-3">
//                 <div className="text-xs uppercase tracking-[0.24em] text-slate-400">{label}</div>
//                 <div className="mt-2 text-2xl font-semibold text-white">{value}</div>
//               </div>
//             ))}
//             <div
//               className={`rounded-2xl px-4 py-3 text-sm ${
//                 counts.error
//                   ? 'border border-amber-500/20 bg-amber-500/10 text-amber-200'
//                   : 'border border-emerald-500/20 bg-emerald-500/10 text-emerald-200'
//               }`}
//             >
//               DB mode: {dbStatus.mode.toUpperCase()}
//               {counts.error ? ` (${counts.error})` : ''}
//             </div>
//           </div>
//         </aside>

//         <div className="flex min-w-0 flex-1 flex-col gap-6">
//           <header className="rounded-[28px] border border-slate-200 bg-white/90 px-5 py-4 shadow-sm backdrop-blur sm:px-6">
//             <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
//               <div>
//                 <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">
//                   Admin Dashboard
//                 </p>
//                 <h2 className="mt-1 text-2xl font-semibold text-slate-900">
//                   Create pages and manage your list
//                 </h2>
//               </div>
//               <div className="flex flex-wrap gap-3">
//                 {navItems.map((item) => (
//                   <Link
//                     key={item.href}
//                     href={item.href}
//                     className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-white"
//                   >
//                     {item.label}
//                   </Link>
//                 ))}
//               </div>
//             </div>
//           </header>

//           <main>{children}</main>
//         </div>
//       </div>
//     </div>
//   );
// }
import Link from 'next/link';
import db, { getDbStatus } from '@/lib/db';
import { logoutAdmin } from '@/app/actions/admin-auth-actions';
import { requireAdminSession } from '@/lib/admin-auth';

async function getAdminCounts() {
  try {
    const [[countryRows], [stateRows], [cityRows]] = await Promise.all([
      db.execute('SELECT COUNT(*) AS total FROM countries'),
      db.execute('SELECT COUNT(*) AS total FROM states'),
      db.execute('SELECT COUNT(*) AS total FROM cities'),
    ]);

    return {
      countries: countryRows[0]?.total ?? 0,
      states: stateRows[0]?.total ?? 0,
      cities: cityRows[0]?.total ?? 0,
      error: null,
    };
  } catch (error) {
    console.error('Admin dashboard counts error:', error);
    return {
      countries: 0,
      states: 0,
      cities: 0,
      error: error.code || 'DB_ERROR',
    };
  }
}

const navItems = [
  {
    href: '/admin/dashboard',
    label: 'Create Page',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 5v14M5 12h14" />
      </svg>
    ),
    description: 'Add new location page',
  },
  {
    href: '/admin/dashboard/pages',
    label: 'All Pages',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 12h6M9 8h6M9 16h4M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z" />
      </svg>
    ),
    description: 'View all generated pages',
  },
];

export default async function AdminDashboardLayout({ children }) {
  await requireAdminSession();
  const counts = await getAdminCounts();
  const dbStatus = getDbStatus();

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <div className="flex min-h-screen">

        {/* ── Sidebar ── */}
        <aside className="hidden lg:flex lg:flex-col w-64 xl:w-72 min-h-screen bg-slate-900 text-white shrink-0 fixed top-0 left-0 z-30">

          {/* Brand */}
          <div className="px-6 pt-7 pb-6 border-b border-white/8">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center shrink-0">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                </svg>
              </div>
              <div>
                <p className="text-[11px] font-semibold tracking-widest text-slate-400 uppercase">Hiya Admin</p>
                <p className="text-sm font-semibold text-white leading-tight mt-0.5">Dashboard</p>
              </div>
            </div>
          </div>

          {/* Nav */}
          <div className="px-4 pt-6">
            <p className="text-[10px] font-semibold tracking-widest text-slate-500 uppercase px-2 mb-3">Navigation</p>
            <nav className="space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-300 transition-all duration-150 hover:bg-white/8 hover:text-white"
                >
                  <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-white/5 text-slate-400 group-hover:bg-indigo-500/20 group-hover:text-indigo-300 transition-all duration-150 shrink-0">
                    {item.icon}
                  </span>
                  <div className="min-w-0">
                    <p className="font-medium leading-tight">{item.label}</p>
                    <p className="text-[11px] text-slate-500 group-hover:text-slate-400 mt-0.5 truncate">{item.description}</p>
                  </div>
                </Link>
              ))}
            </nav>
          </div>

          {/* Stats */}
          <div className="mt-auto px-4 pb-6 pt-6 border-t border-white/8">
            <p className="text-[10px] font-semibold tracking-widest text-slate-500 uppercase px-2 mb-3">Overview</p>
            <div className="space-y-2">
              {[
                { label: 'Countries', value: counts.countries, color: 'text-sky-400' },
                { label: 'States', value: counts.states, color: 'text-violet-400' },
                { label: 'Pages', value: counts.cities, color: 'text-emerald-400' },
              ].map(({ label, value, color }) => (
                <div key={label} className="flex items-center justify-between rounded-xl bg-white/5 px-3 py-2.5">
                  <span className="text-sm text-slate-400">{label}</span>
                  <span className={`text-sm font-semibold tabular-nums ${color}`}>{value}</span>
                </div>
              ))}
            </div>

            {/* DB Status */}
            <div className={`mt-3 flex items-center gap-2 rounded-xl px-3 py-2.5 text-xs font-medium ${
              counts.error
                ? 'bg-amber-500/10 text-amber-300 border border-amber-500/20'
                : 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20'
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${counts.error ? 'bg-amber-400' : 'bg-emerald-400'}`} />
              DB: {dbStatus.mode.toUpperCase()}{counts.error ? ` — ${counts.error}` : ' connected'}
            </div>
          </div>
        </aside>

        {/* ── Main area ── */}
        <div className="flex-1 flex flex-col min-w-0 lg:pl-64 xl:pl-72">

          {/* Header */}
          <header className="sticky top-0 z-20 bg-white border-b border-slate-200 px-6 py-0 shadow-none">
            <div className="flex items-center justify-between h-16 gap-4">
              <div className="flex items-center gap-3 min-w-0">
                <div className="hidden sm:flex flex-col">
                  <p className="text-[11px] font-semibold tracking-widest text-slate-400 uppercase">Admin Dashboard</p>
                  <h1 className="text-base font-semibold text-slate-800 leading-tight mt-0.5 truncate">
                    Page Management
                  </h1>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-2 text-sm font-medium text-slate-600 transition hover:border-slate-300 hover:bg-white hover:text-slate-900"
                  >
                    <span className="text-slate-400">{item.icon}</span>
                    {item.label}
                  </Link>
                ))}
                <form action={logoutAdmin}>
                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 rounded-lg border border-rose-200 bg-rose-50 px-3.5 py-2 text-sm font-medium text-rose-700 transition hover:border-rose-300 hover:bg-rose-100"
                  >
                    Logout
                  </button>
                </form>
              </div>
            </div>
          </header>

          {/* Page content */}
          <main className="flex-1 px-6 py-6 xl:px-8 xl:py-8">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
