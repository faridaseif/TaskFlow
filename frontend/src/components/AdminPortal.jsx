import React from 'react';
import { useNavigate } from 'react-router-dom';
import './auth/Login.css';

const AdminPortal = () => {
    const navigate = useNavigate();

    return (
        <div className="login-container">
            <div className="login-card" style={{ textAlign: 'center' }}>
                <h1 style={{ color: '#ff5e5e', marginBottom: '16px' }}>Admin Portal</h1>
                <p style={{ color: '#8a92a6', marginBottom: '32px' }}>Welcome, Administrator. You have full access.</p>
                <button className="submit-btn" onClick={() => navigate('/login')}>Sign Out</button>
            </div>
        </div>
    );
};

export default AdminPortal;
