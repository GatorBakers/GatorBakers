import { useState, useEffect, useRef } from 'react';
import CardImage from '../CardImage';
import './MobileOrderSummaryModal.css';
import { pickupLocations, type PickupLocation } from '@shared/utils/pickupLocations';
import useFocusTrap from '../../hooks/useFocusTrap';

const PLATFORM_FEE = 0.00;

interface MobileOrderSummaryModalProps {
    isOpen: boolean;
    onClose: () => void;
    onBack: () => void;
    title: string;
    bakerName: string;
    price: number;
    imageUrl?: string;
}

const MobileOrderSummaryModal = ({ isOpen, onClose, onBack, title, bakerName, price, imageUrl }: MobileOrderSummaryModalProps) => {
    const [selectedPickupLocation, setSelectedPickupLocation] = useState<PickupLocation | null>(null);
    const [selectedPickupDate, setSelectedPickupDate] = useState<string>('');
    const [selectedPickupTime, setSelectedPickupTime] = useState<string>('');
    const modalRef = useRef<HTMLDivElement>(null);

    useFocusTrap(modalRef, isOpen);

    useEffect(() => {
        if (isOpen) {
            setSelectedPickupLocation(null);
            setSelectedPickupDate('');
            setSelectedPickupTime('');
        }
    }, [isOpen]);

    useEffect(() => {
        if (!isOpen) return;
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [isOpen, onClose]);

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
        };

        console.log('Order:', order);
    };

    return (
        <div className="m-order-summary-overlay" onClick={onClose} aria-hidden="true">
            <div
                ref={modalRef}
                className="m-order-summary-content"
                role="dialog"
                aria-modal="true"
                aria-labelledby="m-order-summary-title"
                onClick={(e) => e.stopPropagation()}
            >

                <button className="m-order-summary-close" aria-label="Close" onClick={onClose}>✕</button>

                <h2 id="m-order-summary-title" className="m-order-summary-heading">Order Summary</h2>

                {/* Item preview */}
                <div className="m-order-summary-item">
                    <CardImage
                        imageUrl={imageUrl}
                        alt={title}
                        placeholderText="Product Image"
                        className="m-order-summary-item-image"
                    />
                    <div className="m-order-summary-item-info">
                        <p className="m-order-summary-item-title">{title}</p>
                        <p className="m-order-summary-item-baker">by {bakerName}</p>
                    </div>
                </div>

                <hr className="m-order-summary-divider" />

                {/* Pricing */}
                <div className="m-order-summary-pricing">
                    <div className="m-order-summary-pricing-row">
                        <span>Item price</span>
                        <span>${price.toFixed(2)}</span>
                    </div>
                    <div className="m-order-summary-pricing-row">
                        <span>Platform fee</span>
                        <span>${PLATFORM_FEE.toFixed(2)}</span>
                    </div>
                    <div className="m-order-summary-pricing-row m-order-summary-pricing-total">
                        <span>Total</span>
                        <span>${total.toFixed(2)}</span>
                    </div>
                </div>

                <hr className="m-order-summary-divider" />

                {/* Pickup details */}
                {/* TODO: This area is subject to change. And could be based off of baker availability. */}
                <div className="m-order-summary-pickup">
                    <label htmlFor="m-pickup-location" className="m-order-summary-pickup-label">
                        Pickup Location
                    </label>
                    <select
                        id="m-pickup-location"
                        className="m-order-summary-pickup-dropdown"
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
                        <div className="m-order-summary-pickup-details">
                            <p className="m-order-summary-pickup-location-name">
                                {selectedPickupLocation.name}
                            </p>
                            <p className="m-order-summary-pickup-location-address">
                                {selectedPickupLocation.address}
                            </p>
                        </div>
                    )}
                </div>

                {/* Pickup date */}
                <div className="m-order-summary-pickup">
                    <label htmlFor="m-pickup-date" className="m-order-summary-pickup-label">
                        Pickup Date
                    </label>
                    <input
                        id="m-pickup-date"
                        type="date"
                        className="m-order-summary-time-input"
                        value={selectedPickupDate}
                        min={new Date().toISOString().split('T')[0]}
                        onChange={(e) => setSelectedPickupDate(e.target.value)}
                    />
                    {selectedPickupDate && (
                        <div className="m-order-summary-pickup-details">
                            <p className="m-order-summary-pickup-location-name">
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
                <div className="m-order-summary-pickup">
                    <label htmlFor="m-pickup-time" className="m-order-summary-pickup-label">
                        Pickup Time
                    </label>
                    <input
                        id="m-pickup-time"
                        type="time"
                        className="m-order-summary-time-input"
                        value={selectedPickupTime}
                        onChange={(e) => setSelectedPickupTime(e.target.value)}
                    />
                    {selectedPickupTime && (
                        <div className="m-order-summary-pickup-details">
                            <p className="m-order-summary-pickup-location-name">
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

                <hr className="m-order-summary-divider" />

                {/* Buttons */}
                <div className="m-order-summary-actions">
                    <button className="m-order-summary-btn-back" onClick={onBack}>
                        Back
                    </button>
                    <button
                        className="m-order-summary-btn-confirm"
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

export default MobileOrderSummaryModal;
