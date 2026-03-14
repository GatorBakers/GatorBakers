import UserListings from '../../components/UserListings';
import type { Listing } from '../../components/UserListings';
import type { UserProfile } from '../../hooks/useProfile';
import './MobileProfilePage.css';

interface MobileProfilePageProps {
    userProfile: UserProfile;
    listings: Listing[];
    listingsLoading: boolean;
    listingsError: string | null;
}

const MobileProfilePage = ({ userProfile, listings, listingsLoading, listingsError }: MobileProfilePageProps) => {
    const initial = userProfile.name.charAt(0).toUpperCase();
    const locationText = userProfile.city && userProfile.state
        ? `${userProfile.city}, ${userProfile.state}`
        : null;

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
                    {locationText && <p className="m-profile-location">{locationText}</p>}
                    {userProfile.favoriteBake && <p className="m-profile-detail">Favorite Thing To Bake: {userProfile.favoriteBake}</p>}
                    <p className="m-profile-detail">Active Listings: {userProfile.listingCount}</p>
                    <p className="m-profile-detail">Orders Placed: {userProfile.orderCount}</p>
                    <p className="m-profile-detail">Member Since: {userProfile.createdAt}</p>
                </div>
            </section>

            {listingsLoading ? (
                <p>Loading listings…</p>
            ) : listingsError ? (
                <p className="profile-error">{listingsError}</p>
            ) : (
                <UserListings listings={listings} />
            )}
        </div>
    );
};

export default MobileProfilePage;
