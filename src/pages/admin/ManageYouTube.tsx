import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, ExternalLink, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
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
import { youtubeApi, YouTubeVideo } from '@/services/api';
import { youtubeVideos as defaultVideos } from '@/data/newsData';
import { toast } from 'sonner';

export default function ManageYouTube() {
  const [videos, setVideos] = useState<YouTubeVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [editDialog, setEditDialog] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [form, setForm] = useState<Partial<YouTubeVideo>>({
    video_id: '',
    title: '',
    description: '',
    category: 'general',
  });
  const [editingId, setEditingId] = useState<number | null>(null);

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      const data = await youtubeApi.getAll({ limit: 50 });
      setVideos(data);
    } catch {
      // Use default videos
      setVideos(defaultVideos.map((v, i) => ({
        id: i + 1,
        video_id: v.id,
        title: v.title,
        description: '',
        thumbnail: `https://img.youtube.com/vi/${v.id}/maxresdefault.jpg`,
        category: 'general',
        views: v.views,
        is_live: false,
        display_order: i,
        created_at: v.date,
      })));
    } finally {
      setLoading(false);
    }
  };

  const openCreateDialog = () => {
    setEditingId(null);
    setForm({
      video_id: '',
      title: '',
      description: '',
      category: 'general',
    });
    setEditDialog(true);
  };

  const openEditDialog = (video: YouTubeVideo) => {
    setEditingId(video.id);
    setForm({
      video_id: video.video_id,
      title: video.title,
      description: video.description,
      category: video.category,
    });
    setEditDialog(true);
  };

  const extractVideoId = (input: string) => {
    // Handle full URLs or just IDs
    const match = input.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/|^)([a-zA-Z0-9_-]{11})/);
    return match ? match[1] : input;
  };

  const handleSave = async () => {
    const videoId = extractVideoId(form.video_id || '');
    
    try {
      if (editingId) {
        await youtubeApi.update(editingId, { ...form, video_id: videoId });
        setVideos(videos.map(v => 
          v.id === editingId ? { 
            ...v, 
            ...form, 
            video_id: videoId,
            thumbnail: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
          } as YouTubeVideo : v
        ));
        toast.success('Video updated!');
      } else {
        const newVideo: YouTubeVideo = {
          id: Date.now(),
          video_id: videoId,
          title: form.title!,
          description: form.description || '',
          thumbnail: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
          category: form.category || 'general',
          views: '0',
          is_live: false,
          display_order: videos.length,
          created_at: new Date().toISOString(),
        };
        await youtubeApi.create({ ...form, video_id: videoId });
        setVideos([...videos, newVideo]);
        toast.success('Video added!');
      }
    } catch {
      toast.error('Backend not connected. Changes saved locally.');
      if (!editingId) {
        setVideos([...videos, {
          id: Date.now(),
          video_id: videoId,
          title: form.title!,
          description: form.description || '',
          thumbnail: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
          category: form.category || 'general',
          views: '0',
          is_live: false,
          display_order: videos.length,
          created_at: new Date().toISOString(),
        }]);
      }
    }
    setEditDialog(false);
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await youtubeApi.delete(deleteId);
    } catch {
      // Demo mode
    }
    setVideos(videos.filter(v => v.id !== deleteId));
    setDeleteId(null);
    toast.success('Video deleted!');
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold">YouTube Videos</h2>
            <p className="text-muted-foreground">Manage videos shown on your website.</p>
          </div>
          <Button onClick={openCreateDialog}>
            <Plus className="h-4 w-4 mr-2" />
            Add Video
          </Button>
        </div>

        {/* Videos Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {loading ? (
            [...Array(6)].map((_, i) => (
              <div key={i} className="aspect-video bg-muted animate-pulse rounded-xl" />
            ))
          ) : videos.length === 0 ? (
            <div className="col-span-full text-center py-12 text-muted-foreground">
              No videos added yet. Click "Add Video" to get started.
            </div>
          ) : (
            videos.map((video) => (
              <div
                key={video.id}
                className="group bg-card rounded-xl overflow-hidden border border-border"
              >
                <div className="relative aspect-video">
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <a
                      href={`https://youtube.com/watch?v=${video.video_id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 bg-white/20 rounded-full hover:bg-white/30"
                    >
                      <Play className="h-5 w-5 text-white" />
                    </a>
                    <a
                      href={`https://youtube.com/watch?v=${video.video_id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 bg-white/20 rounded-full hover:bg-white/30"
                    >
                      <ExternalLink className="h-5 w-5 text-white" />
                    </a>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold line-clamp-2">{video.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {video.views} views
                  </p>
                  <div className="flex items-center gap-2 mt-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openEditDialog(video)}
                    >
                      <Pencil className="h-3 w-3 mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-destructive"
                      onClick={() => setDeleteId(video.id)}
                    >
                      <Trash2 className="h-3 w-3 mr-1" />
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Edit/Create Dialog */}
        <Dialog open={editDialog} onOpenChange={setEditDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingId ? 'Edit Video' : 'Add YouTube Video'}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>YouTube Video URL or ID *</Label>
                <Input
                  value={form.video_id}
                  onChange={(e) => setForm({ ...form, video_id: e.target.value })}
                  placeholder="https://youtube.com/watch?v=dQw4w9WgXcQ or dQw4w9WgXcQ"
                />
                <p className="text-xs text-muted-foreground">
                  Paste the full URL or just the video ID
                </p>
              </div>
              <div className="space-y-2">
                <Label>Title *</Label>
                <Input
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="Video title"
                />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Input
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Brief description"
                />
              </div>
              {form.video_id && (
                <div className="aspect-video rounded-lg overflow-hidden">
                  <img
                    src={`https://img.youtube.com/vi/${extractVideoId(form.video_id)}/maxresdefault.jpg`}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setEditDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={!form.video_id || !form.title}>
                {editingId ? 'Update' : 'Add Video'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Dialog */}
        <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Video</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to remove this video?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete} className="bg-destructive">
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </AdminLayout>
  );
}
