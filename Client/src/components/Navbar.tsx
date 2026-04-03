import { NavLink } from 'react-router-dom';
import './Navbar.css';
import CompassIcon from '../assets/Compass.svg';
import SearchIcon from '../assets/Search.svg';
import HandbagIcon from '../assets/Handbag.svg';
import MessagesIcon from '../assets/Messages.svg';
import { useProfile } from '../hooks/useProfile';

const Navbar = () => {
    const { profile } = useProfile();
    const initial = profile?.name.charAt(0).toUpperCase();
    return (
        <nav className="navbar" aria-label="Main navigation">
            <NavLink to="/discover" className="navbar-logo" aria-label="GatorBakers — go to Discover">
                Bake
            </NavLink>

            <div className="navbar-center">
                <NavLink
                    to="/discover"
                    className={({ isActive }) => `navbar-link${isActive ? ' active' : ''}`}
                    aria-current={undefined}
                >
                    <img src={CompassIcon} alt="" className="navbar-icon" aria-hidden="true" />
                    <span>Discover</span>
                </NavLink>
                <NavLink
                    to="/search"
                    className={({ isActive }) => `navbar-link${isActive ? ' active' : ''}`}
                    aria-current={undefined}
                >
                    <img src={SearchIcon} alt="" className="navbar-icon" aria-hidden="true" />
                    <span>Search</span>
                </NavLink>
                <NavLink
                    to="/orders"
                    className={({ isActive }) => `navbar-link${isActive ? ' active' : ''}`}
                    aria-current={undefined}
                >
                    <img src={HandbagIcon} alt="" className="navbar-icon" aria-hidden="true" />
                    <span>Orders</span>
                </NavLink>
            </div>

            <div className="navbar-right">
                <NavLink
                    to="/messages"
                    className={({ isActive }) => `navbar-messages${isActive ? ' active' : ''}`}
                    aria-label="Messages"
                >
                    <img src={MessagesIcon} alt="" className="navbar-icon" aria-hidden="true" />
                </NavLink>
                <NavLink
                    to="/create-listing"
                    className={({ isActive }) => `navbar-create-listing${isActive ? ' active' : ''}`}
                >
                    + Create Listing
                </NavLink>
                <NavLink
                    to="/profile"
                    className={({ isActive }) => `navbar-avatar${isActive ? ' active' : ''}`}
                    aria-label={profile?.name ? `Profile — ${profile.name}` : 'Profile'}
                >
                    {initial}
                </NavLink>
            </div>
        </nav>
    );
};

export default Navbar;
