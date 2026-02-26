import './ProfilePage.css';
import YourListingsColumn from '../components/YourListingsColumn';
import type { Listing } from '../components/YourListingsColumn';

// TODO: Add profile data from backend, this data is placeholder
const name = "John Doe";
const city = "New York";
const state = "NY";
const favoriteBake = "Chocolate Cake";
const photoUrl = "https://picsum.photos/150";
// const photoUrl = false;

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

            <YourListingsColumn listings={placeholderListings} />
        </div>
    );
};

export default ProfilePage;