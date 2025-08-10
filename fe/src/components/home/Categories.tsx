"use client";

import Link from "next/link";
import { useState, useEffect, useMemo } from "react";
import { 
  AlertCircle
} from "lucide-react";
import {
  LaboratoryIcon,
  MeasurementIcon,
  IndustrialIcon,
  HomeApplianceIcon,
  RealEstateIcon,
  ElectronicsIcon,
  OtherProductsIcon,
  AllCategoriesIcon,
  VehiclesIcon,
  FashionIcon,
  SportsIcon,
  PetsIcon,
  FoodBeverageIcon,
  BooksEducationIcon,
  BeautyHealthIcon
} from "@/components/icons/CategoryIcons";
import { useAuctionCategories } from "@/services/bid";
import { APP_ROUTES } from "@/constants/routes.constants";

interface Category {
  _id: string;
  name: string;
  image?: string[];
  status?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

interface CategoryUI {
  id: string;
  name: string;
  displayName: string;
  icon: React.ReactNode;
  bgGradient: string;
  iconColor: string;
  href: string;
  badge?: string;
  badgeColor?: string;
}

// Pastel gradient backgrounds matching Chợ Tốt style
const categoryStyles = [
  {
    bgGradient: "bg-gradient-to-br from-orange-50 via-yellow-50 to-amber-50",
    iconColor: "text-orange-500",
    hoverBg: "hover:from-orange-100 hover:via-yellow-100 hover:to-amber-100"
  },
  {
    bgGradient: "bg-gradient-to-br from-blue-50 via-sky-50 to-cyan-50",
    iconColor: "text-blue-500",
    hoverBg: "hover:from-blue-100 hover:via-sky-100 hover:to-cyan-100"
  },
  {
    bgGradient: "bg-gradient-to-br from-purple-50 via-violet-50 to-fuchsia-50",
    iconColor: "text-purple-500",
    hoverBg: "hover:from-purple-100 hover:via-violet-100 hover:to-fuchsia-100"
  },
  {
    bgGradient: "bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50",
    iconColor: "text-emerald-500",
    hoverBg: "hover:from-emerald-100 hover:via-green-100 hover:to-teal-100"
  },
  {
    bgGradient: "bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50",
    iconColor: "text-amber-500",
    hoverBg: "hover:from-amber-100 hover:via-yellow-100 hover:to-orange-100"
  },
  {
    bgGradient: "bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-50",
    iconColor: "text-slate-500",
    hoverBg: "hover:from-slate-100 hover:via-gray-100 hover:to-zinc-100"
  },
  {
    bgGradient: "bg-gradient-to-br from-cyan-50 via-sky-50 to-blue-50",
    iconColor: "text-cyan-500",
    hoverBg: "hover:from-cyan-100 hover:via-sky-100 hover:to-blue-100"
  },
  {
    bgGradient: "bg-gradient-to-br from-pink-50 via-rose-50 to-red-50",
    iconColor: "text-pink-500",
    hoverBg: "hover:from-pink-100 hover:via-rose-100 hover:to-red-100"
  }
];

// Icon mapping with colorful visual icons
const getIconForCategory = (name: string): React.ReactNode => {
  const lowerName = name.toLowerCase();
  
  // Laboratory & Scientific
  if (lowerName.includes("thí nghiệm") || lowerName.includes("lab") || lowerName.includes("khoa học")) {
    return <LaboratoryIcon className="w-10 h-10" />;
  }
  
  // Measurement & Tools
  if (lowerName.includes("đo lường") || lowerName.includes("đo") || lowerName.includes("dụng cụ")) {
    return <MeasurementIcon className="w-10 h-10" />;
  }
  
  // Industrial & Machinery
  if (lowerName.includes("công nghiệp") || lowerName.includes("máy móc") || lowerName.includes("thiết bị")) {
    return <IndustrialIcon className="w-10 h-10" />;
  }
  
  // Home & Appliances
  if (lowerName.includes("gia dụng") || lowerName.includes("nội thất") || lowerName.includes("văn phòng") || lowerName.includes("nhà cửa")) {
    return <HomeApplianceIcon className="w-10 h-10" />;
  }
  
  // Real Estate
  if (lowerName.includes("bất động sản") || lowerName.includes("nhà") || lowerName.includes("đất")) {
    return <RealEstateIcon className="w-10 h-10" />;
  }
  
  // Electronics & Technology
  if (lowerName.includes("điện tử") || lowerName.includes("điện thoại") || lowerName.includes("máy tính") || lowerName.includes("công nghệ")) {
    return <ElectronicsIcon className="w-10 h-10" />;
  }
  
  // Vehicles & Transportation
  if (lowerName.includes("xe") || lowerName.includes("ô tô") || lowerName.includes("xe máy") || lowerName.includes("phương tiện")) {
    return <VehiclesIcon className="w-10 h-10" />;
  }
  
  // Fashion & Clothing
  if (lowerName.includes("thời trang") || lowerName.includes("quần áo") || lowerName.includes("phụ kiện") || lowerName.includes("trang phục")) {
    return <FashionIcon className="w-10 h-10" />;
  }
  
  // Sports & Recreation
  if (lowerName.includes("thể thao") || lowerName.includes("giải trí") || lowerName.includes("vui chơi") || lowerName.includes("hoạt động")) {
    return <SportsIcon className="w-10 h-10" />;
  }
  
  // Pets & Animals
  if (lowerName.includes("thú cưng") || lowerName.includes("động vật") || lowerName.includes("pet")) {
    return <PetsIcon className="w-10 h-10" />;
  }
  
  // Food & Beverages
  if (lowerName.includes("thức ăn") || lowerName.includes("đồ uống") || lowerName.includes("thực phẩm") || lowerName.includes("ăn uống")) {
    return <FoodBeverageIcon className="w-10 h-10" />;
  }
  
  // Books & Education
  if (lowerName.includes("sách") || lowerName.includes("giáo dục") || lowerName.includes("học tập") || lowerName.includes("văn phòng phẩm")) {
    return <BooksEducationIcon className="w-10 h-10" />;
  }
  
  // Beauty & Health
  if (lowerName.includes("làm đẹp") || lowerName.includes("sức khỏe") || lowerName.includes("y tế") || lowerName.includes("chăm sóc")) {
    return <BeautyHealthIcon className="w-10 h-10" />;
  }
  
  // Default fallback
  return <OtherProductsIcon className="w-10 h-10" />;
};

// Get display name for category
const getDisplayName = (name: string): string => {
  const lowerName = name.toLowerCase();
  
  if (lowerName.includes("thiết bị thí nghiệm")) return "Thiết Bị Thí Nghiệm";
  if (lowerName.includes("thiết bị đo lường")) return "Thiết Bị Đo Lường";
  if (lowerName.includes("thiết bị công nghiệp")) return "Thiết Bị Công Nghiệp";
  if (lowerName.includes("thiết bị gia dụng") || lowerName.includes("nội thất")) return "Thiết Bị Gia Dụng";
  if (lowerName.includes("bất động sản") || lowerName.includes("xe cộ")) return "Bất Động Sản";
  if (lowerName.includes("sản phẩm khác")) return "Sản Phẩm Khác";
  
  // Shorten long names
  if (name.length > 20) {
    const parts = name.split(' - ');
    return parts[0] || name.substring(0, 15) + '...';
  }
  
  return name;
};

// Loading skeleton component
const CategorySkeleton = () => (
  <div className="flex flex-col items-center animate-pulse">
    <div className="w-full aspect-[4/3] bg-gray-200 dark:bg-gray-700 rounded-2xl"></div>
    <div className="mt-2 h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
  </div>
);

// Error state component
const ErrorState = ({ onRetry }: { onRetry: () => void }) => (
  <div className="col-span-full flex flex-col items-center justify-center py-12">
    <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
    <p className="text-lg font-semibold text-foreground mb-2">
      Không thể tải danh mục
    </p>
    <p className="text-sm text-muted-foreground mb-4">
      Đã có lỗi xảy ra khi tải danh mục. Vui lòng thử lại.
    </p>
    <button
      onClick={onRetry}
      className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors duration-200"
    >
      Thử lại
    </button>
  </div>
);

export default function Categories() {
  const { categories, refetchCategories, isLoading } = useAuctionCategories();
  const [error, setError] = useState(false);

  // Transform API categories to UI format
  const uiCategories = useMemo(() => {
    if (!categories || !Array.isArray(categories)) return [];
    
    const mappedCategories = categories
      .filter((cat: Category) => cat.status !== false)
      .slice(0, 6)
      .map((cat: Category, index: number): CategoryUI => {
        const style = categoryStyles[index % categoryStyles.length];
        
        return {
          id: cat._id,
          name: cat.name,
          displayName: getDisplayName(cat.name),
          icon: getIconForCategory(cat.name),
          bgGradient: style.bgGradient,
          iconColor: style.iconColor,
          href: `${APP_ROUTES.CATEGORY}/${cat._id}`,
        };
      });

    // Add popular static categories if we have space
    const staticCategories: CategoryUI[] = [];
    
    // Always add "All Categories" as the last item
    const allCategory: CategoryUI = {
      id: 'all',
      name: 'Tất Cả',
      displayName: 'Tất Cả',
      icon: <AllCategoriesIcon className="w-10 h-10" />,
      bgGradient: categoryStyles[7].bgGradient,
      iconColor: categoryStyles[7].iconColor,
      href: `${APP_ROUTES.CATEGORY}/all`,
      badge: 'HOT',
      badgeColor: 'bg-gradient-to-r from-green-500 to-green-600'
    };
    
    // Add popular categories if we have less than 7 from API
    if (mappedCategories.length < 6) {
      const popularCategories = [
        {
          id: 'electronics',
          name: 'Điện Tử',
          displayName: 'Điện Tử',
          icon: <ElectronicsIcon className="w-10 h-10" />,
          href: `${APP_ROUTES.CATEGORY}/dien-tu`,
        },
        {
          id: 'vehicles',
          name: 'Xe Cộ',
          displayName: 'Xe Cộ',
          icon: <VehiclesIcon className="w-10 h-10" />,
          href: `${APP_ROUTES.CATEGORY}/vehicles`,
        },
        {
          id: 'fashion',
          name: 'Thời Trang',
          displayName: 'Thời Trang',
          icon: <FashionIcon className="w-10 h-10" />,
          href: `${APP_ROUTES.CATEGORY}/fashion`,
        },
        {
          id: 'sports',
          name: 'Thể Thao',
          displayName: 'Thể Thao',
          icon: <SportsIcon className="w-10 h-10" />,
          href: `${APP_ROUTES.CATEGORY}/sports`,
        }
      ];
      
      const needed = Math.min(6 - mappedCategories.length, popularCategories.length);
      for (let i = 0; i < needed; i++) {
        const cat = popularCategories[i];
        const styleIndex = (mappedCategories.length + i) % categoryStyles.length;
        staticCategories.push({
          ...cat,
          bgGradient: categoryStyles[styleIndex].bgGradient,
          iconColor: categoryStyles[styleIndex].iconColor,
        });
      }
    }
    
    return [...mappedCategories, ...staticCategories, allCategory];
  }, [categories]);

  // Handle error state
  useEffect(() => {
    if (categories === null && !isLoading) {
      setError(true);
    } else {
      setError(false);
    }
  }, [categories, isLoading]);

  const handleRetry = () => {
    setError(false);
    refetchCategories();
  };

  return (
    <section className="w-full bg-white dark:bg-background py-8 px-4 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-6">
          <h2 className="text-xl lg:text-2xl font-bold text-gray-900 dark:text-foreground">
            Khám phá danh mục đấu giá
          </h2>
          <p className="text-sm text-gray-600 dark:text-muted-foreground mt-1">
            Tìm sản phẩm phù hợp với nhu cầu của bạn
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4 lg:gap-5">
          {/* Loading State */}
          {isLoading && (
            <>
              {[...Array(8)].map((_, index) => (
                <CategorySkeleton key={index} />
              ))}
            </>
          )}

          {/* Error State */}
          {error && <ErrorState onRetry={handleRetry} />}

          {/* Categories */}
          {!isLoading && !error && uiCategories.map((category) => (
            <Link
              key={category.id}
              href={category.href}
              className="group relative flex flex-col items-center"
              aria-label={`Danh mục ${category.name}`}
            >
              <div className={`
                relative w-full aspect-[4/3] max-w-[140px] mx-auto
                flex items-center justify-center
                rounded-3xl shadow-lg border border-white/20
                ${category.bgGradient}
                transition-all duration-300 ease-out
                hover:shadow-xl hover:scale-105 hover:-translate-y-1
                cursor-pointer
                backdrop-blur-sm
              `}>
                <div className={`
                  transition-all duration-300
                  group-hover:scale-110
                  drop-shadow-sm
                `}>
                  {category.icon}
                </div>
                
                {/* Badge */}
                {category.badge && (
                  <span className={`
                    absolute -top-1 -right-1 
                    ${category.badgeColor} 
                    text-white text-[10px] font-bold
                    px-2 py-0.5 rounded-full
                    shadow-sm
                  `}>
                    {category.badge}
                  </span>
                )}
              </div>
              
              {/* Category Name */}
              <h3 className="mt-3 text-xs lg:text-sm font-semibold text-gray-800 dark:text-foreground text-center line-clamp-2 
                            transition-colors duration-200 group-hover:text-gray-900 dark:group-hover:text-white">
                {category.displayName}
              </h3>
            </Link>
          ))}
        </div>

        {/* Bottom Section - Optional promotional banner */}
        {!isLoading && !error && categories && (
          <div className="mt-10 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-950/20 dark:to-orange-950/20 rounded-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-900 dark:text-foreground">
                  Đấu giá phong phú, mỗi ngày đều có hàng mới!
                </p>
                <p className="text-xs text-gray-600 dark:text-muted-foreground mt-1">
                  {categories.length} danh mục đang hoạt động với hàng ngàn sản phẩm
                </p>
              </div>
              <Link
                href={APP_ROUTES.PRODUCT_NEW}
                className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium rounded-lg transition-colors duration-200 shadow-sm"
              >
                Đăng đấu giá
              </Link>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}