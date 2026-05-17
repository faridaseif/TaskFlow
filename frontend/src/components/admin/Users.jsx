import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, UserPlus, Trash2, ShieldCheck, User as UserIcon, Calendar, X, Check } from 'lucide-react';
import './Users.css';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('ALL');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    // Fetch users from backend
    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await fetch('http://localhost:8080/api/users');
            if (response.ok) {
                const data = await response.json();
                if (Array.isArray(data)) {
                    setUsers(data);
                }
            } else {
                console.error('Failed to fetch users:', response.status);
            }
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredUsers = useMemo(() => {
        return users.filter(user => {
            const name = user.name || '';
            const email = user.email || '';
            const matchesSearch = name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                                email.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesRole = roleFilter === 'ALL' || user.role === roleFilter;
            return matchesSearch && matchesRole;
        });
    }, [users, searchTerm, roleFilter]);

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            try {
                const response = await fetch(`http://localhost:8080/api/users/${id}`, {
                    method: 'DELETE'
                });
                if (response.ok) {
                    setUsers(users.filter(user => user.id !== id));
                }
            } catch (error) {
                console.error('Error deleting user:', error);
            }
        }
    };

    const toggleRole = async (user) => {
        const newRole = user.role === 'ADMIN' ? 'USER' : 'ADMIN';
        try {
            const response = await fetch(`http://localhost:8080/api/users/${user.id}/role?role=${newRole}`, {
                method: 'PATCH'
            });
            if (response.ok) {
                setUsers(users.map(u => u.id === user.id ? { ...u, role: newRole } : u));
            }
        } catch (error) {
            console.error('Error updating role:', error);
        }
    };

    return (
        <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="admin-container"
        >
            <header className="admin-header">
                <div className="header-titles">
                    <h1>User Management</h1>
                    <p>Total workspace members: {users.length}</p>
                </div>
                <button className="add-user-btn" onClick={() => setIsAddModalOpen(true)}>
                    <UserPlus size={18} />
                    <span>Add Member</span>
                </button>
            </header>

            <div className="admin-controls">
                <div className="search-box">
                    <Search size={18} className="search-icon" />
                    <input 
                        type="text" 
                        placeholder="Search by name or email..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="filter-tabs">
                    <button 
                        className={roleFilter === 'ALL' ? 'active' : ''} 
                        onClick={() => setRoleFilter('ALL')}
                    >All</button>
                    <button 
                        className={roleFilter === 'ADMIN' ? 'active' : ''} 
                        onClick={() => setRoleFilter('ADMIN')}
                    >Admins</button>
                    <button 
                        className={roleFilter === 'USER' ? 'active' : ''} 
                        onClick={() => setRoleFilter('USER')}
                    >Users</button>
                </div>
            </div>

            <div className="user-table-wrapper">
                {loading ? (
                    <div className="loading-state">Loading users...</div>
                ) : (
                    <table className="user-table">
                        <thead>
                            <tr>
                                <th>Member</th>
                                <th>Role</th>
                                <th>Signup Date</th>
                                <th className="text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <AnimatePresence mode='popLayout'>
                                {filteredUsers.map((user, index) => (
                                    <UserRow 
                                        key={user.id} 
                                        user={user} 
                                        index={index}
                                        onDelete={handleDelete}
                                        onToggleRole={toggleRole}
                                    />
                                ))}
                            </AnimatePresence>
                        </tbody>
                    </table>
                )}
                {!loading && filteredUsers.length === 0 && (
                    <div className="empty-state">
                        <UserIcon size={48} className="empty-icon" />
                        <p>No users found matching your criteria</p>
                    </div>
                )}
            </div>

            {/* Add Member Modal */}
            <AnimatePresence>
                {isAddModalOpen && (
                    <AddMemberModal 
                        onClose={() => setIsAddModalOpen(false)} 
                        onSuccess={() => {
                            fetchUsers(); // Just re-fetch all users to keep state in sync
                        }}
                    />
                )}
            </AnimatePresence>
        </motion.div>
    );
};

const UserRow = ({ user, index, onDelete, onToggleRole }) => {
    const name = user.name || 'Anonymous';
    const initials = name.split(' ').map(n => n[0]).join('').toUpperCase();
    const formattedDate = user.signupDate ? new Date(user.signupDate).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    }) : 'N/A';

    return (
        <motion.tr 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ delay: index * 0.05 }}
            className="user-row"
        >
            <td>
                <div className="member-info">
                    <div className={`member-avatar ${user.role === 'ADMIN' ? 'admin-avatar' : ''}`}>
                        {initials}
                    </div>
                    <div className="member-details">
                        <span className="member-name">{name}</span>
                        <span className="member-email">{user.email}</span>
                    </div>
                </div>
            </td>
            <td>
                <span className={`role-pill ${user.role?.toLowerCase()}`}>
                    {user.role === 'ADMIN' && <ShieldCheck size={12} />}
                    {user.role}
                </span>
            </td>
            <td>
                <div className="date-info">
                    <Calendar size={14} />
                    <span>{formattedDate}</span>
                </div>
            </td>
            <td className="text-right">
                <div className="action-group">
                    <button className="action-btn role-toggle" title="Toggle Admin Role" onClick={() => onToggleRole(user)}>
                        <ShieldCheck size={18} />
                    </button>
                    <button className="action-btn delete-btn" title="Delete User" onClick={() => onDelete(user.id)}>
                        <Trash2 size={18} />
                    </button>
                </div>
            </td>
        </motion.tr>
    );
};

const AddMemberModal = ({ onClose, onSuccess }) => {
    const [formData, setFormData] = useState({ name: '', email: '', role: 'USER' });
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [generatedCode, setGeneratedCode] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);

    // Generate a secure random password/join code
    const generateJoinCode = () => {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = 'TF'; // Removed the hyphen to satisfy [A-Za-z\d] regex
        for (let i = 0; i < 8; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result + '1a'; 
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrorMsg('');
        
        const tempPassword = generateJoinCode();
        console.log("Attempting to create member with payload:", { ...formData, password: tempPassword });
        
        try {
            const response = await fetch('http://localhost:8080/api/auth/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...formData, password: tempPassword })
            });
            
            console.log("Signup Response Status:", response.status);
            const data = await response.json();
            console.log("Signup Response Data:", data);
            
            if (response.ok && data.success) {
                console.log("Signup SUCCESS");
                setGeneratedCode(tempPassword);
                setIsSuccess(true);
                onSuccess(); // Refresh the list
            } else {
                console.log("Signup FAILED:", data.message);
                setErrorMsg(data.message || 'Failed to create member. Check if email is unique.');
            }
        } catch (error) {
            console.error('Error adding user:', error);
            setErrorMsg('Server connection failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (isSuccess) {
        return (
            <div className="modal-overlay" onClick={onClose}>
                <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="modal-content"
                    style={{ textAlign: 'center' }}
                    onClick={e => e.stopPropagation()}
                >
                    <div className="success-icon-wrapper" style={{ color: '#10b981', marginBottom: '1.5rem', display: 'flex', justifyContent: 'center' }}>
                        <Check size={48} />
                    </div>
                    <h2 style={{ marginBottom: '1rem' }}>Member Created!</h2>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
                        The account for <strong>{formData.name}</strong> has been created. 
                        Give them this temporary <strong>Join Code</strong> to sign in:
                    </p>
                    <div className="join-code-box" style={{ backgroundColor: 'var(--bg-dark)', padding: '1.2rem', borderRadius: '12px', border: '2px dashed var(--primary-color)', fontSize: '1.5rem', fontWeight: '700', letterSpacing: '2px', color: 'var(--primary-color)', marginBottom: '2rem' }}>
                        {generatedCode}
                    </div>
                    <button className="submit-btn" onClick={onClose}>Got it</button>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="modal-overlay" onClick={onClose}>
            <motion.div 
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="modal-content"
                onClick={e => e.stopPropagation()}
            >
                <div className="modal-header">
                    <h2>Add New Member</h2>
                    <button className="close-btn" onClick={onClose}><X size={20} /></button>
                </div>

                {errorMsg && (
                    <div className="error-banner" style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', padding: '10px', borderRadius: '8px', marginBottom: '15px', fontSize: '0.85rem', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
                        {errorMsg}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="modal-form">
                    <div className="form-group">
                        <label>Full Name</label>
                        <input 
                            type="text" 
                            required 
                            value={formData.name}
                            onChange={e => setFormData({...formData, name: e.target.value})}
                            placeholder="John Doe"
                        />
                    </div>
                    <div className="form-group">
                        <label>Email Address</label>
                        <input 
                            type="email" 
                            required 
                            value={formData.email}
                            onChange={e => setFormData({...formData, email: e.target.value})}
                            placeholder="john@example.com"
                        />
                    </div>
                    <div className="form-group">
                        <label>Assigned Role</label>
                        <select 
                            value={formData.role}
                            onChange={e => setFormData({...formData, role: e.target.value})}
                            style={{ width: '100%', padding: '0.8rem', borderRadius: '10px', backgroundColor: 'var(--bg-dark)', color: 'white', border: '1px solid var(--border-color)' }}
                        >
                            <option value="USER">Standard User</option>
                            <option value="ADMIN">Administrator</option>
                        </select>
                    </div>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '1rem', fontStyle: 'italic' }}>
                        * A temporary Join Code will be generated automatically for security.
                    </p>
                    <button type="submit" className="submit-btn" disabled={loading}>
                        {loading ? 'Creating Account...' : 'Create Member'}
                    </button>
                </form>
            </motion.div>
        </div>
    );
};

export default UserManagement;
