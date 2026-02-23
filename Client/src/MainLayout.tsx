import { Outlet } from 'react-router-dom';
import Navbar from './components/Navbar';
import MobileNavbar from './components/mobile/MobileNavbar';
import { useIsMobile } from './hooks/useIsMobile';

const MainLayout = () => {
    const isMobile = useIsMobile();

    return (
        <div className={isMobile ? 'mobile-layout' : 'desktop-layout'}>
            {isMobile ? <MobileNavbar /> : <Navbar />}
            <Outlet />
        </div>
    );
};

export default MainLayout;
