import { notFound } from 'next/navigation';
import Link from 'next/link';
import { format } from 'date-fns';
import { getBlogPostBySlug, getAllBlogPosts } from '../../../lib/blog';

export async function generateStaticParams() {
  const posts = await getAllBlogPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = await getBlogPostBySlug(params.slug);
  if (!post) {
    notFound();
  }

  return (
    <article className="mx-auto max-w-3xl px-6 py-16 prose prose-slate">
      <Link href="/blog" className="text-xs uppercase tracking-[0.3em] text-sky-500 no-underline">
        ← Back to blog
      </Link>
      <h1>{post.title}</h1>
      <p className="text-sm text-slate-500">Published {format(post.publishedAt, 'PPP')}</p>
      <div dangerouslySetInnerHTML={{ __html: post.contentHtml }} />
    </article>
  );
}
