import React, { useEffect } from 'react';
import { CheckCircle, XCircle, AlertCircle, Info } from 'lucide-react';
import './Alert.css';

const Alert = ({ alert, onClose, duration = 5000 }) => {
  useEffect(() => {
    if (alert && duration > 0) {
      const timer = setTimeout(() => {
        if (onClose) onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [alert, duration, onClose]);

  if (!alert) return null;

  const getIcon = () => {
    switch (alert.tag) {
      case 'success':
        return <CheckCircle size={20} />;
      case 'danger':
      case 'error':
        return <XCircle size={20} />;
      case 'warning':
        return <AlertCircle size={20} />;
      case 'info':
        return <Info size={20} />;
      default:
        return <Info size={20} />;
    }
  };

  const getAlertClass = () => {
    switch (alert.tag) {
      case 'success':
        return 'alert-success';
      case 'danger':
      case 'error':
        return 'alert-danger';
      case 'warning':
        return 'alert-warning';
      case 'info':
        return 'alert-info';
      default:
        return 'alert-info';
    }
  };

  return (
    <div className={`alert-container ${getAlertClass()}`}>
      <div className="alert-icon">
        {getIcon()}
      </div>
      <div className="alert-content">
        <p className="alert-message">{alert.alert1 || alert.message}</p>
      </div>
      {onClose && (
        <button className="alert-close" onClick={onClose}>
          ×
        </button>
      )}
    </div>
  );
};

export default Alert;