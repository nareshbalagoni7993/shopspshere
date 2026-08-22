import React, { useEffect, useState } from 'react';
import { toastBus } from '../../services/toastBus';
import './ToastContainer.css';

const ICONS = { success: '✓', error: '✕', info: 'ℹ' };

const ToastContainer = () => {
  const [toasts, setToasts] = useState([]);

  useEffect(() => toastBus.subscribe(setToasts), []);

  if (!toasts.length) return null;

  return (
    <div className="toast-stack" aria-live="polite">
      {toasts.map((t) => (
        <div key={t.id} className={`toast toast-${t.type}`} onClick={() => toastBus.dismiss(t.id)}>
          <span className="toast-icon" aria-hidden="true">{ICONS[t.type]}</span>
          <span className="toast-message">{t.message}</span>
        </div>
      ))}
    </div>
  );
};

export default ToastContainer;
