import React, { useEffect, useState } from 'react';
import { loadingBus } from '../../services/loadingBus';
import './GlobalLoader.css';

const GlobalLoader = () => {
  const [active, setActive] = useState(false);

  useEffect(() => loadingBus.subscribe((count) => setActive(count > 0)), []);

  if (!active) return null;

  return (
    <div className="global-loader" role="status" aria-live="polite" aria-label="Loading">
      <div className="global-loader-bar" />
    </div>
  );
};

export default GlobalLoader;
