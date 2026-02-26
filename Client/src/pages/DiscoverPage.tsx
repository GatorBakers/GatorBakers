import ProductCard from '../components/ProductCard';
import MobileDiscoverPage from './mobile/MobileDiscoverPage';
import { useIsMobile } from '../hooks/useIsMobile';

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
                    />
                ))}
            </div>
        </div>
    );
};

export default DiscoverPage;
