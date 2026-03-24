import { useQuery } from '@tanstack/react-query';
import type { SellerOrdersResponse } from '@shared/types';
import { fetchSellerOrders } from '../services/listingService';
import { queryKeys } from './queryKeys';

const emptySellerOrders: SellerOrdersResponse = {
    pending_orders: [],
    confirmed_orders: [],
    cancelled_orders: [],
};

export function useSellerOrders(userId: number | null) {
    const { data, isLoading, error } = useQuery<SellerOrdersResponse, Error>({
        queryKey: queryKeys.sellerOrders(userId ?? -1),
        queryFn: async () => fetchSellerOrders(userId!),
        enabled: userId !== null,
        staleTime: 60 * 1000,
        retry: false,
    });

    return {
        orders: data ?? emptySellerOrders,
        isLoading,
        error: error?.message ?? null,
    };
}
