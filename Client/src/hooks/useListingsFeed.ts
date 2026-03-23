import { useQuery } from '@tanstack/react-query';
import type { ListingFeedParams } from '@shared/types';
import { fetchListings, type ListingData } from '../services/listingService';
import { queryKeys } from './queryKeys';

interface UseListingsFeedOptions {
    params?: ListingFeedParams;
    enabled?: boolean;
}

export function useListingsFeed({ params = {}, enabled = true }: UseListingsFeedOptions = {}) {
    const { data, isLoading, error } = useQuery<ListingData[], Error>({
        queryKey: queryKeys.listingsFeed(params),
        queryFn: async () => fetchListings(params),
        enabled,
        staleTime: 60 * 1000,
        retry: false,
    });

    return {
        listings: data ?? [],
        isLoading,
        error: error?.message ?? null,
    };
}
