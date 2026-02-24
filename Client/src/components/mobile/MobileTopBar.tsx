import { NavLink } from 'react-router-dom';
import './MobileTopBar.css';

const MobileTopBar = () => {
    return (
        <header className="mobile-top-bar">
            <NavLink to="/discover" className="mobile-top-bar-logo">
                Bake
            </NavLink>
        </header>
    );
};

export default MobileTopBar;
