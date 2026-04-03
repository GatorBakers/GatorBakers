import { createPortal } from 'react-dom';
import CardImage from './CardImage';
import './ProductCard.css';
import { useRef, useState, useEffect } from 'react';
import OrderSummaryModal from './OrderSummaryModal';
import useFocusTrap from '../hooks/useFocusTrap';

type ProductCardVariant = 'to_order' | 'listing';

const VARIANT_LABEL: Record<ProductCardVariant, string> = {
    to_order: 'Order',
    listing: 'View Listing',
};

interface ProductCardProps {
    title: string;
    bakerName: string;
    price: number;
    imageUrl?: string;
    variant: ProductCardVariant;
    itemDescription: string;
    ingredients: string[];
    allergens: string[];
    quantity?: number;
}

const ProductCard = ({ title, bakerName, price, imageUrl, variant, itemDescription, ingredients, allergens, quantity }: ProductCardProps) => {
    const [openModal, setOpenModal] = useState<boolean>(false);
    const [openOrderSummary, setOpenOrderSummary] = useState<boolean>(false);
    const modalRef = useRef<HTMLDivElement>(null);
    const titleId = `product-dialog-title-${title.replace(/\s+/g, '-').toLowerCase()}`;

    useFocusTrap(modalRef, openModal);

    useEffect(() => {
        if (!openModal) return;
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setOpenModal(false);
        };
        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [openModal]);

    return (
        <article className="product-card" aria-label={`${title} by ${bakerName}`}>
            <CardImage
                imageUrl={imageUrl}
                alt=""
                placeholderText="Product Image"
                className="product-card-image"
            />
            <div className="product-card-info">
                <h3 className="product-card-title">{title}</h3>
                <p className="product-card-baker">by {bakerName}</p>
                <p className="product-card-price">${price.toFixed(2)}</p>
                <button
                    className="product-card-action"
                    aria-label={`${VARIANT_LABEL[variant]} ${title} by ${bakerName} — $${price.toFixed(2)}`}
                    onClick={() => setOpenModal(true)}
                >
                    {VARIANT_LABEL[variant]}
                </button>
            </div>

            {openModal && createPortal(
                <div
                    className="product-card-modal-overlay"
                    onClick={() => setOpenModal(false)}
                >
                    <div
                        ref={modalRef}
                        className="product-card-modal-content"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby={titleId}
                        tabIndex={-1}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            className="product-card-modal-close"
                            aria-label="Close"
                            onClick={() => setOpenModal(false)}
                        >
                            ✕
                        </button>
                        <CardImage
                            imageUrl={imageUrl}
                            alt=""
                            placeholderText="Product Image"
                            className="product-card-modal-image"
                        />
                        <div className="product-card-modal-info">
                            <h2 id={titleId} className="product-card-title">{title}</h2>
                            <p className="product-card-baker">by {bakerName}</p>
                            <p className="product-card-price">${price.toFixed(2)}</p>
                            <p className="product-card-description">{itemDescription}</p>
                            <p className="product-card-ingredients">Ingredients: {ingredients.join(', ')}</p>
                            <p className="product-card-allergens">Allergens: {allergens.join(', ')}</p>
                            {quantity !== undefined && (
                                <p className="product-card-quantity">
                                    {quantity > 0 ? `${quantity} available` : 'Out of stock'}
                                </p>
                            )}
                            {variant === 'to_order' && (
                                <button className="product-card-action" onClick={() => setOpenOrderSummary(true)}>
                                    Purchase Now
                                </button>
                            )}
                            {variant === 'listing' && (
                                <button className="product-card-action" onClick={() => setOpenModal(false)}>
                                    Close
                                </button>
                            )}
                        </div>
                    </div>
                </div>,
                document.body
            )}

            <OrderSummaryModal
                isOpen={openOrderSummary}
                onClose={() => { setOpenOrderSummary(false); setOpenModal(false); }}
                onBack={() => setOpenOrderSummary(false)}
                title={title}
                bakerName={bakerName}
                price={price}
                imageUrl={imageUrl}
            />
        </article>
    );
};

export default ProductCard;
