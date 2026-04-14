import { useState } from "react";
import type { ListingSummary } from "@shared/types";
import SearchBar from "../components/SearchBar";
import ProductCard from "../components/ProductCard";
import MobileSearchPage from "./mobile/MobileSearchPage";
import { useIsMobile } from "../hooks/useIsMobile";
import { useListingsFeed } from "../hooks/useListingsFeed";
import { useProfile } from "../hooks/useProfile";
import "./SearchPage.css";

const SearchPage = () => {
  const isMobile = useIsMobile();
  const { listings, isLoading, error } = useListingsFeed();
  const { profile, isLoading: profileLoading } = useProfile();
  const [searchResults, setSearchResults] = useState<ListingSummary[]>([]);
  const visibleListings = profile?.id
    ? listings.filter(listing => listing.user_id !== profile.id)
    : listings;
  const resultsToShow =
    searchResults.length > 0 ? searchResults : visibleListings;

  if (isMobile) {
    return (
      <MobileSearchPage
        listings={visibleListings}
        searchResults={searchResults}
        onSearch={setSearchResults}
        isLoading={isLoading}
        error={error}
        buyerUserId={profile?.id ?? null}
        buyerIdentityLoading={profileLoading}
      />
    );
  }

  return (
    <div className="search-page">
      <SearchBar onSearch={setSearchResults} />
      <div className="search-results">
        {isLoading && <p>Loading results...</p>}
        {error && <p style={{ color: "red" }}>Error: {error}</p>}
        {!isLoading && (
          <>
            <p className="search-results-count">
              {resultsToShow.length} results
            </p>
            {resultsToShow.length === 0 ? (
              <p>No listings found. Try adjusting your search.</p>
            ) : (
              <div className="search-results-grid">
                {resultsToShow.map(listing => (
                  <ProductCard
                    key={listing.id}
                    listingId={listing.id}
                    sellerUserId={listing.user_id}
                    buyerUserId={profile?.id ?? null}
                    buyerIdentityLoading={profileLoading}
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
