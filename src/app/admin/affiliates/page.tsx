import { assertAdmin } from '../../../lib/session';
import { Card } from '../../../components/ui/card';

export default async function AdminAffiliatesPage() {
  await assertAdmin();
  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <Card>
        <h1 className="text-2xl font-semibold text-slate-900">Affiliate manager (coming soon)</h1>
        <p className="mt-2 text-sm text-slate-600">
          Track affiliate performance, approve payouts, and set commission tiers for your promoters.
        </p>
      </Card>
    </div>
  );
}
