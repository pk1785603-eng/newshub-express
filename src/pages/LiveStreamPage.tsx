import { useState, useEffect } from "react";
import { Radio, Calendar, Play, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { youtubeVideos } from "@/data/newsData";
import { liveApi, LiveSettings, youtubeApi, YouTubeVideo } from "@/services/api";

export default function LiveStreamPage() {
  const [liveSettings, setLiveSettings] = useState<LiveSettings | null>(null);
  const [videos, setVideos] = useState<YouTubeVideo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [live, vids] = await Promise.all([
          liveApi.getSettings(),
          youtubeApi.getAll({ limit: 6 })
        ]);
        setLiveSettings(live);
        setVideos(vids);
      } catch {
        // Use defaults
        setVideos(youtubeVideos.map((v, i) => ({
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
    fetchData();
  }, []);

  const isLive = liveSettings?.is_live;
  const liveVideoId = liveSettings?.live_video_id;

  return (
    <div className="min-h-screen">
      {/* Live Banner */}
      {isLive && (
        <div className="bg-gradient-to-r from-red-600 to-red-500 text-white py-3">
          <div className="container flex items-center justify-center gap-3">
            <Radio className="h-5 w-5 animate-pulse" />
            <span className="font-semibold">{liveSettings?.live_title || '🔴 LIVE NOW!'}</span>
            <a
              href={`https://youtube.com/watch?v=${liveVideoId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 underline hover:no-underline"
            >
              <ExternalLink className="h-4 w-4" />
              Watch on YouTube
            </a>
          </div>
        </div>
      )}

      {/* Main Video Player */}
      <section className="bg-foreground py-8">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Video Player */}
            <div className="lg:col-span-2">
              <div className="aspect-video bg-black rounded-xl overflow-hidden">
                {isLive && liveVideoId ? (
                  <iframe
                    src={`https://www.youtube.com/embed/${liveVideoId}?autoplay=1`}
                    title="24x7 News Time Live"
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : videos.length > 0 ? (
                  <iframe
                    src={`https://www.youtube.com/embed/${videos[0]?.video_id}`}
                    title="Latest Video"
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white/50">
                    No video available
                  </div>
                )}
              </div>
              <div className="mt-4">
                <h1 className="text-2xl font-bold text-white mb-2">
                  {isLive ? (
                    <span className="flex items-center gap-2">
                      <span className="px-2 py-1 bg-red-500 rounded text-sm">LIVE</span>
                      {liveSettings?.live_title || '24x7 News Time Live Stream'}
                    </span>
                  ) : (
                    videos[0]?.title || '24x7 News Time Videos'
                  )}
                </h1>
                <p className="text-white/70">
                  {isLive 
                    ? 'Watch live breaking news, political updates, and in-depth analysis.'
                    : 'Watch our latest news videos and previous live streams.'}
                </p>
              </div>
            </div>

            {/* Live Chat / Watch on YouTube */}
            <div className="bg-card rounded-xl p-4 h-[400px] lg:h-auto flex flex-col">
              <h3 className="font-bold mb-4">
                {isLive ? 'Live Chat' : 'Watch on YouTube'}
              </h3>
              <div className="flex-1 bg-muted rounded-lg flex flex-col items-center justify-center gap-4 p-4">
                {isLive ? (
                  <p className="text-muted-foreground text-sm text-center">
                    Join the conversation on YouTube
                  </p>
                ) : (
                  <p className="text-muted-foreground text-sm text-center">
                    Subscribe to our channel for live stream notifications
                  </p>
                )}
                <a
                  href={isLive 
                    ? `https://youtube.com/watch?v=${liveVideoId}` 
                    : 'https://youtube.com/@24x7newstime'}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button className="bg-red-600 hover:bg-red-700">
                    <Play className="h-4 w-4 mr-2" />
                    {isLive ? 'Join on YouTube' : 'Subscribe to Channel'}
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Schedule */}
      <section className="py-12">
        <div className="container">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
            <Calendar className="h-6 w-6 text-primary" />
            Upcoming Shows
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { time: "6:00 AM", title: "Morning Headlines", desc: "Start your day with top stories" },
              { time: "12:00 PM", title: "Afternoon Bulletin", desc: "Midday news roundup" },
              { time: "6:00 PM", title: "Prime Time News", desc: "Complete evening news coverage" },
              { time: "9:00 PM", title: "The Debate", desc: "Political analysis and debates" },
              { time: "10:00 PM", title: "Sports Tonight", desc: "Latest sports updates" },
              { time: "11:00 PM", title: "Late Night Wrap", desc: "Day's news summary" },
            ].map((show) => (
              <div key={show.time} className="bg-card rounded-xl p-5 border border-border">
                <span className="text-primary font-bold">{show.time}</span>
                <h3 className="font-semibold text-lg mt-1">{show.title}</h3>
                <p className="text-muted-foreground text-sm">{show.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Past Recordings */}
      <section className="py-12 bg-muted/50">
        <div className="container">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
            <Play className="h-6 w-6 text-primary" />
            {isLive ? 'Previous Streams' : 'Recent Videos'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? (
              [...Array(3)].map((_, i) => (
                <div key={i} className="aspect-video bg-muted animate-pulse rounded-xl" />
              ))
            ) : (
              (videos.length > 0 ? videos : youtubeVideos.map((v, i) => ({
                id: i,
                video_id: v.id,
                title: v.title,
                views: v.views,
                created_at: v.date,
              } as YouTubeVideo))).map((video) => (
                <a
                  key={video.id}
                  href={`https://youtube.com/watch?v=${video.video_id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group bg-card rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all"
                >
                  <div className="relative aspect-video">
                    <img
                      src={`https://img.youtube.com/vi/${video.video_id}/maxresdefault.jpg`}
                      alt={video.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center">
                        <div className="w-0 h-0 border-l-[18px] border-l-white border-t-[12px] border-t-transparent border-b-[12px] border-b-transparent ml-1" />
                      </div>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold line-clamp-2 group-hover:text-primary transition-colors">
                      {video.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-2">
                      {video.views} views
                    </p>
                  </div>
                </a>
              ))
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
