import { useParams, useLocation } from 'wouter';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ParticleBackground } from '@/components/ParticleBackground';
import { FloatingNav } from '@/components/FloatingNav';
import { MobileNav } from '@/components/MobileNav';
import { BlogMobileNav } from '@/components/BlogMobileNav';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Image, Link2, SquareCode, FileCode, Code } from 'lucide-react';
import { useState } from 'react';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import type { BlogPost } from '@shared/schema';

const postSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  content: z.string().min(10, 'Content must be at least 10 characters'),
  excerpt: z.string().optional(),
  category: z.string().optional(),
  tags: z.string(),
  coverImage: z.string().optional(),
  published: z.boolean().default(true),
});

export default function BlogEdit() {
  const { id } = useParams();
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [imageUrl, setImageUrl] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const [linkText, setLinkText] = useState('');
  const [buttonUrl, setButtonUrl] = useState('');
  const [buttonText, setButtonText] = useState('');
  const [htmlCode, setHtmlCode] = useState('');
  const [mdCode, setMdCode] = useState('');
  const [codeBlockLang, setCodeBlockLang] = useState('javascript');
  const [codeBlockContent, setCodeBlockContent] = useState('');
  const [codeBlockPreview, setCodeBlockPreview] = useState(false);
  const [codeBlockTitle, setCodeBlockTitle] = useState('');

  const { data: post, isLoading } = useQuery<BlogPost>({
    queryKey: ['/api/blog/posts', id],
    enabled: !!id,
  });

  const form = useForm({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: '',
      content: '',
      excerpt: '',
      category: '',
      tags: '',
      coverImage: '',
      published: true,
    },
    values: post ? {
      title: post.title,
      content: post.content,
      excerpt: post.excerpt || '',
      category: post.category || '',
      tags: post.tags.join(', '),
      coverImage: post.coverImage || '',
      published: post.published,
    } : undefined,
  });

  const updateMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await apiRequest('PATCH', `/api/blog/posts/${id}`, {
        ...data,
        tags: data.tags.split(',').map((t: string) => t.trim()).filter(Boolean),
      });
      return res.json();
    },
    onSuccess: (updatedPost: any) => {
      queryClient.invalidateQueries({ queryKey: ['/api/blog/posts'] });
      queryClient.invalidateQueries({ queryKey: ['/api/blog/posts', id] });
      toast({ title: 'Post updated successfully!' });
      setLocation(`/blog/${updatedPost.slug || updatedPost.id || id}`);
    },
  });

  const insertImage = () => {
    if (imageUrl) {
      const currentContent = form.getValues('content');
      form.setValue('content', currentContent + `\n![Image](${imageUrl})\n`);
      setImageUrl('');
    }
  };

  const insertLink = () => {
    if (linkUrl && linkText) {
      const currentContent = form.getValues('content');
      form.setValue('content', currentContent + `[${linkText}](${linkUrl})`);
      setLinkUrl('');
      setLinkText('');
    }
  };

  const insertButton = () => {
    if (buttonUrl && buttonText) {
      const currentContent = form.getValues('content');
      form.setValue('content', currentContent + `\n<a href="${buttonUrl}" class="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">${buttonText}</a>\n`);
      setButtonUrl('');
      setButtonText('');
    }
  };

  const insertHtml = () => {
    if (htmlCode) {
      const currentContent = form.getValues('content');
      form.setValue('content', currentContent + `\n${htmlCode}\n`);
      setHtmlCode('');
    }
  };

  const insertMarkdown = () => {
    if (mdCode) {
      const currentContent = form.getValues('content');
      form.setValue('content', currentContent + `\n${mdCode}\n`);
      setMdCode('');
    }
  };

  const insertCodeBlock = () => {
    if (codeBlockContent) {
      const currentContent = form.getValues('content');
      let langString = codeBlockLang;
      if (codeBlockPreview) langString += ':preview';
      if (codeBlockTitle) langString += ` title=${codeBlockTitle}`;
      
      const codeBlock = `\n\`\`\`${langString}\n${codeBlockContent}\n\`\`\`\n`;
      form.setValue('content', currentContent + codeBlock);
      setCodeBlockContent('');
      setCodeBlockLang('javascript');
      setCodeBlockPreview(false);
      setCodeBlockTitle('');
    }
  };

  if (isLoading) {
    return (
      <div className="relative min-h-screen bg-background text-foreground">
        <ParticleBackground />
        <FloatingNav />
        <MobileNav />
        <div className="container mx-auto px-4 md:px-6 py-32">
          <div className="max-w-4xl mx-auto">
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="relative min-h-screen bg-background text-foreground">
        <ParticleBackground />
        <FloatingNav />
        <MobileNav />
        <div className="container mx-auto px-4 md:px-6 py-32">
          <div className="max-w-4xl mx-auto">
            <p className="text-muted-foreground">Post not found</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-background text-foreground pb-20 md:pb-0">
      <ParticleBackground />
      <FloatingNav />
      <MobileNav />

      <div className="container mx-auto px-4 md:px-6 py-20 md:py-32 pb-24 md:pb-32">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-5xl font-serif font-bold mb-8">Edit Post</h1>

          <Form {...form}>
            <form onSubmit={form.handleSubmit((data) => updateMutation.mutate(data))} className="space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input {...field} data-testid="input-title" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="excerpt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Excerpt (Optional)</FormLabel>
                    <FormControl>
                      <Input {...field} data-testid="input-excerpt" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category (Optional)</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Tutorial, Review, Opinion" data-testid="input-category" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="coverImage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cover Image URL (Optional)</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="https://example.com/image.jpg" data-testid="input-cover-image" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Content</FormLabel>
                    
                    {/* Content Tools Toolbar */}
                    <div className="flex flex-wrap gap-2 mb-2 p-2 bg-card border border-card-border rounded-lg">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button type="button" variant="outline" size="sm">
                            <Image className="w-4 h-4 mr-1" />
                            Image
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Insert Image</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <Input
                              placeholder="Image URL"
                              value={imageUrl}
                              onChange={(e) => setImageUrl(e.target.value)}
                            />
                            <Button onClick={insertImage} className="w-full">Insert</Button>
                          </div>
                        </DialogContent>
                      </Dialog>

                      <Dialog>
                        <DialogTrigger asChild>
                          <Button type="button" variant="outline" size="sm">
                            <Link2 className="w-4 h-4 mr-1" />
                            Link
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Insert Link</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <Input
                              placeholder="Link text"
                              value={linkText}
                              onChange={(e) => setLinkText(e.target.value)}
                            />
                            <Input
                              placeholder="URL"
                              value={linkUrl}
                              onChange={(e) => setLinkUrl(e.target.value)}
                            />
                            <Button onClick={insertLink} className="w-full">Insert</Button>
                          </div>
                        </DialogContent>
                      </Dialog>

                      <Dialog>
                        <DialogTrigger asChild>
                          <Button type="button" variant="outline" size="sm">
                            <SquareCode className="w-4 h-4 mr-1" />
                            Button
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Insert Button</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <Input
                              placeholder="Button text"
                              value={buttonText}
                              onChange={(e) => setButtonText(e.target.value)}
                            />
                            <Input
                              placeholder="Button URL"
                              value={buttonUrl}
                              onChange={(e) => setButtonUrl(e.target.value)}
                            />
                            <Button onClick={insertButton} className="w-full">Insert</Button>
                          </div>
                        </DialogContent>
                      </Dialog>

                      <Dialog>
                        <DialogTrigger asChild>
                          <Button type="button" variant="outline" size="sm">
                            <FileCode className="w-4 h-4 mr-1" />
                            HTML
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Insert HTML</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <Textarea
                              placeholder="Paste your HTML code here"
                              value={htmlCode}
                              onChange={(e) => setHtmlCode(e.target.value)}
                              rows={6}
                              className="font-mono text-sm"
                            />
                            <Button onClick={insertHtml} className="w-full">Insert</Button>
                          </div>
                        </DialogContent>
                      </Dialog>

                      <Dialog>
                        <DialogTrigger asChild>
                          <Button type="button" variant="outline" size="sm">
                            <Code className="w-4 h-4 mr-1" />
                            Markdown
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Insert Markdown</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <Textarea
                              placeholder="Paste your Markdown code here"
                              value={mdCode}
                              onChange={(e) => setMdCode(e.target.value)}
                              rows={6}
                              className="font-mono text-sm"
                            />
                            <Button onClick={insertMarkdown} className="w-full">Insert</Button>
                          </div>
                        </DialogContent>
                      </Dialog>

                      <Dialog>
                        <DialogTrigger asChild>
                          <Button type="button" variant="outline" size="sm">
                            <SquareCode className="w-4 h-4 mr-1" />
                            Code Block
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Insert Code Block</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="text-sm font-medium">Language</label>
                                <Input
                                  placeholder="javascript, python, html, etc."
                                  value={codeBlockLang}
                                  onChange={(e) => setCodeBlockLang(e.target.value)}
                                />
                              </div>
                              <div>
                                <label className="text-sm font-medium">Title (optional)</label>
                                <Input
                                  placeholder="e.g., example.js"
                                  value={codeBlockTitle}
                                  onChange={(e) => setCodeBlockTitle(e.target.value)}
                                />
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              <Switch
                                checked={codeBlockPreview}
                                onCheckedChange={setCodeBlockPreview}
                              />
                              <label className="text-sm font-medium">Enable preview/run option</label>
                            </div>

                            <Textarea
                              placeholder="Paste your code here..."
                              value={codeBlockContent}
                              onChange={(e) => setCodeBlockContent(e.target.value)}
                              rows={12}
                              className="font-mono text-sm"
                            />
                            <Button onClick={insertCodeBlock} className="w-full">Insert Code Block</Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>

                    <FormControl>
                      <Textarea {...field} rows={15} data-testid="textarea-content" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="tags"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tags</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="JavaScript, React, TypeScript" data-testid="input-tags" />
                    </FormControl>
                    <FormDescription>Comma-separated tags</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="published"
                render={({ field }) => (
                  <FormItem className="flex items-center gap-4">
                    <FormLabel>Published</FormLabel>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} data-testid="switch-published" />
                    </FormControl>
                  </FormItem>
                )}
              />

              <div className="flex gap-4">
                <Button type="submit" disabled={updateMutation.isPending} data-testid="button-submit">
                  {updateMutation.isPending ? 'Updating...' : 'Update Post'}
                </Button>
                <Button type="button" variant="outline" onClick={() => setLocation(`/blog/${id}`)} data-testid="button-cancel">
                  Cancel
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}