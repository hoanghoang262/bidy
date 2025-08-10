export interface NewsArticle {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  date: string;
  author: string;
  category: string;
  readTime: string;
  featured?: boolean;
}

export const newsArticles: NewsArticle[] = [
  {
    id: 1,
    title: "Xu hướng đấu giá trực tuyến năm 2024: Những thay đổi đáng chú ý",
    excerpt: "Khám phá những xu hướng mới nhất trong lĩnh vực đấu giá trực tuyến và cách chúng ảnh hưởng đến người dùng.",
    content: "Năm 2024 chứng kiến sự phát triển mạnh mẽ của công nghệ đấu giá trực tuyến. Với sự xuất hiện của AI và blockchain, các nền tảng đấu giá đang trở nên minh bạch và hiệu quả hơn bao giờ hết. Người dùng có thể tham gia đấu giá từ bất kỳ đâu trên thế giới, với các tính năng bảo mật cao cấp và giao diện thân thiện.",
    image: "/hero.png",
    date: "15/12/2024",
    author: "Nguyễn Văn An",
    category: "Xu hướng",
    readTime: "5 phút",
    featured: true
  },
  {
    id: 2,
    title: "Hướng dẫn chi tiết: Cách tham gia đấu giá thành công",
    excerpt: "Những bí quyết và chiến lược giúp bạn trở thành người đấu giá chuyên nghiệp.",
    content: "Tham gia đấu giá không chỉ đơn giản là đặt giá cao nhất. Bạn cần có chiến lược, hiểu biết về sản phẩm và khả năng đọc vị đối thủ. Bài viết này sẽ hướng dẫn bạn từng bước để trở thành một người đấu giá thành công.",
    image: "/about.png",
    date: "12/12/2024",
    author: "Trần Thị Bình",
    category: "Hướng dẫn",
    readTime: "8 phút"
  },
  {
    id: 3,
    title: "Top 10 sản phẩm đấu giá hot nhất tháng 12",
    excerpt: "Khám phá những sản phẩm được săn đón nhiều nhất trong tháng cuối năm.",
    content: "Tháng 12 là thời điểm sôi động nhất trong năm với nhiều sản phẩm độc đáo được đưa lên đấu giá. Từ đồ cổ quý hiếm đến công nghệ mới nhất, đây là danh sách những sản phẩm được quan tâm nhiều nhất.",
    image: "/images.jpeg",
    date: "10/12/2024",
    author: "Lê Minh Cường",
    category: "Tin tức",
    readTime: "6 phút"
  },
  {
    id: 4,
    title: "Bảo mật trong đấu giá trực tuyến: Những điều cần biết",
    excerpt: "Tìm hiểu về các biện pháp bảo mật và cách bảo vệ thông tin khi tham gia đấu giá.",
    content: "Với sự phát triển của công nghệ, các mối đe dọa bảo mật cũng ngày càng tinh vi. Bài viết này sẽ giúp bạn hiểu rõ về các biện pháp bảo mật hiện đại và cách tự bảo vệ mình khi tham gia đấu giá trực tuyến.",
    image: "/hero.png",
    date: "08/12/2024",
    author: "Phạm Thị Dung",
    category: "Bảo mật",
    readTime: "7 phút"
  },
  {
    id: 5,
    title: "Câu chuyện thành công: Từ người mới đến chuyên gia đấu giá",
    excerpt: "Chia sẻ kinh nghiệm từ những người đã thành công trong lĩnh vực đấu giá.",
    content: "Mỗi chuyên gia đấu giá đều bắt đầu từ những bước đi đầu tiên. Thông qua những câu chuyện thực tế, chúng ta sẽ học được những bài học quý giá và động lực để theo đuổi đam mê.",
    image: "/about.png",
    date: "05/12/2024",
    author: "Hoàng Văn Em",
    category: "Câu chuyện",
    readTime: "10 phút"
  },
  {
    id: 6,
    title: "Công nghệ AI trong đấu giá: Tương lai đã đến",
    excerpt: "Khám phá cách AI đang thay đổi cách thức hoạt động của các nền tảng đấu giá.",
    content: "Trí tuệ nhân tạo không chỉ là xu hướng mà đã trở thành một phần không thể thiếu trong các nền tảng đấu giá hiện đại. Từ việc định giá tự động đến phát hiện gian lận, AI đang mở ra những khả năng mới.",
    image: "/images.jpeg",
    date: "03/12/2024",
    author: "Vũ Thị Phương",
    category: "Công nghệ",
    readTime: "9 phút"
  },
  {
    id: 7,
    title: "Đấu giá nghệ thuật: Thế giới của những tác phẩm độc đáo",
    excerpt: "Tìm hiểu về thị trường đấu giá nghệ thuật và những điều thú vị xung quanh.",
    content: "Đấu giá nghệ thuật là một thế giới đầy màu sắc với những câu chuyện thú vị. Từ những bức tranh cổ điển đến tác phẩm đương đại, mỗi phiên đấu giá đều mang đến những trải nghiệm độc đáo.",
    image: "/hero.png",
    date: "01/12/2024",
    author: "Đặng Văn Giang",
    category: "Nghệ thuật",
    readTime: "11 phút"
  },
  {
    id: 8,
    title: "Chiến lược đấu giá cho người mới bắt đầu",
    excerpt: "Những lời khuyên thiết thực giúp người mới tự tin tham gia đấu giá.",
    content: "Bắt đầu với đấu giá có thể đáng sợ, nhưng với những chiến lược đúng đắn, bạn sẽ nhanh chóng làm quen và thành công. Bài viết này sẽ cung cấp những lời khuyên thực tế từ các chuyên gia.",
    image: "/about.png",
    date: "28/11/2024",
    author: "Ngô Thị Hoa",
    category: "Hướng dẫn",
    readTime: "6 phút"
  },
  {
    id: 999,
    title: "Demo User trở thành người bán nổi bật",
    excerpt: "Demo User đã có những thành tích nổi bật trong tháng này.",
    content: "Demo User đã bán được nhiều sản phẩm và nhận được đánh giá cao từ khách hàng.",
    image: "/about.png",
    date: "01/07/2025",
    author: "Demo User",
    category: "Tin tức",
    readTime: "3 phút"
  }
]; 