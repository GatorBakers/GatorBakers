import { useEffect, useState } from 'react';
import './ProfilePage.css';
import UserListings from '../components/UserListings';
import type { Listing } from '../components/UserListings';
import { useIsMobile } from '../hooks/useIsMobile';
import MobileProfilePage from './mobile/MobileProfilePage';
import { useAuth } from '../context/AuthContext';
import { fetchProfile, type ProfileData } from '../services/profileService';

export interface UserProfile {
    name: string;
    city: string | null;
    state: string | null;
    favoriteBake: string | null;
    photoUrl: string | null;
    listingCount: number;
    orderCount: number;
    createdAt: string;
}

function toUserProfile(data: ProfileData): UserProfile {
    return {
        name: `${data.first_name} ${data.last_name}`,
        city: data.city,
        state: data.state,
        favoriteBake: data.favorite_bake,
        photoUrl: data.photo_url,
        listingCount: data.listing_count,
        orderCount: data.order_count,
        createdAt: new Date(data.created_at).toLocaleDateString(),
    };
}

const ProfilePage = () => {
    const isMobile = useIsMobile();
    const { accessToken } = useAuth();
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // TODO: fetch user listings from backend
    const listings: Listing[] = [];

    useEffect(() => {
        if (!accessToken) {
            setError('You must be logged in to view your profile.');
            setProfile(null);
            setLoading(false);
            return;
        }

        setError('');
        setLoading(true);

        let cancelled = false;
        fetchProfile(accessToken)
            .then((data) => {
                if (!cancelled) {
                    setProfile(toUserProfile(data));
                    setError('');
                }
            })
            .catch((err) => {
                if (!cancelled) setError(err instanceof Error ? err.message : 'Failed to load profile');
            })
            .finally(() => {
                if (!cancelled) setLoading(false);
            });

        return () => { cancelled = true; };
    }, [accessToken]);

    if (loading) {
        return <div className="profile-page"><p>Loading profile…</p></div>;
    }

    if (error || !profile) {
        return <div className="profile-page"><p className="profile-error">{error || 'Could not load profile.'}</p></div>;
    }

    if (isMobile) {
        return <MobileProfilePage userProfile={profile} listings={listings} />;
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

            <UserListings listings={listings} />
        </div>
    );
};

export default ProfilePage;