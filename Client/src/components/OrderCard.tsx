import './OrderCard.css';

export type OrderStatus = 'ready_for_pickup' | 'pending' | 'completed' | 'cancelled';

interface OrderCardProps {
    itemName: string;
    bakerName: string;
    status: OrderStatus;
    pickupTime: string;
    pickupAddress: string;
    imageUrl?: string;
    onViewDetails?: () => void;
}

const statusLabels: Record<OrderStatus, string> = {
    ready_for_pickup: 'Ready for pickup',
    pending: 'Pending',
    completed: 'Completed',
    cancelled: 'Cancelled',
};

const OrderCard = ({
    itemName,
    bakerName,
    status,
    pickupTime,
    pickupAddress,
    imageUrl,
    onViewDetails,
}: OrderCardProps) => {
    return (
        <div className="order-card">
            <div className="order-card-image">
                {imageUrl ? (
                    <img src={imageUrl} alt={itemName} />
                ) : (
                    <span className="order-card-image-placeholder">Temp</span>
                )}
            </div>

            <div className="order-card-info">
                <p className="order-card-item-name">{itemName}</p>
                <p className="order-card-baker-name">{bakerName}</p>
            </div>

            <div className="order-card-status-block">
                <span className={`order-card-badge order-card-badge--${status}`}>
                    {statusLabels[status]}
                </span>
                <p className="order-card-pickup-time">{pickupTime}</p>
                <p className="order-card-pickup-address">{pickupAddress}</p>
            </div>

            <button className="order-card-details-btn" onClick={onViewDetails}>
                View Details
            </button>
        </div>
    );
};

export default OrderCard;
