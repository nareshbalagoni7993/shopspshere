import React from 'react';
import './Loader.css';

const Loader = ({ size = 'medium', fullPage = false }) => {
  if (fullPage) {
    return (
      <div className="loader-fullpage">
        <div className={`loader loader-${size}`} />
      </div>
    );
  }

  return <div className={`loader loader-${size}`} />;
};

export default Loader;
