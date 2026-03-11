import type { Listing } from '../../types';
import MobileProductCard from './MobileProductCard';
import EmptyState from '../EmptyState';
import './MobileUserListings.css';

interface MobileUserListingsProps {
    listings: Listing[];
}

const MobileUserListings = ({ listings }: MobileUserListingsProps) => {
    return (
        <section className="m-your-listings-section">
            <h2 className="m-your-listings-heading">Your Listings</h2>
            <div className="m-your-listings-list">
                {listings.length === 0 ? (
                    <EmptyState
                        title="No listings yet"
                        subtitle="Listings you create will appear here."
                    />
                ) : (
                    listings.map((listing) => (
                        <MobileProductCard
                            key={listing.id}
                            title={listing.title}
                            bakerName={listing.bakerName}
                            price={listing.price}
                            variant="listing"
                            itemDescription={listing.itemDescription}
                            ingredients={listing.ingredients}
                            allergens={listing.allergens}
                        />
                    ))
                )}
            </div>
        </section>
    );
};

export default MobileUserListings;
