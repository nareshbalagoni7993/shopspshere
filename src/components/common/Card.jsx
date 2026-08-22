import React from 'react';
import { motion } from 'framer-motion';
import './Card.css';

const Card = ({
  children,
  className = '',
  onClick,
  hover = true,
  shadow = 'normal',
  padding = true
}) => {
  return (
    <motion.div
      className={`card card-shadow-${shadow} ${padding ? 'card-padding' : ''} ${className}`}
      onClick={onClick}
      whileHover={hover ? { y: -5, boxShadow: '0 12px 24px rgba(0,0,0,0.15)' } : {}}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  );
};

export default Card;
