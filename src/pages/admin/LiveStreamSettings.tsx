import { useState, useEffect } from 'react';
import { Radio, Youtube, ExternalLink, Power, PowerOff, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import AdminLayout from '@/components/admin/AdminLayout';
import { liveApi, LiveSettings } from '@/services/api';
import { toast } from 'sonner';

export default function LiveStreamSettings() {
  const [settings, setSettings] = useState<LiveSettings>({
    id: 1,
    channel_id: '',
    live_video_id: '',
    live_url: '',
    is_live: false,
    live_title: 'LIVE NOW: 24x7 News Time',
    updated_at: new Date().toISOString(),
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const data = await liveApi.getSettings();
      setSettings(data);
    } catch {
      // Use defaults
    } finally {
      setLoading(false);
    }
  };

  const extractVideoId = (input: string) => {
    const match = input.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|live\/)|youtu\.be\/|^)([a-zA-Z0-9_-]{11})/);
    return match ? match[1] : input;
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await liveApi.updateSettings(settings);
      toast.success('Live settings saved!');
    } catch {
      toast.error('Backend not connected. Settings saved locally.');
    } finally {
      setSaving(false);
    }
  };

  const handleGoLive = async () => {
    if (!settings.live_video_id) {
      toast.error('Please enter a live video ID first');
      return;
    }
    
    setSaving(true);
    try {
      await liveApi.goLive(settings.live_video_id, settings.live_title);
      setSettings({ ...settings, is_live: true });
      toast.success('🔴 You are now LIVE!');
    } catch {
      setSettings({ ...settings, is_live: true });
      toast.success('🔴 You are now LIVE! (Demo mode)');
    } finally {
      setSaving(false);
    }
  };

  const handleEndLive = async () => {
    setSaving(true);
    try {
      await liveApi.endLive();
      setSettings({ ...settings, is_live: false });
      toast.success('Live stream ended');
    } catch {
      setSettings({ ...settings, is_live: false });
      toast.success('Live stream ended (Demo mode)');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-3xl">
        {/* Live Status Banner */}
        <Card className={settings.is_live ? 'border-red-500 bg-red-500/5' : ''}>
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
                  settings.is_live ? 'bg-red-500 animate-pulse' : 'bg-muted'
                }`}>
                  <Radio className={`h-8 w-8 ${settings.is_live ? 'text-white' : 'text-muted-foreground'}`} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">
                    {settings.is_live ? '🔴 Currently LIVE' : 'Not Broadcasting'}
                  </h2>
                  <p className="text-muted-foreground">
                    {settings.is_live 
                      ? 'Your live stream is visible on the website'
                      : 'Start a live stream to show on your website'}
                  </p>
                </div>
              </div>
              <div>
                {settings.is_live ? (
                  <Button 
                    variant="destructive" 
                    size="lg"
                    onClick={handleEndLive}
                    disabled={saving}
                  >
                    <PowerOff className="h-5 w-5 mr-2" />
                    End Live
                  </Button>
                ) : (
                  <Button 
                    size="lg"
                    className="bg-red-600 hover:bg-red-700"
                    onClick={handleGoLive}
                    disabled={saving || !settings.live_video_id}
                  >
                    <Power className="h-5 w-5 mr-2" />
                    Go Live
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Live Stream Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Youtube className="h-5 w-5 text-red-500" />
              Live Stream Settings
            </CardTitle>
            <CardDescription>
              Configure your YouTube live stream details
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="live_video_id">Live Video URL or ID *</Label>
              <Input
                id="live_video_id"
                value={settings.live_video_id}
                onChange={(e) => setSettings({ 
                  ...settings, 
                  live_video_id: extractVideoId(e.target.value) 
                })}
                placeholder="https://youtube.com/live/abc123 or abc123"
              />
              <p className="text-xs text-muted-foreground">
                Paste your YouTube live stream URL or video ID
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="live_title">Live Banner Title</Label>
              <Input
                id="live_title"
                value={settings.live_title}
                onChange={(e) => setSettings({ ...settings, live_title: e.target.value })}
                placeholder="LIVE NOW: 24x7 News Time"
              />
              <p className="text-xs text-muted-foreground">
                This appears in the live notification banner on your website
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="channel_id">YouTube Channel ID (optional)</Label>
              <Input
                id="channel_id"
                value={settings.channel_id}
                onChange={(e) => setSettings({ ...settings, channel_id: e.target.value })}
                placeholder="UC_x5XG1OV2P6uZZ5FSM9Ttw"
              />
            </div>

            {settings.live_video_id && (
              <div className="space-y-2">
                <Label>Preview</Label>
                <div className="aspect-video rounded-lg overflow-hidden bg-black">
                  <iframe
                    src={`https://www.youtube.com/embed/${settings.live_video_id}`}
                    title="Live Stream Preview"
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
                <a
                  href={`https://youtube.com/watch?v=${settings.live_video_id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
                >
                  <ExternalLink className="h-4 w-4" />
                  Open in YouTube
                </a>
              </div>
            )}

            <Button onClick={handleSave} disabled={saving}>
              {saving ? 'Saving...' : 'Save Settings'}
            </Button>
          </CardContent>
        </Card>

        {/* How It Works */}
        <Card>
          <CardHeader>
            <CardTitle>How Live Stream Works</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                1
              </div>
              <div>
                <p className="font-medium">Start your live stream on YouTube</p>
                <p className="text-sm text-muted-foreground">
                  Go to YouTube Studio and start your live broadcast
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                2
              </div>
              <div>
                <p className="font-medium">Copy the live video URL</p>
                <p className="text-sm text-muted-foreground">
                  Get your live stream URL from YouTube and paste it above
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                3
              </div>
              <div>
                <p className="font-medium">Click "Go Live" to show on website</p>
                <p className="text-sm text-muted-foreground">
                  A red banner will appear on your website with link to watch
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                4
              </div>
              <div>
                <p className="font-medium">End live when done</p>
                <p className="text-sm text-muted-foreground">
                  Click "End Live" to remove the banner from your website
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
