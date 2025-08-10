"use client";

import Image from "next/image";
import Link from "next/link";
import { Clock, User, Tag } from "lucide-react";
import { newsArticles } from "@/components/home/newsMock";

export default function NewsHero() {
  const featuredArticle =
    newsArticles.find((article) => article.featured) || newsArticles[0];

  return (
    <div className="bg-card border border-border rounded-2xl shadow-lg overflow-hidden">
      <div className="grid lg:grid-cols-2 gap-0">
        {/* Image */}
        <div className="relative h-64 lg:h-full">
          <Image
            src={featuredArticle.image}
            alt={featuredArticle.title}
            fill
            className="object-cover"
          />
          <div className="absolute top-4 left-4">
            <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-semibold">
              {featuredArticle.category}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-8 flex flex-col justify-center">
          <div className="flex items-center gap-4 text-sm text-foreground-secondary mb-4">
            <span className="flex items-center gap-1">
              <Clock size={16} />
              {featuredArticle.readTime}
            </span>
            <span className="flex items-center gap-1">
              <User size={16} />
              {featuredArticle.author}
            </span>
            <span className="flex items-center gap-1">
              <Tag size={16} />
              {featuredArticle.date}
            </span>
          </div>

          <h2 className="text-2xl lg:text-3xl font-bold text-foreground mb-4 leading-tight">
            {featuredArticle.title}
          </h2>

          <p className="text-foreground-secondary mb-6 leading-relaxed">
            {featuredArticle.excerpt}
          </p>

          <Link
            href={`/news/${featuredArticle.id}`}
            className="inline-flex items-center justify-center px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/80 transition-colors w-fit"
          >
            Đọc thêm
          </Link>
        </div>
      </div>
    </div>
  );
}
