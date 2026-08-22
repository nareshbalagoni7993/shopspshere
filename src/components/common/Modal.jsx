import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from './Button';
import './Modal.css';

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  actions,
  size = 'medium',
  closeOnBackdrop = true
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="modal-backdrop"
            onClick={closeOnBackdrop ? onClose : null}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
          <motion.div
            className={`modal modal-${size}`}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
          >
            {title && (
              <div className="modal-header">
                <h2>{title}</h2>
                <button className="modal-close" onClick={onClose}>
                  ✕
                </button>
              </div>
            )}
            <div className="modal-body">{children}</div>
            {actions && (
              <div className="modal-footer">
                {actions.map((action, index) => (
                  <Button
                    key={index}
                    variant={action.variant || 'primary'}
                    onClick={action.onClick}
                  >
                    {action.label}
                  </Button>
                ))}
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default Modal;
