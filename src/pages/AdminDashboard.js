import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import Papa from 'papaparse';
import { AuthContext } from '../context/AuthContext';
import QRScanner from '../components/QRScanner';
import './Dashboard.css';

const AdminDashboard = () => {
    const conferenceIdPattern = /Conference ID: (\w+)/;
    const { token } = useContext(AuthContext);
    const [sessions, setSessions] = useState([]);
    const [chairs, setChairs] = useState([]);
    const [showCreateSessionForm, setShowCreateSessionForm] = useState(false);
    const [showCreateConferenceForm, setShowCreateConferenceForm] = useState(false);
    const [selectedSession, setSelectedSession] = useState('');
    const [newSession, setNewSession] = useState({
        name: '',
        startDateTime: '',
        endDateTime: '',
        location: ''
    });
    const [newConference, setNewConference] = useState({
        title: '',
        description: '',
        date: '',
        time: '',
        presenterEmail: '',
        roomNumber: '',
        sessionId: ''
    });
    const [showScanner, setShowScanner] = useState(false);
    const [scannedData, setScannedData] = useState('');
    const [popupMessage, setPopupMessage] = useState('');

    useEffect(() => {
        fetchSessions();
        fetchChairs();
    }, []);

    const fetchSessions = async () => {
        try {
            const res = await axios.get('https://backend-lzjt.onrender.com/api/sessions', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setSessions(res.data);
        } catch (err) {
            console.error(err.response.data);
        }
    };

    const fetchChairs = async () => {
        try {
            const res = await axios.get('https://backend-lzjt.onrender.com/api/users', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            const chairUsers = res.data.filter(user => user.role === 'Chair');
            setChairs(chairUsers);
        } catch (err) {
            console.error(err.response.data);
        }
    };

    const toggleEnableConference = async (id) => {
        try {
            const res = await axios.patch(`https://backend-lzjt.onrender.com/api/conferences/${id}/enable`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setSessions(sessions.map(session => {
                session.conferences = session.conferences.map(conf => conf._id === id ? res.data : conf);
                return session;
            }));
        } catch (err) {
            console.error(err.response.data);
        }
    };

    const assignChair = async (id, chairId) => {
        try {
            const res = await axios.patch(`https://backend-lzjt.onrender.com/api/conferences/${id}/assign-chair`, { chairId }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setSessions(sessions.map(session => {
                session.conferences = session.conferences.map(conf => conf._id === id ? res.data : conf);
                return session;
            }));
        } catch (err) {
            console.error(err.response.data);
        }
    };

    const handleCreateSession = async () => {
        try {
            await axios.post('https://backend-lzjt.onrender.com/api/sessions', newSession, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setShowCreateSessionForm(false);
            fetchSessions();
        } catch (err) {
            console.error(err.response.data);
        }
    };

    const handleCreateConference = async () => {
        try {
            await axios.post(`https://backend-lzjt.onrender.com/api/sessions/${selectedSession}/conferences`, newConference, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setShowCreateConferenceForm(false);
            fetchSessions();
        } catch (err) {
            console.error(err.response.data);
        }
    };

    const handleSessionChange = (e) => {
        setNewSession({ ...newSession, [e.target.name]: e.target.value });
    };

    const handleConferenceChange = (e) => {
        setNewConference({ ...newConference, [e.target.name]: e.target.value });
    };

    const handleSessionSelect = (e) => {
        setSelectedSession(e.target.value);
        setNewConference({ ...newConference, sessionId: e.target.value });
    };

    const handleScan = async (data) => {
        setScannedData(data);
        setShowScanner(false);
        const match = data.match(conferenceIdPattern);
        if (match) {
            const confId = match[1];
            console.log("Session ID:", confId);
            try {
                const res = await axios.get(`https://backend-lzjt.onrender.com/api/conferences/verify-ticket/${confId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                console.log(res)
                if (res.data.msg === 'Ticket is valid') {
                    setPopupMessage('Valid ticket');
                } else {
                    setPopupMessage('Invalid ticket');
                }
            } catch (err) {
                setPopupMessage('Invalid ticket');
            }
            setTimeout(() => setPopupMessage(''), 3000); // Hide popup after 3 seconds
        } else {
            console.log("Session ID not found.");
            alert("Session ID not found.")
        }
    };

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        Papa.parse(file, {
            header: true,
            complete: async (results) => {
                const data = results.data;
                let isError = false;
                for (let i = 0; i < data.length-1; i++) {
                    const session = data[i];
                    console.log("Processing Conference:", session);
                    if (!session.name || !session.startDateTime || !session.endDateTime || !session.location) {
                        console.error("Error in Conference data:", session);
                        setPopupMessage('There is a problem with the CSV file.');
                        isError = true;
                        break;
                    }
                    try {
                        await axios.post('https://backend-lzjt.onrender.com/api/sessions', {
                            name: session.name,
                            startDateTime: session.startDateTime,
                            endDateTime: session.endDateTime,
                            location: session.location
                        }, {
                            headers: {
                                Authorization: `Bearer ${token}`
                            }
                        });
                    } catch (err) {
                        console.error(err.response.data);
                        setPopupMessage('There was an error creating conference.');
                        isError = true;
                        break;
                    }
                }
                if (!isError) {
                    fetchSessions();
                    setPopupMessage('Conference created successfully from CSV file.');
                }
                setTimeout(() => setPopupMessage(''), 3000); // Hide popup after 3 seconds
            }
        });
    };

    return (
        <div className="dashboard-container">
            <h1>Admin Dashboard</h1>
            <button className="dashboard-button" onClick={() => setShowCreateSessionForm(!showCreateSessionForm)}>Create Conference</button>
            {showCreateSessionForm && (
                <div className="create-session-form">
                    <h2>Create New Conference</h2>
                    <input
                        type="text"
                        name="name"
                        placeholder="Conference Name"
                        value={newSession.name}
                        onChange={handleSessionChange}
                    />
                    <input
                        type="datetime-local"
                        name="startDateTime"
                        placeholder="Start Date Time"
                        value={newSession.startDateTime}
                        onChange={handleSessionChange}
                    />
                    <input
                        type="datetime-local"
                        name="endDateTime"
                        placeholder="End Date Time"
                        value={newSession.endDateTime}
                        onChange={handleSessionChange}
                    />
                    <input
                        type="text"
                        name="location"
                        placeholder="Location"
                        value={newSession.location}
                        onChange={handleSessionChange}
                    />
                    <button onClick={handleCreateSession}>Create</button>
                </div>
            )}
            <button className="dashboard-button" onClick={() => document.getElementById('fileInput').click()}>Upload CSV to Create Conference</button>
            <input id="fileInput" type="file" accept=".csv" style={{ display: 'none' }} onChange={handleFileUpload} />
            <button className="dashboard-button" onClick={() => setShowCreateConferenceForm(!showCreateConferenceForm)}>Create Session</button>
            {showCreateConferenceForm && (
                <div className="create-conference-form">
                    <h2>Create New Session</h2>
                    <select onChange={handleSessionSelect} value={selectedSession}>
                        <option value="">--Select Conference--</option>
                        {sessions.map(session => (
                            <option key={session._id} value={session._id}>
                                {session.name}
                            </option>
                        ))}
                    </select>
                    <input
                        type="text"
                        name="title"
                        placeholder="Title"
                        value={newConference.title}
                        onChange={handleConferenceChange}
                    />
                    <textarea
                        name="description"
                        placeholder="Description"
                        value={newConference.description}
                        onChange={handleConferenceChange}
                    />
                    <input
                        type="date"
                        name="date"
                        value={newConference.date}
                        onChange={handleConferenceChange}
                    />
                    <input
                        type="time"
                        name="time"
                        value={newConference.time}
                        onChange={handleConferenceChange}
                    />
                    <input
                        type="email"
                        name="presenterEmail"
                        placeholder="Presenter Email"
                        value={newConference.presenterEmail}
                        onChange={handleConferenceChange}
                    />
                    <input
                        type="text"
                        name="roomNumber"
                        placeholder="Room Number"
                        value={newConference.roomNumber}
                        onChange={handleConferenceChange}
                    />
                    <button onClick={handleCreateConference}>Create</button>
                </div>
            )}
            
            <button className="dashboard-button" onClick={() => setShowScanner(!showScanner)}>
                {showScanner ? 'Close Scanner' : 'Open Scanner'}
            </button>
            {showScanner && <QRScanner onScan={handleScan} />}
            {popupMessage && <div className="popup">{popupMessage}</div>}
            {scannedData && <p>Scanned Data: {scannedData}</p>}
            
            <table>
                <thead>
                    <tr>
                        <th>Conference Name</th>
                        <th>Start Date Time</th>
                        <th>End Date Time</th>
                        <th>Location</th>
                        <th>Sessions</th>
                    </tr>
                </thead>
                <tbody>
                    {sessions.map((session) => (
                        <tr key={session._id}>
                            <td>{session.name}</td>
                            <td>{new Date(session.startDateTime).toLocaleString()}</td>
                            <td>{new Date(session.endDateTime).toLocaleString()}</td>
                            <td>{session.location}</td>
                            <td>
                            <table>
    <thead>
        <tr>
            <th>Title</th>
            <th>Date</th>
            <th>Presenter Email</th>
            <th>Room Number</th>
            <th>Status</th>
            <th>Chair</th>
            <th>Actions</th>
        </tr>
    </thead>
    <tbody>
        {session.conferences.map(conference => (
            <tr key={conference._id}>
                <td>{conference.title}</td>
                <td>{new Date(conference.date).toLocaleDateString()} {conference.time}</td>
                <td>{conference.presenterEmail}</td>
                <td>{conference.roomNumber}</td>
                <td>{conference.enabled ? 'Enabled' : 'Disabled'}</td>
                <td>
                    <select
                        value={conference.chairId || ''}
                        onChange={(e) => assignChair(conference._id, e.target.value)}
                    >
                        <option value="">--Select Chair--</option>
                        {chairs.map(chair => (
                            <option key={chair._id} value={chair._id}>
                                {chair.username}
                            </option>
                        ))}
                    </select>
                </td>
                <td>
                    <button onClick={() => toggleEnableConference(conference._id)}>
                        {conference.enabled ? 'Disable' : 'Enable'}
                    </button>
                </td>
            </tr>
        ))}
    </tbody>
</table>

                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AdminDashboard;
