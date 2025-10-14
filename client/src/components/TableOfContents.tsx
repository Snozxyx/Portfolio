import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ScrollArea } from '@/components/ui/scroll-area';

interface TocItem {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  content: string;
}

export const TableOfContents = ({ content }: TableOfContentsProps) => {
  const [headings, setHeadings] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    // Extract headings from content (assuming markdown-style headings)
    const lines = content.split('\n');
    const tocItems: TocItem[] = [];
    
    lines.forEach((line, index) => {
      const match = line.match(/^(#{1,3})\s+(.+)/);
      if (match) {
        const level = match[1].length;
        const text = match[2];
        const id = `heading-${index}`;
        tocItems.push({ id, text, level });
      }
    });
    
    setHeadings(tocItems);
  }, [content]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: '0px 0px -80% 0px' }
    );

    headings.forEach(({ id }) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [headings]);

  if (headings.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="hidden lg:block sticky top-24 w-64"
    >
      <div className="bg-card border border-card-border rounded-xl p-6">
        <h3 className="text-sm font-serif font-bold mb-4 text-foreground">Table of Contents</h3>
        <ScrollArea className="h-[60vh]">
          <nav className="space-y-2">
            {headings.map(({ id, text, level }) => (
              <a
                key={id}
                href={`#${id}`}
                className={`block text-sm transition-colors font-sans ${
                  activeId === id
                    ? 'text-primary font-medium'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
                style={{ paddingLeft: `${(level - 1) * 12}px` }}
              >
                {text}
              </a>
            ))}
          </nav>
        </ScrollArea>
      </div>
    </motion.div>
  );
};
