import { API_URL, throwApiError } from './api';
import type {
    BuyerOrder,
    CreateListingRequest,
    CreateOrderRequest,
    ListingFeedParams,
    ListingSummary,
    OrderRecord,
    SellerOrdersResponse,
    UpdateOrderStatusRequest,
} from '@shared/types';

export type ListingData = ListingSummary;

export type CreateListingPayload = CreateListingRequest;

// Create a new listing for the logged-in user
export async function createListing(
    accessToken: string,
    payload: CreateListingPayload,
): Promise<ListingData> {
    const response = await fetch(`${API_URL}/listing`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
        },
        credentials: 'include',
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        await throwApiError(response, 'Failed to create listing');
    }

    return response.json() as Promise<ListingData>;
}

// Fetch the public listings feed with optional filters
export async function fetchListings(params: ListingFeedParams = {}): Promise<ListingData[]> {
    const queryParams = new URLSearchParams();

    queryParams.set('sortBy', params.sortBy ?? 'recent');

    // Search functionality deferred to future PR
    // if (params.search) {
    //     queryParams.set('search', params.search);
    // }
    // if (params.category) {
    //     queryParams.set('category', params.category);
    // }
    if (params.status) {
        queryParams.set('status', params.status);
    }

    const query = queryParams.toString();
    const response = await fetch(`${API_URL}/discovery/listings${query ? `?${query}` : ''}`, {
        credentials: 'include',
    });

    if (!response.ok) {
        await throwApiError(response, 'Failed to load listings feed');
    }

    return response.json() as Promise<ListingData[]>;
}

// Fetch listings created by the logged-in user
export async function fetchMyListings(accessToken: string): Promise<ListingData[]> {
    const response = await fetch(`${API_URL}/my-listings`, {
        headers: { Authorization: `Bearer ${accessToken}` },
        credentials: 'include',
    });

    if (!response.ok) {
        await throwApiError(response, 'Failed to load listings');
    }

    return response.json() as Promise<ListingData[]>;
}

// Fetch one listing by id
export async function fetchListing(id: number): Promise<ListingData> {
    const response = await fetch(`${API_URL}/listing/${id}`);

    if (!response.ok) {
        await throwApiError(response, 'Failed to load listing');
    }

    return response.json() as Promise<ListingData>;
}

// Create a new order for a listing
export async function createOrder(
    listingId: number,
    payload: CreateOrderRequest,
): Promise<OrderRecord> {
    const response = await fetch(`${API_URL}/listing/${listingId}/order`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        await throwApiError(response, 'Failed to create order');
    }

    return response.json() as Promise<OrderRecord>;
}

// Fetch all orders for a buyer
export async function fetchBuyerOrders(userId: number): Promise<BuyerOrder[]> {
    const response = await fetch(`${API_URL}/orders/user/${userId}`, {
        credentials: 'include',
    });

    if (!response.ok) {
        await throwApiError(response, 'Failed to load buyer orders');
    }

    return response.json() as Promise<BuyerOrder[]>;
}

// Fetch all orders for a seller
export async function fetchSellerOrders(userId: number): Promise<SellerOrdersResponse> {
    const response = await fetch(`${API_URL}/orders/seller/${userId}`, {
        credentials: 'include',
    });

    if (!response.ok) {
        await throwApiError(response, 'Failed to load seller orders');
    }

    return response.json() as Promise<SellerOrdersResponse>;
}

// Update an order status by id
export async function updateOrderStatus(
    orderId: number,
    payload: UpdateOrderStatusRequest,
): Promise<OrderRecord> {
    const response = await fetch(`${API_URL}/order/${orderId}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        await throwApiError(response, 'Failed to update order status');
    }

    return response.json() as Promise<OrderRecord>;
}
