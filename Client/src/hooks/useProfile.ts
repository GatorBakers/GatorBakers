import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';
import { fetchProfile, type ProfileData } from '../services/profileService';

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

function toUserProfile(data: ProfileData): UserProfile {
    return {
        name: `${data.first_name} ${data.last_name}`,
        city: data.city,
        state: data.state,
        favoriteBake: data.favorite_bake,
        photoUrl: data.photo_url,
        listingCount: data.listing_count,
        orderCount: data.order_count,
        createdAt: new Date(data.created_at).toLocaleDateString(),
    };
}

export function useProfile() {
    const { accessToken } = useAuth();

    const { data: profile, isLoading, error } = useQuery<UserProfile, Error>({
        queryKey: ['profile'],
        queryFn: async () => {
            const data = await fetchProfile(accessToken!);
            return toUserProfile(data);
        },
        enabled: !!accessToken,
        staleTime: 5 * 60 * 1000, // 5 minutes
    });

    const authError = !accessToken
        ? 'You must be logged in to view your profile.'
        : null;

    return {
        profile: profile ?? null,
        isLoading: !!accessToken && isLoading,
        error: authError ?? (error?.message || null),
    };
}
