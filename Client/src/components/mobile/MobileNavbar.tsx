import { NavLink } from 'react-router-dom';
import './MobileNavbar.css';
import CompassIcon from '../../assets/Compass.svg';
import SearchIcon from '../../assets/Search.svg';
import HandbagIcon from '../../assets/Handbag.svg';
import MessagesIcon from '../../assets/Messages.svg';

const MobileNavbar = () => {
    return (
        <nav className="mobile-navbar">
            <NavLink to="/discover" className="mobile-nav-tab">
                <img src={CompassIcon} alt="Discover" className="mobile-nav-icon" />
                <span>Discover</span>
            </NavLink>
            <NavLink to="/search" className="mobile-nav-tab">
                <img src={SearchIcon} alt="Search" className="mobile-nav-icon" />
                <span>Search</span>
            </NavLink>
            <NavLink to="/orders&listings" className="mobile-nav-tab">
                <img src={HandbagIcon} alt="Orders" className="mobile-nav-icon" />
                <span>Orders & Listings</span>
            </NavLink>
            <NavLink to="/messages" className="mobile-nav-tab">
                <img src={MessagesIcon} alt="Messages" className="mobile-nav-icon" />
                <span>Messages</span>
            </NavLink>
            <NavLink to="/profile" className="mobile-nav-tab">
                <div className="mobile-nav-avatar">P</div>
                <span>Profile</span>
            </NavLink>
        </nav>
    );
};

export default MobileNavbar;
