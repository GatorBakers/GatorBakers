import { useState, useEffect } from 'react';
import CardImage from './CardImage';
import './OrderSummaryModal.css';
import { pickupLocations, type PickupLocation } from '@shared/utils/pickupLocations';
import { useCreateOrder } from '../hooks/useOrderMutations';

// TODO (Backend): Define the actual service/platform fee logic.
//       This could come from GET /api/fees or be a fixed percentage returned by the order preview endpoint.
//       This is if we want to add a platform fee in the future.
const PLATFORM_FEE = 0.00;

interface OrderSummaryModalProps {
    isOpen: boolean;
    onClose: () => void;
    onBack: () => void;
    listingId: number;
    sellerUserId: number;
    buyerUserId: number | null;
    buyerIdentityLoading: boolean;
    title: string;
    bakerName: string;
    price: number;
    imageUrl?: string;
}

const OrderSummaryModal = ({
    isOpen,
    onClose,
    onBack,
    listingId,
    sellerUserId,
    buyerUserId,
    buyerIdentityLoading,
    title,
    bakerName,
    price,
    imageUrl,
}: OrderSummaryModalProps) => {
    const [selectedPickupLocation, setSelectedPickupLocation] = useState<PickupLocation | null>(null);
    const [selectedPickupDate, setSelectedPickupDate] = useState<string>('');
    const [selectedPickupTime, setSelectedPickupTime] = useState<string>('');
    const [submitError, setSubmitError] = useState<string | null>(null);
    const createOrderMutation = useCreateOrder();

    useEffect(() => {
        if (isOpen) {
            setSelectedPickupLocation(null);
            setSelectedPickupDate('');
            setSelectedPickupTime('');
            setSubmitError(null);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const total = price + PLATFORM_FEE;

    const handleConfirmOrder = async () => {
        if (buyerIdentityLoading) {
            setSubmitError('Still loading your account. Please try again in a moment.');
            return;
        }

        if (!buyerUserId) {
            setSubmitError('Please log in before placing an order.');
            return;
        }

        if (!selectedPickupLocation || !selectedPickupDate || !selectedPickupTime) {
            setSubmitError('Please select pickup location, pickup date, and pickup time.');
            return;
        }

        setSubmitError(null);

        try {
            await createOrderMutation.mutateAsync({
                listingId,
                payload: {
                    pickup_location: `${selectedPickupLocation.name} (${selectedPickupLocation.address})`,
                    pickup_time: selectedPickupTime,
                },
                sellerUserId,
            });

            onClose();
        } catch (error) {
            setSubmitError(error instanceof Error ? error.message : 'Failed to place order.');
        }
    };

    return (
        <div className="order-summary-overlay" onClick={onClose}>
            <div className="order-summary-modal" onClick={(e) => e.stopPropagation()}>

                <button className="order-summary-close" onClick={onClose}>✕</button>

                <h2 className="order-summary-heading">Order Summary</h2>

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

                <hr className="order-summary-divider" />

                {/* Buttons */}
                <div className="order-summary-actions">
                    <button className="order-summary-btn-back" onClick={onBack}>
                        Back
                    </button>
                    <button
                        className="order-summary-btn-confirm"
                        onClick={handleConfirmOrder}
                        disabled={buyerIdentityLoading || !selectedPickupLocation || !selectedPickupDate || !selectedPickupTime || createOrderMutation.isPending}
                    >
                        {createOrderMutation.isPending ? 'Placing Order...' : `Confirm Order — $${total.toFixed(2)}`}
                    </button>
                </div>

                {submitError && <p style={{ color: 'red', marginTop: '8px' }}>{submitError}</p>}

            </div>
        </div>
    );
};

export default OrderSummaryModal;
