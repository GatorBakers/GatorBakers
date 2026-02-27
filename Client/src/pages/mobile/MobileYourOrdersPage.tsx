import MobileOrderCard from '../../components/mobile/MobileOrderCard';
import type { OrderStatus } from '../../components/StatusBadge';
import UserListings from '../../components/UserListings';
import type { Listing } from '../../components/UserListings';
import EmptyState from '../../components/EmptyState';
import './MobileYourOrdersPage.css';

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
    orders: Order[];
    listings: Listing[];
}

const MobileYourOrdersPage = ({ orders, listings }: MobileYourOrdersPageProps) => {
    // TODO: Auth context is resolved in the parent (YourOrderPage.tsx) — no userId needed here directly,
    //       but ensure the parent is not rendering this component before auth is confirmed.

    // TODO: Wire up onViewDetails on each MobileOrderCard to navigate to the order detail page.
    //       e.g. navigate(`/orders/${order.id}`) — GET /api/orders/{orderId}.

    // TODO: Wire up onAction on each listing ProductCard to navigate to the listing edit page.
    //       e.g. navigate(`/listings/${listing.id}/edit`) — GET/PATCH /api/listings/{listingId}.

    return (
        <div className="m-your-orders-page">
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

            <UserListings listings={listings} />
        </div>
    );
};

export default MobileYourOrdersPage;
