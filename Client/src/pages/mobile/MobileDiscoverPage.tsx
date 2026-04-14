import MobileProductCard from '../../components/mobile/MobileProductCard';
import './MobileDiscoverPage.css';

interface Product {
    id: number;
    listingId: number;
    sellerUserId: number;
    buyerUserId: number | null;
    buyerIdentityLoading: boolean;
    title: string;
    bakerName: string;
    price: number;
    imageUrl?: string;
    itemDescription: string;
    ingredients: string[];
    allergens: string[];
    quantity?: number;
}

interface MobileDiscoverPageProps {
    sortBy: 'recent' | 'popular';
    onSortChange: (value: 'recent' | 'popular') => void;
    products: Product[];
}

const MobileDiscoverPage = ({ sortBy, onSortChange, products }: MobileDiscoverPageProps) => {
    return (
        <div className="m-discover-page">
            <div className="m-discover-headline">
                <h1>Fresh from local bakers</h1>
                <p>Homemade breads, pastries, and treats nearby</p>
            </div>

            <div className="m-sort-toggle">
                <button className={sortBy === 'recent' ? 'active' : ''} onClick={() => onSortChange('recent')}>Recent</button>
                <button className={sortBy === 'popular' ? 'active' : ''} onClick={() => onSortChange('popular')}>Popular</button>
            </div>

            <div className="m-discover-list">
                {products.map((product) => (
                    <MobileProductCard
                        key={product.id}
                        listingId={product.listingId}
                        sellerUserId={product.sellerUserId}
                        buyerUserId={product.buyerUserId}
                        buyerIdentityLoading={product.buyerIdentityLoading}
                        title={product.title}
                        bakerName={product.bakerName}
                        price={product.price}
                        imageUrl={product.imageUrl}
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

export default MobileDiscoverPage;
