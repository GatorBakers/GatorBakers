import OrderCard from '../components/OrderCard';
import type { OrderStatus } from '../components/StatusBadge';
import EmptyState from '../components/EmptyState';
import MobileYourOrdersPage from './mobile/MobileOrdersAndListingsPage';
import { useIsMobile } from '../hooks/useIsMobile';
import './OrdersAndListingsPage.css';

// TODO: Create a PATCH endpoint to update the state of an order.
// * onConfirm - set order status to COMPLETED
// * onDeny - set order status to CANCELLED

interface Order {
    id: number;
    itemName: string;
    bakerName: string;
    status: OrderStatus;
    pickupTime: string;
    pickupAddress: string;
}

// TODO: Replace with real order data from the API once order fetching is implemented.
const placeholderOrders: Order[] = [];
const placeholderPendingOrders: Order[] = [];

const YourOrdersPage = () => {
    const isMobile = useIsMobile();

    if (isMobile) {
        return (
            <MobileYourOrdersPage
                pendingOrders={placeholderPendingOrders}
                orders={placeholderOrders}
            />
        );
    }

    return (
        <div className="your-orders-page">
            <div className="your-orders-col">
                <h2 className="your-orders-heading">Orders From Others</h2>
                <div className="your-orders-list">
                    {placeholderPendingOrders.length === 0 ? (
                        <EmptyState
                            title="No pending orders"
                            subtitle="Order requests from buyers will appear here."
                        />
                    ) : (
                        placeholderPendingOrders.map((order) => (
                            <OrderCard
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
            </div>

            <div className="your-orders-col">
                <h2 className="your-orders-heading">Orders You Placed</h2>
                <div className="your-orders-list">
                    {placeholderOrders.length === 0 ? (
                        <EmptyState
                            title="No active orders"
                            subtitle="Your orders will appear here once you place one."
                        />
                    ) : (
                        placeholderOrders.map((order) => (
                            <OrderCard
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
            </div>
        </div>
    );
};

export default YourOrdersPage;