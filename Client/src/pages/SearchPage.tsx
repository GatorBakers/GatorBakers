import SearchBar from '../components/SearchBar';
import ProductCard from '../components/ProductCard';
import MobileSearchPage from './mobile/MobileSearchPage';
import { useIsMobile } from '../hooks/useIsMobile';
import { useListingsFeed } from '../hooks/useListingsFeed';
import './SearchPage.css';

const SearchPage = () => {
    const isMobile = useIsMobile();
    const { listings, isLoading, error } = useListingsFeed();

    if (isMobile) {
        return <MobileSearchPage listings={listings} isLoading={isLoading} error={error} />;
    }

    return (
        <div className="search-page">
            <SearchBar />
            {/* TODO: Wire SearchBar input to pass search param to useListingsFeed in future PR */}
            <div className="search-results">
                {isLoading && <p>Loading results...</p>}
                {error && <p style={{ color: 'red' }}>Error: {error}</p>}
                {!isLoading && (
                    <>
                        <p className="search-results-count">{listings.length} results</p>
                        {listings.length === 0 ? (
                            <p>No listings found. Try adjusting your search.</p>
                        ) : (
                            <div className="search-results-grid">
                                {listings.map((listing) => (
                                    <ProductCard
                                        key={listing.id}
                                        title={listing.title}
                                        bakerName={`${listing.user.first_name} ${listing.user.last_name}`}
                                        price={Number(listing.price)}
                                        imageUrl={listing.photo_url}
                                        variant="to_order"
                                        itemDescription={listing.description}
                                        ingredients={listing.ingredients}
                                        allergens={listing.allergens}
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

export default SearchPage;
