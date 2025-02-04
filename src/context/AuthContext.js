import { createContext, useReducer, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

const authReducer = (state, action) => {
    switch (action.type) {
        case 'LOGIN':
            localStorage.setItem('token', action.payload.token);
            return {
                ...state,
                user: action.payload.user,
                token: action.payload.token,
            };
        case 'LOGOUT':
            localStorage.removeItem('token');
            return {
                ...state,
                user: null,
                token: null,
            };
        case 'SET_PROFILE':
            return {
                ...state,
                user: action.payload,
            };
        default:
            return state;
    }
};

const AuthProvider = ({ children }) => {
    const [state, dispatch] = useReducer(authReducer, {
        user: null,
        token: localStorage.getItem('token'),
    });

    useEffect(() => {
        const fetchProfile = async () => {
            if (state.token) {
                try {
                    const res = await axios.get('https://backend-lzjt.onrender.com/api/auth/profile', {
                        headers: {
                            Authorization: `Bearer ${state.token}`
                        }
                    });
                    dispatch({ type: 'SET_PROFILE', payload: res.data });
                } catch (err) {
                    console.error(err.response.data);
                }
            }
        };

        fetchProfile();
    }, [state.token]);

    const login = (userData) => {
        dispatch({ type: 'LOGIN', payload: userData });
    };

    const logout = () => {
        dispatch({ type: 'LOGOUT' });
    };

    return (
        <AuthContext.Provider value={{ ...state, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export { AuthContext, AuthProvider };
