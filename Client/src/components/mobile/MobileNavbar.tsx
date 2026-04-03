import { NavLink } from 'react-router-dom';
import './MobileNavbar.css';
import CompassIcon from '../../assets/Compass.svg';
import SearchIcon from '../../assets/Search.svg';
import HandbagIcon from '../../assets/Handbag.svg';
import MessagesIcon from '../../assets/Messages.svg';

const MobileNavbar = () => {
    return (
        <nav className="mobile-navbar" aria-label="Main navigation">
            <NavLink
                to="/discover"
                className={({ isActive }) => `mobile-nav-tab${isActive ? ' active' : ''}`}
            >
                <img src={CompassIcon} alt="" className="mobile-nav-icon" aria-hidden="true" />
                <span>Discover</span>
            </NavLink>
            <NavLink
                to="/search"
                className={({ isActive }) => `mobile-nav-tab${isActive ? ' active' : ''}`}
            >
                <img src={SearchIcon} alt="" className="mobile-nav-icon" aria-hidden="true" />
                <span>Search</span>
            </NavLink>
            <NavLink
                to="/orders"
                className={({ isActive }) => `mobile-nav-tab${isActive ? ' active' : ''}`}
            >
                <img src={HandbagIcon} alt="" className="mobile-nav-icon" aria-hidden="true" />
                <span>Orders</span>
            </NavLink>
            <NavLink
                to="/messages"
                className={({ isActive }) => `mobile-nav-tab${isActive ? ' active' : ''}`}
            >
                <img src={MessagesIcon} alt="" className="mobile-nav-icon" aria-hidden="true" />
                <span>Messages</span>
            </NavLink>
            <NavLink
                to="/profile"
                className={({ isActive }) => `mobile-nav-tab${isActive ? ' active' : ''}`}
            >
                <div className="mobile-nav-avatar" aria-hidden="true">P</div>
                <span>Profile</span>
            </NavLink>
        </nav>
    );
};

export default MobileNavbar;
