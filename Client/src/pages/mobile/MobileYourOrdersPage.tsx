import MobileOrderCard from '../../components/mobile/MobileOrderCard';
import type { OrderStatus } from '../../components/mobile/MobileOrderCard';
import MobileListingCard from '../../components/mobile/MobileListingCard';
import './MobileYourOrdersPage.css';

interface Order {
    id: number;
    itemName: string;
    bakerName: string;
    status: OrderStatus;
    pickupTime: string;
    pickupAddress: string;
}

interface Listing {
    id: number;
    title: string;
    bakerName: string;
    price: number;
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

    // TODO: Wire up onViewEdit on each MobileListingCard to navigate to the listing edit page.
    //       e.g. navigate(`/listings/${listing.id}/edit`) — GET/PATCH /api/listings/{listingId}.

    return (
        <div className="m-your-orders-page">
            <section className="m-your-orders-section">
                <h2 className="m-your-orders-heading">Your Orders</h2>
                <div className="m-your-orders-list">
                    {orders.length === 0 ? (
                        <div className="m-your-orders-empty">
                            <p className="m-your-orders-empty-title">No active orders</p>
                            <p className="m-your-orders-empty-sub">Your orders will appear here once you place one.</p>
                        </div>
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

            <section className="m-your-listings-section">
                <h2 className="m-your-orders-heading">Your Listings</h2>
                <div className="m-your-listings-grid">
                    {listings.length === 0 ? (
                        <div className="m-your-orders-empty m-your-listings-empty">
                            <p className="m-your-orders-empty-title">No listings yet</p>
                            <p className="m-your-orders-empty-sub">Listings you create will appear here.</p>
                        </div>
                    ) : (
                        listings.map((listing) => (
                            <MobileListingCard
                                key={listing.id}
                                title={listing.title}
                                bakerName={listing.bakerName}
                                price={listing.price}
                            />
                        ))
                    )}
                </div>
            </section>
        </div>
    );
};

export default MobileYourOrdersPage;
