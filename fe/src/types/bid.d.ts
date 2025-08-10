export interface PlaceBidPayload {
  id: string;
  price: number;
}

export interface AutoBidPayload {
  id: string;
  max: number;
}

export interface CreateOrderBody {
  isPayment: boolean;
  carts: {
    bid_id: string;
    _id: string;
  }[];
  info: {
    name: string;
    phone: string;
    email: string;
  };
}

export interface Bid {
  _id?: string;
  name?: string;
  owner: {
    _id?: string;
    full_name?: string;
  };
  time_remain?: string;
  quantity?: number;
  image?: string[];
  description?: string;
  category: string;
  finishedTime?: string;
  bidHideTime?: string;
  price?: string;
  priceBuyNow?: string;
  hasActiveAutoBid?: boolean;
  top_ownerships?: TopOwnership[];
  status?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface AdminBid extends Omit<Bid, "category"> {
  category: {
    _id: string;
    name: string;
  };
}

export interface Cart {
  _id?: string;
  user_id: string;
  bid_id: string;
  price?: string;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Category {
  _id?: string;
  name: string;
  image?: string[];
  status: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Order {
  _id?: string;
  user_id: string;
  bid_id: string;
  price?: string;
  isPayment?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface UploadImageKeyPayload {
  key: string | string[];
}
export interface UploadImageKeyRequest extends UploadImageKeyPayload {
  signal?: AbortSignal;
}

export interface AuctionCategory {
  _id: string;
  name: string;
  image: string[]; // or File[] if you're using local File objects
  status: boolean;
  createdAt: string; // or Date if parsed
  updatedAt: string; // or Date if parsed
  __v?: number;
}

export interface UpdateProductBody {
  name?: string;
  price?: string;
  priceBuyNow?: string;
  category: string;
  description?: string;
  finishedTime?: string;
  image?: (File | string)[];
}

export interface TopOwnership {
  user_id: string;
  user_name?: string;
  amount: number;
  isAuto?: boolean;
  limitBid?: number;
}
