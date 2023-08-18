import { createContext } from 'react';
import jwt_decode from 'jwt-decode';

export const AuthContext = createContext();

export const reducer = (state, action) => {
    switch (action.type) {
        case 'LOGIN':
            const decodedToken = jwt_decode(action.payload.token)
            const tokenExpirationTimestamp = decodedToken.exp * 1000;
            const currentTime = Date.now();
            const isSavedTokenExpired = tokenExpirationTimestamp < currentTime;

            localStorage.setItem('user', JSON.stringify(action.payload.user));
            localStorage.setItem('token', JSON.stringify(action.payload.token));
            return {
                ...state,
                isAuthenticated: true,
                user: action.payload.user,
                token: action.payload.token,
                isTokenExpired: isSavedTokenExpired,
                admin_level: action.payload.user.role.admin_level
            };

        case 'LOGOUT':
            localStorage.removeItem('user');
            localStorage.removeItem('token');
            return {
                ...state,
                isAuthenticated: false,
                user: null,
                token: null,
                isTokenExpired: false,
                admin_level: 0
            };

        default:
            return state;
    }
};
