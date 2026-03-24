import StatusBadge from './StatusBadge';
import type { OrderStatus } from './StatusBadge';
import CardImage from './CardImage';
import type { PickupLocation } from '@shared/utils/pickupLocations';
import './OrderCard.css';

export type { OrderStatus };

interface OrderCardProps {
    itemName: string;
    bakerName: string;
    status: OrderStatus;
    pickupDate: string;
    pickupTime: string;
    pickupLocation: PickupLocation;
    imageUrl?: string;
    onViewDetails?: () => void;
    // TODO: Wire up onConfirm and onDeny to PATCH with status CONFIRMED or CANCELLED.
    onConfirm?: () => void;
    onDeny?: () => void;
}

const OrderCard = ({
    itemName,
    bakerName,
    status,
    pickupDate,
    pickupTime,
    pickupLocation,
    imageUrl,
    onViewDetails,
    onConfirm,
    onDeny,
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
                <p className="order-card-pickup-time">{pickupDate} · {pickupTime}</p>
                <p className="order-card-pickup-address">{pickupLocation.name}</p>
                <p className="order-card-pickup-address">{pickupLocation.address}</p>
            </div>

            {onConfirm && onDeny ? (
                <div className="order-card-actions">
                    <button className="order-card-confirm-btn" onClick={onConfirm}>Confirm</button>
                    <button className="order-card-deny-btn" onClick={onDeny}>Deny</button>
                </div>
            ) : (
                <button className="order-card-details-btn" onClick={onViewDetails}>
                    View Details
                </button>
            )}
        </div>
    );
};

export default OrderCard;
