import React, { useState } from 'react';
import { X, Calendar, Flag, Activity, Users, FolderKanban } from 'lucide-react';
import CustomDropdown from './CustomDropdown';
import './TaskModal.css';

const WORKFLOW_COLUMNS = ['Backlog', 'To Do', 'In Progress', 'Review', 'Testing', 'QC', 'Completed'];
const statusOptions = WORKFLOW_COLUMNS.map(col => ({ label: col, value: col }));

const projectOptions = [
  { label: 'Frontend', value: 'Frontend' },
  { label: 'Backend', value: 'Backend' },
  { label: 'QA', value: 'QA' }
];

const priorityOptions = [
  { label: 'Low', value: 'Low' },
  { label: 'Medium', value: 'Medium' },
  { label: 'High', value: 'High' }
];

const assigneeOptions = [
  { label: 'Alex Morgan', value: 'Alex Morgan' },
  { label: 'Sam Smith', value: 'Sam Smith' },
  { label: 'Jordan Lee', value: 'Jordan Lee' },
  { label: 'Unassigned', value: '' }
];

const TaskModal = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'Low',
    dueDate: '',
    assignee: '',
    project: '',
    status: 'Backlog'
  });

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDropdownChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ ...formData });
    setFormData({ title: '', description: '', priority: 'Low', dueDate: '', assignee: '', project: '', status: 'Backlog' });
  };

  return (
    <div className="modal-overlay animate-fade-in">
      <div className="modal-content animate-slide-up">
        <div className="modal-header">
          <h2 className="text-h2">Create New Task</h2>
          <button className="close-btn" onClick={onClose} type="button">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-body">
          <div className="form-group">
            <label className="form-label">Ticket ID</label>
            <input 
              type="text" 
              className="form-input modal-input" 
              value="Auto-generated on creation"
              disabled
            />
          </div>

          <div className="form-group">
            <label className="form-label">Task Title</label>
            <input 
              type="text" 
              name="title"
              className="form-input modal-input" 
              placeholder="e.g., Update Landing Page"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea 
              name="description"
              className="form-textarea modal-textarea" 
              placeholder="Add more details about this task..."
              value={formData.description}
              onChange={handleChange}
            ></textarea>
          </div>

          <div className="form-row">
            <div className="form-group half">
              <label className="form-label">Project</label>
              <CustomDropdown 
                options={projectOptions}
                value={formData.project}
                onChange={(val) => handleDropdownChange('project', val)}
                placeholder="Select Project"
                icon={FolderKanban}
              />
            </div>
            <div className="form-group half">
              <label className="form-label">Status</label>
              <CustomDropdown 
                options={statusOptions}
                value={formData.status}
                onChange={(val) => handleDropdownChange('status', val)}
                placeholder="Select Status"
                icon={Activity}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group half">
              <label className="form-label">Priority</label>
              <CustomDropdown 
                options={priorityOptions}
                value={formData.priority}
                onChange={(val) => handleDropdownChange('priority', val)}
                placeholder="Select Priority"
                icon={Flag}
              />
            </div>
            <div className="form-group half">
              <label className="form-label">Assign To</label>
              <CustomDropdown 
                options={assigneeOptions}
                value={formData.assignee}
                onChange={(val) => handleDropdownChange('assignee', val)}
                placeholder="Select Assignee"
                icon={Users}
              />
            </div>
          </div>
          
          <div className="form-group">
            <label className="form-label">Deadline</label>
            <div className="date-input-wrapper">
              <Calendar size={16} className="date-icon" />
              <input 
                type="date" 
                name="dueDate"
                className="form-input modal-input with-icon"
                value={formData.dueDate}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-secondary modal-btn-cancel" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-primary modal-btn-submit">Create Task</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskModal;
