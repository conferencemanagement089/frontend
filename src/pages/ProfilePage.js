import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import './ProfilePage.css';

const ProfilePage = () => {
    const { token } = useContext(AuthContext);
    const [profile, setProfile] = useState(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await axios.get('http://localhost:5001/api/auth/profile', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setProfile(res.data);
            } catch (err) {
                console.error(err.response.data);
            }
        };

        fetchProfile();
    }, [token]);

    if (!profile) {
        return <div>Loading...</div>;
    }

    return (
        <div className="profile-container">
            <h1>Profile Details</h1>
            <div className="profile-layout">
                <div className="profile-info-left">
                    <p><strong>Name:</strong> {profile.username}</p>
                    <p><strong>Role:</strong> {profile.role}</p>
                </div>
                <div className="profile-picture">
                    <img 
                        src="https://as1.ftcdn.net/v2/jpg/02/59/39/46/1000_F_259394679_GGA8JJAEkukYJL9XXFH2JoC3nMguBPNH.jpg"
                        alt="Profile" 
                        style={{ borderRadius: '50%', width: '150px', height: '150px' }} 
                    />
                </div>
                <div className="profile-info-right">
                    <p><strong>Email:</strong> {profile.email}</p>
                    <p><strong>Age:</strong> {profile.age}</p>
                    <p><strong>Department:</strong> {profile.department}</p>
                    <p><strong>Phone Number:</strong> {profile.phoneNo}</p>
                    <p><strong>Address:</strong> {profile.address}</p>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;