import type { ListingFeedParams } from '@shared/types';

export const queryKeys = {
    profileRoot: ['profile'] as const,
    profile: (scope: string | null) => ['profile', scope ?? 'anonymous'] as const,
    myListingsRoot: ['my-listings'] as const,
    myListings: (scope: string | null) => ['my-listings', scope ?? 'anonymous'] as const,
    listingsFeed: (params: ListingFeedParams = {}) => [
        'listings-feed',
        params.search ?? '',
        params.category ?? '',
        params.status ?? '',
    ] as const,
    buyerOrders: (userId: number) => ['orders', 'buyer', userId] as const,
    sellerOrders: (userId: number) => ['orders', 'seller', userId] as const,
};
