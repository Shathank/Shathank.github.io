import { assertAdmin } from '../../../lib/session';
import { Card } from '../../../components/ui/card';

export default async function AdminCertificatesPage() {
  await assertAdmin();
  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <Card>
        <h1 className="text-2xl font-semibold text-slate-900">Certificate generator (coming soon)</h1>
        <p className="mt-2 text-sm text-slate-600">
          Upload branding assets, trigger certificate generation, and send completion emails from one interface.
        </p>
      </Card>
    </div>
  );
}
