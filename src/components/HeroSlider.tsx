import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getFeaturedPosts, NewsPost } from "@/data/newsData";

export default function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const featuredPosts = getFeaturedPosts();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % featuredPosts.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [featuredPosts.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % featuredPosts.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + featuredPosts.length) % featuredPosts.length);
  };

  if (!featuredPosts.length) return null;

  return (
    <section className="relative h-[400px] md:h-[500px] lg:h-[550px] overflow-hidden bg-muted">
      {featuredPosts.map((post, index) => (
        <div
          key={post.id}
          className={`absolute inset-0 transition-opacity duration-700 ${
            index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
        >
          <img
            src={post.featuredImage}
            alt={post.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 hero-overlay" />
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 lg:p-16">
            <div className="container">
              <div className="max-w-3xl">
                <span className={`category-badge category-${post.categorySlug} mb-4`}>
                  {post.category}
                </span>
                <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold text-white mb-4 text-shadow line-clamp-3">
                  {post.title}
                </h1>
                <p className="text-white/90 text-sm md:text-base mb-6 line-clamp-2 max-w-2xl">
                  {post.excerpt}
                </p>
                <Link to={`/post/${post.slug}`}>
                  <Button size="lg" className="bg-primary hover:bg-primary/90">
                    Read More
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Arrows */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-black/30 hover:bg-black/50 text-white h-12 w-12 rounded-full"
        onClick={prevSlide}
      >
        <ChevronLeft className="h-6 w-6" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-black/30 hover:bg-black/50 text-white h-12 w-12 rounded-full"
        onClick={nextSlide}
      >
        <ChevronRight className="h-6 w-6" />
      </Button>

      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {featuredPosts.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-all ${
              index === currentSlide
                ? "bg-primary w-8"
                : "bg-white/50 hover:bg-white/80"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
