import React from "react";
import { Calendar, Clock, User } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { Draggable } from '@hello-pangea/dnd';
import { getTaskProgress } from '../hooks/useTasks';
import './TaskCard.css';

const TaskCard = ({ task, index, onClick, isDragDisabled }) => {
  const getPriorityBadgeClass = (priority) => {
    if (!priority) return '';
    const p = priority.toUpperCase();
    switch (p) {
      case 'LOW': return 'badge-low';
      case 'MEDIUM': return 'badge-medium';
      case 'HIGH': return 'badge-high';
      default: return '';
    }
  };

  const getInitials = (name) => {
    if (!name) return '?';
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  const progress = getTaskProgress(task.status);
  const isCompleted = progress === 100;

  return (
    <Draggable draggableId={String(task.id)} index={index} isDragDisabled={isDragDisabled}>
      {(provided, snapshot) => (
        <div
          className={`task-card animate-fade-in ${snapshot.isDragging ? 'is-dragging' : ''}`}
          onClick={() => onClick(task)}
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          style={{ ...provided.draggableProps.style }}
        >
          <div className="task-card-header">
            <span className="task-ticket-id">{task.ticketId}</span>
            <span className={`badge ${getPriorityBadgeClass(task.priority)}`}>
              {task.priority ? task.priority.charAt(0).toUpperCase() + task.priority.slice(1).toLowerCase() : ''}
            </span>
          </div>

          <h3 className="task-title">{task.title}</h3>

          <div className="task-dates-row">
            <div className="date-item" title="Created Date">
              <Clock size={12} />
              <span>{task.createdAt ? format(parseISO(task.createdAt), 'MMM d') : 'N/A'}</span>
            </div>
            <div className="date-item" title="Due Date">
              <Calendar size={12} />
              <span>{task.dueDate ? format(parseISO(task.dueDate), 'MMM d') : 'N/A'}</span>
            </div>
          </div>

          <div className="task-progress-container">
            <div className="task-progress-header">
              <span>Progress</span>
              <span>{progress}%</span>
            </div>
            <div className="task-progress-bar-bg">
              <div
                className={`task-progress-bar-fill ${isCompleted ? 'completed' : ''}`}
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>

          <div className="task-footer">
            <div className="assignee-pill" title={task.assignee || 'Unassigned'}>
              <div className="assignee-icon">
                {task.assignee ? getInitials(task.assignee) : <User size={12} />}
              </div>
              <span className="assignee-name">{task.assignee || 'Unassigned'}</span>
            </div>
          </div>
        </div>
      )}
    </Draggable>
  );
};

export default TaskCard;