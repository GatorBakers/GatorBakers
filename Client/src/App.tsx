import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<></>} /> {/* Log In Page */}
        <Route path="/signup" element={<></>} /> {/* Sign Up Page */}
      </Routes>
    </BrowserRouter>
  )
}

export default App
