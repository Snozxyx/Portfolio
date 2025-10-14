import { useEffect } from 'react';

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article';
  author?: string;
  publishedTime?: string;
  tags?: string[];
}

export const SEO = ({
  title = 'Snozxyx Portfolio',
  description = 'Full-stack developer, gamer, and tech enthusiast',
  image = '/og-image.jpg',
  url,
  type = 'website',
  author,
  publishedTime,
  tags = [],
}: SEOProps) => {
  useEffect(() => {
    // Update document title
    document.title = title;

    // Helper function to set or update meta tags
    const setMetaTag = (name: string, content: string, isProperty = false) => {
      const attribute = isProperty ? 'property' : 'name';
      let element = document.querySelector(`meta[${attribute}="${name}"]`);
      
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attribute, name);
        document.head.appendChild(element);
      }
      
      element.setAttribute('content', content);
    };

    // Basic meta tags
    setMetaTag('description', description);
    
    // Open Graph tags
    setMetaTag('og:title', title, true);
    setMetaTag('og:description', description, true);
    setMetaTag('og:type', type, true);
    setMetaTag('og:image', image, true);
    
    if (url) {
      setMetaTag('og:url', url, true);
    }

    // Twitter Card tags
    setMetaTag('twitter:card', 'summary_large_image');
    setMetaTag('twitter:title', title);
    setMetaTag('twitter:description', description);
    setMetaTag('twitter:image', image);

    // Article-specific tags
    if (type === 'article') {
      if (author) {
        setMetaTag('article:author', author, true);
      }
      if (publishedTime) {
        setMetaTag('article:published_time', publishedTime, true);
      }
      tags.forEach(tag => {
        const element = document.createElement('meta');
        element.setAttribute('property', 'article:tag');
        element.setAttribute('content', tag);
        document.head.appendChild(element);
      });
    }
  }, [title, description, image, url, type, author, publishedTime, tags]);

  return null;
};
