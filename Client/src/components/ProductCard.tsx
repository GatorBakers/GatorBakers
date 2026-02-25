import CardImage from './CardImage';
import './ProductCard.css';

interface ProductCardProps {
    title: string;
    bakerName: string;
    price: number;
    imageUrl?: string;
    buttonLabel: string;
    onAction?: () => void;
}

const ProductCard = ({ title, bakerName, price, imageUrl, buttonLabel, onAction }: ProductCardProps) => {
    return (
        <div className="product-card">
            <CardImage
                imageUrl={imageUrl}
                alt={title}
                placeholderText="Product Image"
                className="product-card-image"
            />
            <div className="product-card-info">
                <h3 className="product-card-title">{title}</h3>
                <p className="product-card-baker">by {bakerName}</p>
                <p className="product-card-price">${price.toFixed(2)}</p>
                <button className="product-card-action" onClick={onAction}>
                    {buttonLabel}
                </button>
            </div>
        </div>
    );
};

export default ProductCard;
