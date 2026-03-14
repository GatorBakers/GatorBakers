import CardImage from '../CardImage';
import './MobileProductCard.css';
import { useState } from 'react';
import MobileOrderSummaryModal from './MobileOrderSummaryModal';

type MobileProductCardVariant = 'to_order' | 'listing';

const VARIANT_LABEL: Record<MobileProductCardVariant, string> = {
    to_order: 'Order',
    listing: 'View Listing',
};

interface MobileProductCardProps {
    title: string;
    bakerName: string;
    price: number;
    imageUrl?: string;
    variant: MobileProductCardVariant;
    itemDescription: string;
    ingredients: string[];
    allergens: string[];
}

const MobileProductCard = ({ title, bakerName, price, imageUrl, variant, itemDescription, ingredients, allergens }: MobileProductCardProps) => {
    const [openModal, setOpenModal] = useState<boolean>(false);
    const [openOrderSummary, setOpenOrderSummary] = useState<boolean>(false);

    return (
        <div className="m-product-card">
            <CardImage
                imageUrl={imageUrl}
                alt={title}
                placeholderText="Product Image"
                className="m-product-card-image"
            />
            <div className="m-product-card-info">
                <h3 className="m-product-card-title">{title}</h3>
                <p className="m-product-card-baker">by {bakerName}</p>
                <div className="m-product-card-bottom">
                    <p className="m-product-card-price">${price.toFixed(2)}</p>
                    <button className="m-product-card-order" onClick={() => setOpenModal(true)}>
                        {VARIANT_LABEL[variant]}
                    </button>
                </div>
            </div>

            {openModal && (
                <div className="m-product-card-modal-overlay" onClick={() => setOpenModal(false)}>
                    <div className="m-product-card-modal-content" onClick={(e) => e.stopPropagation()}>
                        <button className="m-product-card-modal-close" onClick={() => setOpenModal(false)}>✕</button>
                        <CardImage
                            imageUrl={imageUrl}
                            alt={title}
                            placeholderText="Product Image"
                            className="m-product-card-modal-image"
                        />
                        <div className="m-product-card-modal-info">
                            <h2 className="m-product-card-title">{title}</h2>
                            <p className="m-product-card-baker">by {bakerName}</p>
                            <p className="m-product-card-price">${price.toFixed(2)}</p>
                            <p className="m-product-card-description">{itemDescription}</p>
                            <p className="m-product-card-ingredients">Ingredients: {ingredients.join(', ')}</p>
                            <p className="m-product-card-allergens">Allergens: {allergens.join(', ')}</p>
                            {variant === 'to_order' && (
                                <button className="m-product-card-order" onClick={() => { setOpenModal(false); setOpenOrderSummary(true); }}>
                                    Purchase Now
                                </button>
                            )}
                            {variant === 'listing' && (
                                <button className="m-product-card-order" onClick={() => setOpenModal(false)}>
                                    Close
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        <MobileOrderSummaryModal
                isOpen={openOrderSummary}
                onClose={() => setOpenOrderSummary(false)}
                onBack={() => { setOpenOrderSummary(false); setOpenModal(true); }}
                title={title}
                bakerName={bakerName}
                price={price}
                imageUrl={imageUrl}
            />
        </div>
    );
};

export default MobileProductCard;
