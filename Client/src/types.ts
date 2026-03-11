export type OrderStatus = 'ready_for_pickup' | 'pending' | 'completed' | 'cancelled';

export type ProductCardVariant = 'to_order' | 'listing';

export interface Listing {
    id: number;
    title: string;
    bakerName: string;
    price: number;
    itemDescription: string;
    ingredients: string[];
    allergens: string[];
}

export interface Order {
    id: number;
    itemName: string;
    bakerName: string;
    status: OrderStatus;
    pickupTime: string;
    pickupAddress: string;
}

export interface UserProfile {
    name: string;
    city: string | null;
    state: string | null;
    favoriteBake: string | null;
    photoUrl: string | null;
    listingCount: number;
    orderCount: number;
    createdAt: string;
}

export interface ProfileData {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
    account_status: string | null;
    photo_url: string | null;
    favorite_bake: string | null;
    created_at: string;
    city: string | null;
    state: string | null;
    listing_count: number;
    order_count: number;
}

export interface ListingForm {
    name: string;
    description: string;
    price: string;
    ingredients: string[];
    allergens: string[];
    image: File | null;
}
