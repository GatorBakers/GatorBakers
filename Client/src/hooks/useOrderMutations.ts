import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { CreateOrderRequest, UpdatableOrderStatus } from '@shared/types';
import { createOrder, updateOrderStatus } from '../services/listingService';
import { queryKeys } from './queryKeys';

interface CreateOrderInput {
    listingId: number;
    payload: CreateOrderRequest;
    buyerUserId?: number;
    sellerUserId?: number;
}

interface UpdateOrderStatusInput {
    orderId: number;
    status: UpdatableOrderStatus;
    buyerUserId?: number;
    sellerUserId?: number;
}

export function useCreateOrder() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ listingId, payload }: CreateOrderInput) => createOrder(listingId, payload),
        onSuccess: (_createdOrder, variables) => {
            queryClient.invalidateQueries({ queryKey: queryKeys.myListings });

            if (variables.buyerUserId) {
                queryClient.invalidateQueries({ queryKey: queryKeys.buyerOrders(variables.buyerUserId) });
            }
            if (variables.sellerUserId) {
                queryClient.invalidateQueries({ queryKey: queryKeys.sellerOrders(variables.sellerUserId) });
            }
        },
    });
}

export function useUpdateOrderStatus() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ orderId, status }: UpdateOrderStatusInput) =>
            updateOrderStatus(orderId, { status }),
        onSuccess: (_updatedOrder, variables) => {
            queryClient.invalidateQueries({ queryKey: queryKeys.myListings });

            if (variables.buyerUserId) {
                queryClient.invalidateQueries({ queryKey: queryKeys.buyerOrders(variables.buyerUserId) });
            }
            if (variables.sellerUserId) {
                queryClient.invalidateQueries({ queryKey: queryKeys.sellerOrders(variables.sellerUserId) });
            }
        },
    });
}
