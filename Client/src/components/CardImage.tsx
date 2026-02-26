import './CardImage.css';

interface CardImageProps {
    imageUrl?: string;
    alt: string;
    placeholderText?: string;
    className?: string;
}

const CardImage = ({ imageUrl, alt, placeholderText = 'Image', className = '' }: CardImageProps) => (
    <div className={`card-image ${className}`.trim()}>
        {imageUrl ? (
            <img src={imageUrl} alt={alt} />
        ) : (
            <span className="card-image-placeholder">{placeholderText}</span>
        )}
    </div>
);

export default CardImage;
