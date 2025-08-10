import { notFound } from "next/navigation";
import Image from "next/image";
import { Clock, User, Tag, Share2 } from "lucide-react";
import { NewsBreadcrumbs, RelatedArticles } from "./components";
import { newsArticles } from "@/components/home/newsMock";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const article = newsArticles.find((a) => a.id === parseInt(id));

  if (!article) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background pb-64 lg:pb-32">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumbs */}
        <NewsBreadcrumbs article={article} />

        {/* Article Header */}
        <div className="mb-8">
          <div className="bg-card border border-border rounded-xl p-6 mb-6">
            <div className="flex flex-col lg:flex-row items-center gap-4 text-sm text-foreground-secondary mb-4">
              <div className="flex flex-row gap-4 justify-between w-full lg:w-fit lg:justify-start">
                <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-semibold">
                  {article.category}
                </span>
                <span className="flex items-center gap-1">
                  <Clock size={16} />
                  {article.readTime}
                </span>
              </div>
              <div className="flex flex-row gap-4 justify-between w-full lg:w-fit lg:justify-start">
                <span className="flex items-center gap-1">
                  <User size={16} />
                  {article.author}
                </span>
                <span className="flex items-center gap-1">
                  <Tag size={16} />
                  {article.date}
                </span>
              </div>
            </div>

            <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-4 leading-tight">
              {article.title}
            </h1>

            <p className="text-lg text-foreground-secondary leading-relaxed">
              {article.excerpt}
            </p>
          </div>
        </div>

        {/* Article Content */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
              {/* Featured Image */}
              <div className="relative h-64 lg:h-80">
                <Image
                  src={article.image}
                  alt={article.title}
                  fill
                  className="object-cover"
                />
              </div>

              {/* Article Body */}
              <div className="p-6 lg:p-8">
                <div className="prose prose-lg max-w-none">
                  <p className="text-foreground-secondary leading-relaxed mb-6">
                    {article.content}
                  </p>
                  {/* Additional paragraphs for demo */}
                  <p className="text-foreground-secondary leading-relaxed mb-6">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                    do eiusmod tempor incididunt ut labore et dolore magna
                    aliqua. Ut enim ad minim veniam, quis nostrud exercitation
                    ullamco laboris nisi ut aliquip ex ea commodo consequat.
                  </p>
                  <p className="text-foreground-secondary leading-relaxed mb-6">
                    Duis aute irure dolor in reprehenderit in voluptate velit
                    esse cillum dolore eu fugiat nulla pariatur. Excepteur sint
                    occaecat cupidatat non proident, sunt in culpa qui officia
                    deserunt mollit anim id est laborum.
                  </p>
                </div>
                {/* Share Button */}
                <div className="mt-8 pt-6 border-t border-border">
                  <button className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/80 transition-colors">
                    <Share2 size={16} />
                    Chia sẻ bài viết
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <RelatedArticles currentArticleId={article.id} />
          </div>
        </div>
      </div>
    </div>
  );
}
