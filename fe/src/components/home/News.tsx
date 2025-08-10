"use client";
import React from "react";
import Link from "next/link";
import { newsArticles } from "./newsMock";
import { NewsCard } from "../ui";
import { APP_ROUTES } from "@/constants/routes.constants";

export default function News() {
  // Get the first 3 articles for the home page
  const featuredNews = newsArticles.slice(0, 3);

  return (
    <section className="w-full p-8 lg:px-48 pb-64 lg:pb-40 min-h-screen flex flex-col gap-8">
      {/* Title */}
      <div className="flex flex-col gap-2 items-center">
        <h2 className="text-2xl font-semibold text-foreground">
          TIN TỨC & HƯỚNG DẪN
        </h2>
        <p className="text-center text-foreground-secondary text-base max-w-md">
          Hướng dẫn & mẹo đấu giá
        </p>
      </div>
      {/* Cards */}
      <div className="w-full flex flex-col gap-6 items-center lg:grid lg:grid-cols-3 lg:gap-8 lg:items-start">
        {featuredNews.map((item) => (
          <NewsCard
            key={item.id}
            image={item.image}
            title={item.title}
            link={`/news/${item.id}`}
          />
        ))}
      </div>
      {/* CTA at bottom */}
      <div className="flex justify-center mt-8">
        <Link href={APP_ROUTES.NEWS}>
          <button className="bg-primary text-primary-foreground rounded-lg shadow px-8 py-3 font-semibold hover:bg-primary/80 transition-colors">
            Xem tất cả bài viết
          </button>
        </Link>
      </div>
    </section>
  );
}
