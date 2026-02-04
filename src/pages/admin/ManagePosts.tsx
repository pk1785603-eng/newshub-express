import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, Search, Eye, EyeOff } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import AdminLayout from '@/components/admin/AdminLayout';
import { postsApi, Post } from '@/services/api';
import { newsPosts } from '@/data/newsData';

export default function ManagePosts() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteId, setDeleteId] = useState<number | null>(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const data = await postsApi.getAll({ limit: 100 });
      setPosts(data);
    } catch {
      // Use demo data if API fails
      setPosts(newsPosts.map((item, index) => ({
        id: index + 1,
        title: item.title,
        slug: item.slug,
        excerpt: item.excerpt,
        content: item.content,
        featured_image: item.featuredImage,
        category_id: 1,
        category_name: item.category,
        category_slug: item.categorySlug,
        category_color: '#DC2626',
        author_id: 1,
        author_name: item.author.name,
        author_avatar: item.author.avatar,
        tags: item.tags,
        keywords: [],
        youtube_id: item.youtubeId,
        is_featured: item.featured,
        is_published: true,
        views: item.views,
        publish_date: item.publishDate,
        created_at: item.publishDate,
        updated_at: item.publishDate,
      })));
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await postsApi.delete(deleteId);
      setPosts(posts.filter(p => p.id !== deleteId));
    } catch {
      // Demo mode - just remove from state
      setPosts(posts.filter(p => p.id !== deleteId));
    }
    setDeleteId(null);
  };

  const filteredPosts = posts.filter(post =>
    post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.category_name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold">Manage Posts</h2>
            <p className="text-muted-foreground">Create, edit, and manage your news articles.</p>
          </div>
          <Link to="/admin/posts/new">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add New Post
            </Button>
          </Link>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search posts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Posts Table */}
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">Image</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Views</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <TableRow key={i}>
                    <TableCell colSpan={7}>
                      <div className="h-12 bg-muted animate-pulse rounded" />
                    </TableCell>
                  </TableRow>
                ))
              ) : filteredPosts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    No posts found. Create your first post!
                  </TableCell>
                </TableRow>
              ) : (
                filteredPosts.map((post) => (
                  <TableRow key={post.id}>
                    <TableCell>
                      <img
                        src={post.featured_image || '/placeholder.svg'}
                        alt={post.title}
                        className="w-12 h-8 object-cover rounded"
                      />
                    </TableCell>
                    <TableCell>
                      <div className="max-w-[300px]">
                        <p className="font-medium truncate">{post.title}</p>
                        <p className="text-xs text-muted-foreground">/{post.slug}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant="outline"
                        style={{ borderColor: post.category_color, color: post.category_color }}
                      >
                        {post.category_name}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {post.is_published ? (
                        <Badge className="bg-green-500/10 text-green-600 hover:bg-green-500/20">
                          <Eye className="h-3 w-3 mr-1" />
                          Published
                        </Badge>
                      ) : (
                        <Badge variant="secondary">
                          <EyeOff className="h-3 w-3 mr-1" />
                          Draft
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>{post.views.toLocaleString()}</TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {new Date(post.publish_date).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link to={`/admin/posts/edit/${post.id}`}>
                          <Button variant="ghost" size="icon">
                            <Pencil className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:text-destructive"
                          onClick={() => setDeleteId(post.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Delete Dialog */}
        <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Post</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this post? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </AdminLayout>
  );
}
