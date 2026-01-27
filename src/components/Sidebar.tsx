import { Link } from "react-router-dom";
import { TrendingUp, Youtube, Facebook, Twitter, Instagram, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { categories, getTrendingPosts, getRecentPosts, youtubeVideos } from "@/data/newsData";
import NewsCard from "./NewsCard";

interface SidebarProps {
  position: "left" | "right";
}

export default function Sidebar({ position }: SidebarProps) {
  const trendingPosts = getTrendingPosts(5);
  const recentPosts = getRecentPosts(5);

  if (position === "left") {
    return (
      <aside className="space-y-8">
        {/* Trending Now */}
        <div className="bg-card rounded-xl p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="h-5 w-5 text-primary" />
            <h3 className="font-bold text-lg">Trending Now</h3>
          </div>
          <div className="space-y-4">
            {trendingPosts.map((post, index) => (
              <div key={post.id} className="flex gap-3">
                <span className="text-2xl font-bold text-primary/20">{index + 1}</span>
                <NewsCard post={post} variant="compact" />
              </div>
            ))}
          </div>
        </div>

        {/* Categories */}
        <div className="bg-card rounded-xl p-5 shadow-sm">
          <h3 className="font-bold text-lg mb-4">Categories</h3>
          <div className="space-y-2">
            {categories.map((cat) => (
              <Link
                key={cat.slug}
                to={`/category/${cat.slug}`}
                className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-muted transition-colors"
              >
                <span className="font-medium">{cat.name}</span>
                <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">
                  {Math.floor(Math.random() * 50) + 10}
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* Social Follow */}
        <div className="bg-card rounded-xl p-5 shadow-sm">
          <h3 className="font-bold text-lg mb-4">Follow Us</h3>
          <div className="grid grid-cols-2 gap-3">
            <a
              href="#"
              className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 hover:bg-red-500/20 transition-colors"
            >
              <Youtube className="h-5 w-5 text-red-500" />
              <span className="text-sm font-medium">YouTube</span>
            </a>
            <a
              href="#"
              className="flex items-center gap-2 p-3 rounded-lg bg-blue-600/10 hover:bg-blue-600/20 transition-colors"
            >
              <Facebook className="h-5 w-5 text-blue-600" />
              <span className="text-sm font-medium">Facebook</span>
            </a>
            <a
              href="#"
              className="flex items-center gap-2 p-3 rounded-lg bg-sky-500/10 hover:bg-sky-500/20 transition-colors"
            >
              <Twitter className="h-5 w-5 text-sky-500" />
              <span className="text-sm font-medium">Twitter</span>
            </a>
            <a
              href="#"
              className="flex items-center gap-2 p-3 rounded-lg bg-pink-500/10 hover:bg-pink-500/20 transition-colors"
            >
              <Instagram className="h-5 w-5 text-pink-500" />
              <span className="text-sm font-medium">Instagram</span>
            </a>
          </div>
        </div>

        {/* Newsletter */}
        <div className="bg-gradient-to-br from-primary to-secondary rounded-xl p-5 text-white">
          <Mail className="h-8 w-8 mb-3" />
          <h3 className="font-bold text-lg mb-2">Newsletter</h3>
          <p className="text-sm text-white/80 mb-4">
            Get daily news updates delivered to your inbox.
          </p>
          <div className="space-y-2">
            <Input
              type="email"
              placeholder="Your email address"
              className="bg-white/20 border-white/30 text-white placeholder:text-white/60"
            />
            <Button className="w-full bg-white text-primary hover:bg-white/90">
              Subscribe
            </Button>
          </div>
        </div>
      </aside>
    );
  }

  return (
    <aside className="space-y-8">
      {/* Latest Posts */}
      <div className="bg-card rounded-xl p-5 shadow-sm">
        <h3 className="font-bold text-lg mb-4">Latest Posts</h3>
        <div className="space-y-4">
          {recentPosts.map((post) => (
            <NewsCard key={post.id} post={post} variant="compact" />
          ))}
        </div>
      </div>

      {/* Video Highlights */}
      <div className="bg-card rounded-xl p-5 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <Youtube className="h-5 w-5 text-red-500" />
          <h3 className="font-bold text-lg">Video Highlights</h3>
        </div>
        <div className="space-y-4">
          {youtubeVideos.slice(0, 3).map((video, index) => (
            <a
              key={index}
              href={`https://youtube.com/watch?v=${video.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex gap-3 group"
            >
              <div className="relative w-24 h-16 flex-shrink-0 rounded-lg overflow-hidden bg-muted">
                <img
                  src={`https://img.youtube.com/vi/${video.id}/mqdefault.jpg`}
                  alt={video.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                  <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center">
                    <div className="w-0 h-0 border-l-[8px] border-l-white border-t-[5px] border-t-transparent border-b-[5px] border-b-transparent ml-0.5" />
                  </div>
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium line-clamp-2 group-hover:text-primary transition-colors">
                  {video.title}
                </h4>
                <p className="text-xs text-muted-foreground mt-1">
                  {video.views} views • {video.date}
                </p>
              </div>
            </a>
          ))}
        </div>
        <Link
          to="/live-stream"
          className="block mt-4 text-center text-sm font-medium text-primary hover:underline"
        >
          View All Videos →
        </Link>
      </div>

      {/* Ad Placeholder */}
      <div className="ad-hidden bg-muted rounded-xl p-5 flex items-center justify-center h-64">
        <p className="text-muted-foreground text-sm">Ad Space Available</p>
      </div>
    </aside>
  );
}
