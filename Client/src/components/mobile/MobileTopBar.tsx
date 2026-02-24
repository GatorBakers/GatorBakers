import { NavLink } from 'react-router-dom';
import './MobileTopBar.css';

const MobileTopBar = () => {
    return (
        <header className="mobile-top-bar">
            <NavLink to="/discover" className="mobile-top-bar-logo">
                Bake
            </NavLink>
            <NavLink to="/create-listing" className="mobile-top-bar-create">
                + Create Listing
            </NavLink>
        </header>
    );
};

export default MobileTopBar;
