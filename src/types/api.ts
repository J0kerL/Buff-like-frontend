export interface Result<T> {
  code: number;
  message: string;
  data: T;
  timestamp: string;
}

export interface PageResult<T> {
  total: number;
  list: T[];
  pageNum: number;
  pageSize: number;
  totalPages: number;
}

export interface User {
  id: number;
  username: string;
  mobile?: string;
  steamId?: string;
  avatar?: string;
  balance?: number;
}

export interface LoginVO {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface InventoryItem {
  id: number;
  templateId: number;
  itemName: string;
  iconUrl: string;
  wearValue: number;
  patternIndex: number;
  status: number;
  lockExpireTime?: string;
  getTime: string;
}

export interface InventoryStatistics {
  totalCount: number;
  inStockCount: number;
  onSaleCount: number;
  lockedCount: number;
  totalValue: number;
  rarityStats: Record<string, number>;
  typeStats: Record<string, number>;
}

export interface MarketListing {
  id: number;
  sellerId: number;
  sellerName: string;
  inventoryId: number;
  templateId: number;
  itemName: string;
  itemType?: string;
  iconUrl: string;
  wearValue: number;
  price: number;
  status: number;
  createTime: string;
}

export interface OrderItem {
  id: number;
  orderNo: string;
  buyerId: number;
  sellerId: number;
  itemName: string;
  iconUrl: string;
  totalAmount: number;
  status: number;
  createTime: string;
  payTime?: string;
  deliverTime?: string;
  finishTime?: string;
}

export interface WalletLog {
  id: number;
  type: number;
  typeName: string;
  amount: number;
  balanceAfter: number;
  orderNo?: string;
  remark?: string;
  createTime: string;
}

