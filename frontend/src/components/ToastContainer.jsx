import React from 'react';
import { useWorkflow } from '../context/WorkflowContext';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';
import './Toast.css';

const Toast = ({ toast }) => {
  const { removeToast } = useWorkflow();

  const getIcon = () => {
    switch (toast.type) {
      case 'success': return <CheckCircle size={18} className="toast-icon success" />;
      case 'error': return <AlertCircle size={18} className="toast-icon error" />;
      case 'warning': return <AlertCircle size={18} className="toast-icon warning" />;
      default: return <Info size={18} className="toast-icon info" />;
    }
  };

  return (
    <div className={`toast-item toast-${toast.type} animate-toast-in`}>
      <div className="toast-content">
        {getIcon()}
        <span className="toast-message">{toast.message}</span>
      </div>
      <button className="toast-close" onClick={() => removeToast(toast.id)}>
        <X size={14} />
      </button>
    </div>
  );
};

const ToastContainer = () => {
  const { toasts } = useWorkflow();

  return (
    <div className="toast-container">
      {toasts.map(toast => (
        <Toast key={toast.id} toast={toast} />
      ))}
    </div>
  );
};

export default ToastContainer;
