import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';
import { fetchProfile, type ProfileData } from '../services/profileService';
import { queryKeys } from './queryKeys';

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
    const { accessToken, isAuthLoading } = useAuth();

    const { data: profile, isLoading, error } = useQuery<UserProfile, Error>({
        queryKey: queryKeys.profile(accessToken),
        queryFn: async () => {
            const data = await fetchProfile(accessToken!);
            return toUserProfile(data);
        },
        enabled: !!accessToken,
        staleTime: 5 * 60 * 1000, // 5 minutes
        retry: false,
    });

    const authError = !isAuthLoading && !accessToken
        ? 'You must be logged in to view your profile.'
        : null;

    return {
        profile: profile ?? null,
        isLoading: isAuthLoading || (!!accessToken && isLoading),
        error: authError ?? (error?.message || null),
    };
}
