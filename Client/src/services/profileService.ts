import { API_URL, throwApiError } from './api';

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

export async function fetchProfile(accessToken: string): Promise<ProfileData> {
    const response = await fetch(`${API_URL}/profile`, {
        headers: { Authorization: `Bearer ${accessToken}` },
        credentials: "include",
    });

    if (!response.ok) {
        await throwApiError(response, "Failed to load profile");
    }

    return response.json() as Promise<ProfileData>;
}
