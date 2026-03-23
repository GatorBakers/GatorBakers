import type { ListingFeedParams } from '@shared/types';

export const queryKeys = {
    profile: ['profile'] as const,
    myListings: ['my-listings'] as const,
    listingsFeed: (params: ListingFeedParams = {}) => [
        'listings-feed',
        params.search ?? '',
        params.category ?? '',
        params.status ?? '',
    ] as const,
    buyerOrders: (userId: number) => ['orders', 'buyer', userId] as const,
    sellerOrders: (userId: number) => ['orders', 'seller', userId] as const,
};
