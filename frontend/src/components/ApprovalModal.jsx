import React from 'react';
import { AlertTriangle, Send, X } from 'lucide-react';
import './ApprovalModal.css';

const ApprovalModal = ({ isOpen, onClose, onConfirm, moveDetails }) => {
  if (!isOpen) return null;

  return (
    <div className="approval-modal-overlay animate-fade-in">
      <div className="approval-modal-content animate-slide-up">
        <button className="approval-close-btn" onClick={onClose}>
          <X size={20} />
        </button>
        
        <div className="approval-header">
          <div className="warning-icon-wrapper">
            <AlertTriangle size={28} className="warning-icon" />
          </div>
          <h2 className="approval-title">Manager Approval Required</h2>
        </div>
        
        <div className="approval-body">
          <p className="approval-desc">
            This workflow action requires approval from the Project Manager. 
            A request notification will be sent.
          </p>
          
          {moveDetails && (
            <div className="move-details-box">
              <span className="move-task-id">{moveDetails.ticketId}</span>
              <div className="move-path">
                <span className="move-badge source">{moveDetails.sourceStatus}</span>
                <span className="move-arrow">→</span>
                <span className="move-badge dest">{moveDetails.destStatus}</span>
              </div>
            </div>
          )}
        </div>
        
        <div className="approval-footer">
          <button className="btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn-primary" onClick={onConfirm}>
            <Send size={16} />
            <span>Send Request</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ApprovalModal;
