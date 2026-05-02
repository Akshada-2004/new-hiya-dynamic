import { NextResponse } from 'next/server';
import {
  ADMIN_DEFAULT_PATH,
  ADMIN_LOGIN_PATH,
  getAdminSessionFromRequest,
  getSafeAdminNextPath,
} from '@/lib/admin-auth';

function isLoginRoute(pathname) {
  return pathname === ADMIN_LOGIN_PATH || pathname.startsWith(`${ADMIN_LOGIN_PATH}/`);
}

export function proxy(request) {
  const { pathname, search } = request.nextUrl;
  const session = getAdminSessionFromRequest(request);
  const isLogin = isLoginRoute(pathname);

  if (!session && !isLogin) {
    const loginUrl = new URL(ADMIN_LOGIN_PATH, request.url);
    loginUrl.searchParams.set('next', `${pathname}${search}`);
    return NextResponse.redirect(loginUrl);
  }

  if (session && isLogin) {
    const requestedNext = request.nextUrl.searchParams.get('next');
    const redirectPath = getSafeAdminNextPath(requestedNext ?? ADMIN_DEFAULT_PATH);
    return NextResponse.redirect(new URL(redirectPath, request.url));
  }

  if (session && pathname === '/admin') {
    return NextResponse.redirect(new URL(ADMIN_DEFAULT_PATH, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
