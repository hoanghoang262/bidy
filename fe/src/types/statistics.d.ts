export interface IStatistic {
  users: {
    totalUsers: number;
    isBlock: number;
    isActive: number;
  };
  auctions: {
    totalAuctions: number;
    isFinished: number;
    isHappening: number;
  };
  categories: {
    totalCategories: number;
    isHide: number;
    isShow: number;
  };
}
export interface IStatisticAuction {
  month: string;
  amount: string;
}
export type IStatisticAuctions = IStatisticAuction[];
