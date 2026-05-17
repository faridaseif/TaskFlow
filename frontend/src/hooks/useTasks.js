import { useState, useEffect } from 'react';

// Helper to calculate progress based on status
export const getTaskProgress = (status) => {
  switch (status) {
    case 'Backlog': return 0;
    case 'To Do': return 10;
    case 'In Progress': return 40;
    case 'Review': return 60;
    case 'Testing': return 80;
    case 'QC': return 90;
    case 'Completed': return 100;
    default: return 0;
  }
};

const API_BASE_URL = 'http://localhost:8080/api/tasks';

export const useTasks = () => {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch(API_BASE_URL);
        const data = await response.json();
        setTasks(data);
      } catch (error) {
        console.error("Failed to fetch tasks", error);
      }
    };
    fetchTasks();
  }, []);

  const addTask = async (newTask) => {
    try {
      const response = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newTask),
      });
      if (response.ok) {
        const createdTask = await response.json();
        setTasks(prev => [...prev, createdTask]);
      }
    } catch (error) {
      console.error("Failed to add task", error);
    }
  };

  const moveTask = async (taskId, sourceStatus, destStatus, sourceIndex, destIndex) => {
    // 1. Optimistically update UI
    setTasks(prevTasks => {
      const taskIndex = prevTasks.findIndex(t => String(t.id) === String(taskId));
      if (taskIndex === -1) return prevTasks;
      const task = prevTasks[taskIndex];

      let newTasks = [...prevTasks];
      newTasks.splice(taskIndex, 1);
      const updatedTask = { ...task, status: destStatus };

      const destColumnTasks = newTasks.filter(t => t.status === destStatus);

      if (destIndex >= destColumnTasks.length) {
        newTasks.push(updatedTask);
      } else {
        const taskAtDest = destColumnTasks[destIndex];
        const globalDestIndex = newTasks.findIndex(t => t.id === taskAtDest.id);
        newTasks.splice(globalDestIndex, 0, updatedTask);
      }
      return newTasks;
    });

    // 2. Persist to Backend
    try {
      const taskToUpdate = tasks.find(t => String(t.id) === String(taskId));
      if (!taskToUpdate) return;
      
      const payload = { ...taskToUpdate, status: destStatus };
      if (!payload.dueDate) payload.dueDate = null;
      
      await fetch(`${API_BASE_URL}/${taskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
    } catch (error) {
      console.error("Failed to update task status on backend", error);
    }
  };

  const updateTaskStatus = async (taskId, newStatus) => {
    // Optimistic UI update
    setTasks(prev => prev.map(t => String(t.id) === String(taskId) ? { ...t, status: newStatus } : t));
    
    // Persist to backend
    try {
      const taskToUpdate = tasks.find(t => String(t.id) === String(taskId));
      if (!taskToUpdate) return;
      
      const payload = { ...taskToUpdate, status: newStatus };
      if (!payload.dueDate) payload.dueDate = null;

      await fetch(`${API_BASE_URL}/${taskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
    } catch (error) {
      console.error("Failed to update task status on backend", error);
    }
  };

  const updateTask = async (updatedTask) => {
    // Optimistic UI update
    setTasks(prev => prev.map(t => String(t.id) === String(updatedTask.id) ? updatedTask : t));

    // Persist to backend
    try {
      const payload = { ...updatedTask };
      if (!payload.dueDate) payload.dueDate = null;

      await fetch(`${API_BASE_URL}/${payload.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
    } catch (error) {
      console.error("Failed to update task on backend", error);
    }
  };

  return { tasks, addTask, moveTask, updateTaskStatus, updateTask };
};
