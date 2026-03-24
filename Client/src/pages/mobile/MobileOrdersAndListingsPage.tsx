import MobileOrderCard from '../../components/mobile/MobileOrderCard';
import type { OrderStatus } from '../../components/StatusBadge';
import EmptyState from '../../components/EmptyState';
import './MobileOrdersAndListingsPage.css';

interface Order {
    id: number;
    itemName: string;
    bakerName: string;
    status: OrderStatus;
    pickupTime: string;
    pickupAddress: string;
}

interface MobileYourOrdersPageProps {
    // TODO: Once API calls are added in YourOrderPage.tsx, these props will carry real data.
    //       Consider passing loading/error states here as well so the mobile view can show
    //       skeleton loaders or error messages.
    pendingOrders: Order[];
    orders: Order[];
}

const MobileYourOrdersPage = ({ pendingOrders, orders }: MobileYourOrdersPageProps) => {
    // TODO: Auth context is resolved in the parent (YourOrderPage.tsx) — no userId needed here directly,
    //       but ensure the parent is not rendering this component before auth is confirmed.

    // TODO: Wire up onViewDetails on each MobileOrderCard to navigate to the order detail page.
    //       e.g. navigate(`/orders/${order.id}`) — GET /api/orders/{orderId}.

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
                                bakerName={order.bakerName}
                                status={order.status}
                                pickupTime={order.pickupTime}
                                pickupAddress={order.pickupAddress}
                                onConfirm={() => {}}
                                onDeny={() => {}}
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
                                bakerName={order.bakerName}
                                status={order.status}
                                pickupTime={order.pickupTime}
                                pickupAddress={order.pickupAddress}
                            />
                        ))
                    )}
                </div>
            </section>
        </div>
    );
};

export default MobileYourOrdersPage;
