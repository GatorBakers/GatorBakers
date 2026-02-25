import SearchBar from '../../components/SearchBar';
import MobileProductCard from '../../components/mobile/MobileProductCard';
import './MobileSearchPage.css';

const placeholderResults = [
    { id: 1, title: 'Product Title', bakerName: 'Baker Name', price: 0 },
    { id: 2, title: 'Product Title', bakerName: 'Baker Name', price: 0 },
    { id: 3, title: 'Product Title', bakerName: 'Baker Name', price: 0 },
    { id: 4, title: 'Product Title', bakerName: 'Baker Name', price: 0 },
    { id: 5, title: 'Product Title', bakerName: 'Baker Name', price: 0 },
    { id: 6, title: 'Product Title', bakerName: 'Baker Name', price: 0 },
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
                            buttonLabel="Order"
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default MobileSearchPage;
