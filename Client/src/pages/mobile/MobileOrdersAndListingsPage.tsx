import MobileOrderCard from '../../components/mobile/MobileOrderCard';
import type { OrderStatus } from '../../components/StatusBadge';
import EmptyState from '../../components/EmptyState';
import './MobileOrdersAndListingsPage.css';

interface Order {
    id: number;
    itemName: string;
    bakerName: string;
    buyerName: string;
    status: OrderStatus;
    pickupTime: string;
    pickupAddress: string;
    imageUrl?: string;
}

interface MobileYourOrdersPageProps {
    isLoading: boolean;
    error: string | null;
    pendingOrders: Order[];
    orders: Order[];
    onConfirmOrder: (order: Order) => void;
    onDenyOrder: (order: Order) => void;
}

const MobileYourOrdersPage = ({
    isLoading,
    error,
    pendingOrders,
    orders,
    onConfirmOrder,
    onDenyOrder,
}: MobileYourOrdersPageProps) => {
    // TODO: Auth context is resolved in the parent (YourOrderPage.tsx) — no userId needed here directly,
    //       but ensure the parent is not rendering this component before auth is confirmed.

    // TODO: Wire up onViewDetails on each MobileOrderCard to navigate to the order detail page.
    //       e.g. navigate(`/orders/${order.id}`) — GET /api/orders/{orderId}.

    if (isLoading) {
        return <div className="m-your-orders-page"><p>Loading orders…</p></div>;
    }

    if (error) {
        return <div className="m-your-orders-page"><p>{error}</p></div>;
    }

    return (
        <div className="m-your-orders-page">
            <section className="m-your-orders-section">
                <h2 className="m-your-orders-heading">Incoming Orders</h2>
                <div className="m-your-orders-list">
                    {pendingOrders.length === 0 ? (
                        <EmptyState
                            title="No pending orders"
                            subtitle="Order requests from buyers will appear here."
                        />
                    ) : (
                        pendingOrders.map((order) => (
                            <MobileOrderCard
                                key={order.id}
                                itemName={order.itemName}
                                otherPartyName={order.buyerName}
                                status={order.status}
                                pickupTime={order.pickupTime}
                                pickupAddress={order.pickupAddress}
                                imageUrl={order.imageUrl}
                                onConfirm={order.status === 'pending' ? () => onConfirmOrder(order) : undefined}
                                onDeny={order.status === 'pending' ? () => onDenyOrder(order) : undefined}
                            />
                        ))
                    )}
                </div>
            </section>

            <section className="m-your-orders-section">
                <h2 className="m-your-orders-heading">Your Orders</h2>
                <div className="m-your-orders-list">
                    {orders.length === 0 ? (
                        <EmptyState
                            title="No active orders"
                            subtitle="Your orders will appear here once you place one."
                        />
                    ) : (
                        orders.map((order) => (
                            <MobileOrderCard
                                key={order.id}
                                itemName={order.itemName}
                                otherPartyName={order.bakerName}
                                status={order.status}
                                pickupTime={order.pickupTime}
                                pickupAddress={order.pickupAddress}
                                imageUrl={order.imageUrl}
                            />
                        ))
                    )}
                </div>
            </section>
        </div>
    );
};

export default MobileYourOrdersPage;
