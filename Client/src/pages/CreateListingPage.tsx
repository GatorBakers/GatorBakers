// TODO: Ingredients Section (Type them in and press add)
// TODO: Allergen Section (Present common allergens and allow users to add custom allergens)

import { useState, type SubmitEvent } from 'react';
import ImageUpload from '../components/ImageUpload';
import ButtonAddOn from '../components/ButtonAddOn';
import './CreateListingPage.css';

interface ListingForm {
    name: string;
    description: string;
    price: string;
    ingredients: string[];
    allergens: string[];
    image: File | null;
}

const INITIAL_LISTING: ListingForm = {
    name: '',
    description: '',
    price: '',
    ingredients: [],
    allergens: [],
    image: null,
};

const CreateListingPage = () => {
    const [listing, setListing] = useState<ListingForm>(INITIAL_LISTING);
    const [uploadKey, setUploadKey] = useState(0);

    const handleChange = (field: keyof ListingForm, value: ListingForm[typeof field]) => {
        setListing(prev => ({ ...prev, [field]: value }));
    };

    // TODO: Build FormData from `listing` and POST to /api/listings
    const handleSubmit = (e: SubmitEvent) => {
        e.preventDefault();
        console.log('Listing to submit:', listing);

        const formData = new FormData();
        formData.append('name', listing.name.trim());
        formData.append('description', listing.description.trim());
        formData.append('price', listing.price.trim());
        listing.ingredients.forEach(i => formData.append('ingredients[]', i));
        listing.allergens.forEach(a => formData.append('allergens[]', a));
        if (listing.image) formData.append('image', listing.image);

        for (const [key, value] of formData.entries()) {
            console.log(`${key}: ${value}`);
        }

        setListing(INITIAL_LISTING);
        setUploadKey(k => k + 1);
    };

    return (
        <form className="create-listing-page" onSubmit={handleSubmit}>
            <h2 className="create-listing-heading">Create Listing</h2>

            <hr className="create-listing-divider" />

            <div className="create-listing-section">
                <h3 className="create-listing-section-title">Item Photo</h3>
                <ImageUpload key={uploadKey} onFileChange={(file) => handleChange('image', file)} />
            </div>

            <hr className="create-listing-divider" />

            <div className="create-listing-section">
                <h3 className="create-listing-section-title">Item Details</h3>
                <label className="create-listing-label">
                    Item Name
                    <input
                        className="create-listing-input"
                        type="text"
                        placeholder="e.g. Chocolate Chip Cookies"
                        value={listing.name}
                        onChange={(e) => handleChange('name', e.target.value)}
                    />
                </label>
                <label className="create-listing-label">
                    Description
                    <textarea
                        className="create-listing-textarea"
                        placeholder="Describe your item..."
                        value={listing.description}
                        onChange={(e) => handleChange('description', e.target.value)}
                    />
                </label>
                <label className="create-listing-label">
                    Price ($)
                    <input
                        className="create-listing-input"
                        type="number"
                        placeholder="0.00"
                        min="0"
                        step="0.01"
                        value={listing.price}
                        onChange={(e) => {
                            const val = e.target.value;
                            if (/^\d*\.?\d{0,2}$/.test(val)) handleChange('price', val);
                        }}
                        onBlur={() => {
                            if (listing.price) handleChange('price', parseFloat(listing.price).toFixed(2));
                        }}
                        onKeyDown={(e) => { if (e.key === 'Enter') e.preventDefault(); }}
                    />
                </label>
            </div>

            <hr className="create-listing-divider" />

            <div className="create-listing-section">
                <h3 className="create-listing-section-title">Ingredients</h3>
                <ButtonAddOn
                    label="List every ingredient in your item. Press Enter or click Add."
                    placeholder="e.g. Butter, Flour, Sugar..."
                    onItemsChange={(items) => handleChange('ingredients', items)}
                />
            </div>

            <hr className="create-listing-divider" />

            <div className="create-listing-section">
                <h3 className="create-listing-section-title">Allergens</h3>
                {/* TODO: Common allergen checkboxes + custom allergen input — update listing.allergens */}
                <ButtonAddOn
                    label="List ALL APPLICABLE allergens. Press Enter or click Add."
                    placeholder="e.g. Milk, Eggs, Gluten, Soy, Nuts, etc."
                    onItemsChange={(items) => handleChange('allergens', items)}
                />
            </div>

            <button className="create-listing-submit" type="submit">Create Listing</button>
        </form>
    );
};

export default CreateListingPage;