import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useProjects from '../hooks/useProjects';
import { useAuth } from '../context/AuthContext';
import { Globe, Lock, Folder, Layout, Database, Code, Users, Rocket, Target, Zap, Shield, Check, Search } from 'lucide-react';
import CustomDatePicker from '../components/CustomDatePicker';
import './CreateProjectPage.css';


const ICON_OPTIONS = [
    { id: 'folder', icon: <Folder size={24} />, char: '📁' },
    { id: 'table', icon: <Layout size={24} />, char: '📋' },
    { id: 'database', icon: <Database size={24} />, char: '🗄️' },
    { id: 'code', icon: <Code size={24} />, char: '</>' },
    { id: 'users', icon: <Users size={24} />, char: '👥' },
    { id: 'rocket', icon: <Rocket size={24} />, char: '🚀' },
    { id: 'target', icon: <Target size={24} />, char: '🎯' },
    { id: 'lightning', icon: <Zap size={24} />, char: '⚡' },
    { id: 'shield', icon: <Shield size={24} />, char: '🛡️' },
];

const CreateProjectPage = () => {
    const navigate = useNavigate();
    const { addProject } = useProjects();
    const { currentUser } = useAuth();

    const [formData, setFormData] = useState({
        name: '',
        projectCode: '',
        description: '',
        icon: 'folder',
        startDate: '',
        endDate: '',
        visibility: 'public',
        priority: 'MEDIUM',
        status: 'ACTIVE'
    });

    const [users, setUsers] = useState([]);
    const [selectedMembers, setSelectedMembers] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');

    const filteredUsers = users.filter(user => {
        const name = user.name || '';
        const email = user.email || '';
        return name.toLowerCase().includes(searchQuery.toLowerCase()) || 
               email.toLowerCase().includes(searchQuery.toLowerCase());
    });

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await fetch('http://localhost:8080/api/users');
                if (res.ok) {
                    const data = await res.json();
                    if (Array.isArray(data)) {
                        // Fetch users with role 'USER' only and exclude the current user (project manager) by ID and Email
                        setUsers(data.filter(u => u.id !== currentUser?.id && u.email !== currentUser?.email && u.role === 'USER'));
                    }
                }
            } catch (err) {
                console.error('Error fetching users:', err);
            }
        };
        if (currentUser) {
            fetchUsers();
        }
    }, [currentUser]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const payload = {
            ...formData,
            manager: currentUser ? { id: currentUser.id, email: currentUser.email } : null,
            members: selectedMembers.map(id => ({ id }))
        };
        await addProject(payload);
        navigate('/home');
    };

    const handleIconSelect = (iconId) => {
        setFormData(prev => ({ ...prev, icon: iconId }));
    };

    return (
        <div className="create-project-page">
            <div className="create-project-header">
                <h1>Create a new project</h1>
            </div>

            <form onSubmit={handleSubmit}>
                {/* Section 1: Basics */}
                <div className="form-section">
                    <div className="section-info">
                        <h3>Project Basics</h3>
                        <p>A clear name and code help your team identify and reference the project easily.</p>
                    </div>
                    <div className="form-group">
                        <div className="input-field">
                            <label>Project Name <span>*</span></label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                required
                            />
                        </div>
                        <div className="input-field">
                            <label>Project Code / Slug</label>
                            <input
                                type="text"
                                value={formData.projectCode}
                                onChange={(e) => setFormData(prev => ({ ...prev, projectCode: e.target.value }))}
                            />
                        </div>
                    </div>
                </div>

                {/* Section 2: Icon */}
                <div className="form-section">
                    <div className="section-info">
                        <h3>Project Icon</h3>
                        <p>Choose a unique icon for your project.</p>
                    </div>
                    <div className="icon-grid">
                        {ICON_OPTIONS.map(opt => (
                            <div
                                key={opt.id}
                                className={`icon-option ${formData.icon === opt.id ? 'selected' : ''}`}
                                onClick={() => handleIconSelect(opt.id)}
                            >
                                {opt.icon}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Section 3: Description */}
                <div className="form-section">
                    <div className="section-info">
                        <h3>Description</h3>
                        <p>Explain the key objectives and scope of this project.</p>
                    </div>
                    <div className="input-field">
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                        />
                    </div>
                </div>



                {/* Section 4: Timeline */}
                <div className="form-section">
                    <div className="section-info">
                        <h3>Timeline</h3>
                        <p>Define the lifecycle of this project. These dates will populate your Gantt chart.</p>
                    </div>
                    <div className="timeline-grid">
                        <div className="input-field">
                            <label>Start Date</label>
                            <CustomDatePicker
                                value={formData.startDate}
                                onChange={(val) => setFormData(prev => ({ ...prev, startDate: val }))}
                                placeholder="Select start date"
                            />
                        </div>
                        <div className="input-field">
                            <label>Target End Date</label>
                            <CustomDatePicker
                                value={formData.endDate}
                                onChange={(val) => setFormData(prev => ({ ...prev, endDate: val }))}
                                placeholder="Select end date"
                            />
                        </div>
                    </div>
                </div>


                {/* Section: Assign Members */}
                <div className="form-section">
                    <div className="section-info">
                        <h3>Assign Members</h3>
                        <p>Select workspace members to assign to this project. They will be notified automatically.</p>
                    </div>
                    <div className="members-select-container">
                        <div className="member-search-box" style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            background: 'var(--bg-card)', 
                            border: '1px solid var(--border)', 
                            borderRadius: '8px', 
                            padding: '8px 12px',
                            marginBottom: '10px',
                            width: '100%'
                        }}>
                            <Search size={18} style={{ color: 'var(--text-muted)', marginRight: '8px' }} />
                            <input 
                                type="text" 
                                placeholder="Search members by name or email..." 
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                style={{
                                    background: 'transparent',
                                    border: 'none',
                                    color: 'var(--text-main)',
                                    width: '100%',
                                    outline: 'none',
                                    fontSize: '0.9rem'
                                }}
                            />
                        </div>
                        <div className="members-grid">
                            {filteredUsers.map(user => {
                                const isSelected = selectedMembers.includes(user.id);
                                const initials = user.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase() : 'U';
                                return (
                                    <div 
                                        key={user.id} 
                                        className={`member-select-card ${isSelected ? 'selected' : ''}`}
                                        onClick={() => {
                                            if (isSelected) {
                                                setSelectedMembers(selectedMembers.filter(id => id !== user.id));
                                            } else {
                                                setSelectedMembers([...selectedMembers, user.id]);
                                            }
                                        }}
                                    >
                                        <div className="member-avatar">{initials}</div>
                                        <div className="member-details">
                                            <span className="member-name">{user.name}</span>
                                            <span className="member-email">{user.email}</span>
                                        </div>
                                        <div className="member-checkbox">
                                            {isSelected && <Check size={12} />}
                                        </div>
                                    </div>
                                );
                            })}
                            {filteredUsers.length === 0 && (
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontStyle: 'italic' }}>
                                    {users.length === 0 ? "No other members available in the workspace." : "No members found matching your search."}
                                </p>
                            )}
                        </div>
                    </div>
                </div>


                {/* Section 5: Visibility */}
                <div className="form-section">
                    <div className="section-info">
                        <h3>Visibility</h3>
                        <p>Control who can see and participate in this project.</p>
                    </div>
                    <div className="visibility-options">
                        <div
                            className={`visibility-option ${formData.visibility === 'public' ? 'selected' : ''}`}
                            onClick={() => setFormData(prev => ({ ...prev, visibility: 'public' }))}
                        >
                            <div className="visibility-radio"></div>
                            <div className="visibility-info">
                                <div className="visibility-title"><Globe size={16} /> Public</div>
                                <div className="visibility-desc">Searchable by all company members. Use this for open initiatives.</div>
                            </div>
                        </div>
                        <div
                            className={`visibility-option ${formData.visibility === 'private' ? 'selected' : ''}`}
                            onClick={() => setFormData(prev => ({ ...prev, visibility: 'private' }))}
                        >
                            <div className="visibility-radio"></div>
                            <div className="visibility-info">
                                <div className="visibility-title"><Lock size={16} /> Private</div>
                                <div className="visibility-desc">Only you and invited collaborators can view or access this project.</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="form-actions">
                    <button type="button" className="cancel-btn" onClick={() => navigate('/home')}>Cancel</button>
                    <button type="submit" className="submit-btn">Create Project</button>
                </div>
            </form>
        </div>
    );
};

export default CreateProjectPage;
