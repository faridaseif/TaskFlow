import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Shield, Calendar, RefreshCw, CheckCircle, Briefcase, ChevronRight, Edit3, X, User, Lock, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './Profile.css';

const Profile = ({ tasks = [] }) => {
    const { currentUser, role, login } = useAuth();
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [greeting, setGreeting] = useState('');

    const myTasks = tasks.filter(task => task.assignee === currentUser?.name);
    
    const myProjects = [...new Set(myTasks.map(t => t.project).filter(Boolean))].map((projectName, i) => ({
        id: i,
        name: projectName,
        pm: "N/A",
        deadline: "TBD"
    }));

    const [stats, setStats] = useState({ tasks: myTasks.length, projects: myProjects.length });

    useEffect(() => {
        setStats({ tasks: myTasks.length, projects: myProjects.length });
    }, [myTasks.length, myProjects.length]);

    useEffect(() => {
        const hour = new Date().getHours();
        if (hour < 12) setGreeting('Good morning');
        else if (hour < 18) setGreeting('Good afternoon');
        else setGreeting('Good evening');
    }, []);

    const handleRefresh = () => {
        setIsRefreshing(true);
        setTimeout(() => {
            setStats({ tasks: myTasks.length, projects: myProjects.length });
            setIsRefreshing(false);
        }, 1000);
    };

    const getInitials = (name) => {
        const defaultName = role === 'ADMIN' ? 'Admin' : 'User';
        return (name || defaultName)
            .split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase();
    };

    return (
        <div className="profile-page">
            <header className="profile-header">
                <motion.h1 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="greeting-text"
                >
                    {greeting}, {currentUser?.name?.split(' ')[0]} 👋
                </motion.h1>
                <div className="header-actions">
                    <button 
                        className="edit-profile-btn" 
                        onClick={() => setIsEditModalOpen(true)}
                    >
                        <Edit3 size={18} />
                        <span>Edit Profile</span>
                    </button>
                    {role !== 'ADMIN' && (
                        <button 
                            className={`refresh-btn ${isRefreshing ? 'spinning' : ''}`} 
                            onClick={handleRefresh}
                            disabled={isRefreshing}
                        >
                            <RefreshCw size={18} />
                            <span>Refresh Stats</span>
                        </button>
                    )}
                </div>
            </header>

            <div className={`profile-layout ${role === 'ADMIN' ? 'admin-profile-layout' : ''}`}>
                {/* LEFT COLUMN: INFO */}
                <aside className="profile-aside">
                    <motion.div 
                        className="profile-card info-card"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <div className="card-header-profile">
                            <div className={`avatar-large ${role === 'ADMIN' ? 'admin-avatar' : ''}`}>{getInitials(currentUser?.name)}</div>
                            <div className="user-titles">
                                <h3>{currentUser?.name}</h3>
                                <span className="badge">{role}</span>
                            </div>
                        </div>
                        
                        <div className="card-body">
                            <div className="info-item">
                                <Mail size={18} className="icon" />
                                <div className="info-content">
                                    <label>Email Address</label>
                                    <p>{currentUser?.email}</p>
                                </div>
                            </div>
                            <div className="info-item">
                                <Shield size={18} className="icon" />
                                <div className="info-content">
                                    <label>Access Level</label>
                                    <p>{role === 'ADMIN' ? 'Administrator' : 'Standard User'}</p>
                                </div>
                            </div>
                            <div className="info-item">
                                <Calendar size={18} className="icon" />
                                <div className="info-content">
                                    <label>Member Since</label>
                                    <p>{currentUser?.signupDate ? new Date(currentUser.signupDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'May 2026'}</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </aside>

                {/* RIGHT COLUMN: STATS + DETAILS - ONLY FOR NON-ADMINS */}
                {role !== 'ADMIN' && (
                    <div className="profile-main">
                        {/* STATS ROW */}
                        <div className="stats-row">
                            <motion.div 
                                className="profile-card stats-card-mini"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                            >
                                <div className="stats-icon-mini tasks-icon">
                                    <CheckCircle size={20} />
                                </div>
                                <div className="stats-info-mini">
                                    <label>My Tasks</label>
                                    <div className="stats-value-mini"><Counter value={stats.tasks} /></div>
                                </div>
                            </motion.div>

                            <motion.div 
                                className="profile-card stats-card-mini"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                            >
                                <div className="stats-icon-mini projects-icon">
                                    <Briefcase size={20} />
                                </div>
                                <div className="stats-info-mini">
                                    <label>Assigned Projects</label>
                                    <div className="stats-value-mini"><Counter value={stats.projects} /></div>
                                </div>
                            </motion.div>
                        </div>

                        {/* DETAILED LISTS */}
                        <motion.div 
                            className="profile-card detail-list-card"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                        >
                            <div className="list-section">
                                <div className="list-header">
                                    <h4>Active Tasks</h4>
                                    <span className="count-pill">{myTasks.length}</span>
                                </div>
                                <div className="list-items">
                                    {myTasks.map(task => (
                                        <div key={task.id} className="list-item">
                                            <div className="item-info">
                                                <p className="item-name">{task.title}</p>
                                                <span className="item-subtext">Project: <strong>{task.project || 'Unassigned'}</strong></span>
                                            </div>
                                            <ChevronRight size={16} className="item-arrow" />
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="list-section divider">
                                <div className="list-header">
                                    <h4>Assigned Projects</h4>
                                    <span className="count-pill">{myProjects.length}</span>
                                </div>
                                <div className="list-items">
                                    {myProjects.map(project => (
                                        <div key={project.id} className="list-item">
                                            <div className="item-info">
                                                <p className="item-name">{project.name}</p>
                                                <span className="item-subtext">PM: <strong>{project.pm}</strong></span>
                                            </div>
                                            <div className="item-deadline">
                                                <label>Deadline</label>
                                                <span>{project.deadline}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </div>

            {/* Edit Profile Modal */}
            <AnimatePresence>
                {isEditModalOpen && (
                    <EditProfileModal 
                        user={currentUser} 
                        onClose={() => setIsEditModalOpen(false)}
                        onUpdate={(updatedData) => {
                            // Update local storage and context
                            const newUser = { ...currentUser, ...updatedData };
                            localStorage.setItem('user', JSON.stringify(newUser));
                            window.location.reload(); // Refresh to propagate changes
                        }}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

const EditProfileModal = ({ user, onClose, onUpdate }) => {
    const [activeTab, setActiveTab] = useState('general'); // 'general' or 'security'
    const [formData, setFormData] = useState({ name: user.name, email: user.email });
    const [pwdData, setPwdData] = useState({ oldPassword: '', newPassword: '' });
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState({ type: '', message: '' });

    const handleUpdateDetails = async (e) => {
        e.preventDefault();
        setLoading(true);
        setStatus({ type: '', message: '' });
        try {
            const response = await fetch('http://localhost:8080/api/users/update-profile', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ currentEmail: user.email, ...formData })
            });
            if (response.ok) {
                setStatus({ type: 'success', message: 'Profile updated!' });
                setTimeout(() => onUpdate(formData), 1000);
            } else {
                setStatus({ type: 'error', message: 'Update failed.' });
            }
        } catch (error) {
            setStatus({ type: 'error', message: 'Network error.' });
        } finally {
            setLoading(false);
        }
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();
        setLoading(true);
        setStatus({ type: '', message: '' });
        try {
            const response = await fetch('http://localhost:8080/api/users/change-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: user.email, ...pwdData })
            });
            if (response.ok) {
                setStatus({ type: 'success', message: 'Password changed successfully!' });
                setPwdData({ oldPassword: '', newPassword: '' });
            } else {
                const txt = await response.text();
                setStatus({ type: 'error', message: txt || 'Invalid current password.' });
            }
        } catch (error) {
            setStatus({ type: 'error', message: 'Network error.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <motion.div 
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="modal-content profile-edit-modal"
                onClick={e => e.stopPropagation()}
            >
                <div className="modal-header">
                    <h2>Edit Profile</h2>
                    <button className="close-btn" onClick={onClose}><X size={20} /></button>
                </div>

                <div className="modal-tabs">
                    <button 
                        className={activeTab === 'general' ? 'active' : ''} 
                        onClick={() => setActiveTab('general')}
                    >
                        <User size={16} /> General
                    </button>
                    <button 
                        className={activeTab === 'security' ? 'active' : ''} 
                        onClick={() => setActiveTab('security')}
                    >
                        <Lock size={16} /> Security
                    </button>
                </div>

                {status.message && (
                    <div className={`status-banner ${status.type}`} style={{ 
                        padding: '12px', 
                        borderRadius: '10px', 
                        marginBottom: '1.5rem', 
                        fontSize: '0.9rem',
                        backgroundColor: status.type === 'success' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                        color: status.type === 'success' ? '#10b981' : '#ef4444',
                        border: '1px solid currentColor'
                    }}>
                        {status.message}
                    </div>
                )}

                {activeTab === 'general' ? (
                    <form onSubmit={handleUpdateDetails} className="modal-form">
                        <div className="form-group">
                            <label>Full Name</label>
                            <input 
                                type="text" 
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Email Address</label>
                            <input 
                                type="email" 
                                value={formData.email}
                                onChange={e => setFormData({ ...formData, email: e.target.value })}
                                required
                            />
                        </div>
                        <button type="submit" className="submit-btn" disabled={loading}>
                            {loading ? 'Saving...' : 'Save Changes'}
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleChangePassword} className="modal-form">
                        <div className="form-group">
                            <label>Current Password</label>
                            <input 
                                type="password" 
                                value={pwdData.oldPassword}
                                onChange={e => setPwdData({ ...pwdData, oldPassword: e.target.value })}
                                required
                                placeholder="Enter current password"
                            />
                        </div>
                        <div className="form-group">
                            <label>New Password</label>
                            <input 
                                type="password" 
                                value={pwdData.newPassword}
                                onChange={e => setPwdData({ ...pwdData, newPassword: e.target.value })}
                                required
                                placeholder="Min 8 chars, 1 letter, 1 number"
                            />
                        </div>
                        <button type="submit" className="submit-btn" disabled={loading}>
                            {loading ? 'Updating...' : 'Update Password'}
                        </button>
                    </form>
                )}
            </motion.div>
        </div>
    );
};

const Counter = ({ value }) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
        let start = 0;
        const end = value;
        if (start === end) return;
        let totalMiliseconds = 1000;
        let incrementTime = totalMiliseconds / Math.max(end, 1);
        let timer = setInterval(() => {
            start += 1;
            setCount(start);
            if (start === end) clearInterval(timer);
        }, incrementTime);
        return () => clearInterval(timer);
    }, [value]);

    return <span>{count}</span>;
};

export default Profile;
