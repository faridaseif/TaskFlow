import React from 'react';
import { Calendar, User, Clock } from 'lucide-react';

const TaskList = ({ tasks }) => {
    if (!tasks || tasks.length === 0) {
        return (
            <div className="empty-tasks-state">
                <p>No tasks created for this project yet.</p>
            </div>
        );
    }

    const getStatusClass = (status) => {
        const lower = status?.toLowerCase() || '';
        if (lower === 'completed') return 'status-completed';
        if (lower === 'in progress') return 'status-progress';
        if (lower === 'to do') return 'status-todo';
        return 'status-other';
    };

    return (
        <div className="project-tasks-list">
            <h3 className="section-title">Tasks ({tasks.length})</h3>
            <div className="tasks-container">
                {tasks.map((task, idx) => (
                    <div key={task.id || idx} className="project-task-item animate-fade-in">
                        <div className="task-item-left">
                            <div className={`status-dot ${getStatusClass(task.status)}`} />
                            <div className="task-item-details">
                                <span className="task-item-title">{task.title}</span>
                                <div className="task-item-meta">
                                    <span className="task-item-id">{task.ticketId || `TSK-${101 + idx}`}</span>
                                    {task.assignee && (
                                        <span className="task-item-assignee">
                                            <User size={12} className="meta-icon" />
                                            <span>{task.assignee}</span>
                                        </span>
                                    )}
                                    {task.dueDate && (
                                        <span className="task-item-due">
                                            <Calendar size={12} className="meta-icon" />
                                            <span>{new Date(task.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="task-item-right">
                            {task.priority && (
                                <span className={`priority-badge priority-${task.priority.toLowerCase()}`}>
                                    {task.priority}
                                </span>
                            )}
                            <span className={`task-status-badge ${getStatusClass(task.status)}`}>
                                {task.status || 'To Do'}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TaskList;
