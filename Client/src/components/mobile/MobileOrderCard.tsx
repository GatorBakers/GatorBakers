import './MobileOrderCard.css';

export type OrderStatus = 'ready_for_pickup' | 'pending' | 'completed' | 'cancelled';

interface MobileOrderCardProps {
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

const MobileOrderCard = ({
    itemName,
    bakerName,
    status,
    pickupTime,
    pickupAddress,
    imageUrl,
    onViewDetails,
}: MobileOrderCardProps) => {
    return (
        <div className="m-order-card">
            <div className="m-order-card-image">
                {imageUrl ? (
                    <img src={imageUrl} alt={itemName} />
                ) : (
                    <span className="m-order-card-image-placeholder">Temp</span>
                )}
            </div>

            <div className="m-order-card-body">
                <div className="m-order-card-top-row">
                    <div className="m-order-card-info">
                        <p className="m-order-card-item-name">{itemName}</p>
                        <p className="m-order-card-baker-name">{bakerName}</p>
                    </div>
                    <span className={`m-order-card-badge m-order-card-badge--${status}`}>
                        {statusLabels[status]}
                    </span>
                </div>

                <div className="m-order-card-bottom-row">
                    <div className="m-order-card-pickup">
                        <p className="m-order-card-pickup-time">{pickupTime}</p>
                        <p className="m-order-card-pickup-address">{pickupAddress}</p>
                    </div>
                    <button className="m-order-card-details-btn" onClick={onViewDetails}>
                        View Details
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MobileOrderCard;
