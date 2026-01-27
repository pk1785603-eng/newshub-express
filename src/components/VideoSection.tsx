import { Link } from "react-router-dom";
import { Youtube, Radio } from "lucide-react";
import { Button } from "@/components/ui/button";
import { youtubeVideos } from "@/data/newsData";

export default function VideoSection() {
  return (
    <section className="py-12 bg-muted/50">
      <div className="container">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Youtube className="h-8 w-8 text-red-500" />
            <h2 className="text-2xl font-bold">Watch Latest Videos</h2>
          </div>
          <Link to="/live-stream">
            <Button variant="outline" className="gap-2">
              <Radio className="h-4 w-4 text-red-500 live-pulse" />
              Watch Live
            </Button>
          </Link>
        </div>

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
                  <div className="w-16 h-16 rounded-full bg-red-500 flex items-center justify-center shadow-xl transform scale-90 group-hover:scale-100 transition-transform">
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
  );
}
