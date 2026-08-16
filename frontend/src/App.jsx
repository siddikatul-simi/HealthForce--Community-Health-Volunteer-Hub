import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Toastify CSS

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import VolunteerList from './pages/VolunteerList';
import Profile from './pages/Profile';
import Reports from './pages/Reports';
import LocationTracker from './pages/LocationTracker';
import EmergencySOS from './pages/EmergencySOS';
import LiveMap from './pages/LiveMap';

function App() {
  return (
    <Router>
      {/* Toast Notification Container */}
      <ToastContainer position="top-right" autoClose={3000} theme="colored" />
      
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/volunteers" element={<VolunteerList />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/tracking" element={<LocationTracker />} />
        <Route path="/sos" element={<EmergencySOS />} />
        <Route path="/map" element={<LiveMap />} />
      </Routes>
    </Router>
  );
}

export default App;