import StatusBadge from '../StatusBadge';
import type { OrderStatus } from '../StatusBadge';
import CardImage from '../CardImage';
import type { PickupLocation } from '@shared/utils/pickupLocations';
import './MobileOrderCard.css';

export type { OrderStatus };

interface MobileOrderCardProps {
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

const MobileOrderCard = ({
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
}: MobileOrderCardProps) => {
    return (
        <div className="m-order-card">
            <CardImage
                imageUrl={imageUrl}
                alt={itemName}
                placeholderText="Temp"
                className="m-order-card-image"
            />

            <div className="m-order-card-body">
                <div className="m-order-card-top-row">
                    <div className="m-order-card-info">
                        <p className="m-order-card-item-name">{itemName}</p>
                        <p className="m-order-card-baker-name">{bakerName}</p>
                    </div>
                    <StatusBadge status={status} />
                </div>

                <div className="m-order-card-bottom-row">
                    <div className="m-order-card-pickup">
                        <p className="m-order-card-pickup-time">{pickupDate} · {pickupTime}</p>
                        <p className="m-order-card-pickup-address">{pickupLocation.name}</p>
                        <p className="m-order-card-pickup-address">{pickupLocation.address}</p>
                    </div>
                    {onConfirm && onDeny ? (
                        <div className="m-order-card-actions">
                            <button className="m-order-card-confirm-btn" onClick={onConfirm}>Confirm</button>
                            <button className="m-order-card-deny-btn" onClick={onDeny}>Deny</button>
                        </div>
                    ) : (
                        <button className="m-order-card-details-btn" onClick={onViewDetails}>
                            View Details
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MobileOrderCard;
