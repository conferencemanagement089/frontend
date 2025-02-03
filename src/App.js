import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Header from './components/Header';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import Home from './pages/Home';
import AdminDashboard from './pages/AdminDashboard';
import AttendeeDashboard from './pages/AttendeeDashboard';
import PresenterDashboard from './pages/PresenterDashboard';
import ChairDashboard from './pages/ChairDashboard';
import Users from './pages/Users';
import Payment from './pages/Payment';
import Report from './pages/Report';
import EnterConference from './pages/EnterConference';
import Organize from './pages/Organize';
import './App.css';  // Make sure this import is present

function App() {
    return (
        <AuthProvider>
            <Router>
                <Header />
                <div className="App">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/register" element={<RegisterPage />} />
                        <Route path="/profile" element={<ProfilePage />} />
                        <Route path="/admin-dashboard" element={<AdminDashboard />} />
                        <Route path="/attendee-dashboard" element={<AttendeeDashboard />} />
                        <Route path="/presenter-dashboard" element={<PresenterDashboard />} />
                        <Route path="/chair-dashboard" element={<ChairDashboard />} />
                        <Route path="/users" element={<Users />} />
                        <Route path="/payment" element={<Payment />} />
                        <Route path="/report" element={<Report />} />
                        <Route path="/enter-conference/:id" element={<EnterConference />} />
                        <Route path="/organize/:id" element={<Organize />} />
                        <Route path="*" element={<Navigate to="/" />} />
                    </Routes>
                </div>
            </Router>
        </AuthProvider>
    );
}

export default App;
