import './MobileListingCard.css';

interface MobileListingCardProps {
    title: string;
    bakerName: string;
    price: number;
    imageUrl?: string;
    onViewEdit?: () => void;
}

const MobileListingCard = ({ title, bakerName, price, imageUrl, onViewEdit }: MobileListingCardProps) => {
    return (
        <div className="m-listing-card">
            <div className="m-listing-card-image">
                {imageUrl ? (
                    <img src={imageUrl} alt={title} />
                ) : (
                    <span className="m-listing-card-placeholder">Product Image</span>
                )}
            </div>
            <div className="m-listing-card-info">
                <h3 className="m-listing-card-title">{title}</h3>
                <p className="m-listing-card-baker">by {bakerName}</p>
                <p className="m-listing-card-price">${price.toFixed(2)}</p>
                <button className="m-listing-card-edit-btn" onClick={onViewEdit}>
                    View/Edit Listing
                </button>
            </div>
        </div>
    );
};

export default MobileListingCard;
