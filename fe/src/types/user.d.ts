export interface BodyRegisterRequest {
  userName: string;
  password: string;
  fullName: string; // Backend expects 'fullName', not 'full_name'
  email: string;
  identity: string;
  phone: string;
}

export interface BodySigninRequest {
  userName: string;
  password: string;
}

export interface BodyUpdateUserRequest {
  fullName: string;
  email: string;
  identity: string;
  phone: string;
}

export interface BodyChangePasswordRequest {
  old_password: string;
  new_password: string;
}

export interface BodyForgotPasswordRequest {
  email: string;
}

export interface BodyResetPasswordRequest {
  token: string;
  newPassword: string;
}

export interface BodyCheckUserRequest {
  email: string;
  phone: string;
  identity: string;
  userName: string;
}

export interface ParamsWishlistAdd {
  id: string;
}

export interface ParamsWishlistRemove {
  id: string;
}

export interface User {
  _id?: string;
  user_name?: string;
  full_name?: string;
  avatar?: string;
  email?: string;
  password?: string;
  identity?: string;
  phone?: string;
  role?: "user" | "admin" | string | undefined;
  status?: boolean;
  passwordResetToken?: string;
  passwordResetExpires?: Date;
}

export interface WishlistItem {
  _id: string;
  user_id: string;
  auction_id: string;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface UserCookie {
  idUser: string;
  email: string;
  role: string;
}

export interface AdminGetAllUsersParams {
  page?: number;
  limit?: number;
  keyword?: string;
  status?: string;
}
export type AdminGetAllAuctionsParams = Omit<AdminGetAllUsersParams, "status">;
export type AdminGetAllCategoriesParams = AdminGetAllUsersParams;
export interface AdminCreateCategoryRequest {
  name: string;
}

export interface UserStats {
  sell: {
    totalRevenue: string;
    highestAuction: string;
    soldAmount: number;
    sellingAmount: number;
    willSellAmount: number;
  };
  buy: {
    totalSpending: string;
    bidAmount: number;
    boughtAmount: number;
    biddingAmount: number;
    followAmount: number;
  };
}
