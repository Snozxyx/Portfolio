
import { useLocation } from 'wouter';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ParticleBackground } from '@/components/ParticleBackground';
import { FloatingNav } from '@/components/FloatingNav';
import { MobileNav } from '@/components/MobileNav';
import { BlogMobileNav } from '@/components/BlogMobileNav';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Label } from '@/components/ui/label';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { Eye, Code, Save, Send, Image, Link2, SquareCode, FileCode } from 'lucide-react';
import { useState, useMemo } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { marked } from 'marked';
import DOMPurify from 'dompurify';

const postSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  content: z.string().min(10, 'Content must be at least 10 characters'),
  excerpt: z.string().optional(),
  category: z.string().optional(),
  tags: z.string(),
  coverImage: z.string().optional(),
  published: z.boolean().default(true),
});

export default function BlogCreate() {
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [previewMode, setPreviewMode] = useState<'edit' | 'preview'>('edit');
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
  });

  const createMutation = useMutation({
    mutationFn: (data: any) => apiRequest('POST', '/api/blog/posts', {
      ...data,
      tags: data.tags.split(',').map((t: string) => t.trim()).filter(Boolean),
    }),
    onSuccess: (post: any) => {
      queryClient.invalidateQueries({ queryKey: ['/api/blog/posts'] });
      toast({ title: 'Post created successfully!' });
      setLocation(`/blog/${post.slug || post.id}`);
    },
  });

  const saveDraftMutation = useMutation({
    mutationFn: (data: any) => apiRequest('POST', '/api/blog/posts', {
      ...data,
      tags: data.tags.split(',').map((t: string) => t.trim()).filter(Boolean),
      published: false,
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/blog/posts'] });
      toast({ title: 'Draft saved successfully!' });
      setLocation('/dashboard');
    },
  });

  const watchedContent = form.watch('content');
  const watchedTitle = form.watch('title');
  const watchedExcerpt = form.watch('excerpt');
  const watchedCoverImage = form.watch('coverImage');
  const watchedCategory = form.watch('category');
  const watchedTags = form.watch('tags');

  const wordCount = watchedContent.split(/\s+/).filter(Boolean).length;
  const readTime = Math.ceil(wordCount / 200);

  // Parse markdown content to HTML for preview
  const htmlContent = useMemo(() => {
    if (!watchedContent) return '';
    const rawHtml = marked.parse(watchedContent) as string;
    return DOMPurify.sanitize(rawHtml);
  }, [watchedContent]);

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

  return (
    <div className="relative min-h-screen bg-background text-foreground pb-20 md:pb-0">
      <ParticleBackground />
      <div className="hidden md:block">
        <FloatingNav />
      </div>
      <div className="md:hidden">
        <BlogMobileNav />
      </div>

      <div className="container mx-auto px-4 md:px-6 py-20 md:py-32 pb-24 md:pb-32">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div>
              <h1 className="text-3xl md:text-5xl font-serif font-bold mb-2">Create New Post</h1>
              <p className="text-muted-foreground font-sans">
                {wordCount} words · {readTime} min read
              </p>
            </div>
            <div className="flex gap-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => saveDraftMutation.mutate(form.getValues())}
                disabled={saveDraftMutation.isPending}
              >
                <Save className="w-4 h-4 mr-2" />
                Save Draft
              </Button>
            </div>
          </div>

          <Tabs value={previewMode} onValueChange={(v) => setPreviewMode(v as any)} className="mb-6">
            <TabsList className="grid w-full md:w-[400px] grid-cols-2">
              <TabsTrigger value="edit" className="gap-2">
                <Code className="w-4 h-4" />
                Edit
              </TabsTrigger>
              <TabsTrigger value="preview" className="gap-2">
                <Eye className="w-4 h-4" />
                Preview
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              {previewMode === 'edit' ? (
                <Form {...form}>
                  <form onSubmit={form.handleSubmit((data) => createMutation.mutate(data))} className="space-y-6">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Title</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Enter an engaging title" className="text-2xl font-serif" data-testid="input-title" />
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
                          <FormLabel>Excerpt</FormLabel>
                          <FormControl>
                            <Textarea {...field} rows={3} placeholder="A brief summary of your post" data-testid="input-excerpt" />
                          </FormControl>
                          <FormDescription>This will be shown in post previews</FormDescription>
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
                                      <Label>Language</Label>
                                      <Input
                                        placeholder="javascript, python, html, etc."
                                        value={codeBlockLang}
                                        onChange={(e) => setCodeBlockLang(e.target.value)}
                                      />
                                    </div>
                                    <div>
                                      <Label>Title (optional)</Label>
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
                                    <Label>Enable preview/run option</Label>
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
                            <Textarea 
                              {...field} 
                              rows={20} 
                              placeholder="Write your content here... (Markdown supported)" 
                              className="font-mono text-sm"
                              data-testid="textarea-content" 
                            />
                          </FormControl>
                          <FormDescription>Use markdown for formatting or insert HTML/buttons using the tools above</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="flex gap-4">
                      <Button type="submit" disabled={createMutation.isPending} data-testid="button-submit">
                        <Send className="w-4 h-4 mr-2" />
                        {createMutation.isPending ? 'Publishing...' : 'Publish Post'}
                      </Button>
                      <Button type="button" variant="outline" onClick={() => setLocation('/blog')} data-testid="button-cancel">
                        Cancel
                      </Button>
                    </div>
                  </form>
                </Form>
              ) : (
                <div className="bg-card border border-card-border rounded-xl p-8">
                  {watchedCoverImage && (
                    <img 
                      src={watchedCoverImage} 
                      alt="Cover" 
                      className="w-full h-64 object-cover rounded-lg mb-6"
                    />
                  )}
                  <h1 className="text-4xl font-serif font-bold mb-4">{watchedTitle || 'Untitled Post'}</h1>
                  {watchedExcerpt && (
                    <p className="text-lg text-muted-foreground font-sans mb-6 italic">{watchedExcerpt}</p>
                  )}
                  <div className="prose prose-invert max-w-none">
                    {watchedContent ? (
                      <div className="font-sans" dangerouslySetInnerHTML={{ __html: htmlContent }} />
                    ) : (
                      <div className="text-muted-foreground">No content yet...</div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-6">
              <div className="bg-card border border-card-border rounded-xl p-6 sticky top-24">
                <h3 className="font-serif font-bold mb-4">Post Settings</h3>
                
                <Form {...form}>
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="category"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Category</FormLabel>
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
                          <FormLabel>Cover Image URL</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="https://example.com/image.jpg" data-testid="input-cover-image" />
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
                          <FormDescription>Comma-separated</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="published"
                      render={({ field }) => (
                        <FormItem className="flex items-center justify-between">
                          <FormLabel>Publish immediately</FormLabel>
                          <FormControl>
                            <Switch checked={field.value} onCheckedChange={field.onChange} data-testid="switch-published" />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                </Form>

                <div className="mt-6 pt-6 border-t border-card-border">
                  <h4 className="text-sm font-semibold mb-3">Quick Tips</h4>
                  <ul className="text-xs text-muted-foreground space-y-2">
                    <li>• Use # for headings</li>
                    <li>• Use **bold** for emphasis</li>
                    <li>• Use `code` for inline code</li>
                    <li>• Add images with cover URL</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
