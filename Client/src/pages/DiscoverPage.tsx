import ProductCard from '../components/ProductCard';


/* Placeholder products for the discover page */
const placeholderProducts = [
    { id: 1, title: 'Product Title', bakerName: 'Baker Name', price: 0 },
    { id: 2, title: 'Product Title', bakerName: 'Baker Name', price: 0 },
    { id: 3, title: 'Product Title', bakerName: 'Baker Name', price: 0 },
    { id: 4, title: 'Product Title', bakerName: 'Baker Name', price: 0 },
    { id: 5, title: 'Product Title', bakerName: 'Baker Name', price: 0 },
    { id: 6, title: 'Product Title', bakerName: 'Baker Name', price: 0 },
];

const DiscoverPage = () => {
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
                    />
                ))}
            </div>
        </div>
    );
};

export default DiscoverPage;
