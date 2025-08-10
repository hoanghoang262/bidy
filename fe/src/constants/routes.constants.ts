export const APP_ROUTES = {
  HOME: "/",
  ABOUT: "/about",
  CONTACT: "/contact",
  NEWS: "/news",
  GUIDE: "/guide",
  SIGN_IN: "/signin",
  SIGN_UP: "/signup",
  FORGOT_PASS: "/forgot-password",
  RESET_PASS: "/reset-password",
  PROFILE: "/profile",
  SETTINGS: "/profile/settings",
  DASHBOARD: "/dashboard",
  USERS: "/dashboard/users",
  NOT_FOUND: "*",
  MESSAGES: "/profile/messages",
  NOTIFICATIONS: "/notifications",
  CATEGORY: "/category",
  PRODUCT_NEW: "/product/new",
  PRODUCT_DETAIL: (id: string | number) => `/product/${id}`,
  ADMIN: "/admin",
};
export const API_ROUTES = {
  // user
  USER_LIST: "/user",
  USER_STATS: "/user/stats",
  CHECK_USER: "/user/check",
  SIGN_IN: "/user/login",
  SIGN_UP: "/user/signup",
  PROFILE: "/user/profile",
  UPDATE_USER: "/user/update",
  FORGOT_PASS: "/user/forgot-password",
  RESET_PASS: "/user/reset-password",
  OTP: "/user/otp",
  VERIFY: "/user/verify",
  CHANGE_PASS: "/user/changePassword",
  WISHLIST: "/user/wishlist",
  WISHLIST_ADD: "/user/wishlist/add/:id",
  WISHLIST_REMOVE: "/user/wishlist/remove/:id",
  WISHLIST_REMOVE_ALL: "/user/wishlist/removeAll",

  // auction
  AUCTION_IMAGE_UPLOAD: "/auction/images",
  AUCTION_LISTING: "/auction/listing",
  AUCTION_ORDER: "/auction/order",
  AUCTION_CATEGORIES: "/auction/categories",
  AUCTION_MY: "/auction/myAuction",
  AUCTION_CART: "/auction/cart",
  AUCTION_END: "/auction/end",
  AUCTION_BY_STATUS: (status: string) => `/auction/${status}`,
  AUCTION_USER_BY_STATUS: (id: string, status: string) =>
    `/auction/${id}/${status}`,
  AUCTION_USER_BUY: (id: string) => `/auction/bought/${id}`,
  AUCTION_USER_SELL: (id: string) => `/auction/sold/${id}`,
  AUCTION_BY_CATEGORY: (category: string) => `/auction/category/${category}`,
  AUCTION_BY_ID: (id: string) => `/auction/listing/${id}`,
  AUCTION_SEARCH: (keyword: string) => `/auction/listing/search/${keyword}`,
  AUCTION_BUY_NOW: (id: string) => `/auction/listing/${id}/buy-now`,
  AUCTION_BID: (id: string) => `/auction/listing/${id}/bid`,
  AUCTION_AUTO_BID: (id: string) => `/auction/listing/${id}/auto-bid`,
  AUCTION_DELETE: (id: string) => `/auction/myAuction/${id}/delete`,
  AUCTION_FORCE_END: (id: string) => `/auction/${id}/end`,
  AUCTION_CREATE_ORDER: "/auction/order/create",

  //admin
  ADMIN_GET_ALL_USERS: "/admin/get-all-user",
  ADMIN_GET_ALL_AUCTIONS: "/admin/get-all-auction",
  ADMIN_GET_ALL_CATEGORIES: "/admin/get-all-category",
  ADMIN_CREATE_CATEGORY: "/admin/create-category",
  ADMIN_GET_STATISTIC: "/admin/get-statistic",
  ADMIN_GET_STATISTIC_AUCTIONS: "/admin/statistic/auctions",
  ADMIN_GET_STATISTIC_USERS: "/admin/statistic/users",
  ADMIN_UPDATE_STATUS_USER: (id: string) => `/admin/update-status-user/${id}`,
  ADMIN_UPDATE_CATEGORY: (id: string) => `/admin/update-category/${id}`,
  ADMIN_DELETE_CATEGORY: (id: string) => `/admin/delete-category/${id}`,
};

export const PUBLIC_ROUTES = [
  APP_ROUTES.SIGN_IN,
  APP_ROUTES.SIGN_UP,
  APP_ROUTES.FORGOT_PASS,
  APP_ROUTES.RESET_PASS,
  APP_ROUTES.HOME,
  APP_ROUTES.ABOUT,
  APP_ROUTES.NEWS,
  APP_ROUTES.CONTACT,
  APP_ROUTES.GUIDE,
  APP_ROUTES.CATEGORY,
];

export const PROTECTED_ROUTES = Object.entries(APP_ROUTES)
  .filter(
    ([, value]) => typeof value === "string" && !PUBLIC_ROUTES.includes(value)
  )
  .map(([, value]) => value as string);
