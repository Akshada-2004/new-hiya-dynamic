'use server';

import { redirect } from 'next/navigation';
import {
  ADMIN_DEFAULT_PATH,
  clearAdminSession,
  createAdminSession,
  getSafeAdminNextPath,
  verifyAdminCredentials,
} from '@/lib/admin-auth';

function getTextValue(formData, key) {
  const value = formData.get(key);
  return typeof value === 'string' ? value.trim() : '';
}

export async function loginAdmin(prevState, formData) {
  const userId = getTextValue(formData, 'userId');
  const password = getTextValue(formData, 'password');
  const nextPath = getTextValue(formData, 'next');

  if (!userId || !password) {
    return {
      success: false,
      message: 'User ID and password are required.',
    };
  }

  const result = verifyAdminCredentials(userId, password);

  if (!result.ok) {
    return {
      success: false,
      message: result.error,
    };
  }

  await createAdminSession(userId);
  redirect(getSafeAdminNextPath(nextPath) || ADMIN_DEFAULT_PATH);
}

export async function logoutAdmin() {
  await clearAdminSession();
  redirect('/admin/login');
}
