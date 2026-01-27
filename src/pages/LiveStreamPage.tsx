import { Radio, Calendar, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { youtubeVideos } from "@/data/newsData";

export default function LiveStreamPage() {
  return (
    <div className="min-h-screen">
      {/* Live Banner */}
      <div className="bg-primary text-primary-foreground py-3">
        <div className="container flex items-center justify-center gap-3">
          <Radio className="h-5 w-5 live-pulse" />
          <span className="font-semibold">Live Now: Watch our 24/7 News Stream</span>
        </div>
      </div>

      {/* Main Video Player */}
      <section className="bg-foreground py-8">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Video Player */}
            <div className="lg:col-span-2">
              <div className="aspect-video bg-black rounded-xl overflow-hidden">
                <iframe
                  src="https://www.youtube.com/embed/live_stream?channel=UC_x5XG1OV2P6uZZ5FSM9Ttw"
                  title="24x7 News Time Live"
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
              <div className="mt-4">
                <h1 className="text-2xl font-bold text-white mb-2">
                  24x7 News Time Live Stream
                </h1>
                <p className="text-white/70">
                  Watch live breaking news, political updates, and in-depth analysis 24 hours a day.
                </p>
              </div>
            </div>

            {/* Live Chat Placeholder */}
            <div className="bg-card rounded-xl p-4 h-[400px] lg:h-auto flex flex-col">
              <h3 className="font-bold mb-4">Live Chat</h3>
              <div className="flex-1 bg-muted rounded-lg flex items-center justify-center">
                <p className="text-muted-foreground text-sm text-center px-4">
                  Live chat available during active streams
                </p>
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
            Recent Recordings
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {youtubeVideos.map((video, index) => (
              <a
                key={index}
                href={`https://youtube.com/watch?v=${video.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group bg-card rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all"
              >
                <div className="relative aspect-video">
                  <img
                    src={`https://img.youtube.com/vi/${video.id}/maxresdefault.jpg`}
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
                    {video.views} views • {video.date}
                  </p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
