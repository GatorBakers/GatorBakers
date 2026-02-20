import './ProductCard.css';

interface ProductCardProps {
    title: string;
    bakerName: string;
    price: number;
    imageUrl?: string;
    onOrder?: () => void;
}

const ProductCard = ({ title, bakerName, price, imageUrl, onOrder }: ProductCardProps) => {
    return (
        <div className="product-card">
            <div className="product-card-image">
                {imageUrl ? (
                    <img src={imageUrl} alt={title} />
                ) : (
                    <span className="product-card-placeholder">Product Image</span>
                )}
            </div>
            <div className="product-card-info">
                <h3 className="product-card-title">{title}</h3>
                <p className="product-card-baker">by {bakerName}</p>
                <p className="product-card-price">${price.toFixed(2)}</p>
                <button className="product-card-order" onClick={onOrder}>
                    Order
                </button>
            </div>
        </div>
    );
};

export default ProductCard;
