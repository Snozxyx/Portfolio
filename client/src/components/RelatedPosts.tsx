import { motion } from 'framer-motion';
import { Link } from 'wouter';
import { Badge } from '@/components/ui/badge';
import { Clock, Eye } from 'lucide-react';
import type { BlogPost } from '@shared/schema';

interface RelatedPostsProps {
  currentPostId: string;
  currentTags: string[];
  allPosts: BlogPost[];
}

export const RelatedPosts = ({ currentPostId, currentTags, allPosts }: RelatedPostsProps) => {
  // Find posts with matching tags
  const relatedPosts = allPosts
    .filter((post) => post.id !== currentPostId && post.published)
    .map((post) => ({
      ...post,
      matchingTags: post.tags.filter((tag) => currentTags.includes(tag)).length,
    }))
    .filter((post) => post.matchingTags > 0)
    .sort((a, b) => b.matchingTags - a.matchingTags)
    .slice(0, 3);

  if (relatedPosts.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-12 pt-8 border-t border-card-border"
    >
      <h2 className="text-3xl font-serif font-bold mb-6">Related Posts</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {relatedPosts.map((post, index) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -5 }}
            className="bg-card border border-card-border rounded-xl p-6 hover-elevate transition-all"
          >
            <Link href={`/blog/${post.id}`}>
              <div>
                {post.coverImage && (
                  <img
                    src={post.coverImage}
                    alt={post.title}
                    className="w-full h-32 object-cover rounded-lg mb-4"
                  />
                )}
                <h3 className="text-lg font-serif font-bold mb-2 hover:text-primary transition-colors line-clamp-2">
                  {post.title}
                </h3>
                <p className="text-sm text-muted-foreground font-sans mb-3 line-clamp-2">
                  {post.excerpt}
                </p>
                <div className="flex flex-wrap gap-2 mb-3">
                  {post.tags.slice(0, 2).map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  {post.readTime && (
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {post.readTime} min read
                    </span>
                  )}
                  {post.views > 0 && (
                    <span className="flex items-center gap-1">
                      <Eye className="w-3 h-3" />
                      {post.views} views
                    </span>
                  )}
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};
