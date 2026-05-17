import React, { useState, useEffect } from 'react';
import { X, Calendar, User, Flag, FolderKanban, Clock, Pencil, Save } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { useAuth } from '../context/AuthContext';
import { useWorkflow } from '../context/WorkflowContext';
import { getTaskProgress } from '../hooks/useTasks';
import CustomDropdown from './CustomDropdown';
import ApprovalModal from './ApprovalModal';
import ActivityTimeline from './ActivityTimeline';
import './TaskDetailsPage.css';

const WORKFLOW_COLUMNS = ['Backlog', 'To Do', 'In Progress', 'Review', 'Testing', 'QC', 'Completed'];

const TaskDetailsPage = ({ task, onClose, onUpdateStatus, onUpdateTask }) => {
  const { isPM, currentUser } = useAuth();
  const { requestMove, addToast, logActivity } = useWorkflow();
  
  // Local state for editing (if PM)
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ ...task });
  const [approvalModalData, setApprovalModalData] = useState(null);

  useEffect(() => {
    setFormData({ ...task });
  }, [task]);

  if (!task) return null;

  const handleStatusChange = (e) => {
    const newStatus = e.target.value;
    if (isPM) {
      setFormData(prev => ({ ...prev, status: newStatus }));
      onUpdateStatus(task.id, newStatus);
      logActivity(task.id, 'STATUS_CHANGED', `Changed status to ${newStatus}`, currentUser.name);
    } else {
      // Normal user instantly updates status, but enforce forward only
      const oldIndex = WORKFLOW_COLUMNS.indexOf(task.status);
      const newIndex = WORKFLOW_COLUMNS.indexOf(newStatus);
      if (newIndex <= oldIndex) {
        setApprovalModalData({
          taskId: task.id,
          ticketId: task.ticketId,
          sourceStatus: task.status,
          destStatus: newStatus
        });
        return;
      }
      onUpdateStatus(task.id, newStatus);
      setFormData(prev => ({ ...prev, status: newStatus }));
      logActivity(task.id, 'STATUS_CHANGED', `Changed status to ${newStatus}`, currentUser.name);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    onUpdateTask(formData);
    setIsEditing(false);
    
    if (formData.assignee !== task.assignee) {
      logActivity(task.id, 'STATUS_CHANGED', `Reassigned to ${formData.assignee || 'Unassigned'}`, currentUser.name);
    }
  };

  const handleApprovalConfirm = () => {
    requestMove({
      taskId: approvalModalData.taskId,
      ticketId: approvalModalData.ticketId,
      requesterName: currentUser.name,
      sourceStatus: approvalModalData.sourceStatus,
      destStatus: approvalModalData.destStatus
    });
    addToast("Approval request sent to Project Manager", "info");
    setApprovalModalData(null);
  };

  return (
    <div className="task-details-overlay animate-fade-in">
      <div className="task-details-panel">
        <div className="panel-header">
          <div className="header-actions">
            <button className="close-btn" onClick={onClose} title="Close">
              <X size={24} />
            </button>
            {isPM && !isEditing && (
              <button className="btn-edit-task" onClick={() => setIsEditing(true)}>
                <Pencil size={16} />
                <span>Edit Task</span>
              </button>
            )}
            {isPM && isEditing && (
              <button className="btn-save-task" onClick={handleSave}>
                <Save size={16} />
                <span>Save Changes</span>
              </button>
            )}
          </div>
          <div className="status-selector">
            <label className="text-small text-muted">Status:</label>
            <CustomDropdown 
              options={WORKFLOW_COLUMNS.map(s => ({ label: s, value: s }))}
              value={formData.status}
              onChange={(val) => handleStatusChange({ target: { value: val } })}
              disabled={!isPM && task.assignee !== currentUser?.name} 
            />
          </div>
        </div>

        <div className="panel-content">
          <div className="task-header-meta">
            <span className="task-ticket-id-large">{task.ticketId}</span>
          </div>
          {isEditing ? (
            <div className="edit-form">
              <input 
                type="text" 
                name="title"
                className="form-input text-h1 edit-title" 
                value={formData.title}
                onChange={handleInputChange}
              />
              <textarea 
                name="description"
                className="form-textarea edit-desc" 
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
              />
            </div>
          ) : (
            <>
              <h1 className="text-h1 task-title-large">{task.title}</h1>
              <p className="task-description-large">{task.description || 'No description provided.'}</p>
            </>
          )}

          <div className="task-metadata-grid">
            {/* Progress Bar Container spanning full width */}
            <div className="metadata-item full-width">
              <div className="task-progress-container-large">
                <div className="task-progress-header-large">
                  <span className="metadata-label">Progress</span>
                  <span className="progress-value">{getTaskProgress(task.status)}%</span>
                </div>
                <div className="task-progress-bar-bg-large">
                  <div 
                    className={`task-progress-bar-fill-large ${getTaskProgress(task.status) === 100 ? 'completed' : ''}`} 
                    style={{ width: `${getTaskProgress(task.status)}%` }}
                  ></div>
                </div>
              </div>
            </div>

            <div className="metadata-item">
              <div className="metadata-icon"><User size={18} /></div>
              <div className="metadata-content">
                <span className="metadata-label">Assignee</span>
                {isEditing ? (
                  <CustomDropdown 
                    options={[
                      { label: 'Alex Morgan', value: 'Alex Morgan' },
                      { label: 'Sam Smith', value: 'Sam Smith' },
                      { label: 'Jordan Lee', value: 'Jordan Lee' }
                    ]}
                    value={formData.assignee || ''}
                    onChange={(val) => handleInputChange({ target: { name: 'assignee', value: val } })}
                    placeholder="Select Assignee"
                  />
                ) : (
                  <span className="metadata-value">{task.assignee || 'Unassigned'}</span>
                )}
              </div>
            </div>

            <div className="metadata-item">
              <div className="metadata-icon"><FolderKanban size={18} /></div>
              <div className="metadata-content">
                <span className="metadata-label">Project</span>
                {isEditing ? (
                  <CustomDropdown 
                    options={[
                      { label: 'Frontend', value: 'Frontend' },
                      { label: 'Backend', value: 'Backend' },
                      { label: 'QA', value: 'QA' }
                    ]}
                    value={formData.project || ''}
                    onChange={(val) => handleInputChange({ target: { name: 'project', value: val } })}
                    placeholder="Select Project"
                  />
                ) : (
                  <span className="metadata-value">{task.project || 'Unassigned'}</span>
                )}
              </div>
            </div>

            <div className="metadata-item">
              <div className="metadata-icon"><Clock size={18} /></div>
              <div className="metadata-content">
                <span className="metadata-label">Created At</span>
                <span className="metadata-value">{task.createdAt ? format(parseISO(task.createdAt), 'MMMM d, yyyy') : 'No creation date'}</span>
              </div>
            </div>

            <div className="metadata-item">
              <div className="metadata-icon"><Calendar size={18} /></div>
              <div className="metadata-content">
                <span className="metadata-label">Due Date</span>
                {isEditing ? (
                  <input type="date" name="dueDate" className="form-input" value={formData.dueDate} onChange={handleInputChange} />
                ) : (
                  <span className="metadata-value">{task.dueDate ? format(parseISO(task.dueDate), 'MMMM d, yyyy') : 'No due date'}</span>
                )}
              </div>
            </div>

            <div className="metadata-item">
              <div className="metadata-icon"><Flag size={18} /></div>
              <div className="metadata-content">
                <span className="metadata-label">Priority</span>
                {isEditing ? (
                  <CustomDropdown 
                    options={[
                      { label: 'Low', value: 'LOW' },
                      { label: 'Medium', value: 'MEDIUM' },
                      { label: 'High', value: 'HIGH' }
                    ]}
                    value={formData.priority ? formData.priority.toUpperCase() : ''}
                    onChange={(val) => handleInputChange({ target: { name: 'priority', value: val } })}
                    placeholder="Select Priority"
                  />
                ) : (
                  <span className={`badge badge-${task.priority.toLowerCase()}`}>{task.priority}</span>
                )}
              </div>
            </div>
          </div>

          <ActivityTimeline taskId={task.id} />
        </div>
      </div>

      <ApprovalModal 
        isOpen={!!approvalModalData} 
        onClose={() => setApprovalModalData(null)} 
        onConfirm={handleApprovalConfirm} 
        moveDetails={approvalModalData} 
      />
    </div>
  );
};

export default TaskDetailsPage;
