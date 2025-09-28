import Link from 'next/link';
import { format } from 'date-fns';
import { Card } from '../../components/ui/card';
import { getAllBlogPosts } from '../../lib/blog';

export const metadata = {
  title: 'Trading Insights & Articles',
  description: 'Weekly trading playbooks, risk management insights, and market updates tailored for Indian traders.',
};

export default async function BlogIndexPage() {
  const posts = await getAllBlogPosts();

  return (
    <div className="mx-auto max-w-5xl px-6 py-16 space-y-8">
      <div className="space-y-3 text-center">
        <h1 className="text-3xl font-semibold text-slate-900">Trading intelligence for the modern Indian trader</h1>
        <p className="text-sm text-slate-600">Actionable strategies, macro commentary, and psychological frameworks published weekly.</p>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        {posts.map((post) => (
          <Card key={post.slug}>
            <span className="text-xs uppercase tracking-[0.3em] text-sky-500">{format(post.publishedAt, 'PPP')}</span>
            <h2 className="mt-3 text-xl font-semibold text-slate-900">{post.title}</h2>
            <p className="mt-2 text-sm text-slate-600">{post.excerpt}</p>
            <Link href={`/blog/${post.slug}`} className="mt-4 inline-flex items-center text-sm font-semibold text-sky-600">
              Read article →
            </Link>
          </Card>
        ))}
      </div>
    </div>
  );
}
