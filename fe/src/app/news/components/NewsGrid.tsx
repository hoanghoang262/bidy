"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { Clock, User, Tag } from "lucide-react";
import { NewsArticle, newsArticles } from "@/components/home/newsMock";

export default function NewsGrid() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  // Filter articles based on search and category
  const filteredArticles = useMemo(() => {
    let filtered = newsArticles.filter((article) => !article.featured); // Exclude featured article

    if (searchTerm) {
      filtered = filtered.filter(
        (article) =>
          article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          article.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
          article.author.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory) {
      filtered = filtered.filter(
        (article) => article.category === selectedCategory
      );
    }

    return filtered;
  }, [searchTerm, selectedCategory]);

  return (
    <div>
      {/* Filter Controls */}
      <div className="flex flex-col lg:flex-row gap-4 mb-8">
        {/* Search Bar */}
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="Tìm kiếm bài viết..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-4 pr-4 text-foreground py-3 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>

        {/* Category Filter */}
        <div className="lg:w-64">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full px-4 py-3 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-foreground"
          >
            <option value="">Tất cả danh mục</option>
            {Array.from(
              new Set(newsArticles.map((article) => article.category))
            ).map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Results Count */}
      <div className="mb-6">
        <p className="text-foreground-secondary">
          Tìm thấy {filteredArticles.length} bài viết
        </p>
      </div>

      {/* Articles Grid */}
      {filteredArticles.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-foreground-secondary text-lg">
            Không tìm thấy bài viết nào phù hợp.
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredArticles.map((article) => (
            <NewsCard key={article.id} article={article} />
          ))}
        </div>
      )}
    </div>
  );
}

interface NewsCardProps {
  article: NewsArticle;
}

function NewsCard({ article }: NewsCardProps) {
  return (
    <Link href={`/news/${article.id}`} className="group">
      <div className="bg-card relative h-full border border-border rounded-xl shadow-sm hover:shadow-lg transition-shadow overflow-hidden">
        {/* Image */}
        <div className="relative h-48">
          <Image
            src={article.image}
            alt={article.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute top-3 left-3">
            <span className="bg-primary text-primary-foreground px-2 py-1 rounded-full text-xs font-semibold">
              {article.category}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Metadata */}
          <div className="flex items-center gap-3 text-xs text-foreground-secondary mb-3">
            <span className="flex items-center gap-1">
              <Clock size={14} />
              {article.readTime}
            </span>
            <span className="flex items-center gap-1">
              <User size={14} />
              {article.author}
            </span>
            <span className="flex items-center gap-1">
              <Tag size={14} />
              {article.date}
            </span>
          </div>

          {/* Title */}
          <h3 className="text-lg font-semibold text-foreground mb-3 line-clamp-2 group-hover:text-primary transition-colors">
            {article.title}
          </h3>

          {/* Excerpt */}
          <p className="text-foreground-secondary text-sm leading-relaxed line-clamp-3 mb-4">
            {article.excerpt}
          </p>

          {/* Read More */}
          <div className="text-primary font-semibold text-sm group-hover:underline absolute bottom-6 right-6">
            Đọc thêm →
          </div>
        </div>
      </div>
    </Link>
  );
}
