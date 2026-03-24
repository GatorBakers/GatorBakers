import SearchBar from '../../components/SearchBar';
import MobileProductCard from '../../components/mobile/MobileProductCard';
import type { ListingSummary } from '@shared/types';
import './MobileSearchPage.css';

interface MobileSearchPageProps {
    listings: ListingSummary[];
    isLoading: boolean;
    error: string | null;
}

const MobileSearchPage = ({ listings, isLoading, error }: MobileSearchPageProps) => {
    return (
        <div className="m-search-page">
            <SearchBar />
            {/* TODO: Wire SearchBar input to pass search param to useListingsFeed in future PR */}
            <div className="m-search-results">
                {isLoading && <p>Loading results...</p>}
                {error && <p style={{ color: 'red' }}>Error: {error}</p>}
                {!isLoading && (
                    <>
                        <p className="m-search-results-count">{listings.length} results</p>
                        {listings.length === 0 ? (
                            <p>No listings found. Try adjusting your search.</p>
                        ) : (
                            <div className="m-search-results-list">
                                {listings.map((listing) => (
                                    <MobileProductCard
                                        key={listing.id}
                                        title={listing.title}
                                        bakerName={`${listing.user.first_name} ${listing.user.last_name}`}
                                        price={Number(listing.price)}
                                        imageUrl={listing.photo_url}
                                        variant="to_order"
                                        itemDescription={listing.description}
                                        ingredients={listing.ingredients}
                                        allergens={listing.allergens}
                                        quantity={listing.quantity}
                                    />
                                ))}
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default MobileSearchPage;
