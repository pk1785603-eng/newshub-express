import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Radio, X, ExternalLink } from 'lucide-react';
import { liveApi, LiveSettings } from '@/services/api';

export default function LiveBanner() {
  const [settings, setSettings] = useState<LiveSettings | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const fetchLiveStatus = async () => {
      try {
        const data = await liveApi.getSettings();
        setSettings(data);
      } catch {
        // Check localStorage for demo mode
        const stored = localStorage.getItem('live_settings');
        if (stored) {
          setSettings(JSON.parse(stored));
        }
      }
    };

    fetchLiveStatus();
    // Poll every 30 seconds
    const interval = setInterval(fetchLiveStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  if (!settings?.is_live || dismissed) {
    return null;
  }

  return (
    <div className="bg-gradient-to-r from-red-600 to-red-500 text-white py-2.5 px-4 relative animate-pulse">
      <div className="container flex items-center justify-center gap-3 text-sm md:text-base">
        <Radio className="h-5 w-5 animate-pulse" />
        <span className="font-semibold">{settings.live_title || 'LIVE NOW!'}</span>
        <Link 
          to="/live-stream"
          className="underline hover:no-underline font-medium flex items-center gap-1"
        >
          Watch Now
        </Link>
        <span className="hidden sm:inline">|</span>
        <a
          href={`https://youtube.com/watch?v=${settings.live_video_id}`}
          target="_blank"
          rel="noopener noreferrer"
          className="hidden sm:flex items-center gap-1 hover:underline"
        >
          <ExternalLink className="h-4 w-4" />
          YouTube
        </a>
        <button
          onClick={() => setDismissed(true)}
          className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-white/20 rounded"
          aria-label="Dismiss"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
