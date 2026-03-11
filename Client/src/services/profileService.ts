import { API_URL, throwApiError } from './api';
import type { ProfileData } from '../types';

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
