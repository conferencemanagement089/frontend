import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import './Dashboard.css';

const PresenterDashboard = () => {
    const { token, user } = useContext(AuthContext);
    const [sessions, setSessions] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchSessions();
    }, []);

    const fetchSessions = async () => {
        try {
            const res = await axios.get('https://backend-lzjt.onrender.com/api/sessions', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            const filteredSessions = res.data
                .map(session => ({
                    ...session,
                    conferences: session.conferences.filter(conf => conf.presenterEmail === user.email)
                }))
                .filter(session => session.conferences.length > 0);
            setSessions(filteredSessions);
        } catch (err) {
            console.error(err.response.data);
        }
    };

    const requestPayment = async (id) => {
        try {
            await axios.post(`https://backend-lzjt.onrender.com/api/conferences/${id}/request-payment`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            fetchSessions();
        } catch (err) {
            console.error(err.response.data);
        }
    };

    const handleEnterConference = (id) => {
        navigate(`/enter-conference/${id}`);
    };

    return (
        <div className="dashboard-container">
            <h1>Presenter Dashboard</h1>
            {sessions.map(session => (
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
                                            <td>{conference.paymentStatus}</td>
                                            <td>
                                                {conference.paymentStatus === 'None' && (
                                                    <button onClick={() => requestPayment(conference._id)}>Request Payment</button>
                                                )}
                                                {conference.paymentStatus === 'Pending' && (
                                                    <span>Pending Approval</span>
                                                )}
                                                {conference.paymentStatus === 'Approved' && (
                                                    <button onClick={() => handleEnterConference(conference._id)}>Enter Conference</button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

export default PresenterDashboard;
