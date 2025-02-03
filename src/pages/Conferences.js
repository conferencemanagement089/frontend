import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import './Conferences.css';

const Conferences = () => {
    const { token } = useContext(AuthContext);
    const [conferences, setConferences] = useState([]);
    const [newConference, setNewConference] = useState({
        title: '',
        description: '',
        date: '',
        presenterEmail: ''
    });

    useEffect(() => {
        fetchConferences();
    }, []);

    const fetchConferences = async () => {
        try {
            const res = await axios.get('http://localhost:5001/api/conferences', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setConferences(res.data);
        } catch (err) {
            console.error(err.response.data);
        }
    };

    const handleCreateConference = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5001/api/conferences', newConference, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            fetchConferences();
        } catch (err) {
            console.error(err.response.data);
        }
    };

    const handleDeleteConference = async (id) => {
        try {
            await axios.delete(`http://localhost:5001/api/conferences/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            fetchConferences();
        } catch (err) {
            console.error(err.response.data);
        }
    };

    const handleChange = (e) => {
        setNewConference({ ...newConference, [e.target.name]: e.target.value });
    };

    return (
        <div className="conferences-container">
            <h1>Session</h1>
            <form onSubmit={handleCreateConference}>
                <input
                    type="text"
                    name="title"
                    placeholder="Title"
                    value={newConference.title}
                    onChange={handleChange}
                />
                <input
                    type="text"
                    name="description"
                    placeholder="Description"
                    value={newConference.description}
                    onChange={handleChange}
                />
                <input
                    type="date"
                    name="date"
                    value={newConference.date}
                    onChange={handleChange}
                />
                <input
                    type="email"
                    name="presenterEmail"
                    placeholder="Presenter Email"
                    value={newConference.presenterEmail}
                    onChange={handleChange}
                />
                <button type="submit">Create Session</button>
            </form>
            <table>
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Description</th>
                        <th>Date</th>
                        <th>Presenter Email</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {conferences.map((conference) => (
                        <tr key={conference._id}>
                            <td>{conference.title}</td>
                            <td>{conference.description}</td>
                            <td>{conference.date}</td>
                            <td>{conference.presenterEmail}</td>
                            <td>{conference.status}</td>
                            <td>
                                <button onClick={() => handleDeleteConference(conference._id)}>Delete</button>
                                {/* Additional buttons for Update, Start, End can be added here */}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Conferences;
