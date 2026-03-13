import ProductCard from './ProductCard';
import EmptyState from './EmptyState';
import './UserListings.css';

export interface Listing {
    id: number;
    title: string;
    bakerName: string;
    price: number;
    itemDescription: string;
    ingredients: string[];
    allergens: string[];
    quantity: number;
}

interface UserListingsProps {
    listings: Listing[];
}

const UserListings = ({ listings }: UserListingsProps) => {
    return (
        <div className="your-listings-col">
            <h2 className="your-listings-heading">User Listings</h2>
            <div className="your-listings-grid">
                {listings.length === 0 ? (
                    <EmptyState
                        title="No listings yet"
                        subtitle="Listings you create will appear here."
                        className="your-listings-empty-span"
                    />
                ) : (
                    listings.map((listing) => (
                        <ProductCard
                            key={listing.id}
                            title={listing.title}
                            bakerName={listing.bakerName}
                            price={listing.price}
                            variant="listing"
                            itemDescription={listing.itemDescription}
                            ingredients={listing.ingredients}
                            allergens={listing.allergens}
                            quantity={listing.quantity}
                        />
                    ))
                )}
            </div>
        </div>
    );
};

export default UserListings;
