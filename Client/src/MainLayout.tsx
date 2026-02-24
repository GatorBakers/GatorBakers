import { Outlet } from 'react-router-dom';
import Navbar from './components/Navbar';
import MobileNavbar from './components/mobile/MobileNavbar';
import MobileTopBar from './components/mobile/MobileTopBar';
import { useIsMobile } from './hooks/useIsMobile';

const MainLayout = () => {
    const isMobile = useIsMobile();

    return (
        <div className={isMobile ? 'mobile-layout' : 'desktop-layout'}>
            {isMobile ? (
                <>
                    <MobileTopBar />
                    <MobileNavbar />
                </>
            ) : (
                <Navbar />
            )}
            <Outlet />
        </div>
    );
};

export default MainLayout;
