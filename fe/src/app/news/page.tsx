// Remove Suspense for immediate loading - preloading strategy
import { NewsHero, NewsGrid } from "./components";

export default function NewsPage() {
  return (
    <div className="min-h-screen bg-background pb-64 lg:pb-32">
      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="text-center mb-12">
          <p className="text-2xl lg:text-3xl font-bold text-primary w-full text-center mb-4">
            Tin Tức & Cập Nhật
          </p>
          <p className="text-lg text-foreground-secondary max-w-2xl mx-auto">
            Khám phá những tin tức mới nhất về đấu giá, xu hướng công nghệ và
            những câu chuyện thú vị từ cộng đồng
          </p>
        </div>

        {/* Featured Article - Immediate loading */}
        <NewsHero />

        {/* News Grid - Immediate loading */}
        <div className="mt-16">
          <NewsGrid />
        </div>
      </div>
    </div>
  );
}
