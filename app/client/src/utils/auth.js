import { createContext } from 'react';

export const AuthContext = createContext();

export const reducer = (state, action) => {
    switch (action.type) {
        case 'LOGIN':
            localStorage.setItem('user', JSON.stringify(action.payload.user));
            localStorage.setItem('token', JSON.stringify(action.payload.token));
            return {
                ...state,
                isAuthenticated: true,
                user: action.payload.user,
                token: action.payload.token,
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
                admin_level: 0
            };

        default:
            return state;
    }
};
