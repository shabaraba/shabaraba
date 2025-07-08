import type { NextApiRequest, NextApiResponse } from 'next';

interface OGPData {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<OGPData | { error: string }>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { url } = req.query;

  if (!url || typeof url !== 'string') {
    return res.status(400).json({ error: 'URL parameter is required' });
  }

  try {
    const response = await fetch(url);
    const html = await response.text();

    // Basic OGP parsing
    const ogImage = html.match(/<meta property="og:image" content="([^"]*)"[^>]*>/i)?.[1];
    const ogTitle = html.match(/<meta property="og:title" content="([^"]*)"[^>]*>/i)?.[1];
    const ogDescription = html.match(/<meta property="og:description" content="([^"]*)"[^>]*>/i)?.[1];
    
    // Fallback to regular meta tags
    const title = ogTitle || html.match(/<title[^>]*>([^<]*)<\/title>/i)?.[1];
    const description = ogDescription || html.match(/<meta name="description" content="([^"]*)"[^>]*>/i)?.[1];

    // Handle relative URLs for images
    let imageUrl = ogImage;
    if (imageUrl && !imageUrl.startsWith('http')) {
      const urlObj = new URL(url);
      imageUrl = new URL(imageUrl, urlObj.origin).href;
    }

    res.status(200).json({
      title: title?.trim(),
      description: description?.trim(),
      image: imageUrl,
      url: url,
    });
  } catch (error) {
    console.error('Error fetching OGP data:', error);
    res.status(500).json({ error: 'Failed to fetch OGP data' });
  }
}