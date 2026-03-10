import ProductCard from './ProductCard';
import EmptyState from './EmptyState';
import type { Listing } from '../hooks/useUserListings';
import './UserListings.css';

export type { Listing };

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
                            imageUrl={listing.imageUrl}
                            variant="listing"
                            itemDescription={listing.itemDescription}
                            ingredients={listing.ingredients}
                            allergens={listing.allergens}
                        />
                    ))
                )}
            </div>
        </div>
    );
};

export default UserListings;
