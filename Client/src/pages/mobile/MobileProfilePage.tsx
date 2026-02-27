import UserListings from '../../components/UserListings';
import type { Listing } from '../../components/UserListings';
import './MobileProfilePage.css';

interface UserProfile {
    name: string;
    city: string;
    state: string;
    favoriteBake: string;
    photoUrl: string;
    ordersPlaced: number;
    createdAt: string;
}

interface MobileProfilePageProps {
    userProfile: UserProfile;
    listings: Listing[];
}

const MobileProfilePage = ({ userProfile, listings }: MobileProfilePageProps) => {
    const initial = userProfile.name.charAt(0).toUpperCase();

    return (
        <div className="m-profile-page">
            <section className="m-profile-section">
                <h2 className="m-profile-heading">{userProfile.name}'s Profile</h2>
                <div className="m-profile-info">
                    {userProfile.photoUrl ? (
                        <img
                            className="m-profile-avatar-img"
                            src={userProfile.photoUrl}
                            alt={`${userProfile.name}'s profile`}
                        />
                    ) : (
                        <div className="m-profile-avatar-initial">{initial}</div>
                    )}
                    <p className="m-profile-name">{userProfile.name}</p>
                    <p className="m-profile-location">{userProfile.city}, {userProfile.state}</p>
                    <p className="m-profile-detail">Favorite Thing To Bake: {userProfile.favoriteBake}</p>
                    <p className="m-profile-detail">Active Listings: {listings.length}</p>
                    <p className="m-profile-detail">Orders Placed: {userProfile.ordersPlaced}</p>
                    <p className="m-profile-detail">Created At: {userProfile.createdAt}</p>
                </div>
            </section>

            <UserListings listings={listings} />
        </div>
    );
};

export default MobileProfilePage;
