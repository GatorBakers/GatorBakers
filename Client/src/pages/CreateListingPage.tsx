// TODO: Ingredients Section (Type them in and press add)
// TODO: Allergen Section (Present common allergens and allow users to add custom allergens)

import { useState } from 'react';
import ImageUpload from '../components/ImageUpload';
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
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Listing to submit:', listing);
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
                        onChange={(e) => handleChange('price', e.target.value)}
                    />
                </label>
            </div>

            <hr className="create-listing-divider" />

            <div className="create-listing-section">
                <h3 className="create-listing-section-title">Ingredients</h3>
                {/* TODO: Ingredient input + add button — update listing.ingredients */}
            </div>

            <hr className="create-listing-divider" />

            <div className="create-listing-section">
                <h3 className="create-listing-section-title">Allergens</h3>
                {/* TODO: Common allergen checkboxes + custom allergen input — update listing.allergens */}
            </div>

            <button className="create-listing-submit" type="submit">Create Listing</button>
        </form>
    );
};

export default CreateListingPage;