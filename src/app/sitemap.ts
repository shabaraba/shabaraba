import type { MetadataRoute } from 'next';
import { CommonDataService } from '../services/CommonDataService';

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://shaba.dev').replace(/\/$/, '');
const POSTS_PER_PAGE = 10;

export const dynamic = 'force-static';

function toDate(value: unknown): Date | null {
  if (!value) return null;
  const date = new Date(value as string);
  return isNaN(date.getTime()) ? null : date;
}

function getLatestDate(dates: (Date | null)[]): Date | null {
  const timestamps = dates
    .filter((date): date is Date => date !== null)
    .map(date => date.getTime());

  return timestamps.length > 0 ? new Date(Math.max(...timestamps)) : null;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const data = await CommonDataService.getAllData();
  const posts = data.posts as any[];

  const latestPostDate = getLatestDate(
    posts.map(post => toDate(post.updatedAt || post.publishedAt))
  ) || new Date();

  const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE);

  const entries: MetadataRoute.Sitemap = [
    {
      url: `${SITE_URL}/`,
      lastModified: latestPostDate,
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${SITE_URL}/blog`,
      lastModified: latestPostDate,
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/privacy`,
      lastModified: new Date('2025-01-05'),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ];

  for (let page = 2; page <= totalPages; page++) {
    entries.push({
      url: `${SITE_URL}/blog/page/${page}`,
      lastModified: latestPostDate,
      changeFrequency: 'daily',
      priority: 0.6,
    });
  }

  for (const post of posts) {
    entries.push({
      url: `${SITE_URL}/blog/posts/${post.slug}`,
      lastModified: toDate(post.updatedAt || post.publishedAt) || latestPostDate,
      changeFrequency: 'monthly',
      priority: 0.7,
    });
  }

  for (const tag of data.tags) {
    const encodedTag = encodeURIComponent(tag.name.toLowerCase());

    const taggedPosts = posts.filter(post =>
      post.tags?.some((postTag: any) => {
        const name = typeof postTag === 'string' ? postTag : postTag?.name;
        return typeof name === 'string' && name.toLowerCase() === tag.name.toLowerCase();
      })
    );

    const tagLatestDate = getLatestDate(
      taggedPosts.map(post => toDate(post.updatedAt || post.publishedAt))
    ) || latestPostDate;

    entries.push({
      url: `${SITE_URL}/tags/${encodedTag}`,
      lastModified: tagLatestDate,
      changeFrequency: 'weekly',
      priority: 0.6,
    });

    const tagTotalPages = Math.ceil(taggedPosts.length / POSTS_PER_PAGE);
    for (let page = 2; page <= tagTotalPages; page++) {
      entries.push({
        url: `${SITE_URL}/tags/${encodedTag}/page/${page}`,
        lastModified: tagLatestDate,
        changeFrequency: 'weekly',
        priority: 0.5,
      });
    }
  }

  return entries;
}
