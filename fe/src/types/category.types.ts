export interface Category {
  _id: string;
  name: string;
  description?: string;
  image?: string;
  icon?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  _id: string;
  title: string;
  description: string;
  price: number;
  images: string[];
  category: string;
  seller: string;
  status: 'active' | 'inactive' | 'sold' | 'expired';
  createdAt: string;
  updatedAt: string;
  endTime?: string;
  currentBid?: number;
  totalBids?: number;
}

export interface Auction {
  _id: string;
  title: string;
  description: string;
  startPrice: number;
  currentBid: number;
  images: string[];
  category: string | { _id: string; name: string };
  seller: string;
  status: 'active' | 'inactive' | 'ended' | 'cancelled';
  endTime: string;
  startTime: string;
  totalBids: number;
  createdAt: string;
  updatedAt: string;
}