import React from 'react';
import Button from './Button';
import './EmptyState.css';

const EmptyState = ({ icon, title, message, action, className = '' }) => {
  return (
    <div className={`empty-state ${className}`}>
      {icon && <div className="empty-state-icon">{icon}</div>}
      {title && <h3>{title}</h3>}
      {message && <p>{message}</p>}
      {action && (
        <Button variant="primary" onClick={action.onClick}>
          {action.label}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
