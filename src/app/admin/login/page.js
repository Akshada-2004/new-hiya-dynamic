import Link from 'next/link';
import LoginForm from './LoginForm';

export const metadata = {
  title: 'Admin Login',
  description: 'Sign in to access the admin dashboard.',
};

function getSafeNextFromSearchParams(searchParams) {
  const nextPath = searchParams?.next;

  if (
    typeof nextPath !== 'string' ||
    !nextPath.startsWith('/admin') ||
    nextPath.startsWith('/admin/login')
  ) {
    return '';
  }

  return nextPath;
}

export default async function AdminLoginPage({ searchParams }) {
  const resolvedSearchParams = await searchParams;
  const nextPath = getSafeNextFromSearchParams(resolvedSearchParams);

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10">
      <section className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-6">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Hiya Admin</p>
          <h1 className="mt-2 text-2xl font-semibold text-slate-900">Sign in</h1>
          <p className="mt-2 text-sm text-slate-500">
            Login is required to access dashboard pages and admin actions.
          </p>
        </div>

        <LoginForm nextPath={nextPath} />

        <div className="mt-6 border-t border-slate-100 pt-4">
          <Link href="/" className="text-sm font-medium text-slate-600 transition hover:text-slate-900">
            Back to website
          </Link>
        </div>
      </section>
    </div>
  );
}
