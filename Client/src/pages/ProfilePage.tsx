import './ProfilePage.css';
import YourListingsColumn from '../components/YourListingsColumn';
import type { Listing } from '../components/YourListingsColumn';

// TODO: Get listings from backend


const name: string = "John Doe";
const city: string = "New York";
const state: string = "NY";
const favoriteBake: string = "Chocolate Cake";
const photoUrl: string = "https://picsum.photos/150";
const ordersPlaced: number = 10;
const createdAt: string = new Date().toLocaleDateString();
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
                    <p className="profile-active-listings">Active Listings: {placeholderListings.length}</p>
                    <p className="profile-orders-places">Orders Placed: {ordersPlaced}</p>
                    <p className="profile-created-at">Created At: {createdAt}</p>
                </div>
            </div>

            <YourListingsColumn listings={placeholderListings} />
        </div>
    );
};

export default ProfilePage;