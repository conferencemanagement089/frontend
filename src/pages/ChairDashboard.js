import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import './Dashboard.css';

const ChairDashboard = () => {
    const { token, user } = useContext(AuthContext);
    const [sessions, setSessions] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchSessions();
    }, []);

    const fetchSessions = async () => {
        try {
            // Fetch sessions from API
            const res = await axios.get('https://backend-lzjt.onrender.com/api/sessions', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            console.log('Fetched sessions:', res.data); // Check the fetched data

            const filteredSessions = res.data
                .map(session => ({
                    ...session,
                    // Filter conferences where chairId matches the current user's ID
                    conferences: session.conferences.filter(conf => conf.chairId === user._id)
                }))
                .filter(session => session.conferences.length > 0); // Remove sessions with no conferences for the chair

            console.log('Filtered sessions:', filteredSessions); // Check the filtered data

            setSessions(filteredSessions);
        } catch (err) {
            console.error('Error fetching sessions:', err.response ? err.response.data : err);
        }
    };

    const handleOrganize = (conferenceId) => {
        navigate(`/organize/${conferenceId}`);
    };

    return (
        <div className="dashboard-container">
            <h1>Chair Dashboard</h1>
            {/* Render sessions if there are any */}
            {sessions.length === 0 ? (
                <p>No sessions assigned to you.</p> // Message when no sessions are available
            ) : (
                sessions.map(session => (
                    <div key={session._id} className="session-container">
                        <button className="session-button" onClick={() => setSessions(prev => prev.map(s => s._id === session._id ? { ...s, expanded: !s.expanded } : s))}>
                            {session.name} - {new Date(session.startDateTime).toLocaleString()} to {new Date(session.endDateTime).toLocaleString()} at {session.location}
                        </button>
                        {session.expanded && (
                            <div className="conferences-container">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Title</th>
                                            <th>Description</th>
                                            <th>Date</th>
                                            <th>Presenter Email</th>
                                            <th>Room Number</th>
                                            <th>Status</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {session.conferences.map((conference) => (
                                            <tr key={conference._id}>
                                                <td>{conference.title}</td>
                                                <td>{conference.description}</td>
                                                <td>{new Date(conference.date).toLocaleDateString()} {conference.time}</td>
                                                <td>{conference.presenterEmail}</td>
                                                <td>{conference.roomNumber}</td>
                                                <td>{conference.enabled ? 'Enabled' : 'Disabled'}</td>
                                                <td>
                                                    <button onClick={() => handleOrganize(conference._id)}>Organize</button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                ))
            )}
        </div>
    );
};

export default ChairDashboard;
