import React, { useState, useEffect, useContext, useCallback } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import './Users.css';

const Users = () => {
    const { token } = useContext(AuthContext);
    const [users, setUsers] = useState([]);

    const fetchUsers = useCallback(async () => {
        try {
            const res = await axios.get('http://localhost:5001/api/users', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setUsers(res.data);
        } catch (err) {
            console.error(err.response.data);
        }
    }, [token]);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    const handleDeleteUser = async (id) => {
        try {
            await axios.delete(`http://localhost:5001/api/users/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            fetchUsers();
        } catch (err) {
            console.error(err.response.data);
        }
    };

    return (
        <div className="users-container">
            <h1>User Details</h1>
            <table>
                <thead>
                    <tr>
                        <th>Username</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <tr key={user._id}>
                            <td>{user.username}</td>
                            <td>{user.email}</td>
                            <td>{user.role}</td>
                            <td>
                                <button onClick={() => handleDeleteUser(user._id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Users;
