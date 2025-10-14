
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, Eye, Star, ArrowRight } from 'lucide-react';
import type { BlogPost } from '@shared/schema';

export const BlogWidget = () => {
  const { data: posts = [], isLoading } = useQuery<BlogPost[]>({
    queryKey: ['/api/blog/posts'],
  });

  const publishedPosts = posts
    .filter(p => p.published)
    .sort((a, b) => new Date(b.publishedAt || b.createdAt).getTime() - new Date(a.publishedAt || a.createdAt).getTime())
    .slice(0, 3);

  if (isLoading) {
    return (
      <section className="py-20 bg-card/20">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="animate-pulse space-y-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-card border border-card-border rounded-xl p-6 h-40" />
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (publishedPosts.length === 0) return null;

  return (
    <section className="py-20 bg-card/20">
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-4xl md:text-5xl font-serif font-bold mb-2">Latest from Blog</h2>
                <p className="text-muted-foreground font-sans">Insights, tutorials, and thoughts on technology</p>
              </div>
              <Button asChild variant="outline" className="hidden md:flex">
                <Link href="/blog">
                  View All Posts
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {publishedPosts.map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                  whileHover={{ y: -5 }}
                  className="bg-card border border-card-border rounded-xl overflow-hidden hover-elevate transition-all group"
                >
                  <Link href={`/blog/${post.slug || post.id}`}>
                    <div>
                      {post.coverImage && (
                        <div className="relative h-48 overflow-hidden">
                          <img
                            src={post.coverImage}
                            alt={post.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          {post.category && (
                            <Badge className="absolute top-3 right-3 bg-primary/90 backdrop-blur-sm">
                              {post.category}
                            </Badge>
                          )}
                        </div>
                      )}
                      <div className="p-6">
                        <h3 className="text-xl font-serif font-bold mb-2 group-hover:text-primary transition-colors line-clamp-2">
                          {post.title}
                        </h3>
                        <p className="text-sm text-muted-foreground font-sans mb-4 line-clamp-3">
                          {post.excerpt || post.content.substring(0, 120) + '...'}
                        </p>
                        <div className="flex flex-wrap gap-2 mb-4">
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
                              {post.readTime} min
                            </span>
                          )}
                          {post.views > 0 && (
                            <span className="flex items-center gap-1">
                              <Eye className="w-3 h-3" />
                              {post.views}
                            </span>
                          )}
                          <span className="flex items-center gap-1">
                            <Star className="w-3 h-3" />
                            {post.stars || 0}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>

            <div className="md:hidden mt-6 text-center">
              <Button asChild variant="outline" className="w-full">
                <Link href="/blog">
                  View All Posts
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
