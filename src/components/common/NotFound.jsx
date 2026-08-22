import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from './Button';
import './NotFound.css';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="not-found">
      <div className="not-found-content">
        <div className="not-found-code">404</div>
        <h1>Page Not Found</h1>
        <p>Sorry, the page you're looking for doesn't exist.</p>
        <Button
          variant="primary"
          onClick={() => navigate('/')}
        >
          Back to Home
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
