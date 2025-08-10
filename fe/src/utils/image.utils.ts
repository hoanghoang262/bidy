import { getAuctionImages } from "@/services/bid/bid.fetcher";
import { appConfig } from "@/config/app.config";
import logger from '@/utils/logger';

// Get API base URL from centralized configuration
const getApiBaseUrl = () => {
  return appConfig.api.baseUrl;
};

/**
 * Maps image URLs to proper format for Next.js Image component
 * @param images - Array of image URLs or filenames
 * @returns Array of properly formatted image URLs
 */
export function mapImageUrls(images: string[] | string | undefined): string[] {
  if (!images) {
    return ["/images.jpeg"];
  }
  
  const imageArray = Array.isArray(images) ? images : [images];
  
  return imageArray.map((img: string) => {
    // Handle different image URL formats
    if (img.startsWith("/") || img.startsWith("http")) {
      return img;
    }
    // If it's just a filename, use the backend uploads path
    if (img.includes(".")) {
      return `${getApiBaseUrl()}/uploads/${img}`;
    }
    // Fallback to default image
    return "/images.jpeg";
  });
}

/**
 * Maps a single image URL to proper format
 * @param image - Image URL or filename
 * @returns Properly formatted image URL
 */
export function mapImageUrl(image: string | undefined): string {
  if (!image) {
    return "/images.jpeg";
  }
  
  if (image.startsWith("/") || image.startsWith("http")) {
    return image;
  }
  
  if (image.includes(".")) {
    return `${getApiBaseUrl()}/uploads/${image}`;
  }
  
  return "/images.jpeg";
}

/**
 * Fetches image data from backend using the existing getAuctionImages function
 * @param key - Image key/filename
 * @returns Promise that resolves to image data
 */
export async function fetchImageData(key: string) {
  try {
    return await getAuctionImages(key);
  } catch (error) {
    // Log error only in development
    if (appConfig.dev.isDevelopment) {
      logger.error('Error fetching image', error, { key });
    }
    return null;
  }
} 