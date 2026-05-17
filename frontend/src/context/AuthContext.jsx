import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [role, setRole] = useState(localStorage.getItem('role') || 'USER');
    const [currentUser, setCurrentUser] = useState(JSON.parse(localStorage.getItem('user')) || {
        name: 'Guest User',
        email: '',
        avatar: 'G',
        signupDate: null
    });

    const login = (userData) => {
        const defaultName = userData.role === 'ADMIN' ? 'Admin' : 'User';
        const name = userData.name || defaultName;
        const user = {
            ...userData,
            name: name,
            avatar: name.split(' ').map(n => n[0]).join('').toUpperCase()
        };
        setCurrentUser(user);
        setRole(userData.role);
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('role', userData.role);
    };

    const logout = () => {
        setCurrentUser({ name: 'Guest User', email: '', avatar: 'G', signupDate: null });
        setRole('USER');
        localStorage.removeItem('user');
        localStorage.removeItem('role');
    };

    return (
        <AuthContext.Provider value={{ currentUser, role, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
