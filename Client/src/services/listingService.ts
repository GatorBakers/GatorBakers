import { API_URL, throwApiError } from './api';

export interface ListingData {
    id: number;
    user_id: number;
    title: string;
    description: string;
    price: string;
    quantity: number;
    listing_status: 'AVAILABLE' | 'PENDING' | 'CONFIRMED' | 'SOLD' | 'COMPLETED' | 'CANCELLED';
    photo_url: string;
    ingredients: string[];
    allergens: string[];
    created_at: string;
    user: {
        first_name: string;
        last_name: string;
    };
}

export interface CreateListingPayload {
    title: string;
    description: string;
    price: string;
    quantity: number;
    photo_url?: string;
    ingredients: string[];
    allergens: string[];
}

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

export async function fetchListing(id: number): Promise<ListingData> {
    const response = await fetch(`${API_URL}/listing/${id}`);

    if (!response.ok) {
        await throwApiError(response, 'Failed to load listing');
    }

    return response.json() as Promise<ListingData>;
}
