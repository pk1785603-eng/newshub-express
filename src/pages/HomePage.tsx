import { useState, useEffect } from "react";
import HeroSlider from "@/components/HeroSlider";
import NewsTicker from "@/components/NewsTicker";
import Sidebar from "@/components/Sidebar";
import NewsCard from "@/components/NewsCard";
import CategorySection from "@/components/CategorySection";
import VideoSection from "@/components/VideoSection";
import { getRecentPosts, categories } from "@/data/newsData";

export default function HomePage() {
  const recentPosts = getRecentPosts(12);
  const mainPosts = recentPosts.slice(0, 8);
  const featuredPost = recentPosts[0];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <HeroSlider />

      {/* Breaking News Ticker */}
      <NewsTicker />

      {/* Main Content */}
      <div className="container py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Sidebar - Hidden on mobile */}
          <div className="hidden lg:block lg:col-span-3">
            <Sidebar position="left" />
          </div>

          {/* Main Content */}
          <main className="lg:col-span-6 space-y-8">
            {/* Featured Post */}
            {featuredPost && (
              <section>
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <span className="w-1 h-8 bg-primary rounded-full" />
                  Featured Story
                </h2>
                <NewsCard post={featuredPost} variant="featured" />
              </section>
            )}

            {/* Latest News Grid */}
            <section>
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <span className="w-1 h-8 bg-secondary rounded-full" />
                Latest News
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {mainPosts.slice(1, 7).map((post) => (
                  <NewsCard key={post.id} post={post} />
                ))}
              </div>
            </section>

            {/* Mobile: Trending Section */}
            <div className="lg:hidden">
              <Sidebar position="left" />
            </div>
          </main>

          {/* Right Sidebar */}
          <div className="lg:col-span-3">
            <Sidebar position="right" />
          </div>
        </div>
      </div>

      {/* Video Section */}
      <VideoSection />

      {/* Category Sections */}
      <div className="container">
        {categories.slice(0, 4).map((category) => (
          <CategorySection key={category.slug} category={category} />
        ))}
      </div>
    </div>
  );
}
