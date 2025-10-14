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
import { useAuth } from '@/lib/auth-context';
import { PenSquare, LogOut, Star, Eye, Shield, Ban, UserX, Settings, Megaphone, Plus, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { BlogPost, SafeUser, SiteSettings, Announcement, InsertAnnouncement } from '@shared/schema';

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
    mutationFn: (data: { maintenanceMode: boolean; maintenanceMessage?: string }) => 
      apiRequest('POST', '/api/admin/settings', data),
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
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-background rounded-lg border border-border">
                        <div className="flex-1">
                          <p className="font-medium">Maintenance Mode</p>
                          <p className="text-sm text-muted-foreground">
                            {siteSettings?.maintenanceMode 
                              ? '🔒 Site is locked - Only admins can access'
                              : '🌐 Site is accessible to all users'
                            }
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
                        />
                      </div>
                      {siteSettings?.maintenanceMode && (
                        <div className="p-4 bg-background rounded-lg border border-border">
                          <label className="text-sm font-medium mb-2 block">Custom Maintenance Message</label>
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
                          />
                          <p className="text-xs text-muted-foreground mt-2">
                            This message will be shown to non-admin users when they try to access the site.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="bg-card border border-card-border rounded-xl p-4 md:p-6">
                    <h3 className="text-lg font-semibold mb-4">User Management</h3>
                    <div className="space-y-3">
                      {allUsers.map((u) => (
                        <div key={u.id} className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-4 bg-background rounded-lg border border-border hover:border-primary/20 transition-colors">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <p className="font-medium">{u.displayName || u.username}</p>
                              {u.id === user.id && <Badge variant="outline" className="text-xs">You</Badge>}
                            </div>
                            <p className="text-sm text-muted-foreground">@{u.username} • {u.email}</p>
                            <div className="flex gap-2 mt-2 flex-wrap">
                              <Badge 
                                variant={
                                  u.role === 'admin' ? 'default' : 
                                  u.role === 'editor' ? 'secondary' : 
                                  u.role === 'author' ? 'outline' :
                                  'outline'
                                }
                              >
                                {u.role === 'admin' ? '👑 Admin' : 
                                 u.role === 'editor' ? '✏️ Editor' : 
                                 u.role === 'author' ? '📝 Author' :
                                 '👤 Reader'}
                              </Badge>
                              {u.isBanned && <Badge variant="destructive">🚫 Banned</Badge>}
                              {u.isMuted && !u.isBanned && <Badge variant="secondary">🔇 Muted</Badge>}
                              {!u.canPost && !u.isBanned && <Badge variant="secondary">📝 Cannot Post</Badge>}
                              {u.canPost && !u.isBanned && <Badge variant="outline" className="bg-green-500/10 text-green-400 border-green-500/20">✓ Can Post</Badge>}
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            <Select
                              value={u.role}
                              onValueChange={(role) => updateRoleMutation.mutate({ userId: u.id, role })}
                              disabled={u.id === user.id}
                            >
                              <SelectTrigger className="w-36">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="admin">👑 Admin</SelectItem>
                                <SelectItem value="editor">✏️ Editor</SelectItem>
                                <SelectItem value="author">📝 Author</SelectItem>
                                <SelectItem value="reader">👤 Reader</SelectItem>
                              </SelectContent>
                            </Select>
                            {u.id !== user.id && (
                              <>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => togglePostingMutation.mutate({ userId: u.id, canPost: !u.canPost })}
                                  disabled={u.isBanned}
                                >
                                  {u.canPost ? 'Disable Posts' : 'Enable Posts'}
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => muteMutation.mutate({ userId: u.id, isMuted: !u.isMuted })}
                                  disabled={u.isBanned}
                                >
                                  {u.isMuted ? 'Unmute' : 'Mute'}
                                </Button>
                                <Button
                                  size="sm"
                                  variant={u.isBanned ? 'default' : 'destructive'}
                                  onClick={() => banMutation.mutate({ userId: u.id, isBanned: !u.isBanned })}
                                >
                                  {u.isBanned ? 'Unban' : 'Ban'}
                                </Button>
                              </>
                            )}
                          </div>
                        </div>
                      ))}
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
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/blog/${post.id}/edit`}>Edit</Link>
                    </Button>
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
