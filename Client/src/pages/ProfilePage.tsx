import './ProfilePage.css';
import UserListings from '../components/UserListings';
import { useIsMobile } from '../hooks/useIsMobile';
import MobileProfilePage from './mobile/MobileProfilePage';
import { useProfile } from '../hooks/useProfile';
import { useUserListings } from '../hooks/useUserListings';

const ProfilePage = () => {
    const isMobile = useIsMobile();
    const { profile, isLoading, error } = useProfile();
    const { listings, isLoading: listingsLoading, error: listingsError } = useUserListings();

    if (isLoading) {
        return <div className="profile-page"><p>Loading profile…</p></div>;
    }

    if (error || !profile) {
        return <div className="profile-page"><p className="profile-error">{error || 'Could not load profile.'}</p></div>;
    }

    if (isMobile) {
        return (
            <MobileProfilePage
                userProfile={profile}
                listings={listings}
                listingsLoading={listingsLoading}
                listingsError={listingsError}
            />
        );
    }

    const initial = profile.name.charAt(0).toUpperCase();
    const locationText = profile.city && profile.state
        ? `${profile.city}, ${profile.state}`
        : null;

    return (
        <div className="profile-page">
            <div className="profile-col">
                <h2 className="profile-heading">{profile.name}'s Profile</h2>
                <div className="profile-info">
                    {profile.photoUrl ? (
                        <img className="profile-avatar-img" src={profile.photoUrl} alt={`${profile.name}'s profile`} />
                    ) : (
                        <div className="profile-avatar-initial">{initial}</div>
                    )}
                    <p className="profile-name">{profile.name}</p>
                    {locationText && <p className="profile-location">{locationText}</p>}
                    {profile.favoriteBake && <p className="profile-favorite-bake">Favorite Thing To Bake: {profile.favoriteBake}</p>}
                    <p className="profile-active-listings">Active Listings: {profile.listingCount}</p>
                    <p className="profile-orders-placed">Orders Placed: {profile.orderCount}</p>
                    <p className="profile-created-at">Member Since: {profile.createdAt}</p>
                </div>
            </div>

            {listingsLoading ? (
                <div className="profile-col"><p>Loading listings…</p></div>
            ) : listingsError ? (
                <div className="profile-col"><p className="profile-error">{listingsError}</p></div>
            ) : (
                <UserListings listings={listings} />
            )}
        </div>
    );
};

export default ProfilePage;