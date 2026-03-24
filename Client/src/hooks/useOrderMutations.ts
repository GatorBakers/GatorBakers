import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { CreateOrderRequest, UpdatableOrderStatus } from '@shared/types';
import { createOrder, updateOrderStatus } from '../services/listingService';
import { queryKeys } from './queryKeys';
import { useAuth } from '../context/AuthContext';

interface CreateOrderInput {
    listingId: number;
    payload: CreateOrderRequest;
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
    const { accessToken } = useAuth();

    return useMutation({
        mutationFn: async ({ listingId, payload }: CreateOrderInput) => {
            if (!accessToken) {
                throw new Error('You must be logged in to place an order.');
            }

            return createOrder(accessToken, listingId, payload);
        },
        onSuccess: (createdOrder, variables) => {
            queryClient.invalidateQueries({ queryKey: ['orders'] });
            queryClient.invalidateQueries({ queryKey: queryKeys.myListingsRoot });
            queryClient.invalidateQueries({ queryKey: queryKeys.listingsFeedRoot });

            queryClient.invalidateQueries({ queryKey: queryKeys.buyerOrders(createdOrder.user_id) });
            if (variables.sellerUserId) {
                queryClient.invalidateQueries({ queryKey: queryKeys.sellerOrders(variables.sellerUserId) });
            }
        },
    });
}

export function useUpdateOrderStatus() {
    const queryClient = useQueryClient();
    const { accessToken } = useAuth();

    return useMutation({
        mutationFn: async ({ orderId, status }: UpdateOrderStatusInput) => {
            if (!accessToken) {
                throw new Error('You must be logged in to update order status.');
            }

            return updateOrderStatus(accessToken, orderId, { status });
        },
        onSuccess: (_updatedOrder, variables) => {
            queryClient.invalidateQueries({ queryKey: ['orders'] });
            queryClient.invalidateQueries({ queryKey: queryKeys.myListingsRoot });
            queryClient.invalidateQueries({ queryKey: queryKeys.listingsFeedRoot });

            if (variables.buyerUserId) {
                queryClient.invalidateQueries({ queryKey: queryKeys.buyerOrders(variables.buyerUserId) });
            }
            if (variables.sellerUserId) {
                queryClient.invalidateQueries({ queryKey: queryKeys.sellerOrders(variables.sellerUserId) });
            }
        },
    });
}
