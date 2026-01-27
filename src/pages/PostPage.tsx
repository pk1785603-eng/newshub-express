import { useParams, Link } from "react-router-dom";
import { ChevronRight, Home, Clock, Eye, Share2, Facebook, Twitter, Bookmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Sidebar from "@/components/Sidebar";
import NewsCard from "@/components/NewsCard";
import { getPostBySlug, getPostsByCategory } from "@/data/newsData";
import { formatDistanceToNow, format } from "date-fns";

export default function PostPage() {
  const { slug } = useParams<{ slug: string }>();
  const post = getPostBySlug(slug || "");
  const relatedPosts = post ? getPostsByCategory(post.categorySlug).filter(p => p.id !== post.id).slice(0, 4) : [];

  if (!post) {
    return (
      <div className="container py-20 text-center">
        <h1 className="text-2xl font-bold mb-4">Article Not Found</h1>
        <Link to="/" className="text-primary hover:underline">
          Return to Home
        </Link>
      </div>
    );
  }

  const timeAgo = formatDistanceToNow(new Date(post.publishDate), { addSuffix: true });
  const publishDate = format(new Date(post.publishDate), "MMMM d, yyyy");

  const shareOnWhatsApp = () => {
    window.open(`https://wa.me/?text=${encodeURIComponent(post.title + " " + window.location.href)}`, "_blank");
  };

  const shareOnTwitter = () => {
    window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(post.title)}`, "_blank");
  };

  const shareOnFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, "_blank");
  };

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    alert("Link copied to clipboard!");
  };

  return (
    <article className="min-h-screen">
      {/* Hero Image */}
      <div className="relative h-[300px] md:h-[400px] lg:h-[500px]">
        <img
          src={post.featuredImage}
          alt={post.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 hero-overlay" />
      </div>

      <div className="container py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-muted-foreground mb-6 text-sm flex-wrap">
          <Link to="/" className="hover:text-foreground flex items-center gap-1">
            <Home className="h-4 w-4" />
            Home
          </Link>
          <ChevronRight className="h-4 w-4" />
          <Link to={`/category/${post.categorySlug}`} className="hover:text-foreground">
            {post.category}
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-foreground font-medium line-clamp-1">{post.title}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Content */}
          <main className="lg:col-span-8">
            {/* Article Header */}
            <header className="mb-8">
              <span className={`category-badge category-${post.categorySlug} mb-4`}>
                {post.category}
              </span>
              <h1 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">
                {post.title}
              </h1>
              <p className="text-lg text-muted-foreground mb-6">
                {post.excerpt}
              </p>

              {/* Author & Meta */}
              <div className="flex flex-wrap items-center gap-4 mb-6">
                <div className="flex items-center gap-3">
                  <img
                    src={post.author.avatar}
                    alt={post.author.name}
                    className="w-12 h-12 rounded-full"
                  />
                  <div>
                    <p className="font-semibold">{post.author.name}</p>
                    <p className="text-sm text-muted-foreground">{post.author.bio}</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {publishDate} ({timeAgo})
                </span>
                <span className="flex items-center gap-1">
                  <Eye className="h-4 w-4" />
                  {post.views.toLocaleString()} views
                </span>
              </div>
            </header>

            {/* Share Buttons */}
            <div className="flex items-center gap-2 mb-8 flex-wrap">
              <span className="text-sm font-medium mr-2">Share:</span>
              <Button variant="outline" size="sm" onClick={shareOnWhatsApp} className="gap-2">
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                WhatsApp
              </Button>
              <Button variant="outline" size="sm" onClick={shareOnTwitter} className="gap-2">
                <Twitter className="h-4 w-4" />
                Twitter
              </Button>
              <Button variant="outline" size="sm" onClick={shareOnFacebook} className="gap-2">
                <Facebook className="h-4 w-4" />
                Facebook
              </Button>
              <Button variant="outline" size="sm" onClick={copyLink} className="gap-2">
                <Share2 className="h-4 w-4" />
                Copy Link
              </Button>
            </div>

            <Separator className="mb-8" />

            {/* Article Content */}
            <div className="prose prose-lg dark:prose-invert max-w-none">
              <p className="lead">{post.excerpt}</p>
              <p>
                {post.content}
              </p>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
              </p>
              <h2>Key Highlights</h2>
              <ul>
                <li>Major policy changes announced in the latest update</li>
                <li>Significant impact expected on various sectors</li>
                <li>Expert opinions divided on long-term implications</li>
                <li>Implementation timeline and next steps revealed</li>
              </ul>
              <p>
                Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
              </p>
              <h2>What This Means For You</h2>
              <p>
                Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.
              </p>
              <blockquote>
                "This is a significant step forward in addressing the key challenges we face today. The implications will be felt across all segments of society."
              </blockquote>
              <p>
                Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.
              </p>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap items-center gap-2 mt-8">
              <span className="text-sm font-medium">Tags:</span>
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-muted rounded-full text-sm text-muted-foreground"
                >
                  #{tag}
                </span>
              ))}
            </div>

            <Separator className="my-8" />

            {/* Author Bio */}
            <div className="bg-muted rounded-xl p-6 flex flex-col md:flex-row gap-4">
              <img
                src={post.author.avatar}
                alt={post.author.name}
                className="w-20 h-20 rounded-full"
              />
              <div>
                <h3 className="font-bold text-lg mb-1">About {post.author.name}</h3>
                <p className="text-muted-foreground">{post.author.bio}</p>
              </div>
            </div>

            {/* Related Posts */}
            {relatedPosts.length > 0 && (
              <section className="mt-12">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <span className="w-1 h-8 bg-primary rounded-full" />
                  Related Articles
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {relatedPosts.map((relatedPost) => (
                    <NewsCard key={relatedPost.id} post={relatedPost} />
                  ))}
                </div>
              </section>
            )}
          </main>

          {/* Sidebar */}
          <aside className="lg:col-span-4">
            <Sidebar position="right" />
          </aside>
        </div>
      </div>
    </article>
  );
}
