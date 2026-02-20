import './App.css'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './MainLayout';
import AuthLayout from './AuthLayout';

import LoginPage from './pages/LogInPage';
import SignUpPage from './pages/SignUpPage';
import DiscoverPage from './pages/DiscoverPage';

function App() {

  return (
    <BrowserRouter>
      <Routes>
        {/* Main Layout */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Navigate to="/login" replace/>} />
          <Route path="/discover" element={<DiscoverPage />} />
          <Route path="/search" element={<></>} /> {/* TODO: Add Search Page */}
          <Route path="/orders" element={<></>} /> {/* TODO: Add Orders Page */}
          <Route path="/messages" element={<></>} /> {/* TODO: Add Messages Page */}
          <Route path="/profile" element={<></>} /> {/* TODO: Add Profile Page */}
        </Route>

        {/* Auth Layout */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
