import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import generateTicketPDF from '../utils/generateTicket';
import './EnterConference.css';

// Add your list of banned words here
const bannedWords = ["f**k", "sh*t", "a**hole", "b**ch", "d**k", "c**t", "b**tard", "b**ls", "n****r", "sp*c", "ch*nk", "k*ke", "w*tback", "p*ssy", "c*ck", "d**do", "f*ggot", "tw*t", "r*tard", "m*ron", "d**chebag", "sc*mbag", "c*ke", "m*th", "h*roin", "cr*ck", "sl*t", "wh*re", "tr*mp",'damn', 'hell', 'crap', 'ass', 'bitch', 'bastard', 'dick', 'pussy', 'slut', 'whore', 'cunt', 'fuck', 'shit', 'piss', 'tits', 'nigger', 'fag', 'retard', 'lame', 'idiot', 'moron', 'stupid', 'dumb', 'loser', 'weirdo'];

const EnterConference = () => {
    const { token, user } = useContext(AuthContext);
    const { id } = useParams();
    const [conference, setConference] = useState(null);
    const [chats, setChats] = useState([]);
    const [newMessage, setNewMessage] = useState('');

    useEffect(() => {
        fetchConference();
        fetchChats();
    }, []);

    const fetchConference = async () => {
        try {
            console.log('Fetching conference:', id);
            const res = await axios.get(`http://localhost:5001/api/conferences/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            console.log('Fetched conference:', res.data);
            setConference(res.data);
        } catch (err) {
            console.error('Error fetching conference:', err.response ? err.response.data : err.message);
        }
    };

    const fetchChats = async () => {
        try {
            console.log('Fetching chats for conference:', id);
            const res = await axios.get(`http://localhost:5001/api/conferences/${id}/chats`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            console.log('Fetched chats:', res.data);

            // Ensure that res.data is an array and contains chat messages
            if (Array.isArray(res.data)) {
                setChats(res.data);
            } else {
                console.error('Chats data is not in expected format:', res.data);
            }
        } catch (err) {
            console.error('Error fetching chats:', err.response ? err.response.data : err.message);
        }
    };

    const handleSendMessage = async () => {
        if (!newMessage.trim()) return;

        // Check for banned words
        const containsBannedWords = bannedWords.some(word => newMessage.toLowerCase().includes(word.toLowerCase()));

        if (containsBannedWords) {
            console.log('Message contains banned words and will not be sent.');
            setNewMessage(''); // Clear the input
            return;
        }

        try {
            console.log('Sending message:', newMessage, id);
            const res = await axios.post(`http://localhost:5001/api/conferences/${id}/chats`, { message: newMessage }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            console.log('Sent message response:', res.data);
            setChats([...chats, res.data]);
            setNewMessage('');
        } catch (err) {
            console.error('Server error', err.response ? err.response.data : err.message);
        }
    };

    const handleDownloadTicket = async () => {
        if (conference) {
            await generateTicketPDF(conference, user);
        }
    };

    return (
        <div className="enter-conference-container">
            {conference && (
                <>
                    <div className="conference-details">
                        <h1>{conference.title}</h1>
                        <p>{conference.description}</p>
                        <p>Date: {new Date(conference.date).toLocaleDateString()}</p>
                        {user.role === 'Presenter' && (
                            <button onClick={handleDownloadTicket}>Download Ticket</button>
                        )}
                    </div>
                    {user.role === 'Attendee' && (
                        <div className="chat-room">
                            <h2>Chat Room</h2>
                            {conference.chatEnabled ? (
                                <>
                                    <div className="chat-messages">
                                        {chats.map((chat, index) => (
                                            <div key={index} className="chat-message">
                                                <strong>{chat.username}:</strong> {chat.message}
                                            </div>
                                        ))}
                                    </div>
                                    <div className="chat-input">
                                        <input
                                            type="text"
                                            value={newMessage}
                                            onChange={(e) => setNewMessage(e.target.value)}
                                            placeholder="Type your message..."
                                        />
                                        <button onClick={handleSendMessage}>Send</button>
                                        <button onClick={fetchChats} className="refresh-chat">Refresh Chat</button>
                                    </div>
                                </>
                            ) : (
                                <p>Chat room is not enabled for this session.</p>
                            )}
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default EnterConference;
