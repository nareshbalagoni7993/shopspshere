import React, { useId, useState } from 'react';
import './Input.css';

const Input = ({
  type = 'text',
  name,
  label,
  placeholder,
  value,
  onChange,
  error,
  helperText,
  disabled = false,
  fullWidth = true,
  icon = null,
  className = ''
}) => {
  const [focused, setFocused] = useState(false);
  const inputId = useId();

  return (
    <div className={`input-group ${fullWidth ? 'full-width' : ''} ${className}`}>
      {label && (
        <label htmlFor={inputId} className={`input-label ${focused ? 'focused' : ''} ${value ? 'filled' : ''}`}>
          {label}
        </label>
      )}
      <div className="input-wrapper">
        {icon && <span className="input-icon">{icon}</span>}
        <input
          id={inputId}
          type={type}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className={`input-field ${error ? 'error' : ''} ${icon ? 'with-icon' : ''}`}
        />
      </div>
      {error && <span className="input-error">{error}</span>}
      {helperText && !error && <span className="input-helper">{helperText}</span>}
    </div>
  );
};

export default Input;
