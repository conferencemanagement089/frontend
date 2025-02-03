import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import './Payment.css';

const Payment = () => {
    const { token } = useContext(AuthContext);
    const [conferences, setConferences] = useState([]);

    useEffect(() => {
        fetchPendingPayments();
    }, []);

    const fetchPendingPayments = async () => {
        try {
            const res = await axios.get('http://localhost:5001/api/conferences', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setConferences(res.data.filter(conf => conf.paymentStatus === 'Pending'));
        } catch (err) {
            console.error(err.response.data);
        }
    };

    const handlePaymentApproval = async (id, status) => {
        try {
            await axios.patch(`http://localhost:5001/api/conferences/${id}/approve-payment`, { status }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            fetchPendingPayments();
        } catch (err) {
            console.error(err.response.data);
        }
    };

    return (
        <div className="payment-container">
            <h1>Pending Payment Approvals</h1>
            <table>
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Description</th>
                        <th>Date</th>
                        <th>Presenter Email</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {conferences.map((conference) => (
                        <tr key={conference._id}>
                            <td>{conference.title}</td>
                            <td>{conference.description}</td>
                            <td>{new Date(conference.date).toLocaleDateString()}</td>
                            <td>{conference.presenterEmail}</td>
                            <td>
                                <button onClick={() => handlePaymentApproval(conference._id, 'Approved')}>Approve</button>
                                <button onClick={() => handlePaymentApproval(conference._id, 'Rejected')}>Reject</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Payment;
