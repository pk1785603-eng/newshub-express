import { useSearchParams, Link } from "react-router-dom";
import { Search, Home, ChevronRight } from "lucide-react";
import NewsCard from "@/components/NewsCard";
import { newsPosts } from "@/data/newsData";

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";

  const results = query
    ? newsPosts.filter(
        (post) =>
          post.title.toLowerCase().includes(query.toLowerCase()) ||
          post.excerpt.toLowerCase().includes(query.toLowerCase()) ||
          post.tags.some((tag) => tag.toLowerCase().includes(query.toLowerCase()))
      )
    : [];

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-secondary py-12">
        <div className="container">
          <nav className="flex items-center gap-2 text-white/80 mb-4 text-sm">
            <Link to="/" className="hover:text-white flex items-center gap-1">
              <Home className="h-4 w-4" />
              Home
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-white">Search</span>
          </nav>
          <div className="flex items-center gap-3">
            <Search className="h-8 w-8 text-white" />
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white">Search Results</h1>
              {query && (
                <p className="text-white/80">
                  Showing results for: <span className="font-semibold">"{query}"</span>
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="container py-8">
        {!query ? (
          <div className="text-center py-16">
            <Search className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Enter a search term</h2>
            <p className="text-muted-foreground">
              Use the search bar in the header to find news articles.
            </p>
          </div>
        ) : results.length === 0 ? (
          <div className="text-center py-16">
            <Search className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">No results found</h2>
            <p className="text-muted-foreground mb-6">
              Try different keywords or browse our categories.
            </p>
            <Link to="/" className="text-primary hover:underline">
              Return to Home
            </Link>
          </div>
        ) : (
          <>
            <p className="text-muted-foreground mb-6">
              Found {results.length} result{results.length !== 1 ? "s" : ""}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {results.map((post) => (
                <NewsCard key={post.id} post={post} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
