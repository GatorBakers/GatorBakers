import './App.css'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import MainLayout from './MainLayout';
import AuthLayout from './AuthLayout';
import { AuthProvider } from './context/AuthContext';

import LoginPage from './pages/LogInPage';
import SignUpPage from './pages/SignUpPage';
import DiscoverPage from './pages/DiscoverPage';
import YourOrdersPage from './pages/OrdersAndListingsPage';
import SearchPage from './pages/SearchPage';
import ProfilePage from './pages/ProfilePage';
import CreateListingPage from './pages/CreateListingPage';
import MessagesPage from './pages/MessagesPage';
import ScrollToTop from './components/ScrollToTop';

const queryClient = new QueryClient();

function App() {

  return (
    <QueryClientProvider client={queryClient}>
    <AuthProvider>
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        {/* Main Layout */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Navigate to="/login" replace/>} />
          <Route path="/discover" element={<DiscoverPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/orders" element={<YourOrdersPage />} />
          <Route path="/messages" element={<MessagesPage />} />
          <Route path="/create-listing" element={<CreateListingPage />} />
          <Route path="/profile" element={<ProfilePage/>} />
        </Route>

        {/* Auth Layout */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
    </AuthProvider>
    </QueryClientProvider>
  )
}

export default App
