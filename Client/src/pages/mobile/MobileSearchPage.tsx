import SearchBar from '../../components/SearchBar';
import MobileProductCard from '../../components/mobile/MobileProductCard';
import './MobileSearchPage.css';

const placeholderResults = [
    { id: 1, title: 'Product Title', bakerName: 'Baker Name', price: 0, itemDescription: 'Item Description 1', ingredients: ['Ingredient 1', 'Ingredient 2', 'Ingredient 3'], allergens: ['Allergen 1', 'Allergen 2', 'Allergen 3'] },
    { id: 2, title: 'Product Title', bakerName: 'Baker Name', price: 0, itemDescription: 'Item Description 2', ingredients: ['Ingredient 1', 'Ingredient 2', 'Ingredient 3'], allergens: ['Allergen 1', 'Allergen 2', 'Allergen 3'] },
    { id: 3, title: 'Product Title', bakerName: 'Baker Name', price: 0, itemDescription: 'Item Description 3', ingredients: ['Ingredient 1', 'Ingredient 2', 'Ingredient 3'], allergens: ['Allergen 1', 'Allergen 2', 'Allergen 3'] },
    { id: 4, title: 'Product Title', bakerName: 'Baker Name', price: 0, itemDescription: 'Item Description 4', ingredients: ['Ingredient 1', 'Ingredient 2', 'Ingredient 3'], allergens: ['Allergen 1', 'Allergen 2', 'Allergen 3'] },
    { id: 5, title: 'Product Title', bakerName: 'Baker Name', price: 0, itemDescription: 'Item Description 5', ingredients: ['Ingredient 1', 'Ingredient 2', 'Ingredient 3'], allergens: ['Allergen 1', 'Allergen 2', 'Allergen 3'] },
    { id: 6, title: 'Product Title', bakerName: 'Baker Name', price: 0, itemDescription: 'Item Description 6', ingredients: ['Ingredient 1', 'Ingredient 2', 'Ingredient 3'], allergens: ['Allergen 1', 'Allergen 2', 'Allergen 3'] },
];

const MobileSearchPage = () => {
    return (
        <div className="m-search-page">
            <SearchBar />
            <div className="m-search-results">
                <p className="m-search-results-count">{placeholderResults.length} results</p>
                
                {/* TODO: To be changed with actual search results */}
                
                <div className="m-search-results-list">
                    {placeholderResults.map((product) => (
                        <MobileProductCard
                            key={product.id}
                            title={product.title}
                            bakerName={product.bakerName}
                            price={product.price}
                            variant="to_order"
                            itemDescription={product.itemDescription}
                            ingredients={product.ingredients}
                            allergens={product.allergens}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default MobileSearchPage;
