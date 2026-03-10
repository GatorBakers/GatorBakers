import OrderCard from '../components/OrderCard';
import type { OrderStatus } from '../components/StatusBadge';
import UserListings from '../components/UserListings';
import EmptyState from '../components/EmptyState';
import MobileYourOrdersPage from './mobile/MobileOrdersAndListingsPage';
import { useIsMobile } from '../hooks/useIsMobile';
import { useUserListings } from '../hooks/useUserListings';
import './OrdersAndListingsPage.css';

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

const YourOrdersPage = () => {
    const isMobile = useIsMobile();
    const { listings, isLoading: listingsLoading, error: listingsError } = useUserListings();

    if (isMobile) {
        return (
            <MobileYourOrdersPage
                orders={placeholderOrders}
                listings={listings}
            />
        );
    }

    return (
        <div className="your-orders-page">
            <div className="your-orders-col">
                <h2 className="your-orders-heading">Your Orders</h2>
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

            {listingsLoading ? (
                <div className="your-listings-col"><p>Loading listings…</p></div>
            ) : listingsError ? (
                <div className="your-listings-col"><p className="listings-error">{listingsError}</p></div>
            ) : (
                <UserListings listings={listings} />
            )}
        </div>
    );
};

export default YourOrdersPage;