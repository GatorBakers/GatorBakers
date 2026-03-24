import { useState } from 'react';
import ProductCard from '../components/ProductCard';
import MobileDiscoverPage from './mobile/MobileDiscoverPage';
import { useIsMobile } from '../hooks/useIsMobile';
import { useListingsFeed } from '../hooks/useListingsFeed';

const DiscoverPage = () => {
    const isMobile = useIsMobile();
    const [sortBy, setSortBy] = useState<'recent' | 'popular'>('recent');
    const { listings, isLoading, error } = useListingsFeed({ params: { sortBy } });

    const handleSort = (value: 'recent' | 'popular') => {
        setSortBy(value);
    };

    if (isMobile) {
        return (
            <MobileDiscoverPage
                sortBy={sortBy}
                onSortChange={handleSort}
                products={listings.map(listing => ({
                    id: listing.id,
                    title: listing.title,
                    bakerName: `${listing.user.first_name} ${listing.user.last_name}`,
                    price: Number(listing.price),
                    imageUrl: listing.photo_url,
                    itemDescription: listing.description,
                    ingredients: listing.ingredients,
                    allergens: listing.allergens,
                    quantity: listing.quantity,
                }))}
            />
        );
    }

    return (
        <div className="discover-page">
            <div className="headline-container">
                <h1>Fresh from local bakers</h1>
                <p>Discover homemade breads, pastries, and treats from bakers in your neighborhood</p>
            </div>

            <div className="sort-toggle">
                <button className={sortBy === 'recent' ? 'active' : ''} onClick={() => handleSort('recent')}>Recent</button>
                <button className={sortBy === 'popular' ? 'active' : ''} onClick={() => handleSort('popular')}>Popular</button>
            </div>

            {isLoading && <p>Loading listings...</p>}
            {error && <p style={{ color: 'red' }}>Error: {error}</p>}
            {!isLoading && listings.length === 0 && <p>No listings available at the moment.</p>}

            {!isLoading && listings.length > 0 && (
                <div className="product-card-container">
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
                            quantity={listing.quantity}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default DiscoverPage;
