import './ProfilePage.css';
import EmptyState from '../components/EmptyState';
import ProductCard from '../components/ProductCard';

// TODO: Add profile data from backend, this data is placeholder
const name = "John Doe";
const city = "New York";
const state = "NY";
const favoriteBake = "Chocolate Cake";
const photoUrl = "https://picsum.photos/150";
// const photoUrl = false;

interface Listing {
    id: number;
    title: string;
    bakerName: string;
    price: number;
}

const placeholderListings: Listing[] = [];

const ProfilePage = () => {
    const initial = name.charAt(0).toUpperCase();

    return (
        <div className="profile-page">
            
            <div className="profile-col">
                <h2 className="profile-heading">{name}'s Profile</h2>
                <div className="profile-info">
                    {photoUrl ? (
                        <img className="profile-avatar-img" src={photoUrl} alt={`${name}'s profile`} />
                    ) : (
                        <div className="profile-avatar-initial">{initial}</div>
                    )}
                    <p className="profile-name">{name}</p>
                    <p className="profile-location">{city}, {state}</p>
                    <p className="profile-favorite-bake">Favorite Thing To Bake: {favoriteBake}</p>
                </div>
            </div>



            <div className="your-listings-col">
                <h2 className="profile-heading">Your Listings</h2>
                <div className="your-listings-grid">
                    {placeholderListings.length === 0 ? (
                        <EmptyState
                            title="No listings yet"
                            subtitle="Listings you create will appear here."
                            className="your-listings-empty-span"
                        />
                    ) : (
                        placeholderListings.map((listing) => (
                            <ProductCard 
                                key={listing.id}
                                title={listing.title}
                                bakerName={listing.bakerName}
                                price={listing.price}
                                buttonLabel="View/Edit Listing"
                            />
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;