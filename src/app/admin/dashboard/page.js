import AdminCreatePageForm from '@/app/components/admin-create-page-form';

export const metadata = {
  title: 'Admin Dashboard | Create Page',
  description: 'Create new location pages from the admin dashboard.',
};

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <section>
        <AdminCreatePageForm />
      </section>
    </div>
  );
}
