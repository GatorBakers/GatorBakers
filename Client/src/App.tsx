import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import LoginPage from './pages/LogInPage';

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage onSwitchToSignUp={() => {}} />} />
        <Route path="/signup" element={<></>} /> {/* TODO: Add Sign Up Page */}
      </Routes>
    </BrowserRouter>
  )
}

export default App
