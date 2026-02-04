import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, Eye, Image, Youtube, Tag, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AdminLayout from '@/components/admin/AdminLayout';
import { postsApi, categoriesApi, Category } from '@/services/api';
import { categories as defaultCategories } from '@/data/newsData';
import { toast } from 'sonner';

export default function PostEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;

  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [form, setForm] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    featured_image: '',
    category_id: 1,
    author_name: '24x7 News Desk',
    tags: '',
    keywords: '',
    youtube_id: '',
    is_featured: false,
    is_published: true,
    publish_date: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    fetchCategories();
    if (isEditing) {
      fetchPost();
    }
  }, [id]);

  const fetchCategories = async () => {
    try {
      const data = await categoriesApi.getAll();
      setCategories(data);
    } catch {
      // Use default categories
      setCategories(defaultCategories.map((c, i) => ({
        id: i + 1,
        name: c.name,
        slug: c.slug,
        description: c.description || '',
        icon: c.icon || 'Newspaper',
        color: '#DC2626',
        post_count: 0,
        created_at: new Date().toISOString(),
      })));
    }
  };

  const fetchPost = async () => {
    // Fetch post data for editing - placeholder for now
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const handleTitleChange = (title: string) => {
    setForm({
      ...form,
      title,
      slug: form.slug || generateSlug(title),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const postData = {
        ...form,
        slug: form.slug || generateSlug(form.title),
        tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
        keywords: form.keywords.split(',').map(k => k.trim()).filter(Boolean),
      };

      if (isEditing) {
        await postsApi.update(parseInt(id!), postData);
        toast.success('Post updated successfully!');
      } else {
        await postsApi.create(postData);
        toast.success('Post created successfully!');
      }
      navigate('/admin/posts');
    } catch (error) {
      toast.error('Failed to save post. Backend may not be connected.');
      // Navigate anyway for demo
      navigate('/admin/posts');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              type="button"
              variant="ghost"
              onClick={() => navigate('/admin/posts')}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <h2 className="text-2xl font-bold">
              {isEditing ? 'Edit Post' : 'Create New Post'}
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <Button type="button" variant="outline" disabled>
              <Eye className="h-4 w-4 mr-2" />
              Preview
            </Button>
            <Button type="submit" disabled={loading || !form.title}>
              <Save className="h-4 w-4 mr-2" />
              {loading ? 'Saving...' : 'Save Post'}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Post Content</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    placeholder="Enter post title..."
                    value={form.title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="slug">URL Slug</Label>
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground text-sm">/post/</span>
                    <Input
                      id="slug"
                      placeholder="auto-generated-from-title"
                      value={form.slug}
                      onChange={(e) => setForm({ ...form, slug: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="excerpt">Excerpt / Summary</Label>
                  <Textarea
                    id="excerpt"
                    placeholder="Brief description for previews (160 characters max)"
                    value={form.excerpt}
                    onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
                    rows={3}
                    maxLength={300}
                  />
                  <p className="text-xs text-muted-foreground">{form.excerpt.length}/300</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="content">Full Content (Markdown supported)</Label>
                  <Textarea
                    id="content"
                    placeholder="Write your article content here... You can use Markdown formatting."
                    value={form.content}
                    onChange={(e) => setForm({ ...form, content: e.target.value })}
                    rows={15}
                    className="font-mono text-sm"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Media */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Image className="h-5 w-5" />
                  Media
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="featured_image">Featured Image URL</Label>
                  <Input
                    id="featured_image"
                    placeholder="https://example.com/image.jpg"
                    value={form.featured_image}
                    onChange={(e) => setForm({ ...form, featured_image: e.target.value })}
                  />
                  {form.featured_image && (
                    <img
                      src={form.featured_image}
                      alt="Preview"
                      className="w-full max-w-md h-48 object-cover rounded-lg mt-2"
                      onError={(e) => (e.currentTarget.style.display = 'none')}
                    />
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="youtube_id" className="flex items-center gap-2">
                    <Youtube className="h-4 w-4 text-red-500" />
                    YouTube Video ID (optional)
                  </Label>
                  <Input
                    id="youtube_id"
                    placeholder="dQw4w9WgXcQ"
                    value={form.youtube_id}
                    onChange={(e) => setForm({ ...form, youtube_id: e.target.value })}
                  />
                  <p className="text-xs text-muted-foreground">
                    Enter only the video ID from the YouTube URL
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Publish Settings */}
            <Card>
              <CardHeader>
                <CardTitle>Publish Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="is_published">Published</Label>
                  <Switch
                    id="is_published"
                    checked={form.is_published}
                    onCheckedChange={(checked) => setForm({ ...form, is_published: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="is_featured">Featured Post</Label>
                  <Switch
                    id="is_featured"
                    checked={form.is_featured}
                    onCheckedChange={(checked) => setForm({ ...form, is_featured: checked })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="publish_date" className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Publish Date
                  </Label>
                  <Input
                    id="publish_date"
                    type="date"
                    value={form.publish_date}
                    onChange={(e) => setForm({ ...form, publish_date: e.target.value })}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Category & Author */}
            <Card>
              <CardHeader>
                <CardTitle>Category & Author</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select
                    value={String(form.category_id)}
                    onValueChange={(value) => setForm({ ...form, category_id: parseInt(value) })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.id} value={String(cat.id)}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="author_name">Author Name</Label>
                  <Input
                    id="author_name"
                    value={form.author_name}
                    onChange={(e) => setForm({ ...form, author_name: e.target.value })}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Tags & Keywords */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Tag className="h-5 w-5" />
                  SEO & Tags
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="tags">Tags (comma separated)</Label>
                  <Input
                    id="tags"
                    placeholder="news, india, breaking"
                    value={form.tags}
                    onChange={(e) => setForm({ ...form, tags: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="keywords">SEO Keywords (comma separated)</Label>
                  <Input
                    id="keywords"
                    placeholder="breaking news, latest updates"
                    value={form.keywords}
                    onChange={(e) => setForm({ ...form, keywords: e.target.value })}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </AdminLayout>
  );
}
