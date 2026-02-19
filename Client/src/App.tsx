import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './MainLayout';
import AuthLayout from './AuthLayout';

import LoginPage from './pages/LogInPage';
import SignUpPage from './pages/SignUpPage';

function App() {

  return (
    <BrowserRouter>
      <Routes>
        {/* Main Layout */}
        <Route element={<MainLayout />}>
          <Route path="/discover" element={<></>} /> {/* TODO: Add Discover Page */}
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
