import type { Listing } from '../../types';
import MobileProductCard from '../../components/mobile/MobileProductCard';
import './MobileDiscoverPage.css';

interface MobileDiscoverPageProps {
    products: Listing[];
}

const MobileDiscoverPage = ({ products }: MobileDiscoverPageProps) => {
    return (
        <div className="m-discover-page">
            <div className="m-discover-headline">
                <h1>Fresh from local bakers</h1>
                <p>Homemade breads, pastries, and treats nearby</p>
            </div>

            <div className="m-discover-list">
                {products.map((product) => (
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
    );
};

export default MobileDiscoverPage;
