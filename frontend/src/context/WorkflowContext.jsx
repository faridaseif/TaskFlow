import React, { createContext, useContext, useState, useCallback } from 'react';

const WorkflowContext = createContext();

export const WorkflowProvider = ({ children }) => {
  const [requests, setRequests] = useState([]);
  const [toasts, setToasts] = useState([]);
  const [taskTimelines, setTaskTimelines] = useState({});

  // --- Toasts ---
  const addToast = useCallback((message, type = 'info') => {
    const id = Date.now() + Math.random().toString(36).substring(2);
    setToasts((prev) => [...prev, { id, message, type }]);
    
    // Auto-remove toast after 4 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter(t => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter(t => t.id !== id));
  }, []);

  // --- Timelines ---
  const logActivity = useCallback((taskId, eventType, description, user) => {
    const newEvent = {
      id: Date.now() + Math.random().toString(36).substring(2),
      eventType,
      description,
      user,
      timestamp: new Date().toISOString()
    };
    setTaskTimelines(prev => ({
      ...prev,
      [taskId]: [newEvent, ...(prev[taskId] || [])] // Prepend so newest is first
    }));
  }, []);

  // --- Approval Requests ---
  const requestMove = useCallback((requestData) => {
    const newRequest = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      ...requestData
    };
    setRequests((prev) => [newRequest, ...prev]);
    
    logActivity(
      requestData.taskId, 
      'APPROVAL_REQUESTED', 
      `Requested to move from ${requestData.sourceStatus} to ${requestData.destStatus}`, 
      requestData.requesterName
    );
  }, [logActivity]);

  const approveRequest = useCallback((requestId, pmName) => {
    const request = requests.find(r => r.id === requestId);
    if (request) {
      logActivity(
        request.taskId, 
        'APPROVAL_GRANTED', 
        `PM approved move to ${request.destStatus}`, 
        pmName
      );
      setRequests((prev) => prev.filter(r => r.id !== requestId));
      return request; // return it so the caller can execute the move
    }
    return null;
  }, [requests, logActivity]);

  const rejectRequest = useCallback((requestId, pmName) => {
    const request = requests.find(r => r.id === requestId);
    if (request) {
      logActivity(
        request.taskId, 
        'APPROVAL_REJECTED', 
        `PM rejected move to ${request.destStatus}`, 
        pmName
      );
      setRequests((prev) => prev.filter(r => r.id !== requestId));
    }
  }, [requests, logActivity]);

  return (
    <WorkflowContext.Provider value={{
      requests,
      requestMove,
      approveRequest,
      rejectRequest,
      toasts,
      addToast,
      removeToast,
      taskTimelines,
      logActivity
    }}>
      {children}
    </WorkflowContext.Provider>
  );
};

export const useWorkflow = () => useContext(WorkflowContext);
