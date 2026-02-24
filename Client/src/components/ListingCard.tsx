import './ListingCard.css';

interface ListingCardProps {
    title: string;
    bakerName: string;
    price: number;
    imageUrl?: string;
    onViewEdit?: () => void;
}

const ListingCard = ({ title, bakerName, price, imageUrl, onViewEdit }: ListingCardProps) => {
    return (
        <div className="listing-card">
            <div className="listing-card-image">
                {imageUrl ? (
                    <img src={imageUrl} alt={title} />
                ) : (
                    <span className="listing-card-placeholder">Product Image</span>
                )}
            </div>
            <div className="listing-card-info">
                <h3 className="listing-card-title">{title}</h3>
                <p className="listing-card-baker">by {bakerName}</p>
                <p className="listing-card-price">${price.toFixed(2)}</p>
                <button className="listing-card-edit-btn" onClick={onViewEdit}>
                    View/Edit Listing
                </button>
            </div>
        </div>
    );
};

export default ListingCard;
