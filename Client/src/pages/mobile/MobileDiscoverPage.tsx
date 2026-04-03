import { useState } from 'react';
import MobileProductCard from '../../components/mobile/MobileProductCard';
import './MobileDiscoverPage.css';

interface Product {
    id: number;
    title: string;
    bakerName: string;
    price: number;
    itemDescription: string;
    ingredients: string[];
    allergens: string[];
}

interface MobileDiscoverPageProps {
    products: Product[];
}

const MobileDiscoverPage = ({ products }: MobileDiscoverPageProps) => {
    const [sortBy, setSortBy] = useState<'recent' | 'popular'>('recent');

    const handleSort = (value: 'recent' | 'popular') => {
        setSortBy(value);
        console.log(`Sort changed to: ${value}`);
    };

    return (
        <div className="m-discover-page">
            <div className="m-discover-headline">
                <h1>Fresh from local bakers</h1>
                <p>Homemade breads, pastries, and treats nearby</p>
            </div>

            <div className="m-sort-toggle" role="group" aria-label="Sort listings by">
                <button
                    className={sortBy === 'recent' ? 'active' : ''}
                    aria-pressed={sortBy === 'recent'}
                    onClick={() => handleSort('recent')}
                >
                    Recent
                </button>
                <button
                    className={sortBy === 'popular' ? 'active' : ''}
                    aria-pressed={sortBy === 'popular'}
                    onClick={() => handleSort('popular')}
                >
                    Popular
                </button>
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
