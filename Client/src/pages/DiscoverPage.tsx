import { useState } from 'react';
import ProductCard from '../components/ProductCard';
import MobileDiscoverPage from './mobile/MobileDiscoverPage';
import { useIsMobile } from '../hooks/useIsMobile';

/* Placeholder products for the discover page */
const placeholderProducts = [
    { id: 1, title: 'Product Title', bakerName: 'Baker Name', price: 0, itemDescription: 'Item Description 1', ingredients: ['Ingredient 1', 'Ingredient 2', 'Ingredient 3'], allergens: ['Allergen 1', 'Allergen 2', 'Allergen 3'], quantity: 10 },
    { id: 2, title: 'Product Title', bakerName: 'Baker Name', price: 0, itemDescription: 'Item Description 2', ingredients: ['Ingredient 1', 'Ingredient 2', 'Ingredient 3'], allergens: ['Allergen 1', 'Allergen 2', 'Allergen 3'] },
    { id: 3, title: 'Product Title', bakerName: 'Baker Name', price: 0, itemDescription: 'Item Description 3', ingredients: ['Ingredient 1', 'Ingredient 2', 'Ingredient 3'], allergens: ['Allergen 1', 'Allergen 2', 'Allergen 3'] },
    { id: 4, title: 'Product Title', bakerName: 'Baker Name', price: 0, itemDescription: 'Item Description 4', ingredients: ['Ingredient 1', 'Ingredient 2', 'Ingredient 3'], allergens: ['Allergen 1', 'Allergen 2', 'Allergen 3'] },
    { id: 5, title: 'Product Title', bakerName: 'Baker Name', price: 0, itemDescription: 'Item Description 5', ingredients: ['Ingredient 1', 'Ingredient 2', 'Ingredient 3'], allergens: ['Allergen 1', 'Allergen 2', 'Allergen 3'] },
    { id: 6, title: 'Product Title', bakerName: 'Baker Name', price: 0, itemDescription: 'Item Description 6', ingredients: ['Ingredient 1', 'Ingredient 2', 'Ingredient 3'], allergens: ['Allergen 1', 'Allergen 2', 'Allergen 3'] },
];

const DiscoverPage = () => {
    const isMobile = useIsMobile();
    const [sortBy, setSortBy] = useState<'recent' | 'popular'>('recent');

    const handleSort = (value: 'recent' | 'popular') => {
        setSortBy(value);
        console.log(`Sort changed to: ${value}`);
    };

    if (isMobile) {
        return <MobileDiscoverPage products={placeholderProducts} />;
    }

    return (
        <div className="discover-page">
            <div className="headline-container">
                <h1>Fresh from local bakers</h1>
                <p>Discover homemade breads, pastries, and treats from bakers in your neighborhood</p>
            </div>

            <div className="sort-toggle" role="group" aria-label="Sort listings by">
                <button
                    className={sortBy === 'recent' ? 'active' : ''}
                    aria-pressed={sortBy === 'recent'}
                    onClick={() => handleSort('recent')}
                >
                    Recent
                </button>
                <button
                    className={sortBy === 'popular' ? 'active' : ''}
                    aria-pressed={sortBy === 'popular'}
                    onClick={() => handleSort('popular')}
                >
                    Popular
                </button>
            </div>

            <div className="product-card-container">
                {placeholderProducts.map((product) => (
                    <ProductCard
                        key={product.id}
                        title={product.title}
                        bakerName={product.bakerName}
                        price={product.price}
                        variant="to_order"
                        itemDescription={product.itemDescription}
                        ingredients={product.ingredients}
                        allergens={product.allergens}
                        quantity={product.quantity}
                    />
                ))}
            </div>
        </div>
    );
};

export default DiscoverPage;
