import './ProfilePage.css';
import UserListings from '../components/UserListings';
import type { Listing } from '../components/UserListings';
import { useIsMobile } from '../hooks/useIsMobile';
import MobileProfilePage from './mobile/MobileProfilePage';

// TODO: Get listings from backend

interface UserProfile {
    name: string;
    city: string;
    state: string;
    favoriteBake: string;
    photoUrl: string;
    ordersPlaced: number;
    createdAt: string;
}

const userProfile: UserProfile = {
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
            <MobileProfilePage userProfile={userProfile} listings={placeholderListings} />
        )
    }

    const initial = userProfile.name.charAt(0).toUpperCase();

    return (
        <div className="profile-page">
            
            <div className="profile-col">
                <h2 className="profile-heading">{userProfile.name}'s Profile</h2>
                <div className="profile-info">
                    {userProfile.photoUrl ? (
                        <img className="profile-avatar-img" src={userProfile.photoUrl} alt={`${userProfile.name}'s profile`} />
                    ) : (
                        <div className="profile-avatar-initial">{initial}</div>
                    )}
                    <p className="profile-name">{userProfile.name}</p>
                    <p className="profile-location">{userProfile.city}, {userProfile.state}</p>
                    <p className="profile-favorite-bake">Favorite Thing To Bake: {userProfile.favoriteBake}</p>
                    <p className="profile-active-listings">Active Listings: {placeholderListings.length}</p>
                    <p className="profile-orders-places">Orders Placed: {userProfile.ordersPlaced}</p>
                    <p className="profile-created-at">Created At: {userProfile.createdAt}</p>
                </div>
            </div>

            <UserListings listings={placeholderListings} />
        </div>
    );
};

export default ProfilePage;