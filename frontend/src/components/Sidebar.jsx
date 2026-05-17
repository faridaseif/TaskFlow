import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, FolderKanban, CheckSquare, TrendingUp, User, LogOut, Package, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './Sidebar.css';

const Sidebar = () => {
    const { currentUser, role } = useAuth();
    const [imageError, setImageError] = useState(false);
    const navigate = useNavigate();

    return (
        <div className="sidebar">
            <div className="sidebar-header">
                <div className="logo-icon">
                    <svg className="logo-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="3" width="7" height="7"></rect>
                        <rect x="14" y="3" width="7" height="7"></rect>
                        <rect x="14" y="14" width="7" height="7"></rect>
                        <rect x="3" y="14" width="7" height="7"></rect>
                    </svg>
                </div>
                <div className="logo-text">
                    <h2 className="text-h2">TaskFlow</h2>
                    <span className="text-small text-muted">Project & Task Management</span>
                </div>
            </div>

            <nav className="sidebar-nav">
                {role !== 'ADMIN' && (
                    <>
                        <div className="nav-section-title">Main</div>
                        <NavLink to="/home" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                            <LayoutDashboard size={20} />
                            <span>Dashboard</span>
                        </NavLink>
                        <NavLink to="/projects" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                            <FolderKanban size={20} />
                            <span>Projects</span>
                        </NavLink>
                        <NavLink to="/tasks" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                            <CheckSquare size={20} />
                            <span>Tasks</span>
                        </NavLink>
                        <NavLink to="/progress" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                            <TrendingUp size={20} />
                            <span>Progress</span>
                        </NavLink>
                    </>
                )}

                <div className="nav-section-title">Account</div>
                <NavLink to="/profile" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                    <User size={20} />
                    <span>Profile</span>
                </NavLink>

                {role === 'ADMIN' && (
                    <>
                        <div className="nav-section-title">Administration</div>
                        <NavLink to="/admin/users" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                            <ShieldCheck size={20} />
                            <span>User Management</span>
                        </NavLink>
                    </>
                )}
            </nav>

            <div className="sidebar-footer">
                <div className="user-profile">
                    <div className={`avatar ${role === 'ADMIN' ? 'admin-avatar' : ''}`}>{currentUser.avatar}</div>
                    <div className="user-info">
                        <div className="user-name">{currentUser.name}</div>
                        <div className="user-role">{role}</div>
                    </div>
                </div>
                <button className="sign-out-btn" onClick={() => navigate('/login')}>
                    <LogOut size={20} />
                    <span>Sign Out</span>
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
