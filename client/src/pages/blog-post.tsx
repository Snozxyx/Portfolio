import { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'wouter';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import { ParticleBackground } from '@/components/ParticleBackground';
import { FloatingNav } from '@/components/FloatingNav';
import { MobileNav } from '@/components/MobileNav';
import { BlogMobileNav } from '@/components/BlogMobileNav';
import { ReadingProgressBar } from '@/components/ReadingProgressBar';
import { TableOfContents } from '@/components/TableOfContents';
import { SocialShare } from '@/components/SocialShare';
import { RelatedPosts } from '@/components/RelatedPosts';
import { ReactionButton } from '@/components/ReactionButton';
import { SEO } from '@/components/SEO';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/lib/auth-context';
import { apiRequest } from '@/lib/queryClient';
import { Star, Edit, ArrowLeft, Send, Clock, Eye } from 'lucide-react';
import type { BlogPost, BlogComment } from '@shared/schema';
import { toast } from '@/hooks/use-toast';

export default function BlogPostPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [comment, setComment] = useState('');

  const { data: post } = useQuery<BlogPost & { author?: any }>({
    queryKey: ['/api/blog/posts', id],
  });

  const { data: allPosts = [] } = useQuery<BlogPost[]>({
    queryKey: ['/api/blog/posts'],
  });

  const { data: comments = [] } = useQuery<BlogComment[]>({
    queryKey: [`/api/blog/posts/${id}/comments`],
  });

  const { data: starData } = useQuery<{ count: number; starred: boolean }>({
    queryKey: [`/api/blog/posts/${id}/star`],
  });

  // Track view on mount
  useEffect(() => {
    if (id) {
      apiRequest('POST', `/api/blog/posts/${id}/view`, {}).catch(() => {
        // Silently fail if view tracking fails
      });
    }
  }, [id]);

  const starMutation = useMutation({
    mutationFn: () => apiRequest('POST', `/api/blog/posts/${id}/star`, {}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/blog/posts/${id}/star`] });
      queryClient.invalidateQueries({ queryKey: ['/api/blog/posts', id] });
    },
  });

  const commentMutation = useMutation({
    mutationFn: (content: string) => apiRequest('POST', `/api/blog/posts/${id}/comments`, { content }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/blog/posts/${id}/comments`] });
      setComment('');
    },
  });

  // Parse markdown content to HTML
  const htmlContent = useMemo(() => {
    if (!post) return '';
    const rawHtml = marked.parse(post.content) as string;
    return DOMPurify.sanitize(rawHtml);
  }, [post?.content]);

  if (!post) return null;

  const postUrl = typeof window !== 'undefined' ? window.location.href : '';

  return (
    <div className="relative min-h-screen bg-background text-foreground pb-20 md:pb-0">
      <SEO
        title={`${post.title} | Snozxyx Blog`}
        description={post.excerpt || post.content.substring(0, 160)}
        image={post.coverImage ?? undefined}
        url={postUrl}
        type="article"
        author={post.authorId}
        publishedTime={post.publishedAt?.toString()}
        tags={post.tags}
      />
      <ReadingProgressBar />
      <ParticleBackground />
      <FloatingNav />
      <MobileNav />
      <BlogMobileNav />

      <div className="container mx-auto px-4 md:px-6 py-20 md:py-32 pb-24 md:pb-32">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl md:text-5xl font-serif font-bold mb-6">{post.title}</h1>
          </motion.div>

          <div className="flex flex-col lg:flex-row gap-8 overflow-x-hidden">
            <div className="flex-1 w-full lg:max-w-4xl overflow-x-hidden">
              <Button variant="ghost" asChild className="mb-6" data-testid="button-back">
                <Link href="/blog">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Blog
                </Link>
              </Button>

              <motion.article
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-card border border-card-border rounded-xl p-4 md:p-8 mb-8 overflow-x-hidden"
              >
                <div className="flex justify-between items-start mb-6">
                  <div className="flex-1">
                    <h1 className="text-4xl font-serif font-bold mb-4" data-testid="heading-post-title">
                      {post.title}
                    </h1>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-4">
                      {post.readTime && (
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {post.readTime} min read
                        </span>
                      )}
                      {post.views > 0 && (
                        <span className="flex items-center gap-1">
                          <Eye className="w-4 h-4" />
                          {post.views} views
                        </span>
                      )}
                      <span>
                        {new Date(post.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </span>
                    </div>
                  </div>
                  {user?.id === post.authorId && (
                    <Button variant="outline" size="sm" asChild data-testid="button-edit">
                      <Link href={`/blog/${post.slug}/edit`}>
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </Link>
                    </Button>
                  )}
                </div>

                <div className="flex flex-wrap gap-2 mb-6">
                  {post.category && (
                    <Badge variant="default">{post.category}</Badge>
                  )}
                  {post.tags.map(tag => (
                    <Badge key={tag} variant="secondary">{tag}</Badge>
                  ))}
                </div>

                {post.coverImage && (
                  <img
                    src={post.coverImage}
                    alt={post.title}
                    className="w-full h-48 md:h-64 object-cover rounded-lg mb-6"
                  />
                )}

                <div 
                  className="prose prose-invert max-w-none mb-6 font-sans prose-headings:font-serif prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-img:rounded-lg prose-pre:bg-card prose-pre:border prose-pre:border-card-border prose-code:text-primary prose-code:bg-card prose-code:px-1 prose-code:py-0.5 prose-code:rounded" 
                  dangerouslySetInnerHTML={{ __html: htmlContent }} 
                />

                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-6 border-t border-card-border">
                  <div className="w-full sm:w-auto overflow-x-auto">
                    <SocialShare title={post.title} url={postUrl} />
                  </div>

                  <div className="flex items-center gap-3 flex-shrink-0">
                    <ReactionButton postId={post.id} />

                    {user ? (
                      <Button
                        variant={starData?.starred ? "default" : "outline"}
                        size="sm"
                        onClick={() => starMutation.mutate()}
                        data-testid="button-star"
                      >
                        <Star className={`w-4 h-4 mr-2 ${starData?.starred ? 'fill-current' : ''}`} />
                        {starData?.count || 0} Stars
                      </Button>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        asChild
                        data-testid="button-star"
                      >
                        <Link href="/login">
                          <Star className="w-4 h-4 mr-2" />
                          {starData?.count || 0} Stars
                        </Link>
                      </Button>
                    )}
                  </div>
                </div>
              </motion.article>

          <div className="bg-card border border-card-border rounded-xl p-4 md:p-8 overflow-x-hidden">
            <h2 className="text-2xl font-serif font-bold mb-6">Comments</h2>

            {user ? (
              <div className="mb-8">
                <Textarea
                  placeholder="Add a comment..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="mb-4"
                  data-testid="textarea-comment"
                />
                <Button
                  onClick={() => commentMutation.mutate(comment)}
                  disabled={!comment.trim()}
                  data-testid="button-post-comment"
                >
                  <Send className="w-4 h-4 mr-2" />
                  Post Comment
                </Button>
              </div>
            ) : (
              <div className="mb-8 text-center py-4">
                <Button asChild data-testid="button-signin-comment">
                  <Link href="/login">Sign in to comment</Link>
                </Button>
              </div>
            )}

            <div className="space-y-4">
              {comments.map((comment: any) => (
                <div key={comment.id} className="bg-card border border-card-border rounded-lg p-4 md:p-6">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {comment.author ? (
                        <Link href={`/profile/${comment.author.id}`}>
                          <span className="text-sm font-medium hover:text-primary transition-colors cursor-pointer">
                            {comment.author.displayName || comment.author.username}
                          </span>
                        </Link>
                      ) : (
                        <span className="text-sm text-muted-foreground">Unknown User</span>
                      )}
                      {comment.author?.role === 'admin' && (
                        <Badge variant="default" className="text-xs">Admin</Badge>
                      )}
                      <span className="text-sm text-muted-foreground">
                        • {new Date(comment.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    {user?.role === 'admin' && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={async () => {
                          if (confirm('Delete this comment?')) {
                            await apiRequest('DELETE', `/api/admin/comments/${comment.id}`, {});
                            queryClient.invalidateQueries({ queryKey: ['/api/blog/posts', id, 'comments'] });
                            toast({ title: 'Comment deleted' });
                          }
                        }}
                      >
                        Delete
                      </Button>
                    )}
                  </div>
                  <p className="text-foreground">{comment.content}</p>
                </div>
              ))}
            </div>
          </div>

          <RelatedPosts
            currentPostId={post.id}
            currentTags={post.tags}
            allPosts={allPosts}
          />
          </div>

          <div className="hidden lg:block">
            <TableOfContents content={post.content} />
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}