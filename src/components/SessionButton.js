import React, { useState } from 'react';
import './SessionButton.css';

const SessionButton = ({ session, conferences }) => {
    const [expanded, setExpanded] = useState(false);

    const toggleExpand = () => {
        setExpanded(!expanded);
    };

    return (
        <div className="session-button-container">
            <button className="session-button" onClick={toggleExpand}>
                {session.name} - {new Date(session.startDateTime).toLocaleString()} to {new Date(session.endDateTime).toLocaleString()} at {session.location}
            </button>
            {expanded && (
                <div className="conferences-container">
                    <ul>
                        {conferences.map(conference => (
                            <li key={conference._id}>
                                <p>Title: {conference.title}</p>
                                <p>Description: {conference.description}</p>
                                <p>Date: {new Date(conference.date).toLocaleDateString()} {conference.time}</p>
                                <p>Presenter Email: {conference.presenterEmail}</p>
                                <p>Status: {conference.enabled ? 'Enabled' : 'Disabled'}</p>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default SessionButton;
