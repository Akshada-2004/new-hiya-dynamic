'use client';

import { usePathname } from 'next/navigation';
import SiteHeader from '@/app/components/layout/SiteHeader';
import SiteFooter from '@/app/components/layout/SiteFooter';

function shouldHideChrome(pathname) {
  return pathname === '/admin' || pathname.startsWith('/admin/');
}

export default function SiteChrome({ children }) {
  const pathname = usePathname() ?? '';

  if (shouldHideChrome(pathname)) {
    return children;
  }

  return (
    <>
      <SiteHeader />
      <div className="flex-1">{children}</div>
      <SiteFooter />
    </>
  );
}
