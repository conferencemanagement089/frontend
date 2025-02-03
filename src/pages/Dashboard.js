import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import QRScanner from './QRScanner'; // Import the QRScanner component
import './Dashboard.css';

const Dashboard = () => {
    const { token, user } = useContext(AuthContext);
    const [conferences, setConferences] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showScanner, setShowScanner] = useState(false);
    const [scannedData, setScannedData] = useState('');

    useEffect(() => {
        fetchConferences();
    }, []);

    const fetchConferences = async () => {
        setLoading(true);
        try {
            const res = await axios.get('http://localhost:27017/api/conferences', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setConferences(res.data);
        } catch (err) {
            setError(err.response?.data || 'Error fetching conferences');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString();
    };

    return (
        <div className="dashboard-container">
            <h1>{user.role} Dashboard</h1>
            <button onClick={() => setShowScanner(!showScanner)}>
                {showScanner ? 'Close Scanner' : 'Open Scanner'}
            </button>
            {showScanner && <QRScanner setScannedData={setScannedData} />}
            {scannedData && <p>Scanned Data: {String(scannedData)}</p>}

            {loading && <p>Loading conferences...</p>}
            {error && <div className="error-message">{String(error)}</div>}
            {!loading && !error && (
                <table>
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Description</th>
                            <th>Date</th>
                            <th>Presenter Email</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {conferences.map((conference) => (
                            <tr key={conference._id}>
                                <td>{conference.title}</td>
                                <td>{conference.description}</td>
                                <td>{formatDate(conference.date)}</td>
                                <td>{conference.presenterEmail}</td>
                                <td>{conference.status}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default Dashboard;
