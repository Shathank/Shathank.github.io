import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';

export type BlogFrontMatter = {
  title: string;
  excerpt: string;
  publishedAt: string;
  tags?: string[];
  readingTime?: number;
};

export type BlogPost = BlogFrontMatter & {
  slug: string;
  contentHtml: string;
};

const BLOG_DIR = path.join(process.cwd(), 'content/blog');

const getReadingTime = (markdown: string) => {
  const words = markdown.trim().split(/\s+/).length;
  return Math.ceil(words / 200);
};

export const getAllBlogPosts = async (): Promise<BlogPost[]> => {
  let entries: string[] = [];
  try {
    entries = await fs.readdir(BLOG_DIR);
  } catch (error) {
    console.warn('No blog directory found at', BLOG_DIR, error);
    return [];
  }

  const posts = await Promise.all(
    entries
      .filter((file) => file.endsWith('.md') || file.endsWith('.mdx'))
      .map(async (file) => {
        const filePath = path.join(BLOG_DIR, file);
        const fileContent = await fs.readFile(filePath, 'utf-8');
        const { data, content } = matter(fileContent);
        const processedContent = await remark().use(html).process(content);
        const contentHtml = processedContent.toString();
        const fm = data as BlogFrontMatter;

        return {
          slug: file.replace(/\.mdx?$/, ''),
          contentHtml,
          readingTime: fm.readingTime ?? getReadingTime(content),
          ...fm,
        } satisfies BlogPost;
      }),
  );

  return posts
    .filter((post) => post && post.title)
    .sort((a, b) => (a.publishedAt > b.publishedAt ? -1 : 1));
};

export const getBlogPostBySlug = async (slug: string): Promise<BlogPost | null> => {
  const posts = await getAllBlogPosts();
  return posts.find((post) => post.slug === slug) ?? null;
};

export const getFeaturedPosts = async (limit = 3) => {
  const posts = await getAllBlogPosts();
  return posts.slice(0, limit);
};
