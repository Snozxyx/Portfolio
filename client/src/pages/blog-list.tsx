import { useState, useMemo } from 'react';
import { Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { ParticleBackground } from '@/components/ParticleBackground';
import { FloatingNav } from '@/components/FloatingNav';
import { MobileNav } from '@/components/MobileNav';
import { BlogMobileNav } from '@/components/BlogMobileNav';
import { SearchBar } from '@/components/SearchBar';
import { NewsletterSignup } from '@/components/NewsletterSignup';
import { BlogListSkeleton } from '@/components/BlogSkeleton';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/lib/auth-context';
import { Star, PenSquare, Clock, Eye } from 'lucide-react';
import type { BlogPost } from '@shared/schema';

export default function BlogList() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  const { data: posts = [], isLoading } = useQuery<BlogPost[]>({
    queryKey: ['/api/blog/posts'],
  });

  // Extract unique tags and categories
  const { availableTags, availableCategories } = useMemo(() => {
    const tags = new Set<string>();
    const categories = new Set<string>();
    
    posts.forEach((post) => {
      post.tags.forEach((tag) => tags.add(tag));
      if (post.category) categories.add(post.category);
    });
    
    return {
      availableTags: Array.from(tags).sort(),
      availableCategories: Array.from(categories).sort(),
    };
  }, [posts]);

  // Filter posts based on search and filters
  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      // Search query filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = post.title.toLowerCase().includes(query);
        const matchesContent = post.content.toLowerCase().includes(query);
        const matchesExcerpt = post.excerpt?.toLowerCase().includes(query);
        if (!matchesTitle && !matchesContent && !matchesExcerpt) return false;
      }

      // Category filter
      if (selectedCategory && post.category !== selectedCategory) return false;

      // Tags filter
      if (selectedTags.length > 0) {
        const hasMatchingTag = selectedTags.some((tag) => post.tags.includes(tag));
        if (!hasMatchingTag) return false;
      }

      return true;
    });
  }, [posts, searchQuery, selectedCategory, selectedTags]);

  const handleTagToggle = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  return (
    <div className="relative min-h-screen bg-background text-foreground pb-20 md:pb-0">
      <ParticleBackground />
      <div className="hidden md:block">
        <FloatingNav />
      </div>
      <div className="md:hidden">
        <BlogMobileNav />
      </div>
      
      <div className="container mx-auto px-4 md:px-6 py-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-5xl mx-auto"
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div>
              <h1 className="text-5xl font-serif font-bold mb-4" data-testid="heading-blog">Blog</h1>
              <p className="text-muted-foreground font-sans">Thoughts on tech, gaming, and development</p>
            </div>
            {user ? (
              <Button asChild data-testid="button-create-post">
                <Link href="/blog/create">
                  <PenSquare className="w-4 h-4 mr-2" />
                  New Post
                </Link>
              </Button>
            ) : (
              <Button asChild data-testid="button-auth">
                <Link href="/login">Sign In</Link>
              </Button>
            )}
          </div>

          <SearchBar
            onSearchChange={setSearchQuery}
            availableTags={availableTags}
            selectedTags={selectedTags}
            onTagToggle={handleTagToggle}
            availableCategories={availableCategories}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
          />

          <div className="mt-8">
            {isLoading ? (
              <BlogListSkeleton />
            ) : filteredPosts.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-muted-foreground font-sans text-lg">
                  {searchQuery || selectedTags.length > 0 || selectedCategory
                    ? 'No posts match your filters'
                    : 'No posts yet'}
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {filteredPosts.map((post, index) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-card border border-card-border rounded-xl p-4 md:p-6 hover-elevate transition-all"
                    data-testid={`post-${index}`}
                  >
                    <Link href={`/blog/${post.slug}`}>
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h2 className="text-xl md:text-2xl font-serif font-bold text-foreground hover:text-primary transition-colors">
                              {post.title}
                            </h2>
                            {post.category && (
                              <Badge variant="outline" className="text-xs">
                                {post.category}
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
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
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Star className="w-4 h-4" />
                          <span className="text-sm">{post.stars}</span>
                        </div>
                      </div>
                      <p className="text-muted-foreground font-sans mb-4">{post.excerpt}</p>
                      <div className="flex flex-wrap gap-2">
                        {post.tags.map(tag => (
                          <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
                        ))}
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          <div className="mt-12">
            <NewsletterSignup />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
