import React from 'react';
import { CheckCircle2, AlertCircle, Info } from './Icons';
import { useAuth } from '../context/AuthContext';

const Toast = () => {
  const { toast } = useAuth();

  if (!toast) return null;

  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return <CheckCircle2 size={18} style={{ color: '#34d399' }} />;
      case 'error':
        return <AlertCircle size={18} style={{ color: '#fb7185' }} />;
      default:
        return <Info size={18} style={{ color: '#60a5fa' }} />;
    }
  };

  return (
    <div className="toast-container">
      <div className={`toast ${toast.type || 'info'} animate-fade-in`}>
        {getIcon()}
        <span>{toast.message}</span>
      </div>
    </div>
  );
};

export default Toast;
