import { Link } from "react-router-dom";
import { Clock, Eye, Share2 } from "lucide-react";
import { NewsPost } from "@/data/newsData";
import { formatDistanceToNow } from "date-fns";

interface NewsCardProps {
  post: NewsPost;
  variant?: "default" | "compact" | "horizontal" | "featured";
}

export default function NewsCard({ post, variant = "default" }: NewsCardProps) {
  const timeAgo = formatDistanceToNow(new Date(post.publishDate), { addSuffix: true });

  const getCategoryClass = (slug: string) => {
    const classMap: Record<string, string> = {
      national: "category-national",
      international: "category-international",
      sports: "category-sports",
      technology: "category-technology",
      entertainment: "category-entertainment",
      business: "category-business",
      politics: "category-politics",
      "local-up": "category-local",
    };
    return classMap[slug] || "category-national";
  };

  if (variant === "compact") {
    return (
      <Link to={`/post/${post.slug}`} className="flex gap-3 group">
        <img
          src={post.featuredImage}
          alt={post.title}
          className="w-20 h-16 object-cover rounded-lg flex-shrink-0"
          loading="lazy"
        />
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-medium line-clamp-2 group-hover:text-primary transition-colors">
            {post.title}
          </h4>
          <p className="text-xs text-muted-foreground mt-1">{timeAgo}</p>
        </div>
      </Link>
    );
  }

  if (variant === "horizontal") {
    return (
      <Link to={`/post/${post.slug}`} className="news-card flex gap-4 p-4 group">
        <img
          src={post.featuredImage}
          alt={post.title}
          className="w-32 h-24 md:w-48 md:h-32 object-cover rounded-lg flex-shrink-0"
          loading="lazy"
        />
        <div className="flex-1 min-w-0 flex flex-col">
          <span className={`category-badge ${getCategoryClass(post.categorySlug)} w-fit mb-2`}>
            {post.category}
          </span>
          <h3 className="font-semibold line-clamp-2 group-hover:text-primary transition-colors">
            {post.title}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-2 mt-1 hidden md:block">
            {post.excerpt}
          </p>
          <div className="mt-auto flex items-center gap-4 text-xs text-muted-foreground pt-2">
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {timeAgo}
            </span>
            <span className="flex items-center gap-1">
              <Eye className="h-3 w-3" />
              {post.views.toLocaleString()}
            </span>
          </div>
        </div>
      </Link>
    );
  }

  if (variant === "featured") {
    return (
      <Link to={`/post/${post.slug}`} className="news-card group block relative overflow-hidden rounded-xl">
        <img
          src={post.featuredImage}
          alt={post.title}
          className="w-full h-80 md:h-96 object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 card-overlay" />
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <span className={`category-badge ${getCategoryClass(post.categorySlug)} mb-3`}>
            {post.category}
          </span>
          <h2 className="text-xl md:text-2xl font-bold text-white mb-2 line-clamp-2 text-shadow">
            {post.title}
          </h2>
          <p className="text-white/80 text-sm line-clamp-2 mb-3">
            {post.excerpt}
          </p>
          <div className="flex items-center gap-3">
            <img
              src={post.author.avatar}
              alt={post.author.name}
              className="w-8 h-8 rounded-full border-2 border-white"
            />
            <div className="text-white text-sm">
              <p className="font-medium">{post.author.name}</p>
              <p className="text-white/70 text-xs">{timeAgo}</p>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link to={`/post/${post.slug}`} className="news-card group block">
      <div className="relative overflow-hidden rounded-t-lg">
        <img
          src={post.featuredImage}
          alt={post.title}
          className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <span className={`category-badge ${getCategoryClass(post.categorySlug)} absolute top-3 left-3`}>
          {post.category}
        </span>
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-lg line-clamp-2 group-hover:text-primary transition-colors mb-2">
          {post.title}
        </h3>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
          {post.excerpt}
        </p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img
              src={post.author.avatar}
              alt={post.author.name}
              className="w-6 h-6 rounded-full"
            />
            <span className="text-xs text-muted-foreground">{post.author.name}</span>
          </div>
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {timeAgo}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
