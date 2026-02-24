import MobileProductCard from '../../components/mobile/MobileProductCard';
import './MobileDiscoverPage.css';

interface Product {
    id: number;
    title: string;
    bakerName: string;
    price: number;
}

interface MobileDiscoverPageProps {
    products: Product[];
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
                    />
                ))}
            </div>
        </div>
    );
};

export default MobileDiscoverPage;
