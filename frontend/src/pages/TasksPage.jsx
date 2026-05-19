import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Plus, Users, Search } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useWorkflow } from '../context/WorkflowContext';
import useProjects from '../hooks/useProjects';
import { DragDropContext } from '@hello-pangea/dnd';
import KanbanColumn from '../components/KanbanColumn';
import TaskModal from '../components/TaskModal';
import CustomDropdown from '../components/CustomDropdown';
import ApprovalModal from '../components/ApprovalModal';
import './TasksPage.css';

const WORKFLOW_COLUMNS = ['Backlog', 'To Do', 'In Progress', 'Review', 'Testing', 'QC', 'Completed'];



const TasksPage = ({ tasks, onAddTask, onTaskClick, onMoveTask, refreshTasks }) => {
  const { currentUser, role } = useAuth();
  const { projects, addTaskToProject } = useProjects();
  const { requestMove, addToast, logActivity } = useWorkflow();
  const [searchParams] = useSearchParams();
  const projectParam = searchParams.get('project');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [assigneeFilter, setAssigneeFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [approvalModalData, setApprovalModalData] = useState(null);

  useEffect(() => {
    if (refreshTasks) {
      refreshTasks();
    }
  }, []); // Run only on mount to fetch the latest tasks

  // Find the selected project from the URL parameter
  const selectedProject = useMemo(() => {
    if (!projectParam) return null;
    return projects.find(p => p.projectCode === projectParam || String(p.id) === projectParam || p.name === projectParam);
  }, [projects, projectParam]);

  const isGlobalAdmin = role === 'ADMIN';
  
  // Projects where the current user is the manager (PM)
  const pmProjects = useMemo(() => {
    if (isGlobalAdmin) return projects;
    return projects.filter(p => p.manager?.email === currentUser.email || String(p.manager?.id) === String(currentUser.id));
  }, [projects, currentUser, isGlobalAdmin]);

  // Can the current user create a new task in this context?
  const canCreateTask = useMemo(() => {
    if (isGlobalAdmin) return true;
    if (selectedProject) {
      // Under a specific project, only the manager of that project can create tasks
      return selectedProject.manager?.email === currentUser.email || String(selectedProject.manager?.id) === String(currentUser.id);
    }
    // Globally, they must manage at least one project to see the creation option
    return pmProjects.length > 0;
  }, [selectedProject, pmProjects, currentUser, isGlobalAdmin]);

  const isManagerOfAnyProject = pmProjects.length > 0;
  const isPM = isGlobalAdmin || isManagerOfAnyProject;

  const dynamicAssigneeOptions = useMemo(() => {
    const options = [
      { label: 'All Assignees', value: 'All' }
    ];

    const uniqueMembers = new Set();

    projects.forEach(p => {
      if (selectedProject && p.id !== selectedProject.id) {
        return;
      }

      const isManager = String(p.manager?.id) === String(currentUser.id) || p.manager?.email === currentUser.email;
      if (isGlobalAdmin || isManager) {
        if (p.members) {
          p.members.forEach(m => {
            // Exclude the manager, just like in the project details task creation
            if (m.id !== p.manager?.id && !uniqueMembers.has(m.id)) {
              uniqueMembers.add(m.id);
              options.push({ label: m.name, value: m.name });
            }
          });
        }
      }
    });

    options.push({ label: 'Unassigned', value: '' });
    return options;
  }, [projects, currentUser, isGlobalAdmin, selectedProject]);

  // Filter tasks based on role, selected project, PM assignee filter, and search
  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      // 0. Filter by selected project from URL query parameter
      if (selectedProject && task.project !== selectedProject.name) {
        return false;
      }

      const isProjectManagerForTask = projects.some(p => p.name === task.project && (p.manager?.email === currentUser.email || String(p.manager?.id) === String(currentUser.id)));
      const canSeeTask = isGlobalAdmin || isProjectManagerForTask || task.assignee === currentUser.name;

      // 1. Role-based filtering: Normal users ONLY see their own tasks
      if (!canSeeTask) {
        return false;
      }
      
      // 2. PM Assignee Filtering
      const isPMForFilter = isGlobalAdmin || isProjectManagerForTask;
      if (isPMForFilter && assigneeFilter !== 'All' && task.assignee !== assigneeFilter) {
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
  }, [tasks, projects, currentUser, role, assigneeFilter, searchQuery, selectedProject]);

  const handleCreateTask = async (projectId, newTask) => {
    try {
      await addTaskToProject(projectId, newTask);
      if (refreshTasks) refreshTasks();
      setIsModalOpen(false);
    } catch (e) {
      console.error(e);
      addToast("Failed to create task", "error");
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

    const isProjectManagerForTask = projects.some(p => p.name === task.project && (p.manager?.email === currentUser.email || String(p.manager?.id) === String(currentUser.id)));
    const isPMForTask = role === 'ADMIN' || isProjectManagerForTask;

    // Permissions check
    if (!isPMForTask) {
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
          <h1 className="text-h1">{selectedProject ? `${selectedProject.name} Board` : "Task Board"}</h1>
          <p className="text-muted">{selectedProject ? `Manage tasks for ${selectedProject.name}` : "Manage your project tasks"}</p>
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
                options={dynamicAssigneeOptions}
                value={assigneeFilter}
                onChange={setAssigneeFilter}
                placeholder="Assignee"
                icon={Users}
              />
            </div>
          )}
 
          {canCreateTask && (
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
        projects={pmProjects}
        defaultProjectId={selectedProject?.id}
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
