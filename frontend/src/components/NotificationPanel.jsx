import React, { useRef, useEffect } from 'react';
import { useWorkflow } from '../context/WorkflowContext';
import { useAuth } from '../context/AuthContext';
import { Bell, Check, X, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import './NotificationPanel.css';

const NotificationPanel = ({ isOpen, onClose, updateTaskStatus }) => {
  const { requests, approveRequest, rejectRequest, addToast } = useWorkflow();
  const { currentUser } = useAuth();
  const panelRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (panelRef.current && !panelRef.current.contains(event.target)) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleApprove = async (reqId) => {
    const req = approveRequest(reqId, currentUser.name);
    if (req) {
      if (updateTaskStatus) {
        await updateTaskStatus(req.taskId, req.destStatus);
      }
      addToast("Workflow request approved successfully", "success");
    }
  };

  const handleReject = (reqId) => {
    rejectRequest(reqId, currentUser.name);
    addToast("Workflow request rejected", "error");
  };

  return (
    <div className="notification-panel animate-dropdown" ref={panelRef}>
      <div className="notification-header">
        <h3 className="notification-title">Notifications</h3>
        {requests.length > 0 && (
          <span className="unread-count">{requests.length} New</span>
        )}
      </div>

      <div className="notification-content">
        {requests.length === 0 ? (
          <div className="empty-notifications">
            <Bell size={32} className="empty-icon" />
            <p>You're all caught up!</p>
            <span>No pending approval requests.</span>
          </div>
        ) : (
          <div className="notification-list">
            {requests.map(req => (
              <div key={req.id} className="notification-item">
                <div className="notif-header-row">
                  <span className="notif-ticket">{req.ticketId}</span>
                  <div className="notif-time">
                    <Clock size={10} />
                    <span>{formatDistanceToNow(new Date(req.timestamp), { addSuffix: true })}</span>
                  </div>
                </div>
                
                <p className="notif-desc">
                  <span className="notif-user">{req.requesterName}</span> requested to move to 
                  <span className="notif-status"> {req.destStatus}</span>
                </p>

                <div className="notif-actions">
                  <button className="notif-btn reject" onClick={() => handleReject(req.id)}>
                    <X size={14} />
                    <span>Reject</span>
                  </button>
                  <button className="notif-btn approve" onClick={() => handleApprove(req.id)}>
                    <Check size={14} />
                    <span>Approve</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationPanel;
