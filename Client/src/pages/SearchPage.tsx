import SearchBar from '../components/SearchBar';
import ProductCard from '../components/ProductCard';
import MobileSearchPage from './mobile/MobileSearchPage';
import { useIsMobile } from '../hooks/useIsMobile';
import './SearchPage.css';

const placeholderResults = [
    { id: 1, title: 'Product Title', bakerName: 'Baker Name', price: 0, itemDescription: 'Item Description 1'},
    { id: 2, title: 'Product Title', bakerName: 'Baker Name', price: 0, itemDescription: 'Item Description 2'},
    { id: 3, title: 'Product Title', bakerName: 'Baker Name', price: 0, itemDescription: 'Item Description 3'},
    { id: 4, title: 'Product Title', bakerName: 'Baker Name', price: 0, itemDescription: 'Item Description 4'},
    { id: 5, title: 'Product Title', bakerName: 'Baker Name', price: 0, itemDescription: 'Item Description 5'},
    { id: 6, title: 'Product Title', bakerName: 'Baker Name', price: 0, itemDescription: 'Item Description 6'},
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
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SearchPage;
