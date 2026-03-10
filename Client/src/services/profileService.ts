const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

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
        const text = await response.text().catch(() => "");
        let message = `Failed to load profile (${response.status})`;
        try {
            const data = JSON.parse(text);
            if (data?.message) message = data.message;
        } catch {
            // non-JSON body, use default message
        }
        throw new Error(message);
    }

    return response.json() as Promise<ProfileData>;
}
