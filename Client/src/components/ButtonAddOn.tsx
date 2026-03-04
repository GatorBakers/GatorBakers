import { useState, type KeyboardEvent } from 'react';
import './ButtonAddOn.css';

interface ButtonAddOnProps {
    label?: string;
    placeholder?: string;
    onItemsChange?: (items: string[]) => void;
}

const ButtonAddOn = ({
    label,
    placeholder = 'Type and press Enter or click Add...',
    onItemsChange,
}: ButtonAddOnProps) => {
    const [inputValue, setInputValue] = useState('');
    const [items, setItems] = useState<string[]>([]);

    const addItem = () => {
        const trimmed = inputValue.trim();
        if (!trimmed || items.includes(trimmed)) return;
        const updated = [...items, trimmed];
        setItems(updated);
        onItemsChange?.(updated);
        setInputValue('');
    };

    const removeItem = (index: number) => {
        const updated = items.filter((_, i) => i !== index);
        setItems(updated);
        onItemsChange?.(updated);
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            addItem();
        }
    };

    return (
        <div className="button-addon">
            {label && <p className="button-addon-label">{label}</p>}

            <div className="button-addon-row">
                <input
                    className="button-addon-input"
                    type="text"
                    placeholder={placeholder}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                />
                <button
                    className="button-addon-btn"
                    type="button"
                    onClick={addItem}
                >
                    Add
                </button>
            </div>

            {items.length > 0 && (
                <div className="button-addon-tags">
                    {items.map((item, i) => (
                        <span key={i} className="button-addon-tag">
                            {item}
                            <button
                                className="button-addon-tag-remove"
                                type="button"
                                aria-label={`Remove ${item}`}
                                onClick={() => removeItem(i)}
                            >
                                ×
                            </button>
                        </span>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ButtonAddOn;
