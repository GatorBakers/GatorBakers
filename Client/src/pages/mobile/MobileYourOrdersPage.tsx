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
    orders: Order[];
    listings: Listing[];
}

const MobileYourOrdersPage = ({ orders, listings }: MobileYourOrdersPageProps) => {
    return (
        <div className="m-your-orders-page">
            <section className="m-your-orders-section">
                <h2 className="m-your-orders-heading">Your Orders</h2>
                <div className="m-your-orders-list">
                    {orders.map((order) => (
                        <MobileOrderCard
                            key={order.id}
                            itemName={order.itemName}
                            bakerName={order.bakerName}
                            status={order.status}
                            pickupTime={order.pickupTime}
                            pickupAddress={order.pickupAddress}
                        />
                    ))}
                </div>
            </section>

            <section className="m-your-listings-section">
                <h2 className="m-your-orders-heading">Your Listings</h2>
                <div className="m-your-listings-grid">
                    {listings.map((listing) => (
                        <MobileListingCard
                            key={listing.id}
                            title={listing.title}
                            bakerName={listing.bakerName}
                            price={listing.price}
                        />
                    ))}
                </div>
            </section>
        </div>
    );
};

export default MobileYourOrdersPage;
