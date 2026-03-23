// TODO: Ingredients Section (Type them in and press add)
// TODO: Allergen Section (Present common allergens and allow users to add custom allergens)

import { useState, type SubmitEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import ImageUpload from '../components/ImageUpload';
import ButtonAddOn from '../components/ButtonAddOn';
import { useAuth } from '../context/AuthContext';
import { createListing } from '../services/listingService';
import { queryKeys } from '../hooks/queryKeys';
import './CreateListingPage.css';

interface ListingForm {
    name: string;
    description: string;
    price: string;
    quantity: string;
    ingredients: string[];
    allergens: string[];
    image: File | null;
}

const INITIAL_LISTING: ListingForm = {
    name: '',
    description: '',
    price: '',
    quantity: '',
    ingredients: [],
    allergens: [],
    image: null,
};

const CreateListingPage = () => {
    const [listing, setListing] = useState<ListingForm>(INITIAL_LISTING);
    const [resetKey, setResetKey] = useState(0);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const { accessToken } = useAuth();
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const handleChange = (field: keyof ListingForm, value: ListingForm[typeof field]) => {
        setListing(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e: SubmitEvent) => {
        e.preventDefault();
        setError('');

        if (!accessToken) {
            setError('You must be logged in to create a listing.');
            return;
        }

        const trimmedName = listing.name.trim();
        const trimmedDesc = listing.description.trim();
        const trimmedPrice = listing.price.trim();
        const trimmedQuantity = listing.quantity.trim();

        if (!trimmedName) { setError('Item name is required.'); return; }
        if (!trimmedDesc) { setError('Description is required.'); return; }
        if (!trimmedPrice || isNaN(parseFloat(trimmedPrice)) || parseFloat(trimmedPrice) < 0) {
            setError('Enter a valid price.'); return;
        }
        if (!trimmedQuantity || isNaN(Number(trimmedQuantity)) || !Number.isInteger(Number(trimmedQuantity)) || Number(trimmedQuantity) < 1) {
            setError('Enter a valid quantity.'); return;
        }

        setSubmitting(true);
        try {
            // TODO [AWS S3]: Replace base64 data URL approach with S3 upload.
            //  1. Create an S3 bucket with public-read ACL (or use presigned URLs).
            //  2. POST listing.image (File) to a new server endpoint (e.g. POST /upload)
            //     that uses @aws-sdk/client-s3 + PutObjectCommand to upload to S3.
            //  3. The server returns the S3 object URL (https://<bucket>.s3.<region>.amazonaws.com/<key>).
            //  4. Pass that URL as photo_url instead of the base64 string below.
            //  This removes the large base64 payload from the JSON body and the DB column.
            let photo_url = '';
            if (listing.image) {
                photo_url = await new Promise<string>((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onload = () => resolve(reader.result as string);
                    reader.onerror = () => reject(new Error('Failed to read image'));
                    reader.readAsDataURL(listing.image!);
                });
            }

            await createListing(accessToken, {
                title: trimmedName,
                description: trimmedDesc,
                price: trimmedPrice,
                quantity: Number(trimmedQuantity),
                ingredients: listing.ingredients,
                allergens: listing.allergens,
                photo_url,
            });
            queryClient.invalidateQueries({ queryKey: queryKeys.myListings });
            queryClient.invalidateQueries({ queryKey: queryKeys.profile });
            setListing(INITIAL_LISTING);
            setResetKey(k => k + 1);
            navigate('/orders&listings');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to create listing.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <form className="create-listing-page" onSubmit={handleSubmit}>
            <h2 className="create-listing-heading">Create Listing</h2>

            <hr className="create-listing-divider" />

            <div className="create-listing-section">
                <h3 className="create-listing-section-title">Item Photo</h3>
                <ImageUpload key={resetKey} onFileChange={(file) => handleChange('image', file)} />
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
                <label className="create-listing-label">
                    Quantity Available
                    <input
                        className="create-listing-input"
                        type="number"
                        placeholder="e.g. 12"
                        min="1"
                        step="1"
                        value={listing.quantity}
                        onChange={(e) => {
                            const val = e.target.value;
                            if (/^\d*$/.test(val)) handleChange('quantity', val);
                        }}
                        onKeyDown={(e) => { if (e.key === 'Enter') e.preventDefault(); }}
                    />
                </label>
            </div>

            <hr className="create-listing-divider" />

            <div className="create-listing-section">
                <h3 className="create-listing-section-title">Ingredients</h3>
                <ButtonAddOn
                    key={resetKey}
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
                    key={resetKey + 1}
                    label="List ALL APPLICABLE allergens. Press Enter or click Add."
                    placeholder="e.g. Milk, Eggs, Gluten, Soy, Nuts, etc."
                    onItemsChange={(items) => handleChange('allergens', items)}
                />
            </div>

            <button className="create-listing-submit" type="submit" disabled={submitting}>
                {submitting ? 'Creating…' : 'Create Listing'}
            </button>
            {error && <p className="create-listing-error">{error}</p>}
        </form>
    );
};

export default CreateListingPage;