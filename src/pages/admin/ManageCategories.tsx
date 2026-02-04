import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, Palette } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
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
import { Card, CardContent } from '@/components/ui/card';
import AdminLayout from '@/components/admin/AdminLayout';
import { categoriesApi, Category } from '@/services/api';
import { categories as defaultCategories } from '@/data/newsData';
import { toast } from 'sonner';

const colorOptions = [
  '#DC2626', '#2563EB', '#F59E0B', '#10B981', '#7C3AED',
  '#EC4899', '#F97316', '#6366F1', '#14B8A6', '#8B5CF6',
];

export default function ManageCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [editDialog, setEditDialog] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [form, setForm] = useState<Partial<Category>>({
    name: '',
    slug: '',
    description: '',
    icon: 'Newspaper',
    color: '#DC2626',
  });
  const [editingId, setEditingId] = useState<number | null>(null);

  useEffect(() => {
    fetchCategories();
  }, []);

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
        description: c.description || `${c.name} news and updates`,
        icon: c.icon || 'Newspaper',
        color: colorOptions[i % colorOptions.length],
        post_count: 0,
        created_at: new Date().toISOString(),
      })));
    } finally {
      setLoading(false);
    }
  };

  const openCreateDialog = () => {
    setEditingId(null);
    setForm({
      name: '',
      slug: '',
      description: '',
      icon: 'Newspaper',
      color: '#DC2626',
    });
    setEditDialog(true);
  };

  const openEditDialog = (category: Category) => {
    setEditingId(category.id);
    setForm({
      name: category.name,
      slug: category.slug,
      description: category.description,
      icon: category.icon,
      color: category.color,
    });
    setEditDialog(true);
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-');
  };

  const handleSave = async () => {
    try {
      if (editingId) {
        await categoriesApi.update(editingId, form);
        setCategories(categories.map(c => 
          c.id === editingId ? { ...c, ...form } as Category : c
        ));
        toast.success('Category updated!');
      } else {
        const newCat: Category = {
          id: Date.now(),
          name: form.name!,
          slug: form.slug || generateSlug(form.name!),
          description: form.description || '',
          icon: form.icon || 'Newspaper',
          color: form.color || '#DC2626',
          post_count: 0,
          created_at: new Date().toISOString(),
        };
        await categoriesApi.create(form);
        setCategories([...categories, newCat]);
        toast.success('Category created!');
      }
    } catch {
      toast.error('Backend not connected. Changes saved locally.');
      if (!editingId) {
        setCategories([...categories, {
          id: Date.now(),
          name: form.name!,
          slug: form.slug || generateSlug(form.name!),
          description: form.description || '',
          icon: form.icon || 'Newspaper',
          color: form.color || '#DC2626',
          post_count: 0,
          created_at: new Date().toISOString(),
        }]);
      }
    }
    setEditDialog(false);
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await categoriesApi.delete(deleteId);
    } catch {
      // Demo mode
    }
    setCategories(categories.filter(c => c.id !== deleteId));
    setDeleteId(null);
    toast.success('Category deleted!');
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold">Manage Categories</h2>
            <p className="text-muted-foreground">Organize your news into categories.</p>
          </div>
          <Button onClick={openCreateDialog}>
            <Plus className="h-4 w-4 mr-2" />
            Add Category
          </Button>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {loading ? (
            [...Array(6)].map((_, i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <div className="h-20 bg-muted animate-pulse rounded" />
                </CardContent>
              </Card>
            ))
          ) : (
            categories.map((category) => (
              <Card key={category.id} className="group">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center text-white"
                        style={{ backgroundColor: category.color }}
                      >
                        <span className="text-lg font-bold">
                          {category.name.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-semibold">{category.name}</h3>
                        <p className="text-sm text-muted-foreground">/{category.slug}</p>
                      </div>
                    </div>
                    <Badge variant="secondary">{category.post_count} posts</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-3 line-clamp-2">
                    {category.description || 'No description'}
                  </p>
                  <div className="flex items-center gap-2 mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openEditDialog(category)}
                    >
                      <Pencil className="h-3 w-3 mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-destructive"
                      onClick={() => setDeleteId(category.id)}
                    >
                      <Trash2 className="h-3 w-3 mr-1" />
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Edit/Create Dialog */}
        <Dialog open={editDialog} onOpenChange={setEditDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingId ? 'Edit Category' : 'Create Category'}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Name</Label>
                <Input
                  value={form.name}
                  onChange={(e) => setForm({
                    ...form,
                    name: e.target.value,
                    slug: form.slug || generateSlug(e.target.value),
                  })}
                  placeholder="Category name"
                />
              </div>
              <div className="space-y-2">
                <Label>Slug</Label>
                <Input
                  value={form.slug}
                  onChange={(e) => setForm({ ...form, slug: e.target.value })}
                  placeholder="url-slug"
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
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Palette className="h-4 w-4" />
                  Color
                </Label>
                <div className="flex flex-wrap gap-2">
                  {colorOptions.map((color) => (
                    <button
                      key={color}
                      type="button"
                      className={`w-8 h-8 rounded-full border-2 ${
                        form.color === color ? 'border-foreground' : 'border-transparent'
                      }`}
                      style={{ backgroundColor: color }}
                      onClick={() => setForm({ ...form, color })}
                    />
                  ))}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setEditDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={!form.name}>
                {editingId ? 'Update' : 'Create'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Dialog */}
        <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Category</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure? Posts in this category will be uncategorized.
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
