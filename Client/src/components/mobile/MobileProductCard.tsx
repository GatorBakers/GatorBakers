import CardImage from '../CardImage';
import './MobileProductCard.css';

type MobileProductCardVariant = 'to_order' | 'listing';

const VARIANT_LABEL: Record<MobileProductCardVariant, string> = {
    to_order: 'Order',
    listing: 'View Listing',
};

interface MobileProductCardProps {
    title: string;
    bakerName: string;
    price: number;
    imageUrl?: string;
    variant: MobileProductCardVariant;
    onAction?: () => void;
}

const MobileProductCard = ({ title, bakerName, price, imageUrl, variant, onAction }: MobileProductCardProps) => {
    return (
        <div className="m-product-card">
            <CardImage
                imageUrl={imageUrl}
                alt={title}
                placeholderText="Product Image"
                className="m-product-card-image"
            />
            <div className="m-product-card-info">
                <h3 className="m-product-card-title">{title}</h3>
                <p className="m-product-card-baker">by {bakerName}</p>
                <div className="m-product-card-bottom">
                    <p className="m-product-card-price">${price.toFixed(2)}</p>
                    <button className="m-product-card-order" onClick={onAction}>
                        {VARIANT_LABEL[variant]}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MobileProductCard;
