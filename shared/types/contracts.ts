export type ListingStatus = 'AVAILABLE' | 'PENDING' | 'CONFIRMED' | 'SOLD' | 'COMPLETED' | 'CANCELLED';

export type OrderStatus = 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED' | 'SOLD';

export type UpdatableOrderStatus = 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';

export interface ListingAuthor {
  id?: number;
  first_name: string;
  last_name: string;
}

export interface ListingSummary {
  id: number;
  user_id: number;
  title: string;
  description: string;
  price: string;
  quantity: number;
  listing_status: ListingStatus;
  photo_url: string;
  ingredients: string[];
  allergens: string[];
  created_at: string;
  user: ListingAuthor;
}

export interface CreateListingRequest {
  title: string;
  description: string;
  price: string;
  quantity: number;
  photo_url?: string;
  ingredients: string[];
  allergens: string[];
}

export interface CreateOrderRequest {
  user_id: number;
  pickup_location: string;
}

export interface OrderRecord {
  id: number;
  user_id: number;
  listing_id: number;
  pickup_location: string;
  status: OrderStatus;
  created_at: string;
}

export interface ListingOrderSummary {
  id: number;
  title: string;
  description: string;
  price: string;
  quantity: number;
  listing_status: ListingStatus;
  photo_url: string;
  ingredients: string[];
  allergens: string[];
}

export interface BuyerOrder {
  id: number;
  created_at: string;
  pickup_location: string;
  status: OrderStatus;
  listing: ListingOrderSummary;
}

export interface SellerOrder {
  id: number;
  created_at: string;
  pickup_location: string;
  status: OrderStatus;
  listing: ListingOrderSummary;
  user: {
    id: number;
    first_name: string;
    last_name: string;
  };
}

export interface SellerOrdersResponse {
  pending_orders: SellerOrder[];
  confirmed_orders: SellerOrder[];
  cancelled_orders: SellerOrder[];
}

export interface UpdateOrderStatusRequest {
  status: UpdatableOrderStatus;
}

export interface ListingFeedParams {
  search?: string;
  category?: string;
  status?: ListingStatus;
}
