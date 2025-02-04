import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import './Report.css';

const Report = () => {
    const { token } = useContext(AuthContext);
    const [conferences, setConferences] = useState([]);
    const [registrations, setRegistrations] = useState([]);
    const [selectedConference, setSelectedConference] = useState('');

    useEffect(() => {
        fetchConferences();
    }, []);

    useEffect(() => {
        if (selectedConference) {
            fetchRegistrations(selectedConference);
        }
    }, [selectedConference]);

    const fetchConferences = async () => {
        try {
            const res = await axios.get('https://backend-lzjt.onrender.com/api/conferences', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setConferences(res.data);
        } catch (err) {
            console.error(err.response.data);
        }
    };

    const fetchRegistrations = async (conferenceId) => {
        try {
            const res = await axios.get(`https://backend-lzjt.onrender.com/api/reports/registrations/${conferenceId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setRegistrations(res.data);
        } catch (err) {
            console.error(err.response.data);
        }
    };

    const handleConferenceChange = (e) => {
        setSelectedConference(e.target.value);
    };

    const exportToCSV = () => {
        const headers = [
            'Conference Title', 'Conference Description', 'Conference Date', 'Presenter Email',
            'Attendee Name', 'Attendee Email', 'Age', 'Department', 'Phone No', 'Address', 'Ticket', 'Attended'
        ];

        const rows = registrations.map(registration => [
            registration.conferenceId.title,
            registration.conferenceId.description,
            new Date(registration.conferenceId.date).toLocaleDateString(),
            registration.conferenceId.presenterEmail,
            registration.userId.username,
            registration.userId.email,
            registration.userId.age,
            registration.userId.department,
            registration.userId.phoneNo,
            registration.userId.address,
            registration.ticket,
            registration.attended ? 'Yes' : 'No'
        ]);

        let csvContent = 'data:text/csv;charset=utf-8,'
            + headers.join(',') + '\n'
            + rows.map(row => row.join(',')).join('\n');

        const link = document.createElement('a');
        link.setAttribute('href', encodeURI(csvContent));
        link.setAttribute('download', 'conference_report.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="report-container">
            <h1>Registration Report</h1>
            <div className="filter-container">
                <label htmlFor="conferenceSelect">Select Conference:</label>
                <select id="conferenceSelect" value={selectedConference} onChange={handleConferenceChange}>
                    <option value="">--Select Conference--</option>
                    {conferences.map(conference => (
                        <option key={conference._id} value={conference._id}>
                            {conference.title}
                        </option>
                    ))}
                </select>
                <button onClick={exportToCSV} disabled={!registrations.length}>Export to CSV</button>
            </div>
            <table>
                <thead>
                    <tr>
                        <th>Session Title</th>
                        <th>Session Description</th>
                        <th>Session Date</th>
                        <th>Presenter Email</th>
                        <th>Attendee Name</th>
                        <th>Attendee Email</th>
                        <th>Age</th>
                        <th>Department</th>
                        <th>Phone No</th>
                        <th>Address</th>
                        <th>Ticket</th>
                        <th>Attended</th>
                    </tr>
                </thead>
                <tbody>
                    {registrations.map((registration) => (
                        <tr key={registration._id}>
                            <td>{registration.conferenceId.title}</td>
                            <td>{registration.conferenceId.description}</td>
                            <td>{new Date(registration.conferenceId.date).toLocaleDateString()}</td>
                            <td>{registration.conferenceId.presenterEmail}</td>
                            <td>{registration.userId.username}</td>
                            <td>{registration.userId.email}</td>
                            <td>{registration.userId.age}</td>
                            <td>{registration.userId.department}</td>
                            <td>{registration.userId.phoneNo}</td>
                            <td>{registration.userId.address}</td>
                            <td>{registration.ticket}</td>
                            <td>{registration.attended ? 'Yes' : 'No'}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Report;
