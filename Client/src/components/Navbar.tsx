import { NavLink } from 'react-router-dom';
import './Navbar.css';
import CompassIcon from '../assets/Compass.svg';
import SearchIcon from '../assets/Search.svg';
import HandbagIcon from '../assets/Handbag.svg';
import MessagesIcon from '../assets/Messages.svg';

const Navbar = () => {
    return (
        <nav className="navbar">
            <NavLink to="/discover" className="navbar-logo">
                Bake
            </NavLink>

            <div className="navbar-center">
                <NavLink to="/discover" className="navbar-link">
                    <img src={CompassIcon} alt="Discover" className="navbar-icon" />
                    <span>Discover</span>
                </NavLink>
                <NavLink to="/search" className="navbar-link">
                    <img src={SearchIcon} alt="Search" className="navbar-icon" />
                    <span>Search</span>
                </NavLink>
                <NavLink to="/orders" className="navbar-link">
                    <img src={HandbagIcon} alt="Your Orders" className="navbar-icon" />
                    <span>Orders & Listings</span>
                </NavLink>
            </div>

            <div className="navbar-right">
                <NavLink to="/messages" className="navbar-messages">
                    <img src={MessagesIcon} alt="Messages" className="navbar-icon" />
                </NavLink>
                <NavLink to="/profile" className="navbar-avatar">
                    P
                </NavLink>
            </div>
        </nav>
    );
};

export default Navbar;
