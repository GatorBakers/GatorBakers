import { useQuery } from '@tanstack/react-query';
import type { BuyerOrder } from '@shared/types';
import { fetchBuyerOrders } from '../services/listingService';
import { queryKeys } from './queryKeys';

export function useBuyerOrders(userId: number | null) {
    const { data, isLoading, error } = useQuery<BuyerOrder[], Error>({
        queryKey: queryKeys.buyerOrders(userId ?? -1),
        queryFn: async () => fetchBuyerOrders(userId!),
        enabled: userId !== null,
        staleTime: 60 * 1000,
        retry: false,
    });

    return {
        orders: data ?? [],
        isLoading,
        error: error?.message ?? null,
    };
}
