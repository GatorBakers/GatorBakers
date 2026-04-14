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
    itemDescription: string;
    ingredients: string[];
    allergens: string[];
    quantity?: number;
}

type MobileProductCardToOrderProps = MobileProductCardProps & {
    variant: 'to_order';
    listingId: number;
    sellerUserId: number;
    buyerUserId: number | null;
    buyerIdentityLoading: boolean;
};

type MobileProductCardListingProps = MobileProductCardProps & {
    variant: 'listing';
};

type MobileProductCardAllProps = MobileProductCardToOrderProps | MobileProductCardListingProps;

const MobileProductCard = (props: MobileProductCardAllProps) => {
    const { title, bakerName, price, imageUrl, variant, itemDescription, ingredients, allergens, quantity } = props;
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
                            {quantity !== undefined && (
                                <p className="m-product-card-quantity">
                                    {quantity > 0 ? `${quantity} available` : 'Out of stock'}
                                </p>
                            )}
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
        {variant === 'to_order' && (<MobileOrderSummaryModal
                isOpen={openOrderSummary}
                onClose={() => setOpenOrderSummary(false)}
                onBack={() => { setOpenOrderSummary(false); setOpenModal(true); }}
            listingId={props.listingId}
            sellerUserId={props.sellerUserId}
            buyerUserId={props.buyerUserId}
            buyerIdentityLoading={props.buyerIdentityLoading}
                title={title}
                bakerName={bakerName}
                price={price}
                imageUrl={imageUrl}
            />)}
        </div>
    );
};

export default MobileProductCard;
