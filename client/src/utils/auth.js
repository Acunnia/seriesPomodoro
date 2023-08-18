import { createContext } from 'react';
import jwt_decode from 'jwt-decode';

export const AuthContext = createContext();

export const reducer = (state, action) => {
    switch (action.type) {
        case 'LOGIN':
            const decodedToken = jwt_decode(action.payload.token)
            localStorage.setItem('user', JSON.stringify(action.payload.user));
            localStorage.setItem('token', JSON.stringify(action.payload.token));
            return {
                ...state,
                isAuthenticated: true,
                user: action.payload.user,
                token: action.payload.token,
            };

        case 'LOGOUT':
            localStorage.removeItem('user');
            localStorage.removeItem('token');
            return {
                ...state,
                isAuthenticated: false,
                user: null,
                token: null,
            };

        default:
            return state;
    }
};
