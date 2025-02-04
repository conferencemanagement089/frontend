import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './Organize.css';

const Organize = () => {
    const { token } = useContext(AuthContext);
    const { id } = useParams();
    const [conference, setConference] = useState(null);
    const [chats, setChats] = useState([]);
    const [loading, setLoading] = useState(true); // State to track loading
    const [updatingChat, setUpdatingChat] = useState(false); // State for button disabling

    // Fetch conference and chat data
    useEffect(() => {
        fetchConference();
        fetchChats();
    }, [id]); // Added 'id' as dependency to refetch on route change

    const fetchConference = async () => {
        setLoading(true); // Show loading spinner while fetching data
        try {
            const res = await axios.get(`https://backend-lzjt.onrender.com/api/conferences/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setConference(res.data);
        } catch (err) {
            console.error('Error fetching conference:', err.response ? err.response.data : err.message);
        } finally {
            setLoading(false);
        }
    };

    const fetchChats = async () => {
        try {
            const res = await axios.get(`https://backend-lzjt.onrender.com/api/conferences/${id}/chats`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            console.log('Fetched chat for Chair:', res.data);
            setChats(res.data);
        } catch (err) {
            console.error('Error fetching chats:', err.response ? err.response.data : err.message);
        }
    };

    const toggleChatRoom = async () => {
        if (updatingChat) return; // Prevent toggling while updating

        setUpdatingChat(true); // Set updating state to true while the request is being processed
        try {
            const res = await axios.patch(
                `https://backend-lzjt.onrender.com/api/conferences/${id}/chat`,
                { enabled: !conference.chatEnabled },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setConference(res.data); // Update the conference state with the response
        } catch (err) {
            console.error('Error toggling chat room:', err.response ? err.response.data : err.message);
        } finally {
            setUpdatingChat(false); // Reset updating state after the request completes
        }
    };

    const handleRefreshChats = () => {
        fetchChats(); // Refresh chat data
    };

    if (loading) {
        return <div>Loading...</div>; // Loading state feedback
    }

    return (
        <div className="organize-container">
            {conference && (
                <>
                    <h1>Organize Sessions: {conference.title}</h1>
                    <button onClick={toggleChatRoom} disabled={updatingChat}>
                        {conference.chatEnabled ? 'Disable' : 'Enable'} Chat Room
                    </button>
                    <h2>Chats</h2>
                    <div className="chat-container">
                        {chats.length > 0 ? (
                            chats.map((chat, index) => (
                                <div key={index} className="chat-message">
                                    <strong>{chat.username}:</strong> {chat.message}
                                </div>
                            ))
                        ) : (
                            <p>No chats available</p>
                        )}
                    </div>
                    <button onClick={handleRefreshChats}>Refresh Chat</button>
                </>
            )}
        </div>
    );
};

export default Organize;
