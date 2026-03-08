import SearchBar from '../components/SearchBar';
import ProductCard from '../components/ProductCard';
import MobileSearchPage from './mobile/MobileSearchPage';
import { useIsMobile } from '../hooks/useIsMobile';
import './SearchPage.css';

const placeholderResults = [
    { id: 1, title: 'Product Title', bakerName: 'Baker Name', price: 0, itemDescription: 'Item Description 1', ingredients: ['Ingredient 1', 'Ingredient 2', 'Ingredient 3'], allergens: ['Allergen 1', 'Allergen 2', 'Allergen 3']},
    { id: 2, title: 'Product Title', bakerName: 'Baker Name', price: 0, itemDescription: 'Item Description 2', ingredients: ['Ingredient 1', 'Ingredient 2', 'Ingredient 3'], allergens: ['Allergen 1', 'Allergen 2', 'Allergen 3']},
    { id: 3, title: 'Product Title', bakerName: 'Baker Name', price: 0, itemDescription: 'Item Description 3', ingredients: ['Ingredient 1', 'Ingredient 2', 'Ingredient 3'], allergens: ['Allergen 1', 'Allergen 2', 'Allergen 3']},
    { id: 4, title: 'Product Title', bakerName: 'Baker Name', price: 0, itemDescription: 'Item Description 4', ingredients: ['Ingredient 1', 'Ingredient 2', 'Ingredient 3'], allergens: ['Allergen 1', 'Allergen 2', 'Allergen 3']},
    { id: 5, title: 'Product Title', bakerName: 'Baker Name', price: 0, itemDescription: 'Item Description 5', ingredients: ['Ingredient 1', 'Ingredient 2', 'Ingredient 3'], allergens: ['Allergen 1', 'Allergen 2', 'Allergen 3']},
    { id: 6, title: 'Product Title', bakerName: 'Baker Name', price: 0, itemDescription: 'Item Description 6', ingredients: ['Ingredient 1', 'Ingredient 2', 'Ingredient 3'], allergens: ['Allergen 1', 'Allergen 2', 'Allergen 3']},
];

const SearchPage = () => {
    const isMobile = useIsMobile();

    if (isMobile) {
        return <MobileSearchPage/>;
    }

    return (
        <div className="search-page">
            <SearchBar />
            <div className="search-results">
                <p className="search-results-count">{placeholderResults.length} results</p>
                
                {/* TODO: To be changed with actual search results */}
                
                <div className="search-results-grid">
                    {placeholderResults.map((product) => (
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
        </div>
    );
};

export default SearchPage;
