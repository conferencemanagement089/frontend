import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './RegisterPage.css'; // Importing the CSS for styling

const RegisterPage = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [age, setAge] = useState('');
    const [department, setDepartment] = useState('');
    const [phoneNo, setPhoneNo] = useState('');
    const [address, setAddress] = useState('');
    const [role, setRole] = useState('Attendee'); // Default role is Attendee
    const navigate = useNavigate();

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Sending the form data to the backend API using axios
            await axios.post('https://backend-lzjt.onrender.com/api/auth/register', {
                username,
                email,
                password,
                age,
                department,
                phoneNo,
                address,
                role
            });
            // On success, navigate to the login page
            navigate('/login');
        } catch (err) {
            console.error(err.response?.data || err.message);
        }
    };

    // Function to navigate back to login page
    const goToLogin = () => {
        navigate('/login');
    };

    return (
        <div className="register-container">
            <h1>Register</h1>
            <form onSubmit={handleSubmit}>
                <div className="input-group">
                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div className="input-group">
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="input-group">
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <div className="input-group">
                    <input
                        type="number"
                        placeholder="Age"
                        value={age}
                        onChange={(e) => setAge(e.target.value)}
                        required
                    />
                </div>
                <div className="input-group">
                    <input
                        type="text"
                        placeholder="Department"
                        value={department}
                        onChange={(e) => setDepartment(e.target.value)}
                        required
                    />
                </div>
                <div className="input-group">
                    <input
                        type="text"
                        placeholder="Phone Number"
                        value={phoneNo}
                        onChange={(e) => setPhoneNo(e.target.value)}
                        required
                    />
                </div>
                <div className="input-group">
                    <input
                        type="text"
                        placeholder="Address"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        required
                    />
                </div>
                <div className="input-group">
                    <select
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        required
                    >
                        <option value="Attendee">Attendee</option>
                        <option value="Presenter">Presenter</option>
                        <option value="Chair">Chair</option>
                        <option value="Admin">Admin</option>
                    </select>
                </div>
                <div className="button-group">
                    <button type="submit">Register</button>
                </div>
            </form>
            <div className="back-to-login">
                <button onClick={goToLogin}>Back to Login</button>
            </div>
        </div>
    );
};

export default RegisterPage;
