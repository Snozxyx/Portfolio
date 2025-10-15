
import type { Express } from "express";
import { storage } from "../storage";

export function registerRssRoutes(app: Express) {
  app.get("/rss.xml", async (req, res) => {
    try {
      const posts = await storage.getAllPosts(true);
      const settings = await storage.getSiteSettings();
      
      const baseUrl = `${req.protocol}://${req.get('host')}`;
      
      const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${settings.siteTitle || 'Snozxyx Blog'}</title>
    <link>${baseUrl}</link>
    <description>${settings.siteDescription || 'Latest blog posts'}</description>
    <language>en-us</language>
    <atom:link href="${baseUrl}/rss.xml" rel="self" type="application/rss+xml" />
    ${posts.map(post => `
    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${baseUrl}/blog/${post.slug}</link>
      <guid>${baseUrl}/blog/${post.slug}</guid>
      <pubDate>${new Date(post.publishedAt || post.createdAt).toUTCString()}</pubDate>
      <description>${escapeXml(post.excerpt || post.content.substring(0, 200))}</description>
      ${post.category ? `<category>${escapeXml(post.category)}</category>` : ''}
    </item>`).join('')}
  </channel>
</rss>`;

      res.set('Content-Type', 'application/xml');
      res.send(rss);
    } catch (error) {
      res.status(500).send('Error generating RSS feed');
    }
  });
}

function escapeXml(unsafe: string): string {
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case "'": return '&apos;';
      case '"': return '&quot;';
      default: return c;
    }
  });
}
