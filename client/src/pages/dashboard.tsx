import { useParams, useLocation } from 'wouter';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'wouter';
import { motion } from 'framer-motion';
import { ParticleBackground } from '@/components/ParticleBackground';
import { FloatingNav } from '@/components/FloatingNav';
import { MobileNav } from '@/components/MobileNav';
import { BlogMobileNav } from '@/components/BlogMobileNav';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/lib/auth-context';
import { PenSquare, LogOut, Star, Eye, Shield, Ban, UserX, Settings, Megaphone, Plus, Trash2, Briefcase, Zap, Github, ExternalLink, GitFork, RefreshCw, Film, Gamepad2, Activity } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { BlogPost, SafeUser, SiteSettings, Announcement, InsertAnnouncement, Project, Skill, AnimeEntry, InsertAnime } from '@shared/schema';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: posts = [] } = useQuery<BlogPost[]>({
    queryKey: ['/api/blog/posts'],
    queryFn: async () => {
      const res = await fetch('/api/blog/posts?published=false');
      if (!res.ok) throw new Error('Failed to fetch posts');
      return res.json();
    },
  });

  const { data: allUsers = [] } = useQuery<SafeUser[]>({
    queryKey: ['/api/admin/users'],
    enabled: user?.role === 'admin',
  });

  const { data: siteSettings } = useQuery<SiteSettings>({
    queryKey: ['/api/admin/settings'],
    enabled: user?.role === 'admin',
  });

  const { data: announcements = [] } = useQuery<Announcement[]>({
    queryKey: ['/api/announcements'],
    enabled: user?.role === 'admin',
  });

  const { data: projects = [] } = useQuery<Project[]>({
    queryKey: ['/api/projects'],
    enabled: user?.role === 'admin',
  });

  const { data: skills = [] } = useQuery<Skill[]>({
    queryKey: ['/api/skills'],
    enabled: user?.role === 'admin',
  });

  // GitHub repos query
  const { data: githubRepos = [], refetch: refetchGithubRepos } = useQuery<any[]>({
    queryKey: ['/api/github/repos/snozxyx'],
    enabled: user?.role === 'admin',
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Anime query
  const { data: animeList = [] } = useQuery<AnimeEntry[]>({
    queryKey: ['/api/anime'],
    enabled: user?.role === 'admin',
  });

  const createAnnouncementMutation = useMutation({
    mutationFn: (data: InsertAnnouncement) => 
      apiRequest('POST', '/api/admin/announcements', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/announcements'] });
      toast({ title: 'Announcement created successfully' });
    },
  });

  const deleteAnnouncementMutation = useMutation({
    mutationFn: (id: string) => 
      apiRequest('DELETE', `/api/admin/announcements/${id}`, {}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/announcements'] });
      toast({ title: 'Announcement deleted successfully' });
    },
  });

  const deletePostMutation = useMutation({
    mutationFn: (id: string) => 
      apiRequest('DELETE', `/api/blog/posts/${id}`, {}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/blog/posts'] });
      toast({ title: 'Post deleted successfully' });
    },
  });

  const createProjectMutation = useMutation({
    mutationFn: (data: any) => 
      apiRequest('POST', '/api/projects', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/projects'] });
      toast({ title: 'Project created successfully' });
    },
  });

  const deleteProjectMutation = useMutation({
    mutationFn: (id: string) => 
      apiRequest('DELETE', `/api/projects/${id}`, {}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/projects'] });
      toast({ title: 'Project deleted successfully' });
    },
  });

  const createSkillMutation = useMutation({
    mutationFn: (data: any) => 
      apiRequest('POST', '/api/skills', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/skills'] });
      toast({ title: 'Skill created successfully' });
    },
  });

  const deleteSkillMutation = useMutation({
    mutationFn: (id: string) => 
      apiRequest('DELETE', `/api/skills/${id}`, {}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/skills'] });
      toast({ title: 'Skill deleted successfully' });
    },
  });

  const createAnimeMutation = useMutation({
    mutationFn: async (data: InsertAnime) => {
      const res = await apiRequest('POST', '/api/anime', data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/anime'] });
      toast({ title: 'Anime entry created successfully' });
    },
  });

  const deleteAnimeMutation = useMutation({
    mutationFn: (id: string) => 
      apiRequest('DELETE', `/api/anime/${id}`, {}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/anime'] });
      toast({ title: 'Anime entry deleted successfully' });
    },
  });

  const toggleAnnouncementMutation = useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) => 
      apiRequest('PATCH', `/api/admin/announcements/${id}`, { isActive }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/announcements'] });
      toast({ title: 'Announcement status updated' });
    },
  });

  const banMutation = useMutation({
    mutationFn: ({ userId, isBanned }: { userId: string; isBanned: boolean }) => 
      apiRequest('PATCH', `/api/admin/users/${userId}/ban`, { isBanned }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/users'] });
      toast({ title: 'User ban status updated' });
    },
  });

  const muteMutation = useMutation({
    mutationFn: ({ userId, isMuted }: { userId: string; isMuted: boolean }) => 
      apiRequest('PATCH', `/api/admin/users/${userId}/mute`, { isMuted }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/users'] });
      toast({ title: 'User mute status updated' });
    },
  });

  const togglePostingMutation = useMutation({
    mutationFn: ({ userId, canPost }: { userId: string; canPost: boolean }) => 
      apiRequest('PATCH', `/api/admin/users/${userId}/posting`, { canPost }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/users'] });
      toast({ title: 'Posting permissions updated' });
    },
  });

  const updateRoleMutation = useMutation({
    mutationFn: ({ userId, role }: { userId: string; role: string }) => 
      apiRequest('PATCH', `/api/admin/users/${userId}/role`, { role }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/users'] });
      toast({ title: 'User role updated' });
    },
  });

  const updateSettingsMutation = useMutation({
    mutationFn: async (data: Partial<SiteSettings>) => {
      const res = await apiRequest('POST', '/api/admin/settings', data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/settings'] });
      toast({ title: 'Settings updated' });
    },
  });

  const userPosts = posts.filter(p => p.authorId === user?.id);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Please sign in to access dashboard</p>
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
          className="max-w-6xl mx-auto"
        >
          {siteSettings?.maintenanceMode && user.role === 'admin' && (
            <div className="mb-6 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
              <p className="text-yellow-400 text-sm font-medium">
                ⚠️ Maintenance mode is active. Only admins can access the site.
              </p>
            </div>
          )}

          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8 md:mb-12">
            <div>
              <h1 className="text-3xl md:text-5xl font-serif font-bold mb-2">Dashboard</h1>
              <p className="text-muted-foreground font-sans">Welcome back, {user.displayName || user.username}!</p>
            </div>
            <div className="flex gap-2 md:gap-4">
              {user.role === 'admin' && (
                <Button asChild size="sm" variant="outline" className="md:h-10">
                  <Link href="/admin/logs">
                    <Activity className="w-4 h-4 md:mr-2" />
                    <span className="hidden md:inline">Logs</span>
                  </Link>
                </Button>
              )}
              <Button asChild size="sm" className="md:h-10" data-testid="button-new-post">
                <Link href="/blog/create">
                  <PenSquare className="w-4 h-4 md:mr-2" />
                  <span className="hidden md:inline">New Post</span>
                </Link>
              </Button>
              <Button variant="outline" size="sm" className="md:h-10" onClick={() => logout()} data-testid="button-logout">
                <LogOut className="w-4 h-4 md:mr-2" />
                <span className="hidden md:inline">Sign Out</span>
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 mb-8 md:mb-12">
            <div className="bg-card border border-card-border rounded-xl p-4 md:p-6">
              <h3 className="text-xl md:text-2xl font-serif font-bold text-primary">{userPosts.length}</h3>
              <p className="text-xs md:text-sm text-muted-foreground font-sans">Total Posts</p>
            </div>
            <div className="bg-card border border-card-border rounded-xl p-4 md:p-6">
              <h3 className="text-xl md:text-2xl font-serif font-bold text-primary">
                {userPosts.filter(p => p.published).length}
              </h3>
              <p className="text-xs md:text-sm text-muted-foreground font-sans">Published</p>
            </div>
            <div className="bg-card border border-card-border rounded-xl p-4 md:p-6">
              <h3 className="text-xl md:text-2xl font-serif font-bold text-primary">
                {userPosts.reduce((acc, p) => acc + p.stars, 0)}
              </h3>
              <p className="text-xs md:text-sm text-muted-foreground font-sans">Total Stars</p>
            </div>
            <div className="bg-card border border-card-border rounded-xl p-4 md:p-6">
              <h3 className="text-xl md:text-2xl font-serif font-bold text-primary">
                {userPosts.reduce((acc, p) => acc + (p.views || 0), 0)}
              </h3>
              <p className="text-xs md:text-sm text-muted-foreground font-sans">Total Views</p>
            </div>
          </div>

          {user.role === 'admin' && (
            <>
              <div className="mb-8 md:mb-12">
                <div className="flex items-center gap-2 mb-4">
                  <Shield className="w-6 h-6 text-primary" />
                  <h2 className="text-2xl md:text-3xl font-serif font-bold">Admin Panel</h2>
                </div>

                <div className="space-y-4 mb-6">
                  <div className="bg-card border border-card-border rounded-xl p-4 md:p-6">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <Settings className="w-5 h-5" />
                      Site Settings
                    </h3>
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <label className="text-sm font-medium">Maintenance Mode</label>
                          <p className="text-sm text-muted-foreground">
                            Enable maintenance mode to restrict access to the site
                          </p>
                        </div>
                        <Switch
                          checked={siteSettings?.maintenanceMode || false}
                          onCheckedChange={(checked) => 
                            updateSettingsMutation.mutate({
                              maintenanceMode: checked,
                              maintenanceMessage: siteSettings?.maintenanceMessage || "We're currently performing maintenance. Please check back soon."
                            })
                          }
                          data-testid="switch-maintenance-mode"
                        />
                      </div>

                      {siteSettings?.maintenanceMode && (
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Maintenance Message</label>
                          <Textarea
                            key={siteSettings?.maintenanceMessage}
                            defaultValue={siteSettings?.maintenanceMessage || "We're currently performing maintenance. Please check back soon."}
                            onBlur={(e) => 
                              updateSettingsMutation.mutate({
                                maintenanceMode: true,
                                maintenanceMessage: e.target.value || "We're currently performing maintenance. Please check back soon."
                              })
                            }
                            placeholder="Enter maintenance message..."
                            className="min-h-[100px]"
                            data-testid="textarea-maintenance-message"
                          />
                          <p className="text-xs text-muted-foreground mt-2">
                            This message will be shown to non-admin users when they try to access the site.
                          </p>
                        </div>
                      )}

                      <Separator />

                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold">SEO Settings</h3>

                        <div className="space-y-2">
                          <label className="text-sm font-medium">Site Title</label>
                          <Input
                            key={siteSettings?.siteTitle}
                            defaultValue={siteSettings?.siteTitle || ''}
                            onBlur={(e) => 
                              updateSettingsMutation.mutate({ siteTitle: e.target.value })
                            }
                            placeholder="My Portfolio"
                            data-testid="input-site-title"
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-medium">Site Description</label>
                          <Textarea
                            key={siteSettings?.siteDescription}
                            defaultValue={siteSettings?.siteDescription || ''}
                            onBlur={(e) => 
                              updateSettingsMutation.mutate({ siteDescription: e.target.value })
                            }
                            placeholder="Full-stack developer, gamer, and tech enthusiast"
                            className="min-h-[80px]"
                            data-testid="textarea-site-description"
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-medium">Open Graph Image URL</label>
                          <Input
                            key={siteSettings?.ogImage}
                            defaultValue={siteSettings?.ogImage || ''}
                            onBlur={(e) => 
                              updateSettingsMutation.mutate({ ogImage: e.target.value })
                            }
                            placeholder="https://example.com/og-image.jpg"
                            data-testid="input-og-image"
                          />
                          <p className="text-xs text-muted-foreground">
                            Image shown when sharing on social media (recommended: 1200x630px)
                          </p>
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-medium">Footer Message</label>
                          <Input
                            key={siteSettings?.footerMessage}
                            defaultValue={siteSettings?.footerMessage || ''}
                            onBlur={(e) => 
                              updateSettingsMutation.mutate({ footerMessage: e.target.value })
                            }
                            placeholder="© 2024 Snozxyx. All rights reserved."
                            data-testid="input-footer-message"
                          />
                        </div>
                      </div>

                      <Separator />

                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Page Content</h3>

                        <div className="space-y-2">
                          <label className="text-sm font-medium">Home Hero Title</label>
                          <Input
                            key={siteSettings?.homeHeroTitle}
                            defaultValue={siteSettings?.homeHeroTitle || ''}
                            onBlur={(e) => 
                              updateSettingsMutation.mutate({ homeHeroTitle: e.target.value })
                            }
                            placeholder="Hi, I'm Snozxyx"
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-medium">Home Hero Subtitle</label>
                          <Textarea
                            key={siteSettings?.homeHeroSubtitle}
                            defaultValue={siteSettings?.homeHeroSubtitle || ''}
                            onBlur={(e) => 
                              updateSettingsMutation.mutate({ homeHeroSubtitle: e.target.value })
                            }
                            placeholder="Full-stack developer, gamer, and tech enthusiast"
                            className="min-h-[60px]"
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-medium">About Text</label>
                          <Textarea
                            key={siteSettings?.homeAboutText}
                            defaultValue={siteSettings?.homeAboutText || ''}
                            onBlur={(e) => 
                              updateSettingsMutation.mutate({ homeAboutText: e.target.value })
                            }
                            placeholder="Tell visitors about yourself..."
                            className="min-h-[120px]"
                          />
                        </div>
                      </div>

                      <Separator />

                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Contact Information</h3>

                        <div className="space-y-2">
                          <label className="text-sm font-medium">Email</label>
                          <Input
                            key={siteSettings?.contactEmail}
                            defaultValue={siteSettings?.contactEmail || ''}
                            onBlur={(e) => 
                              updateSettingsMutation.mutate({ contactEmail: e.target.value })
                            }
                            placeholder="your@email.com"
                            type="email"
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-medium">GitHub URL</label>
                          <Input
                            key={siteSettings?.contactGithub}
                            defaultValue={siteSettings?.contactGithub || ''}
                            onBlur={(e) => 
                              updateSettingsMutation.mutate({ contactGithub: e.target.value })
                            }
                            placeholder="https://github.com/username"
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-medium">LinkedIn URL</label>
                          <Input
                            key={siteSettings?.contactLinkedin}
                            defaultValue={siteSettings?.contactLinkedin || ''}
                            onBlur={(e) => 
                              updateSettingsMutation.mutate({ contactLinkedin: e.target.value })
                            }
                            placeholder="https://linkedin.com/in/username"
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-medium">Twitter/X URL</label>
                          <Input
                            key={siteSettings?.contactTwitter}
                            defaultValue={siteSettings?.contactTwitter || ''}
                            onBlur={(e) => 
                              updateSettingsMutation.mutate({ contactTwitter: e.target.value })
                            }
                            placeholder="https://twitter.com/username"
                          />
                        </div>
                      </div>

                      <Separator />

                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Games & Media</h3>

                        <div className="space-y-2">
                          <label className="text-sm font-medium">Steam Profile ID</label>
                          <Input
                            key={siteSettings?.steamProfileId}
                            defaultValue={siteSettings?.steamProfileId || ''}
                            onBlur={(e) => 
                              updateSettingsMutation.mutate({ steamProfileId: e.target.value })
                            }
                            placeholder="Snozxyx"
                          />
                          <p className="text-xs text-muted-foreground">
                            Your Steam custom URL ID (from steamcommunity.com/id/YOUR_ID)
                          </p>
                        </div>
                      </div>

                      <Separator />

                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Page Visibility</h3>

                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <label className="text-sm font-medium">Show Anime Page</label>
                            <p className="text-sm text-muted-foreground">
                              Enable /anime route for visitors
                            </p>
                          </div>
                          <Switch
                            checked={siteSettings?.showAnimePage || false}
                            onCheckedChange={(checked) => 
                              updateSettingsMutation.mutate({ showAnimePage: checked })
                            }
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <label className="text-sm font-medium">Show Games Page</label>
                            <p className="text-sm text-muted-foreground">
                              Enable /games route for visitors
                            </p>
                          </div>
                          <Switch
                            checked={siteSettings?.showGamesPage || false}
                            onCheckedChange={(checked) => 
                              updateSettingsMutation.mutate({ showGamesPage: checked })
                            }
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <label className="text-sm font-medium">Show Anime Widget</label>
                            <p className="text-sm text-muted-foreground">
                              Display anime widget on home page
                            </p>
                          </div>
                          <Switch
                            checked={siteSettings?.showAnimeWidget || false}
                            onCheckedChange={(checked) => 
                              updateSettingsMutation.mutate({ showAnimeWidget: checked })
                            }
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <label className="text-sm font-medium">Show Games Widget</label>
                            <p className="text-sm text-muted-foreground">
                              Display games widget on home page
                            </p>
                          </div>
                          <Switch
                            checked={siteSettings?.showGamesWidget || false}
                            onCheckedChange={(checked) => 
                              updateSettingsMutation.mutate({ showGamesWidget: checked })
                            }
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-card border border-card-border rounded-xl p-4 md:p-6 mt-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold flex items-center gap-2">
                        <Briefcase className="w-5 h-5" />
                        Projects Management
                      </h3>
                    </div>

                    <div className="space-y-4">
                      <div className="p-4 bg-background rounded-lg border border-border">
                        <h4 className="font-medium mb-3">Add New Project</h4>
                        <form onSubmit={(e) => {
                          e.preventDefault();
                          const form = e.target as HTMLFormElement;
                          const formData = new FormData(form);
                          createProjectMutation.mutate({
                            name: formData.get('name') as string,
                            description: formData.get('description') as string,
                            techStack: (formData.get('techStack') as string).split(',').map(s => s.trim()),
                            features: (formData.get('features') as string).split(',').map(s => s.trim()),
                            githubUrl: formData.get('githubUrl') as string || null,
                            liveUrl: formData.get('liveUrl') as string || null,
                            imageUrl: formData.get('imageUrl') as string || null,
                            order: formData.get('order') as string || '0',
                          });
                          form.reset();
                        }} className="space-y-3">
                          <div>
                            <Label htmlFor="projectName">Project Name</Label>
                            <Input id="projectName" name="name" required placeholder="My Awesome Project" />
                          </div>
                          <div>
                            <Label htmlFor="projectDescription">Description</Label>
                            <Textarea id="projectDescription" name="description" required placeholder="Brief description" />
                          </div>
                          <div>
                            <Label htmlFor="techStack">Tech Stack (comma-separated)</Label>
                            <Input id="techStack" name="techStack" required placeholder="React, Node.js, TypeScript" />
                          </div>
                          <div>
                            <Label htmlFor="features">Features (comma-separated)</Label>
                            <Input id="features" name="features" required placeholder="Real-time updates, User authentication" />
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <Label htmlFor="githubUrl">GitHub URL</Label>
                              <Input id="githubUrl" name="githubUrl" placeholder="https://github.com/..." />
                            </div>
                            <div>
                              <Label htmlFor="liveUrl">Live URL</Label>
                              <Input id="liveUrl" name="liveUrl" placeholder="https://..." />
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <Label htmlFor="imageUrl">Image URL</Label>
                              <Input id="imageUrl" name="imageUrl" placeholder="https://..." />
                            </div>
                            <div>
                              <Label htmlFor="order">Order</Label>
                              <Input id="order" name="order" type="number" placeholder="0" />
                            </div>
                          </div>
                          <Button type="submit" className="w-full">
                            <Plus className="w-4 h-4 mr-2" />
                            Add Project
                          </Button>
                        </form>
                      </div>

                      {projects.length > 0 ? (
                        <div className="space-y-2">
                          <h4 className="font-medium text-sm">Existing Projects</h4>
                          {projects.map((project) => (
                            <div key={project.id} className="p-3 bg-background rounded-lg border border-border flex items-start justify-between gap-3">
                              <div className="flex-1">
                                <h5 className="font-medium text-sm">{project.name}</h5>
                                <p className="text-xs text-muted-foreground line-clamp-1">{project.description}</p>
                                <div className="flex gap-2 mt-1 flex-wrap">
                                  {project.techStack.slice(0, 3).map((tech) => (
                                    <Badge key={tech} variant="outline" className="text-xs">{tech}</Badge>
                                  ))}
                                </div>
                              </div>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => deleteProjectMutation.mutate(project.id)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground text-center py-4">No projects yet</p>
                      )}
                    </div>
                  </div>

                  <div className="bg-card border border-card-border rounded-xl p-4 md:p-6 mt-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold flex items-center gap-2">
                        <Zap className="w-5 h-5" />
                        Skills Management
                      </h3>
                    </div>

                    <div className="space-y-4">
                      <div className="p-4 bg-background rounded-lg border border-border">
                        <h4 className="font-medium mb-3">Add New Skill</h4>
                        <form onSubmit={(e) => {
                          e.preventDefault();
                          const form = e.target as HTMLFormElement;
                          const formData = new FormData(form);
                          createSkillMutation.mutate({
                            name: formData.get('skillName') as string,
                            category: formData.get('category') as string,
                            proficiency: formData.get('proficiency') as string,
                            icon: formData.get('icon') as string || null,
                          });
                          form.reset();
                        }} className="space-y-3">
                          <div>
                            <Label htmlFor="skillName">Skill Name</Label>
                            <Input id="skillName" name="skillName" required placeholder="JavaScript" />
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <Label htmlFor="category">Category</Label>
                              <Input id="category" name="category" required placeholder="Languages" />
                            </div>
                            <div>
                              <Label htmlFor="proficiency">Proficiency</Label>
                              <Select name="proficiency" defaultValue="intermediate">
                                <SelectTrigger id="proficiency">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="beginner">Beginner</SelectItem>
                                  <SelectItem value="intermediate">Intermediate</SelectItem>
                                  <SelectItem value="advanced">Advanced</SelectItem>
                                  <SelectItem value="expert">Expert</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          <div>
                            <Label htmlFor="icon">Icon URL (optional)</Label>
                            <Input id="icon" name="icon" placeholder="https://..." />
                          </div>
                          <Button type="submit" className="w-full">
                            <Plus className="w-4 h-4 mr-2" />
                            Add Skill
                          </Button>
                        </form>
                      </div>

                      {skills.length > 0 ? (
                        <div className="space-y-2">
                          <h4 className="font-medium text-sm">Existing Skills</h4>
                          {skills.map((skill) => (
                            <div key={skill.id} className="p-3 bg-background rounded-lg border border-border flex items-start justify-between gap-3">
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <h5 className="font-medium text-sm">{skill.name}</h5>
                                  <Badge variant="outline" className="text-xs capitalize">{skill.proficiency}</Badge>
                                </div>
                                <p className="text-xs text-muted-foreground">{skill.category}</p>
                              </div>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => deleteSkillMutation.mutate(skill.id)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground text-center py-4">No skills yet</p>
                      )}
                    </div>
                  </div>

                  {/* GitHub Repositories Section */}
                  <div className="bg-card border border-card-border rounded-xl p-4 md:p-6 mt-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold flex items-center gap-2">
                        <Github className="w-5 h-5" />
                        GitHub Repositories
                      </h3>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => refetchGithubRepos()}
                      >
                        <RefreshCw className="w-4 h-4 mr-1" />
                        Refresh
                      </Button>
                    </div>

                    {githubRepos.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {githubRepos.slice(0, 10).map((repo: any) => (
                          <div key={repo.id} className="p-3 bg-background rounded-lg border border-border hover:border-primary/50 transition-colors">
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex-1">
                                <a
                                  href={repo.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="font-medium text-sm hover:text-primary transition-colors flex items-center gap-1"
                                >
                                  {repo.name}
                                  <ExternalLink className="w-3 h-3" />
                                </a>
                                {repo.description && (
                                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                                    {repo.description}
                                  </p>
                                )}
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-3 text-xs text-muted-foreground mt-2">
                              {repo.language && (
                                <span className="flex items-center gap-1">
                                  <span className="w-2 h-2 rounded-full bg-primary"></span>
                                  {repo.language}
                                </span>
                              )}
                              <span className="flex items-center gap-1">
                                <Star className="w-3 h-3" />
                                {repo.stars}
                              </span>
                              <span className="flex items-center gap-1">
                                <GitFork className="w-3 h-3" />
                                {repo.forks}
                              </span>
                            </div>
                            
                            {repo.topics && repo.topics.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-2">
                                {repo.topics.slice(0, 3).map((topic: string) => (
                                  <Badge key={topic} variant="outline" className="text-xs">
                                    {topic}
                                  </Badge>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground text-center py-4">
                        No repositories found or failed to load
                      </p>
                    )}
                  </div>

                  {/* Anime Management Section */}
                  <div className="bg-card border border-card-border rounded-xl p-4 md:p-6 mt-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold flex items-center gap-2">
                        <Film className="w-5 h-5" />
                        Anime Management
                      </h3>
                    </div>

                    <div className="space-y-4">
                      <div className="p-4 bg-background rounded-lg border border-border">
                        <h4 className="font-medium mb-3">Add New Anime</h4>
                        <form onSubmit={(e) => {
                          e.preventDefault();
                          const form = e.target as HTMLFormElement;
                          const formData = new FormData(form);
                          createAnimeMutation.mutate({
                            name: formData.get('name') as string,
                            imageUrl: (formData.get('imageUrl') as string) || null,
                            videoUrl: (formData.get('videoUrl') as string) || null,
                            clipUrl: (formData.get('clipUrl') as string) || null,
                            status: (formData.get('status') as string) || 'watching',
                            rating: formData.get('rating') ? parseInt(formData.get('rating') as string) : null,
                            episodes: formData.get('episodes') ? parseInt(formData.get('episodes') as string) : null,
                            notes: (formData.get('notes') as string) || null,
                            order: formData.get('order') ? parseInt(formData.get('order') as string) : 0,
                          });
                          form.reset();
                        }} className="space-y-3">
                          <div>
                            <Label htmlFor="animeName">Anime Name</Label>
                            <Input id="animeName" name="name" required placeholder="Attack on Titan" />
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <Label htmlFor="animeImageUrl">Image URL</Label>
                              <Input id="animeImageUrl" name="imageUrl" placeholder="https://..." />
                            </div>
                            <div>
                              <Label htmlFor="animeStatus">Status</Label>
                              <Select name="status" defaultValue="watching">
                                <SelectTrigger id="animeStatus">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="watching">Watching</SelectItem>
                                  <SelectItem value="completed">Completed</SelectItem>
                                  <SelectItem value="plan_to_watch">Plan to Watch</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          <div className="grid grid-cols-3 gap-3">
                            <div>
                              <Label htmlFor="animeRating">Rating (1-10)</Label>
                              <Input id="animeRating" name="rating" type="number" min="1" max="10" placeholder="8" />
                            </div>
                            <div>
                              <Label htmlFor="animeEpisodes">Episodes</Label>
                              <Input id="animeEpisodes" name="episodes" type="number" placeholder="24" />
                            </div>
                            <div>
                              <Label htmlFor="animeOrder">Order</Label>
                              <Input id="animeOrder" name="order" type="number" placeholder="0" />
                            </div>
                          </div>
                          <div>
                            <Label htmlFor="animeVideoUrl">Full Video URL</Label>
                            <Input id="animeVideoUrl" name="videoUrl" placeholder="https://..." />
                          </div>
                          <div>
                            <Label htmlFor="animeClipUrl">Clip URL</Label>
                            <Input id="animeClipUrl" name="clipUrl" placeholder="https://..." />
                          </div>
                          <div>
                            <Label htmlFor="animeNotes">Notes</Label>
                            <Textarea id="animeNotes" name="notes" placeholder="Your thoughts..." rows={2} />
                          </div>
                          <Button type="submit" className="w-full">
                            <Plus className="w-4 h-4 mr-2" />
                            Add Anime
                          </Button>
                        </form>
                      </div>

                      {animeList.length > 0 ? (
                        <div className="space-y-2">
                          <h4 className="font-medium text-sm">Existing Anime</h4>
                          {animeList.map((anime) => (
                            <div key={anime.id} className="p-3 bg-background rounded-lg border border-border flex items-start justify-between gap-3">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <h5 className="font-medium text-sm">{anime.name}</h5>
                                  {anime.rating && (
                                    <Badge variant="outline" className="text-xs">
                                      ⭐ {anime.rating}/10
                                    </Badge>
                                  )}
                                  <Badge variant="secondary" className="text-xs capitalize">
                                    {anime.status.replace('_', ' ')}
                                  </Badge>
                                </div>
                                {anime.notes && (
                                  <p className="text-xs text-muted-foreground line-clamp-1">{anime.notes}</p>
                                )}
                              </div>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => deleteAnimeMutation.mutate(anime.id)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground text-center py-4">No anime entries yet</p>
                      )}
                    </div>
                  </div>

                  <div className="bg-card border border-card-border rounded-xl p-4 md:p-6 mt-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold flex items-center gap-2">
                        <Megaphone className="w-5 h-5" />
                        Announcements
                      </h3>
                    </div>

                    <div className="space-y-4">
                      <div className="p-4 bg-background rounded-lg border border-border">
                        <h4 className="font-medium mb-3">Create New Announcement</h4>
                        <form onSubmit={(e) => {
                          e.preventDefault();
                          const form = e.target as HTMLFormElement;
                          const formData = new FormData(form);
                          createAnnouncementMutation.mutate({
                            title: formData.get('title') as string,
                            message: formData.get('message') as string,
                            type: (formData.get('type') as string) || 'info',
                            displayType: (formData.get('displayType') as string) || 'banner',
                            isActive: true,
                            startDate: null,
                            endDate: null,
                          });
                          form.reset();
                        }} className="space-y-3">
                          <div>
                            <Label htmlFor="title">Title</Label>
                            <Input id="title" name="title" required placeholder="Announcement title" />
                          </div>
                          <div>
                            <Label htmlFor="message">Message</Label>
                            <Textarea id="message" name="message" required placeholder="Announcement message" />
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <Label htmlFor="type">Type</Label>
                              <Select name="type" defaultValue="info">
                                <SelectTrigger id="type">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="info">ℹ️ Info</SelectItem>
                                  <SelectItem value="warning">⚠️ Warning</SelectItem>
                                  <SelectItem value="alert">🚨 Alert</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <Label htmlFor="displayType">Display</Label>
                              <Select name="displayType" defaultValue="banner">
                                <SelectTrigger id="displayType">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="banner">Banner</SelectItem>
                                  <SelectItem value="popup">Popup</SelectItem>
                                  <SelectItem value="notification">Notification</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          <Button type="submit" className="w-full">
                            <Plus className="w-4 h-4 mr-2" />
                            Create Announcement
                          </Button>
                        </form>
                      </div>

                      {announcements.length > 0 ? (
                        <div className="space-y-2">
                          {announcements.map((announcement) => (
                            <div key={announcement.id} className="p-3 bg-background rounded-lg border border-border flex items-start justify-between gap-3">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <h5 className="font-medium text-sm">{announcement.title}</h5>
                                  <Badge variant={
                                    announcement.type === 'alert' ? 'destructive' :
                                    announcement.type === 'warning' ? 'secondary' :
                                    'default'
                                  } className="text-xs">
                                    {announcement.type}
                                  </Badge>
                                  <Badge variant="outline" className="text-xs">
                                    {announcement.displayType}
                                  </Badge>
                                </div>
                                <p className="text-xs text-muted-foreground">{announcement.message}</p>
                              </div>
                              <div className="flex items-center gap-2">
                                <Switch
                                  checked={announcement.isActive}
                                  onCheckedChange={(checked) => 
                                    toggleAnnouncementMutation.mutate({ id: announcement.id, isActive: checked })
                                  }
                                />
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => deleteAnnouncementMutation.mutate(announcement.id)}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground text-center py-4">No announcements yet</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          <h2 className="text-2xl md:text-3xl font-serif font-bold mb-4 md:mb-6">Your Posts</h2>
          {userPosts.length === 0 ? (
            <div className="text-center py-12 md:py-16 bg-card border border-card-border rounded-xl">
              <p className="text-muted-foreground font-sans mb-4">No posts yet</p>
              <Button asChild>
                <Link href="/blog/create">Create your first post</Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-3 md:space-y-4">
              {userPosts.map((post, index) => (
                <div key={post.id} className="bg-card border border-card-border rounded-xl p-4 md:p-6 hover-elevate transition-all" data-testid={`dashboard-post-${index}`}>
                  <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-3 mb-3">
                    <div className="flex-1">
                      <Link href={`/blog/${post.id}`}>
                        <h3 className="text-lg md:text-xl font-serif font-bold hover:text-primary transition-colors">{post.title}</h3>
                      </Link>
                      <p className="text-xs md:text-sm text-muted-foreground mt-1 line-clamp-2">{post.excerpt}</p>
                      {post.category && (
                        <Badge variant="outline" className="mt-2 text-xs">{post.category}</Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs px-2 py-1 rounded ${post.published ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                        {post.published ? 'Published' : 'Draft'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 md:gap-4 text-xs md:text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Star className="w-3 h-3 md:w-4 md:h-4" />
                        {post.stars}
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye className="w-3 h-3 md:w-4 md:h-4" />
                        {post.views || 0}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/blog/${post.id}/edit`}>Edit</Link>
                      </Button>
                      {user?.role === 'admin' && (
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={() => {
                            if (confirm('Are you sure you want to delete this post?')) {
                              deletePostMutation.mutate(post.id);
                            }
                          }}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}