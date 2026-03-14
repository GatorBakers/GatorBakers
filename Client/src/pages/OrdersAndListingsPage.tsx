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

// TODO: Replace with useState + useEffect fetching pending orders on the seller's listings from the API.
//       GET /orders/seller/:id 
//       Adding a pendingOrders[] array could be useful. Once confirmed or denied, remove order and move to confirmed/cancelledOrders[]
//       Handle loading and error states.
const placeholderPendingOrders: Order[] = [
    { id: 5, itemName: 'Item Name', bakerName: 'Buyer Name', status: 'pending', pickupTime: 'Pickup by 6:30 pm', pickupAddress: '123 Main Street' },
    { id: 6, itemName: 'Item Name', bakerName: 'Buyer Name', status: 'pending', pickupTime: 'Pickup by 6:30 pm', pickupAddress: '123 Main Street' },
];

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
    { id: 1, title: 'Product Title', bakerName: 'Baker Name', price: 0, itemDescription: 'Item Description', ingredients: ['Ingredient 1', 'Ingredient 2', 'Ingredient 3', 'Ingredient 4', 'Ingredient 5', 'Ingredient 6', 'Ingredient 7', 'Ingredient 8', 'Ingredient 9', 'Ingredient 10'], allergens: ['Allergen 1', 'Allergen 2', 'Allergen 3', 'Allergen 4', 'Allergen 5', 'Allergen 6', 'Allergen 7', 'Allergen 8', 'Allergen 9', 'Allergen 10'], quantity: 10 },
    { id: 2, title: 'Product Title', bakerName: 'Baker Name', price: 0, itemDescription: 'Item Description', ingredients: ['Ingredient 1', 'Ingredient 2', 'Ingredient 3'], allergens: ['Allergen 1', 'Allergen 2', 'Allergen 3'], quantity: 10 },
    { id: 3, title: 'Product Title', bakerName: 'Baker Name', price: 0, itemDescription: 'Item Description', ingredients: ['Ingredient 1', 'Ingredient 2', 'Ingredient 3'], allergens: ['Allergen 1', 'Allergen 2', 'Allergen 3'], quantity: 10 },
    { id: 4, title: 'Product Title', bakerName: 'Baker Name', price: 0, itemDescription: 'Item Description', ingredients: ['Ingredient 1', 'Ingredient 2', 'Ingredient 3'], allergens: ['Allergen 1', 'Allergen 2', 'Allergen 3'], quantity: 10 },
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
                pendingOrders={placeholderPendingOrders}
                orders={placeholderOrders}
                listings={placeholderListings}
            />
        );
    }

    return (
        <div className="your-orders-page">
            <div className="your-orders-col">
                <h2 className="your-orders-heading">Pending Orders</h2>
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
