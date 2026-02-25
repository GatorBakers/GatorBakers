import CardImage from '../CardImage';
import './MobileProductCard.css';

interface MobileProductCardProps {
    title: string;
    bakerName: string;
    price: number;
    imageUrl?: string;
    buttonLabel: string;
    onAction?: () => void;
}

const MobileProductCard = ({ title, bakerName, price, imageUrl, buttonLabel, onAction }: MobileProductCardProps) => {
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
                        {buttonLabel}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MobileProductCard;
