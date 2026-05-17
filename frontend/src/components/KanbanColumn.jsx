import React from 'react';
import { Droppable } from '@hello-pangea/dnd';
import TaskCard from './TaskCard';
import './KanbanColumn.css';

const KanbanColumn = ({ status, tasks, onTaskClick, isDropDisabled }) => {
  return (
    <div className="kanban-column-container">
      <div className="kanban-column-header">
        <h3 className="kanban-column-title">
          {status} <span className="task-count">{tasks.length}</span>
        </h3>
      </div>
      <Droppable
        droppableId={status}
        renderClone={(provided, snapshot, rubric) => {
          const task = tasks[rubric.source.index];

          return (
            <div
              ref={provided.innerRef}
              {...provided.draggableProps}
              {...provided.dragHandleProps}
              style={provided.draggableProps.style}
            >
              <TaskCard
                task={task}
                index={rubric.source.index}
                onClick={onTaskClick}
                isDragDisabled={false}
              />
            </div>
          );
        }}
      >
        {(provided, snapshot) => (
          <div
            className={`kanban-column-content ${snapshot.isDraggingOver ? 'is-dragging-over' : ''}`}
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            {tasks.map((task, index) => (
              <TaskCard
                key={task.id}
                task={task}
                index={index}
                onClick={onTaskClick}
                isDragDisabled={false}
              />
            ))}
            
            {tasks.length === 0 && !snapshot.isDraggingOver && (
              <div className="empty-column-placeholder">
                Drop tasks here
              </div>
            )}
            
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
};

export default KanbanColumn;
