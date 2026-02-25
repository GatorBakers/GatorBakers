import StatusBadge from '../StatusBadge';
import type { OrderStatus } from '../StatusBadge';
import CardImage from '../CardImage';
import './MobileOrderCard.css';

export type { OrderStatus };

interface MobileOrderCardProps {
    itemName: string;
    bakerName: string;
    status: OrderStatus;
    pickupTime: string;
    pickupAddress: string;
    imageUrl?: string;
    onViewDetails?: () => void;
}

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
