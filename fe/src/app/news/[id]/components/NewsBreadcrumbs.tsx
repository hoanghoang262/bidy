import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { NewsArticle } from "@/components/home/newsMock";
import { APP_ROUTES } from "@/constants/routes.constants";

interface NewsBreadcrumbsProps {
  article: NewsArticle;
}

export default function NewsBreadcrumbs({ article }: NewsBreadcrumbsProps) {
  return (
    <nav className="flex items-center gap-2 text-sm text-foreground-secondary mb-6">
      <Link
        href={APP_ROUTES.HOME}
        className="flex items-center gap-1 hover:text-primary transition-colors"
      >
        Trang chủ
      </Link>
      <ChevronRight size={16} />
      <Link
        href={APP_ROUTES.NEWS}
        className="hover:text-primary transition-colors"
      >
        Tin tức
      </Link>
      <ChevronRight size={16} />
      <Link
        href={`/news?category=${article.category}`}
        className="hover:text-primary transition-colors"
      >
        {article.category}
      </Link>
      <ChevronRight size={16} />
      <span className="text-foreground font-medium truncate">
        {article.title}
      </span>
    </nav>
  );
}
