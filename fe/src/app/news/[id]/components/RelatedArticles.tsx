import Image from "next/image";
import Link from "next/link";
import { Clock, User } from "lucide-react";
import { newsArticles } from "@/components/home/newsMock";
import { APP_ROUTES } from "@/constants/routes.constants";

interface RelatedArticlesProps {
  currentArticleId: number;
}

export default function RelatedArticles({
  currentArticleId,
}: RelatedArticlesProps) {
  const currentArticle = newsArticles.find((a) => a.id === currentArticleId);

  if (!currentArticle) return null;

  // Get related articles (same category, excluding current article)
  const relatedArticles = newsArticles
    .filter(
      (article) =>
        article.id !== currentArticleId &&
        article.category === currentArticle.category
    )
    .slice(0, 3);

  // If not enough articles in same category, add recent articles
  if (relatedArticles.length < 3) {
    const recentArticles = newsArticles
      .filter(
        (article) =>
          article.id !== currentArticleId &&
          !relatedArticles.find((ra) => ra.id === article.id)
      )
      .slice(0, 3 - relatedArticles.length);

    relatedArticles.push(...recentArticles);
  }

  return (
    <div className="bg-card border border-border rounded-xl p-6">
      <h3 className="text-xl font-bold text-foreground mb-6">
        Bài viết liên quan
      </h3>

      <div className="space-y-4">
        {relatedArticles.map((article) => (
          <Link
            key={article.id}
            href={`/news/${article.id}`}
            className="block group"
          >
            <div className="flex gap-3 p-3 rounded-lg hover:bg-background transition-colors">
              {/* Thumbnail */}
              <div className="w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden">
                <Image
                  src={article.image}
                  alt={article.title}
                  width={64}
                  height={64}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-foreground text-sm line-clamp-2 group-hover:text-primary transition-colors mb-1">
                  {article.title}
                </h4>

                <div className="flex items-center gap-2 text-xs text-foreground-secondary">
                  <span className="flex items-center gap-1">
                    <Clock size={12} />
                    {article.readTime}
                  </span>
                  <span className="flex items-center gap-1">
                    <User size={12} />
                    {article.author}
                  </span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* View All Link */}
      <div className="mt-6 pt-4 border-t border-border">
        <Link
          href={APP_ROUTES.NEWS}
          className="text-primary font-semibold text-sm hover:underline"
        >
          Xem tất cả bài viết →
        </Link>
      </div>
    </div>
  );
}
