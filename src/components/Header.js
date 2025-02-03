import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './Header.css';
import logo from '../assets/logo.png'; // Make sure to place your logo image in the correct path

const Header = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <>
            <div className="logo-container">
                <img src={logo} alt="Logo" className="logo" />
            </div>
            <header className="header">
                <nav>
                    <ul>
                        <li><Link to="/">Home</Link></li>
                        {user && (
                            <>
                                <li><Link to={`/${user.role.toLowerCase()}-dashboard`}>Dashboard</Link></li>
                                {user.role === 'Admin' && (
                                    <>
                                        <li><Link to="/users">User Details</Link></li>
                                        <li><Link to="/payment">Payment</Link></li>
                                        <li><Link to="/report">Report</Link></li>
                                    </>
                                )}
                                <li><Link to="/profile">Profile</Link></li>
                                <li><button onClick={handleLogout}>Logout</button></li>
                            </>
                        )}
                        {!user && (
                            <>
                                <li><Link to="/login">Login</Link></li>
                                <li><Link to="/register">Register</Link></li>
                            </>
                        )}
                    </ul>
                </nav>
            </header>
        </>
    );
};

export default Header;
