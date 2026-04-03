import { useState } from 'react';
import OrderCard from '../components/OrderCard';
import type { OrderStatus } from '../components/StatusBadge';
import EmptyState from '../components/EmptyState';
import MobileYourOrdersPage from './mobile/MobileOrdersAndListingsPage';
import { useIsMobile } from '../hooks/useIsMobile';
import { useProfile } from '../hooks/useProfile';
import { useBuyerOrders } from '../hooks/useBuyerOrders';
import { useSellerOrders } from '../hooks/useSellerOrders';
import { useUpdateOrderStatus } from '../hooks/useOrderMutations';
import type { BuyerOrder, SellerOrder, OrderStatus as ApiOrderStatus } from '@shared/types';
import './OrdersAndListingsPage.css';

interface Order {
    id: number;
    buyerUserId?: number;
    itemName: string;
    bakerName: string;
    status: OrderStatus;
    pickupTime: string;
    pickupAddress: string;
    imageUrl?: string;
}

const formatPickupTime = (pickupTime: string | null): string => {
    if (!pickupTime) {
        return 'Time TBD';
    }
    const [hours, minutes] = pickupTime.split(':').map(Number);
    if (Number.isNaN(hours) || Number.isNaN(minutes)) {
        return pickupTime;
    }
    const period = hours >= 12 ? 'PM' : 'AM';
    const hour = hours % 12 || 12;
    return `${hour}:${String(minutes).padStart(2, '0')} ${period}`;
};

const parseLegacyPickup = (pickupLocation: string): { pickupAddress: string; pickupTime: string } => {
    const [address, time] = pickupLocation.split(' @ ');
    if (time) {
        return {
            pickupAddress: address,
            pickupTime: formatPickupTime(time),
        };
    }
    return {
        pickupAddress: pickupLocation,
        pickupTime: 'Time TBD',
    };
};

const toUiStatus = (status: ApiOrderStatus): OrderStatus => {
    if (status === 'PENDING') return 'pending';
    if (status === 'CONFIRMED') return 'ready_for_pickup';
    if (status === 'COMPLETED') return 'completed';
    return 'cancelled';
};

const mapBuyerOrder = (order: BuyerOrder): Order => {
    const legacyPickup = parseLegacyPickup(order.pickup_location);
    const pickupAddress = order.pickup_time ? order.pickup_location : legacyPickup.pickupAddress;
    const pickupTime = order.pickup_time ? formatPickupTime(order.pickup_time) : legacyPickup.pickupTime;
    return {
        id: order.id,
        itemName: order.listing.title,
        bakerName: order.listing.user
            ? `${order.listing.user.first_name} ${order.listing.user.last_name}`
            : 'Local baker',
        status: toUiStatus(order.status),
        pickupAddress,
        pickupTime,
        imageUrl: order.listing.photo_url,
    };
};

const mapSellerOrder = (order: SellerOrder): Order => {
    const legacyPickup = parseLegacyPickup(order.pickup_location);
    const pickupAddress = order.pickup_time ? order.pickup_location : legacyPickup.pickupAddress;
    const pickupTime = order.pickup_time ? formatPickupTime(order.pickup_time) : legacyPickup.pickupTime;
    return {
        id: order.id,
        buyerUserId: order.user.id,
        itemName: order.listing.title,
        bakerName: `${order.user.first_name} ${order.user.last_name}`,
        status: toUiStatus(order.status),
        pickupAddress,
        pickupTime,
        imageUrl: order.listing.photo_url,
    };
};

const YourOrdersPage = () => {
    const isMobile = useIsMobile();
    const [actionError, setActionError] = useState<string | null>(null);
    const { profile, isLoading: profileLoading, error: profileError } = useProfile();
    const userId = profile?.id ?? null;
    const { orders: buyerOrders, isLoading: buyerLoading, error: buyerError } = useBuyerOrders(userId);
    const { orders: sellerOrders, isLoading: sellerLoading, error: sellerError } = useSellerOrders(userId);
    const updateOrderStatusMutation = useUpdateOrderStatus();

    const incomingOrders = [
        ...sellerOrders.pending_orders,
        ...sellerOrders.confirmed_orders,
    ].map(mapSellerOrder);
    const myOrders = buyerOrders
        .filter((order) => order.listing.user?.id !== userId)
        .map(mapBuyerOrder);

    const handleConfirm = async (order: Order) => {
        if (!userId) {
            setActionError('You must be logged in as a seller to confirm orders.');
            return;
        }

        setActionError(null);
        try {
            await updateOrderStatusMutation.mutateAsync({
                orderId: order.id,
                status: 'CONFIRMED',
                buyerUserId: order.buyerUserId,
                sellerUserId: userId,
            });
        } catch (error) {
            setActionError(error instanceof Error ? error.message : 'Failed to confirm order.');
        }
    };

    const handleDeny = async (order: Order) => {
        if (!userId) {
            setActionError('You must be logged in as a seller to deny orders.');
            return;
        }

        setActionError(null);
        try {
            await updateOrderStatusMutation.mutateAsync({
                orderId: order.id,
                status: 'CANCELLED',
                buyerUserId: order.buyerUserId,
                sellerUserId: userId,
            });
        } catch (error) {
            setActionError(error instanceof Error ? error.message : 'Failed to deny order.');
        }
    };

    if (isMobile) {
        return (
            <MobileYourOrdersPage
                isLoading={profileLoading || buyerLoading || sellerLoading}
                error={profileError || buyerError || sellerError || actionError}
                pendingOrders={incomingOrders}
                orders={myOrders}
                onConfirmOrder={handleConfirm}
                onDenyOrder={handleDeny}
            />
        );
    }

    if (profileLoading || buyerLoading || sellerLoading) {
        return <div className="your-orders-page"><p>Loading orders…</p></div>;
    }

    const combinedError = profileError || buyerError || sellerError || actionError;
    if (combinedError) {
        return <div className="your-orders-page"><p>{combinedError}</p></div>;
    }

    return (
        <div className="your-orders-page">
            <div className="your-orders-col">
                <h2 className="your-orders-heading">Incoming Orders</h2>
                <div className="your-orders-list">
                    {incomingOrders.length === 0 ? (
                        <EmptyState
                            title="No pending orders"
                            subtitle="Order requests from buyers will appear here."
                        />
                    ) : (
                        incomingOrders.map((order) => (
                            <OrderCard
                                key={order.id}
                                itemName={order.itemName}
                                bakerName={order.bakerName}
                                status={order.status}
                                pickupTime={order.pickupTime}
                                pickupAddress={order.pickupAddress}
                                imageUrl={order.imageUrl}
                                onConfirm={order.status === 'pending' ? () => handleConfirm(order) : undefined}
                                onDeny={order.status === 'pending' ? () => handleDeny(order) : undefined}
                            />
                        ))
                    )}
                </div>
            </div>

            <div className="your-orders-col">
                <h2 className="your-orders-heading">Your Orders</h2>
                <div className="your-orders-list">
                    {myOrders.length === 0 ? (
                        <EmptyState
                            title="No active orders"
                            subtitle="Your orders will appear here once you place one."
                        />
                    ) : (
                        myOrders.map((order) => (
                            <OrderCard
                                key={order.id}
                                itemName={order.itemName}
                                bakerName={order.bakerName}
                                status={order.status}
                                pickupTime={order.pickupTime}
                                pickupAddress={order.pickupAddress}
                                imageUrl={order.imageUrl}
                            />
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default YourOrdersPage;