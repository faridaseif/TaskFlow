import React, { useCallback, useMemo, useState, useEffect } from 'react';
import KpiCards from '../components/progress/Cards.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import "./ProgressPage.css";

function getProgressStatus(kanbanStatus) {
  const lower = kanbanStatus?.toLowerCase() || '';
  if (lower === 'backlog') return 'Pending';
  if (lower === 'completed') return 'Completed';
  return 'In Progress';
}

function getKanbanStatus(progressStatus) {
  if (progressStatus === 'Completed') return 'Completed';
  if (progressStatus === 'Pending') return 'Backlog';
  return 'In Progress';
}

function computeKpis(tasks) {
  const total = tasks.length;
  const pending = tasks.filter(t => getProgressStatus(t.status) === 'Pending').length;
  const inProgress = tasks.filter(t => getProgressStatus(t.status) === 'In Progress').length;
  const completed = tasks.filter(t => getProgressStatus(t.status) === 'Completed').length;

  return {
    total,
    pending,
    inProgress,
    completed,
    percent: total ? Math.round((completed / total) * 100) : 0,
  };
}

export default function Progresspage({ tasks = [], projects = [], updateTaskStatus, refreshTasks }) {
  const { currentUser, role } = useAuth();
  
  // Check if the current user is a PM/creator of at least one project (or a global admin)
  const isPM = useMemo(() => {
    return role === 'ADMIN' || projects.some(p => p.manager?.email === currentUser?.email || String(p.manager?.id) === String(currentUser?.id));
  }, [projects, currentUser, role]);

  const [viewMode, setViewMode] = useState('user');

  // Auto-initialize viewMode on project list load
  useEffect(() => {
    if (isPM) {
      setViewMode('pm');
    } else {
      setViewMode('user');
    }
  }, [isPM]);

  useEffect(() => {
    if (refreshTasks) {
      refreshTasks();
    }
  }, []); // Fetch fresh data on mount

  const displayTasks = useMemo(() => {
    if (viewMode === 'pm') {
      // PM perspective: See all tasks for all members belonging to their managed projects
      return tasks.filter(task => {
        const projectObj = projects.find(p => p.name === task.project);
        if (!projectObj) return false;

        const isManagerOfThisProject = role === 'ADMIN' || 
          (projectObj.manager?.email === currentUser?.email || String(projectObj.manager?.id) === String(currentUser?.id));

        return isManagerOfThisProject;
      });
    } else {
      // My Tasks Perspective: see strictly assigned tasks
      return tasks.filter(task => {
        return task.assignee === currentUser?.name;
      });
    }
  }, [tasks, projects, currentUser, role, viewMode]);

  const kpis = useMemo(() => computeKpis(displayTasks), [displayTasks]);

  const handleTaskStatusChange = useCallback(
    async (task, newStatus) => {
      const kanbanStatus = getKanbanStatus(newStatus);
      if (task.status === kanbanStatus) return;
      if (updateTaskStatus) {
        await updateTaskStatus(task.id, kanbanStatus);
        if (refreshTasks) {
          refreshTasks();
        }
      }
    },
    [updateTaskStatus, refreshTasks]
  );

  return (
    <div className="ft-page">

      <div className="ft-page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 className="ft-h1">Progress Page</h1>
          <p style={{ color: 'var(--ft-text-muted)', fontSize: '0.875rem', marginTop: '4px' }}>
            {viewMode === 'pm' ? "Viewing team status for your managed projects" : "Viewing your personal roadmap progress"}
          </p>
        </div>

        {isPM && (
          <div className="view-selector-pill">
            <button 
              className={`view-selector-btn ${viewMode === 'pm' ? 'active' : ''}`}
              onClick={() => setViewMode('pm')}
            >
              Manager View
            </button>
            <button 
              className={`view-selector-btn ${viewMode === 'user' ? 'active' : ''}`}
              onClick={() => setViewMode('user')}
            >
              My Tasks
            </button>
          </div>
        )}
      </div>

      <KpiCards stats={kpis} />

      <div className="ft-card ft-panel">
        <div className="ft-taskHead">
          <div>ASSIGNEE</div>
          <div>PROJECT NAME</div>
          <div>TASK NAME</div>
          <div>PROGRESS STATUS</div>
        </div>
        <div className="ft-taskRowsWrap">

          {displayTasks.length === 0 ? (
            <div style={{ padding: '32px', textAlign: 'center', color: 'var(--ft-text-muted)', fontSize: '0.95rem' }}>
              No tasks found in this perspective.
            </div>
          ) : (
            displayTasks.map((t) => (
              <div
                key={t.id}
                className="ft-taskRow"
              >
                <div className="ft-taskUser">{t.assignee || 'Unassigned'}</div>
                <div className="ft-taskProject">{t.project}</div>
                <div className="ft-taskTitle">
                  <span style={{ color: '#3b82f6', fontWeight: '800', marginRight: '6px' }}>
                    {t.ticketId}:
                  </span> 
                  {t.title}
                </div>

                <div className="ft-statusWrap">
                  <select
                    className="ft-statusSelect"
                    value={getProgressStatus(t.status)}
                    onChange={(e) =>
                      handleTaskStatusChange(t, e.target.value)
                    }
                  >
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>

              </div>
            ))
          )}

        </div>
      </div>

    </div>
  );
}