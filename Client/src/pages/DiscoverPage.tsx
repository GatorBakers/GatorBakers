import ProductCard from '../components/ProductCard';
import MobileDiscoverPage from './mobile/MobileDiscoverPage';
import { useIsMobile } from '../hooks/useIsMobile';

/* Placeholder products for the discover page */
const placeholderProducts = [
    { id: 1, title: 'Product Title', bakerName: 'Baker Name', price: 0, itemDescription: 'Item Description 1', ingredients: ['Ingredient 1', 'Ingredient 2', 'Ingredient 3'], allergens: ['Allergen 1', 'Allergen 2', 'Allergen 3'] },
    { id: 2, title: 'Product Title', bakerName: 'Baker Name', price: 0, itemDescription: 'Item Description 2', ingredients: ['Ingredient 1', 'Ingredient 2', 'Ingredient 3'], allergens: ['Allergen 1', 'Allergen 2', 'Allergen 3'] },
    { id: 3, title: 'Product Title', bakerName: 'Baker Name', price: 0, itemDescription: 'Item Description 3', ingredients: ['Ingredient 1', 'Ingredient 2', 'Ingredient 3'], allergens: ['Allergen 1', 'Allergen 2', 'Allergen 3'] },
    { id: 4, title: 'Product Title', bakerName: 'Baker Name', price: 0, itemDescription: 'Item Description 4', ingredients: ['Ingredient 1', 'Ingredient 2', 'Ingredient 3'], allergens: ['Allergen 1', 'Allergen 2', 'Allergen 3'] },
    { id: 5, title: 'Product Title', bakerName: 'Baker Name', price: 0, itemDescription: 'Item Description 5', ingredients: ['Ingredient 1', 'Ingredient 2', 'Ingredient 3'], allergens: ['Allergen 1', 'Allergen 2', 'Allergen 3'] },
    { id: 6, title: 'Product Title', bakerName: 'Baker Name', price: 0, itemDescription: 'Item Description 6', ingredients: ['Ingredient 1', 'Ingredient 2', 'Ingredient 3'], allergens: ['Allergen 1', 'Allergen 2', 'Allergen 3'] },
];

const DiscoverPage = () => {
    const isMobile = useIsMobile();

    if (isMobile) {
        return <MobileDiscoverPage products={placeholderProducts} />;
    }

    return (
        <div className="discover-page">
            <div className="headline-container">
                <h1>Fresh from local bakers</h1>
                <p>Discover homemade breads, pastries, and treats from bakers in your neighborhood</p>
            </div>

            <div className="product-card-container">
                {placeholderProducts.map((product) => (
                    <ProductCard
                        key={product.id}
                        title={product.title}
                        bakerName={product.bakerName}
                        price={product.price}
                        buttonLabel="Order"
                        itemDescription={product.itemDescription}
                        ingredients={product.ingredients}
                        allergens={product.allergens}
                    />
                ))}
            </div>
        </div>
    );
};

export default DiscoverPage;
