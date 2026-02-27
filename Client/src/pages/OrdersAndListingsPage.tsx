import OrderCard from '../components/OrderCard';
import type { OrderStatus } from '../components/StatusBadge';
import UserListings from '../components/UserListings';
import type { Listing } from '../components/UserListings';
import EmptyState from '../components/EmptyState';
import MobileYourOrdersPage from './mobile/MobileOrdersAndListingsPage';
import { useIsMobile } from '../hooks/useIsMobile';
import './OrdersAndListingsPage.css';

interface Order {
    id: number;
    itemName: string;
    bakerName: string;
    status: OrderStatus;
    pickupTime: string;
    pickupAddress: string;
}

// TODO: Replace with useState + useEffect fetching the authenticated user's orders from the API.
//       GET /api/orders?userId={userId} — should return Order[] for the current user.
//       Handle loading and error states.
const placeholderOrders: Order[] = [
    { id: 1, itemName: 'Item Name', bakerName: 'Baker Name', status: 'ready_for_pickup', pickupTime: 'Pickup by 6:30 pm', pickupAddress: '123 Main Street' },
    { id: 2, itemName: 'Item Name', bakerName: 'Baker Name', status: 'pending', pickupTime: 'Pickup by 6:30 pm', pickupAddress: '123 Main Street' },
    { id: 3, itemName: 'Item Name', bakerName: 'Baker Name', status: 'completed', pickupTime: 'Pickup by 6:30 pm', pickupAddress: '123 Main Street' },
    { id: 4, itemName: 'Item Name', bakerName: 'Baker Name', status: 'cancelled', pickupTime: 'Pickup by 6:30 pm', pickupAddress: '123 Main Street' },
];

// TODO: Replace with useState + useEffect fetching the authenticated user's listings from the API.
//       GET /api/listings?userId={userId} — should return Listing[] owned by the current user.
//       Handle loading and error states.
const placeholderListings: Listing[] = [
    { id: 1, title: 'Product Title', bakerName: 'Baker Name', price: 0 },
    { id: 2, title: 'Product Title', bakerName: 'Baker Name', price: 0 },
    { id: 3, title: 'Product Title', bakerName: 'Baker Name', price: 0 },
    { id: 4, title: 'Product Title', bakerName: 'Baker Name', price: 0 },
];

const YourOrdersPage = () => {
    const isMobile = useIsMobile();

    // TODO: Pull the current user's ID from the auth context once authentication is implemented.
    //       e.g. const { userId } = useAuth(); — pass userId into the fetch calls for orders and listings.

    // TODO: Wire up onViewDetails for each OrderCard to navigate to an order detail page.
    //       e.g. navigate(`/orders/${order.id}`) — GET /api/orders/{orderId} for full details.

    // TODO: Wire up onAction for each listing ProductCard to navigate to the listing edit page.
    //       e.g. navigate(`/listings/${listing.id}/edit`) — GET/PATCH /api/listings/{listingId}.

    if (isMobile) {
        return (
            <MobileYourOrdersPage
                orders={placeholderOrders}
                listings={placeholderListings}
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

            <UserListings listings={placeholderListings} />
        </div>
    );
};

export default YourOrdersPage;
