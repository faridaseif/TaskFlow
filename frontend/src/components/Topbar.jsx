import React, { useState } from 'react';
import { Search, Bell } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useWorkflow } from '../context/WorkflowContext';
import NotificationPanel from './NotificationPanel';
import './Topbar.css';

const Topbar = ({ updateTaskStatus }) => {
  const { isPM } = useAuth();
  const { requests } = useWorkflow();
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <div className="topbar">
      <div className="topbar-search-container">
        <Search className="topbar-search-icon" size={20} />
        <input 
          type="text" 
          placeholder="Search tasks, projects, people..." 
          className="topbar-search-input"
        />
      </div>
      <div className="topbar-actions">
        {isPM && (
          <div style={{ position: 'relative' }}>
            <button 
              className="notification-btn" 
              onClick={() => setShowNotifications(!showNotifications)}
            >
              <Bell size={20} />
              {requests.length > 0 && (
                <span className="notification-badge animate-pulse"></span>
              )}
            </button>
            <NotificationPanel 
              isOpen={showNotifications} 
              onClose={() => setShowNotifications(false)} 
              updateTaskStatus={updateTaskStatus}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Topbar;
