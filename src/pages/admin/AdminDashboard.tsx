import { useState, useEffect } from 'react';
import { FileText, Eye, FolderOpen, Youtube, TrendingUp, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AdminLayout from '@/components/admin/AdminLayout';
import { postsApi } from '@/services/api';

interface Stats {
  totalPosts: number;
  totalViews: number;
  totalCategories: number;
  totalVideos: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    totalPosts: 0,
    totalViews: 0,
    totalCategories: 0,
    totalVideos: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await postsApi.getStats();
        setStats(data);
      } catch (err) {
        setError('Failed to load stats. Make sure your backend is running.');
        // Use fallback data for demo
        setStats({
          totalPosts: 25,
          totalViews: 12500,
          totalCategories: 9,
          totalVideos: 8,
        });
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const statCards = [
    { title: 'Total Posts', value: stats.totalPosts, icon: FileText, color: 'text-blue-500', link: '/admin/posts' },
    { title: 'Total Views', value: stats.totalViews.toLocaleString(), icon: Eye, color: 'text-green-500', link: '/admin/posts' },
    { title: 'Categories', value: stats.totalCategories, icon: FolderOpen, color: 'text-yellow-500', link: '/admin/categories' },
    { title: 'YouTube Videos', value: stats.totalVideos, icon: Youtube, color: 'text-red-500', link: '/admin/youtube' },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Welcome */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold">Welcome back, Admin!</h2>
            <p className="text-muted-foreground">Here's what's happening with your news portal.</p>
          </div>
          <Link to="/admin/posts/new">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add New Post
            </Button>
          </Link>
        </div>

        {error && (
          <div className="p-4 bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 rounded-lg">
            ⚠️ {error}
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((stat) => (
            <Link key={stat.title} to={stat.link}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </CardTitle>
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">
                    {loading ? (
                      <div className="h-9 w-20 bg-muted animate-pulse rounded" />
                    ) : (
                      stat.value
                    )}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Link to="/admin/posts/new">
                <Button variant="outline" className="w-full justify-start">
                  <FileText className="h-4 w-4 mr-2" />
                  Add News Post
                </Button>
              </Link>
              <Link to="/admin/youtube">
                <Button variant="outline" className="w-full justify-start">
                  <Youtube className="h-4 w-4 mr-2" />
                  Add YouTube Video
                </Button>
              </Link>
              <Link to="/admin/categories">
                <Button variant="outline" className="w-full justify-start">
                  <FolderOpen className="h-4 w-4 mr-2" />
                  Manage Categories
                </Button>
              </Link>
              <Link to="/admin/live">
                <Button variant="outline" className="w-full justify-start text-red-500 border-red-200 hover:bg-red-50">
                  Go Live Now
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* API Status */}
        <Card>
          <CardHeader>
            <CardTitle>Backend API Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4 text-sm">
              <div className={`flex items-center gap-2 ${error ? 'text-yellow-600' : 'text-green-600'}`}>
                <div className={`h-2 w-2 rounded-full ${error ? 'bg-yellow-500' : 'bg-green-500'}`} />
                {error ? 'Demo Mode (Backend not connected)' : 'Connected'}
              </div>
              <span className="text-muted-foreground">|</span>
              <span className="text-muted-foreground">
                API URL: {import.meta.env.VITE_API_URL || 'https://api.yourdomain.com'}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
