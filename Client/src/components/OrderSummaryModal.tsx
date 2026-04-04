import { useState, useEffect } from 'react';
import CardImage from './CardImage';
import './OrderSummaryModal.css';
import { pickupLocations, type PickupLocation } from '@shared/utils/pickupLocations';

// TODO (Backend): Define the actual service/platform fee logic.
//       This could come from GET /api/fees or be a fixed percentage returned by the order preview endpoint.
//       This is if we want to add a platform fee in the future.
const PLATFORM_FEE = 0.00;

interface OrderSummaryModalProps {
    isOpen: boolean;
    onClose: () => void;
    onBack: () => void;
    title: string;
    bakerName: string;
    price: number;
    imageUrl?: string;
}

const OrderSummaryModal = ({ isOpen, onClose, onBack, title, bakerName, price, imageUrl }: OrderSummaryModalProps) => {
    const [selectedPickupLocation, setSelectedPickupLocation] = useState<PickupLocation | null>(null);
    const [selectedPickupDate, setSelectedPickupDate] = useState<string>('');
    const [selectedPickupTime, setSelectedPickupTime] = useState<string>('');

    useEffect(() => {
        if (isOpen) {
            setSelectedPickupLocation(null);
            setSelectedPickupDate('');
            setSelectedPickupTime('');
        }
    }, [isOpen]);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    const total = price + PLATFORM_FEE;

    // TODO (Backend): Replace this handler with a real API call.
    //       POST /api/orders — body: { listingId, buyerId }
    //       On success: navigate to /orders&listings (or show a confirmation screen).
    //       On error: display an inline error message to the user.
    const handleConfirmOrder = () => {
        console.log('TODO: POST /api/orders');
        
        const order = {
            title,
            bakerName,
            price,
            imageUrl,
            pickupLocation: selectedPickupLocation,
            pickupDate: selectedPickupDate,
            pickupTime: selectedPickupTime,
        }

        console.log('Order:', order);

    };

    return (
        <div className="order-summary-overlay" onClick={onClose}>
            <div className="order-summary-modal" onClick={(e) => e.stopPropagation()}>

                <button className="order-summary-close" onClick={onClose}>✕</button>

                <h2 className="order-summary-heading">Order Summary</h2>

                {/* Scrollable content */}
                <div className="order-summary-content">

                    {/* Item preview */}
                    <div className="order-summary-item">
                        <CardImage
                            imageUrl={imageUrl}
                            alt={title}
                            placeholderText="Product Image"
                            className="order-summary-item-image"
                        />
                        <div className="order-summary-item-info">
                            <p className="order-summary-item-title">{title}</p>
                            <p className="order-summary-item-baker">by {bakerName}</p>
                        </div>
                    </div>

                    <hr className="order-summary-divider" />

                    {/* Pricing */}
                    <div className="order-summary-pricing">
                        <div className="order-summary-pricing-row">
                            <span>Item price</span>
                            <span>${price.toFixed(2)}</span>
                        </div>
                        
                        <div className="order-summary-pricing-row">
                            <span>Platform fee</span>
                            <span>${PLATFORM_FEE.toFixed(2)}</span>
                        </div>
                        <div className="order-summary-pricing-row order-summary-pricing-total">
                            <span>Total</span>
                            <span>${total.toFixed(2)}</span>
                        </div>
                    </div>

                    <hr className="order-summary-divider" />

                    {/* Pickup details */}
                    {/* TODO: This area is subject to change. And could be based off of baker availability. */}
                    <div className="order-summary-pickup">
                        <p className="order-summary-pickup-label">Pickup Location</p>
                        <select
                            className="order-summary-pickup-dropdown"
                            value={selectedPickupLocation ? selectedPickupLocation.name : ''}
                            onChange={(e) => {
                                const location = pickupLocations.find(loc => loc.name === e.target.value);
                                setSelectedPickupLocation(location || null);
                            }}
                        >
                            <option value="" disabled>
                                Select a location...
                            </option>
                            {pickupLocations.map((location) => (
                                <option key={location.name} value={location.name}>
                                    {location.name}
                                </option>
                            ))}
                        </select>
                        {selectedPickupLocation && (
                            <div className="order-summary-pickup-details">
                                <p className="order-summary-pickup-location-name">
                                    {selectedPickupLocation.name}
                                </p>
                                <p className="order-summary-pickup-location-address">
                                    {selectedPickupLocation.address}
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Pickup date */}
                    <div className="order-summary-pickup">
                        <p className="order-summary-pickup-label">Pickup Date</p>
                        <input
                            type="date"
                            className="order-summary-time-input"
                            value={selectedPickupDate}
                            min={new Date().toISOString().split('T')[0]}
                            onChange={(e) => setSelectedPickupDate(e.target.value)}
                        />
                        {selectedPickupDate && (
                            <div className="order-summary-pickup-details">
                                <p className="order-summary-pickup-location-name">
                                    {new Date(selectedPickupDate + 'T00:00:00').toLocaleDateString('en-US', {
                                        weekday: 'long',
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                    })}
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Pickup time */}
                    <div className="order-summary-pickup">
                        <p className="order-summary-pickup-label">Pickup Time</p>
                        <input
                            type="time"
                            className="order-summary-time-input"
                            value={selectedPickupTime}
                            onChange={(e) => setSelectedPickupTime(e.target.value)}
                        />
                        {selectedPickupTime && (
                            <div className="order-summary-pickup-details">
                                <p className="order-summary-pickup-location-name">
                                    {(() => {
                                        const [h, m] = selectedPickupTime.split(':').map(Number);
                                        const period = h >= 12 ? 'PM' : 'AM';
                                        const hour = h % 12 || 12;
                                        return `${hour}:${String(m).padStart(2, '0')} ${period}`;
                                    })()}
                                </p>
                            </div>
                        )}
                    </div>

                </div>{/* end order-summary-content */}

                {/* Buttons */}
                <div className="order-summary-actions">
                    <button className="order-summary-btn-back" onClick={onBack}>
                        Back
                    </button>
                    <button
                        className="order-summary-btn-confirm"
                        onClick={handleConfirmOrder}
                        disabled={!selectedPickupLocation || !selectedPickupDate || !selectedPickupTime}
                    >
                        Confirm Order — ${total.toFixed(2)}
                    </button>
                </div>

            </div>
        </div>
    );
};

export default OrderSummaryModal;
