import React, { useState } from 'react';
import { Plus } from 'lucide-react';

const TaskForm = ({ onAdd, members = [] }) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        status: 'To Do',
        priority: 'Medium',
        assignee: '',
        dueDate: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.title.trim()) return;

        onAdd({
            title: formData.title,
            description: formData.description,
            status: formData.status,
            priority: formData.priority,
            assignee: formData.assignee || null,
            dueDate: formData.dueDate || null
        });

        setFormData({
            title: '',
            description: '',
            status: 'To Do',
            priority: 'Medium',
            assignee: '',
            dueDate: ''
        });
    };

    return (
        <form onSubmit={handleSubmit} className="task-creation-grid-form">
            <div className="form-left-col">
                <div className="task-form-group">
                    <label className="task-form-label">Task Title <span className="required-star">*</span></label>
                    <input 
                        type="text" 
                        name="title"
                        value={formData.title} 
                        onChange={handleChange} 
                        placeholder="e.g., Implement backend authentication..." 
                        className="task-input-field"
                        required
                    />
                </div>
                <div className="task-form-group">
                    <label className="task-form-label">Description</label>
                    <textarea 
                        name="description"
                        value={formData.description} 
                        onChange={handleChange} 
                        placeholder="Provide details about the task, requirements, etc..." 
                        className="task-textarea-field"
                    />
                </div>
            </div>
            <div className="form-right-col">
                <div className="task-form-row">
                    <div className="task-form-group half">
                        <label className="task-form-label">Status</label>
                        <select 
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                            className="task-select-field"
                        >
                            <option value="Backlog">Backlog</option>
                            <option value="To Do">To Do</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Review">Review</option>
                            <option value="Testing">Testing</option>
                            <option value="QC">QC</option>
                            <option value="Completed">Completed</option>
                        </select>
                    </div>
                    <div className="task-form-group half">
                        <label className="task-form-label">Priority</label>
                        <select 
                            name="priority"
                            value={formData.priority}
                            onChange={handleChange}
                            className="task-select-field"
                        >
                            <option value="Low">Low</option>
                            <option value="Medium">Medium</option>
                            <option value="High">High</option>
                        </select>
                    </div>
                </div>
                <div className="task-form-row">
                    <div className="task-form-group half">
                        <label className="task-form-label">Assignee</label>
                        <select 
                            name="assignee"
                            value={formData.assignee}
                            onChange={handleChange}
                            className="task-select-field"
                        >
                            <option value="">Unassigned</option>
                            {members.map(member => (
                                <option key={member.id} value={member.name}>
                                    {member.name} ({member.roleLabel || 'Member'})
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="task-form-group half">
                        <label className="task-form-label">Due Date</label>
                        <input 
                            type="date" 
                            name="dueDate"
                            value={formData.dueDate}
                            onChange={handleChange}
                            className="task-date-field"
                        />
                    </div>
                </div>
                <button type="submit" className="btn-primary add-task-submit-btn-full">
                    <Plus size={16} />
                    <span>Create Task</span>
                </button>
            </div>
        </form>
    );
};

export default TaskForm;
