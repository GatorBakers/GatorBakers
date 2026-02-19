import './App.css'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

import LoginPage from './pages/LogInPage';
import SignUpPage from './pages/SignUpPage';

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} /> {/* TODO: Add Sign Up Page */}
      </Routes>
    </BrowserRouter>
  )
}

export default App
