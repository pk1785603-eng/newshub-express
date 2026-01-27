import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";
import Sidebar from "@/components/Sidebar";
import NewsCard from "@/components/NewsCard";
import { getPostsByCategory, categories } from "@/data/newsData";

export default function CategoryPage() {
  const { slug } = useParams<{ slug: string }>();
  const category = categories.find((c) => c.slug === slug);
  const posts = getPostsByCategory(slug || "");

  if (!category) {
    return (
      <div className="container py-20 text-center">
        <h1 className="text-2xl font-bold mb-4">Category Not Found</h1>
        <Link to="/" className="text-primary hover:underline">
          Return to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Category Header */}
      <div className="bg-gradient-to-r from-primary to-secondary py-12">
        <div className="container">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-white/80 mb-4 text-sm">
            <Link to="/" className="hover:text-white flex items-center gap-1">
              <Home className="h-4 w-4" />
              Home
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-white">Categories</span>
            <ChevronRight className="h-4 w-4" />
            <span className="text-white font-medium">{category.name}</span>
          </nav>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            {category.name}
          </h1>
          <p className="text-white/80">{category.description}</p>
        </div>
      </div>

      {/* Content */}
      <div className="container py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Content */}
          <main className="lg:col-span-8">
            {posts.length === 0 ? (
              <div className="text-center py-12 bg-muted rounded-xl">
                <p className="text-muted-foreground">No posts found in this category.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {posts.map((post) => (
                  <NewsCard key={post.id} post={post} />
                ))}
              </div>
            )}
          </main>

          {/* Sidebar */}
          <aside className="lg:col-span-4">
            <Sidebar position="right" />
          </aside>
        </div>
      </div>
    </div>
  );
}
