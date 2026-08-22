import React from 'react';
import { getCategoryIcon } from '../../constants';
import './Loader.css';

const Loader = ({ size = 'medium', fullPage = false, category, label }) => {
  const icon = category ? getCategoryIcon(category) : '🛍️';

  const spinner = (
    <div className={`loader-wrap loader-wrap-${size}`}>
      <div className={`loader loader-${size}`} />
      <span className="loader-icon" aria-hidden="true">{icon}</span>
    </div>
  );

  if (fullPage) {
    return (
      <div className="loader-fullpage">
        {spinner}
        {label && <p className="loader-label">{label}</p>}
      </div>
    );
  }

  return spinner;
};

export default Loader;
