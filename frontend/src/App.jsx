import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { WorkflowProvider } from './context/WorkflowContext';
import { useTasks } from './hooks/useTasks';
import Login from './components/auth/Login';
import Home from './components/Home';
import Profile from './components/Profile';
import UserManagement from './components/admin/Users';
import TasksPage from './pages/TasksPage';
import DashboardLayout from './components/DashboardLayout';
import Topbar from './components/Topbar';
import TaskDetailsPage from './components/TaskDetailsPage';
import ToastContainer from './components/ToastContainer';
import './App.css';
import './index.css';

const AppContent = () => {
  const { tasks, addTask, moveTask, updateTaskStatus, updateTask } = useTasks();
  const [selectedTask, setSelectedTask] = useState(null);

  const handleTaskClick = (task) => {
    setSelectedTask(task);
  };

  const handleCloseDetails = () => {
    setSelectedTask(null);
  };

  const handleUpdateStatus = (taskId, newStatus) => {
    updateTaskStatus(taskId, newStatus);
    if (selectedTask && selectedTask.id === taskId) {
      setSelectedTask(prev => ({ ...prev, status: newStatus }));
    }
  };

  const handleUpdateTask = (updatedTask) => {
    updateTask(updatedTask);
    setSelectedTask(updatedTask);
  };

  return (
    <div className="app">
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        
        {/* Protected Dashboard Routes */}
        <Route path="/home" element={
          <DashboardLayout>
            <Home />
          </DashboardLayout>
        } />
        
        <Route path="/projects" element={
          <DashboardLayout>
            <div className="p-4">Projects Content (Coming Soon)</div>
          </DashboardLayout>
        } />
        
        <Route path="/tasks" element={
          <DashboardLayout Topbar={<Topbar updateTaskStatus={handleUpdateStatus} />}>
            <TasksPage 
              tasks={tasks} 
              onAddTask={addTask} 
              onTaskClick={handleTaskClick} 
              onMoveTask={moveTask}
            />
          </DashboardLayout>
        } />
        
        <Route path="/progress" element={
          <DashboardLayout>
            <div className="p-4">Progress Content (Coming Soon)</div>
          </DashboardLayout>
        } />
        
        <Route path="/profile" element={
          <DashboardLayout>
            <Profile tasks={tasks} />
          </DashboardLayout>
        } />
        
        <Route path="/admin" element={<Navigate to="/admin/users" replace />} />
        <Route path="/admin/users" element={
          <DashboardLayout>
            <UserManagement />
          </DashboardLayout>
        } />
      </Routes>

      {selectedTask && (
        <TaskDetailsPage 
          task={selectedTask} 
          onClose={handleCloseDetails}
          onUpdateStatus={handleUpdateStatus}
          onUpdateTask={handleUpdateTask}
        />
      )}
      <ToastContainer />
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <WorkflowProvider>
        <Router>
          <AppContent />
        </Router>
      </WorkflowProvider>
    </AuthProvider>
  );
}

export default App;
