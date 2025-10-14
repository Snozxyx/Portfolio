import { useParams } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { ParticleBackground } from '@/components/ParticleBackground';
import { FloatingNav } from '@/components/FloatingNav';
import { MobileNav } from '@/components/MobileNav';
import { BlogMobileNav } from '@/components/BlogMobileNav';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Calendar, Mail, User as UserIcon } from 'lucide-react';
import type { BlogPost } from '@shared/schema';

interface UserProfile {
  id: string;
  username: string;
  email: string;
  displayName?: string;
  role: string;
  bio?: string;
  avatar?: string;
  createdAt: string;
}

export default function Profile() {
  const { id } = useParams();

  const { data: user } = useQuery<UserProfile>({
    queryKey: ['/api/users', id],
  });

  const { data: posts = [] } = useQuery<BlogPost[]>({
    queryKey: ['/api/blog/posts', { authorId: id }],
  });

  if (!user) {
    return (
      <div className="relative min-h-screen bg-background text-foreground">
        <ParticleBackground />
        <FloatingNav />
        <MobileNav />
        <div className="container mx-auto px-4 md:px-6 py-20 md:py-32">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-background text-foreground pb-20 md:pb-0">
      <ParticleBackground />
      <FloatingNav />
      <MobileNav />
      <BlogMobileNav />

      <div className="container mx-auto px-4 md:px-6 py-20 md:py-32 pb-24 md:pb-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          <div className="bg-card border border-card-border rounded-xl p-6 md:p-8 mb-8">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              <Avatar className="w-24 h-24">
                <AvatarImage src={user.avatar} alt={user.displayName || user.username} />
                <AvatarFallback className="text-2xl">
                  {(user.displayName || user.username).charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 text-center md:text-left">
                <h1 className="text-3xl md:text-4xl font-serif font-bold mb-2">
                  {user.displayName || user.username}
                </h1>
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-4">
                  <Badge variant="outline" className="capitalize">
                    {user.role}
                  </Badge>
                  <span className="flex items-center gap-1 text-sm text-muted-foreground">
                    <UserIcon className="w-4 h-4" />
                    @{user.username}
                  </span>
                  <span className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    Joined {new Date(user.createdAt).toLocaleDateString()}
                  </span>
                </div>
                {user.bio && (
                  <p className="text-muted-foreground mb-4">{user.bio}</p>
                )}
              </div>
            </div>
          </div>

          <div className="bg-card border border-card-border rounded-xl p-6 md:p-8">
            <h2 className="text-2xl font-serif font-bold mb-6">Posts by {user.displayName || user.username}</h2>
            {posts.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">No posts yet</p>
            ) : (
              <div className="space-y-4">
                {posts.map((post) => (
                  <a
                    key={post.id}
                    href={`/blog/${post.id}`}
                    className="block bg-background/50 rounded-lg p-4 border border-card-border hover-elevate transition-all"
                  >
                    <h3 className="text-lg font-serif font-bold mb-1 hover:text-primary transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">{post.excerpt}</p>
                    <div className="flex items-center gap-2 mt-2">
                      {post.category && (
                        <Badge variant="outline" className="text-xs">{post.category}</Badge>
                      )}
                      <span className="text-xs text-muted-foreground">
                        {new Date(post.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </a>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}