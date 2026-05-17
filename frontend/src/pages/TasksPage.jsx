import React, { useState, useMemo } from 'react';
import { Plus, Users, Search } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useWorkflow } from '../context/WorkflowContext';
import { DragDropContext } from '@hello-pangea/dnd';
import KanbanColumn from '../components/KanbanColumn';
import TaskModal from '../components/TaskModal';
import CustomDropdown from '../components/CustomDropdown';
import ApprovalModal from '../components/ApprovalModal';
import './TasksPage.css';

const WORKFLOW_COLUMNS = ['Backlog', 'To Do', 'In Progress', 'Review', 'Testing', 'QC', 'Completed'];

const assigneeOptions = [
  { label: 'All Assignees', value: 'All' },
  { label: 'Alex Morgan', value: 'Alex Morgan' },
  { label: 'Sam Smith', value: 'Sam Smith' },
  { label: 'Jordan Lee', value: 'Jordan Lee' },
  { label: 'Unassigned', value: '' }
];

const TasksPage = ({ tasks, onAddTask, onTaskClick, onMoveTask }) => {
  const { isPM, currentUser } = useAuth();
  const { requestMove, addToast, logActivity } = useWorkflow();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [assigneeFilter, setAssigneeFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [approvalModalData, setApprovalModalData] = useState(null);

  // Filter tasks based on role, PM assignee filter, and search
  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      // 1. Role-based filtering: Normal users ONLY see their own tasks
      if (!isPM && task.assignee !== currentUser.name) {
        return false;
      }
      
      // 2. PM Assignee Filtering
      if (isPM && assigneeFilter !== 'All' && task.assignee !== assigneeFilter) {
        return false;
      }

      // 3. Search text matching (title, ticket ID, assignee)
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = task.title?.toLowerCase().includes(q);
        const matchesId = task.ticketId?.toLowerCase().includes(q);
        const matchesAssignee = task.assignee?.toLowerCase().includes(q);
        if (!matchesTitle && !matchesId && !matchesAssignee) return false;
      }
      
      return true;
    });
  }, [tasks, isPM, currentUser.name, assigneeFilter, searchQuery]);

  const handleCreateTask = (newTask) => {
    onAddTask(newTask);
    setIsModalOpen(false);
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

  const onDragEnd = (result) => {
    const { destination, source, draggableId } = result;

    // Dropped outside a valid column
    if (!destination) return;

    // Dropped in the same column and same position
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const task = tasks.find(t => String(t.id) === draggableId);
    if (!task) return;

    // Permissions check
    if (!isPM) {
      // User can only move their own tasks
      if (task.assignee !== currentUser.name) {
        addToast("You can only move tasks assigned to you.", "error");
        return;
      }

      // User can only move forward
      const sourceIndex = WORKFLOW_COLUMNS.indexOf(source.droppableId);
      const destIndex = WORKFLOW_COLUMNS.indexOf(destination.droppableId);
      
      if (destIndex <= sourceIndex) {
        setApprovalModalData({
          taskId: task.id,
          ticketId: task.ticketId,
          sourceStatus: source.droppableId,
          destStatus: destination.droppableId,
        });
        return;
      }
    }

    // Pass detailed reordering info back up
    onMoveTask(
      task.id, 
      source.droppableId, 
      destination.droppableId, 
      source.index, 
      destination.index
    );
    
    logActivity(task.id, 'STATUS_CHANGED', `Moved task to ${destination.droppableId}`, currentUser.name);
  };

  return (
    <div className="tasks-page">
      <div className="page-header">
        <div>
          <h1 className="text-h1">Task Board</h1>
          <p className="text-muted">Manage your project tasks</p>
        </div>
        
        <div className="header-actions-group">
          <div className="search-wrapper">
            <Search size={16} className="search-icon" />
            <input 
              type="text" 
              className="search-input" 
              placeholder="Search tasks..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {isPM && (
            <div className="filter-wrapper">
              <CustomDropdown 
                options={assigneeOptions}
                value={assigneeFilter}
                onChange={setAssigneeFilter}
                placeholder="Assignee"
                icon={Users}
              />
            </div>
          )}

          {isPM && (
            <button className="btn-primary new-task-btn" onClick={() => setIsModalOpen(true)}>
              <Plus size={18} />
              <span>New Task</span>
            </button>
          )}
        </div>
      </div>

      <div className="kanban-board-scroll">
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="kanban-board">
            {WORKFLOW_COLUMNS.map((columnStatus) => {
              // Filter the already derived filteredTasks for this specific column
              const columnTasks = filteredTasks.filter(t => t.status === columnStatus);
              return (
                <KanbanColumn 
                  key={columnStatus} 
                  status={columnStatus} 
                  tasks={columnTasks} 
                  onTaskClick={onTaskClick}
                />
              );
            })}
          </div>
        </DragDropContext>
      </div>

      <TaskModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateTask}
      />

      <ApprovalModal 
        isOpen={!!approvalModalData} 
        onClose={() => setApprovalModalData(null)} 
        onConfirm={handleApprovalConfirm} 
        moveDetails={approvalModalData} 
      />
    </div>
  );
};

export default TasksPage;
