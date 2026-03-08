import CardImage from './CardImage';
import './ProductCard.css';
import { useState } from 'react';

interface ProductCardProps {
    title: string;
    bakerName: string;
    price: number;
    imageUrl?: string;
    buttonLabel: string;
    itemDescription: string;
    // onAction?: () => void;
}

const ProductCard = ({ title, bakerName, price, imageUrl, buttonLabel, itemDescription }: ProductCardProps) => {
    const [openModal, setOpenModal] = useState<boolean>(false);
    
    return (
        <div className="product-card">
            <CardImage
                imageUrl={imageUrl}
                alt={title}
                placeholderText="Product Image"
                className="product-card-image"
            />
            <div className="product-card-info">
                <h3 className="product-card-title">{title}</h3>
                <p className="product-card-baker">by {bakerName}</p>
                <p className="product-card-price">${price.toFixed(2)}</p>
                <button className="product-card-action" onClick={() => setOpenModal(true)}>
                    {buttonLabel}
                </button>
            </div>

            { openModal && buttonLabel === 'Order' && (
                <div className="product-card-modal-overlay" onClick={() => setOpenModal(false)}>
                    <div className="product-card-modal-content" onClick={(e) => e.stopPropagation()}>
                        <button className="product-card-modal-close" onClick={() => setOpenModal(false)}>✕</button>
                        <CardImage
                            imageUrl={imageUrl}
                            alt={title}
                            placeholderText="Product Image"
                            className="product-card-modal-image"
                        />
                        <div className="product-card-modal-info">
                            <h2 className="product-card-title">{title}</h2>
                            <p className="product-card-baker">by {bakerName}</p>
                            <p className="product-card-price">${price.toFixed(2)}</p>
                            <p className="product-card-description">{itemDescription}</p>
                            <button className="product-card-action">
                                Purchase Now
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default ProductCard;
