import StatusBadge from './StatusBadge';
import type { OrderStatus } from './StatusBadge';
import CardImage from './CardImage';
import './OrderCard.css';

export type { OrderStatus };

interface OrderCardProps {
    itemName: string;
    bakerName: string;
    status: OrderStatus;
    pickupTime: string;
    pickupAddress: string;
    imageUrl?: string;
    onViewDetails?: () => void;
}

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
            <CardImage
                imageUrl={imageUrl}
                alt={itemName}
                placeholderText="Temp"
                className="order-card-image"
            />

            <div className="order-card-info">
                <p className="order-card-item-name">{itemName}</p>
                <p className="order-card-baker-name">{bakerName}</p>
            </div>

            <div className="order-card-status-block">
                <StatusBadge status={status} />
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
