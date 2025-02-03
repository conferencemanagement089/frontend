import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import './Dashboard.css';

const AttendeeDashboard = () => {
    const { token, user } = useContext(AuthContext);
    const [sessions, setSessions] = useState([]);
    const [registrations, setRegistrations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                await fetchSessions();
                await fetchRegistrations();
            } catch (err) {
                setError('An error occurred while fetching data');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const fetchSessions = async () => {
        try {
            const res = await axios.get('http://localhost:5001/api/sessions', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            console.log("Sessions fetched:", res.data);  // Log sessions
            setSessions(res.data);
        } catch (err) {
            setError('Error fetching sessions');
            console.error("Error fetching sessions:", err.response.data);
        }
    };

    const fetchRegistrations = async () => {
        try {
            const res = await axios.get(`http://localhost:5001/api/registrations/${user._id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            console.log("Registrations fetched:", res.data);  // Log registrations
            setRegistrations(res.data);
        } catch (err) {
            setError('Error fetching registrations');
            console.error("Error fetching registrations:", err.response.data);
        }
    };

    const registerForConference = async (id) => {
        try {
            await axios.post(`http://localhost:5001/api/conferences/${id}/register`, { userId: user._id }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            fetchRegistrations();
        } catch (err) {
            setError('Error registering for conference');
            console.error("Error registering for conference:", err.response.data);
        }
    };

    const attendConference = (id) => {
        navigate(`/enter-conference/${id}`);
    };

    const isRegistered = (conferenceId) => {
        return registrations.some(reg => reg.conferenceId === conferenceId);
    };

    const isAttended = (conferenceId) => {
        return registrations.some(reg => reg.conferenceId === conferenceId && reg.attended);
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="dashboard-container">
            <h1>Attendee Dashboard</h1>
            {error && <div className="error-message">{error}</div>}
            {sessions.length === 0 ? (
                <div>No sessions available.</div>
            ) : (
                sessions.map(session => (
                    <div key={session._id} className="session-container">
                        <button
                            className="session-button"
                            onClick={() => setSessions(prev => prev.map(s => s._id === session._id ? { ...s, expanded: !s.expanded } : s))}
                        >
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
                                        {session.conferences.map(conference => (
                                            <tr key={conference._id}>
                                                <td>{conference.title}</td>
                                                <td>{conference.description}</td>
                                                <td>{new Date(conference.date).toLocaleDateString()} {conference.time}</td>
                                                <td>{conference.presenterEmail}</td>
                                                <td>{conference.roomNumber}</td>
                                                <td>{conference.enabled ? 'Enabled' : 'Disabled'}</td>
                                                <td>
                                                    {conference.enabled && !isRegistered(conference._id) && (
                                                        <button onClick={() => registerForConference(conference._id)}>Register</button>
                                                    )}
                                                    {conference.enabled && isRegistered(conference._id) && !isAttended(conference._id) && (
                                                        <button onClick={() => attendConference(conference._id)}>Attend</button>
                                                    )}
                                                    {isAttended(conference._id) && (
                                                        <button onClick={() => attendConference(conference._id)}>Enter Conference</button>
                                                    )}
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

export default AttendeeDashboard;
