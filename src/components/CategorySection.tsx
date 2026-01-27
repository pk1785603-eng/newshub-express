import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { getPostsByCategory, Category } from "@/data/newsData";
import NewsCard from "./NewsCard";

interface CategorySectionProps {
  category: Category;
}

export default function CategorySection({ category }: CategorySectionProps) {
  const posts = getPostsByCategory(category.slug).slice(0, 4);

  if (!posts.length) return null;

  return (
    <section className="py-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-1 h-8 bg-primary rounded-full" />
          <h2 className="text-2xl font-bold">{category.name}</h2>
        </div>
        <Link
          to={`/category/${category.slug}`}
          className="flex items-center gap-1 text-sm font-medium text-primary hover:underline"
        >
          View All
          <ChevronRight className="h-4 w-4" />
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {posts.map((post) => (
          <NewsCard key={post.id} post={post} />
        ))}
      </div>
    </section>
  );
}
