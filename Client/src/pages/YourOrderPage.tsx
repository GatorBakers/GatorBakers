import OrderCard from '../components/OrderCard';
import type { OrderStatus } from '../components/OrderCard';
import ListingCard from '../components/ListingCard';
import MobileYourOrdersPage from './mobile/MobileYourOrdersPage';
import { useIsMobile } from '../hooks/useIsMobile';
import './YourOrdersPage.css';

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

const placeholderOrders: Order[] = [
    { id: 1, itemName: 'Item Name', bakerName: 'Baker Name', status: 'ready_for_pickup', pickupTime: 'Pickup by 6:30 pm', pickupAddress: '123 Main Street' },
    { id: 2, itemName: 'Item Name', bakerName: 'Baker Name', status: 'pending', pickupTime: 'Pickup by 6:30 pm', pickupAddress: '123 Main Street' },
    { id: 3, itemName: 'Item Name', bakerName: 'Baker Name', status: 'completed', pickupTime: 'Pickup by 6:30 pm', pickupAddress: '123 Main Street' },
    { id: 4, itemName: 'Item Name', bakerName: 'Baker Name', status: 'cancelled', pickupTime: 'Pickup by 6:30 pm', pickupAddress: '123 Main Street' },
];

const placeholderListings: Listing[] = [
    { id: 1, title: 'Product Title', bakerName: 'Baker Name', price: 0 },
    { id: 2, title: 'Product Title', bakerName: 'Baker Name', price: 0 },
    { id: 3, title: 'Product Title', bakerName: 'Baker Name', price: 0 },
    { id: 4, title: 'Product Title', bakerName: 'Baker Name', price: 0 },
];

const YourOrdersPage = () => {
    const isMobile = useIsMobile();

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
                    {placeholderOrders.map((order) => (
                        <OrderCard
                            key={order.id}
                            itemName={order.itemName}
                            bakerName={order.bakerName}
                            status={order.status}
                            pickupTime={order.pickupTime}
                            pickupAddress={order.pickupAddress}
                        />
                    ))}
                </div>
            </div>

            <div className="your-listings-col">
                <h2 className="your-orders-heading">Your Listings</h2>
                <div className="your-listings-grid">
                    {placeholderListings.map((listing) => (
                        <ListingCard
                            key={listing.id}
                            title={listing.title}
                            bakerName={listing.bakerName}
                            price={listing.price}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default YourOrdersPage;
