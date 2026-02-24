import './MobileProductCard.css';

interface MobileProductCardProps {
    title: string;
    bakerName: string;
    price: number;
    imageUrl?: string;
    onOrder?: () => void;
}

const MobileProductCard = ({ title, bakerName, price, imageUrl, onOrder }: MobileProductCardProps) => {
    return (
        <div className="m-product-card">
            <div className="m-product-card-image">
                {imageUrl ? (
                    <img src={imageUrl} alt={title} />
                ) : (
                    <span className="m-product-card-placeholder">Product Image</span>
                )}
            </div>
            <div className="m-product-card-info">
                <h3 className="m-product-card-title">{title}</h3>
                <p className="m-product-card-baker">by {bakerName}</p>
                <div className="m-product-card-bottom">
                    <p className="m-product-card-price">${price.toFixed(2)}</p>
                    <button className="m-product-card-order" onClick={onOrder}>
                        Order
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MobileProductCard;
