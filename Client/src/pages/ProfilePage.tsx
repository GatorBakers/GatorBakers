import './ProfilePage.css';
import UserListings from '../components/UserListings';
import type { Listing } from '../components/UserListings';
import { useIsMobile } from '../hooks/useIsMobile';
import MobileProfilePage from './mobile/MobileProfilePage';

// TODO: Get user profile info and listings from the backend.
//       Replace userProfile and placeholderListings with data fetched via API calls
//       (e.g. GET /api/users/{userId}/profile and GET /api/users/{userId}/listings).

export interface UserProfile {
    name: string;
    city: string;
    state: string;
    favoriteBake: string;
    photoUrl: string;
    ordersPlaced: number;
    createdAt: string;
}

const placeholderUserProfile: UserProfile = {
    name: "John Doe",
    city: "New York",
    state: "NY",
    favoriteBake: "Chocolate Cake",
    photoUrl: "https://picsum.photos/150",
    ordersPlaced: 10,
    createdAt: new Date().toLocaleDateString(),
};

const placeholderListings: Listing[] = [];

const ProfilePage = () => {
    const isMobile = useIsMobile();

    if (isMobile) {
        return (
            <MobileProfilePage userProfile={placeholderUserProfile} listings={placeholderListings} />
        )
    }

    const initial = placeholderUserProfile.name.charAt(0).toUpperCase();

    return (
        <div className="profile-page">
            
            <div className="profile-col">
                <h2 className="profile-heading">{placeholderUserProfile.name}'s Profile</h2>
                <div className="profile-info">
                    {placeholderUserProfile.photoUrl ? (
                        <img className="profile-avatar-img" src={placeholderUserProfile.photoUrl} alt={`${placeholderUserProfile.name}'s profile`} />
                    ) : (
                        <div className="profile-avatar-initial">{initial}</div>
                    )}
                        <p className="profile-name">{placeholderUserProfile.name}</p>
                    <p className="profile-location">{placeholderUserProfile.city}, {placeholderUserProfile.state}</p>
                    <p className="profile-favorite-bake">Favorite Thing To Bake: {placeholderUserProfile.favoriteBake}</p>
                    <p className="profile-active-listings">Active Listings: {placeholderListings.length}</p>
                    <p className="profile-orders-places">Orders Placed: {placeholderUserProfile.ordersPlaced}</p>
                    <p className="profile-created-at">Created At: {placeholderUserProfile.createdAt}</p>
                </div>
            </div>

            <UserListings listings={placeholderListings} />
        </div>
    );
};

export default ProfilePage;