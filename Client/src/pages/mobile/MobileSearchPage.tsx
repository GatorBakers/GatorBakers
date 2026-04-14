import SearchBar from "../../components/SearchBar";
import MobileProductCard from "../../components/mobile/MobileProductCard";
import type { ListingSummary } from "@shared/types";
import "./MobileSearchPage.css";

interface MobileSearchPageProps {
  listings: ListingSummary[];
  searchResults: ListingSummary[];
  onSearch: (results: ListingSummary[]) => void;
  isLoading: boolean;
  error: string | null;
  buyerUserId: number | null;
  buyerIdentityLoading: boolean;
}

const MobileSearchPage = ({
  listings,
  searchResults,
  onSearch,
  isLoading,
  error,
  buyerUserId,
  buyerIdentityLoading,
}: MobileSearchPageProps) => {
  const resultsToShow = searchResults.length > 0 ? searchResults : listings;

  return (
    <div className="m-search-page">
      <SearchBar onSearch={onSearch} />
      <div className="m-search-results">
        {isLoading && <p>Loading results...</p>}
        {error && <p style={{ color: "red" }}>Error: {error}</p>}
        {!isLoading && (
          <>
            <p className="m-search-results-count">
              {resultsToShow.length} results
            </p>
            {resultsToShow.length === 0 ? (
              <p>No listings found. Try adjusting your search.</p>
            ) : (
              <div className="m-search-results-list">
                {resultsToShow.map(listing => (
                  <MobileProductCard
                    key={listing.id}
                    listingId={listing.id}
                    sellerUserId={listing.user_id}
                    buyerUserId={buyerUserId}
                    buyerIdentityLoading={buyerIdentityLoading}
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
