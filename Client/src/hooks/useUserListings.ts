import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';
import { fetchMyListings, type ListingData } from '../services/listingService';
import { queryKeys } from './queryKeys';

export interface Listing {
    id: number;
    title: string;
    bakerName: string;
    price: number;
    itemDescription: string;
    ingredients: string[];
    allergens: string[];
    quantity: number;
    imageUrl: string;
}

function toListing(data: ListingData): Listing {
    return {
        id: data.id,
        title: data.title,
        bakerName: `${data.user.first_name} ${data.user.last_name}`,
        price: parseFloat(data.price),
        itemDescription: data.description,
        ingredients: data.ingredients ?? [],
        allergens: data.allergens ?? [],
        quantity: data.quantity ?? 0,
        imageUrl: data.photo_url,
    };
}

export function useUserListings() {
    const { accessToken, isAuthLoading } = useAuth();

    const { data: listings, isLoading, error } = useQuery<Listing[], Error>({
        queryKey: queryKeys.myListings(accessToken),
        queryFn: async () => {
            const data = await fetchMyListings(accessToken!);
            return data.map(toListing);
        },
        enabled: !!accessToken,
        staleTime: 5 * 60 * 1000,
        retry: false,
    });

    const authError = !isAuthLoading && !accessToken
        ? 'You must be logged in to view your listings.'
        : null;

    return {
        listings: listings ?? [],
        isLoading: isAuthLoading || (!!accessToken && isLoading),
        error: authError ?? (error?.message || null),
    };
}
