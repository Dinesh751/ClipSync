import React from 'react';

const Input = ({
  label,
  type = 'text',
  name,
  value,
  onChange,
  onBlur,
  error,
  touched,
  placeholder,
  required = false,
  disabled = false,
  icon: Icon,
  className = '',
  ...props
}) => {
  const getInputClasses = () => {
    let classes = 'form-input';
    
    if (error && touched) {
      classes += ' border-red-300 focus:border-red-500 focus:ring-red-500';
    }
    
    if (disabled) {
      classes += ' bg-gray-50 text-gray-500 cursor-not-allowed';
    }
    
    if (Icon) {
      classes += ' pl-12';
    }
    
    return classes + ' ' + className;
  };

  return (
    <div className="space-y-2">
      {label && (
        <label htmlFor={name} className="form-label">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        {Icon && (
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">
            <Icon />
          </div>
        )}
        
        <input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          disabled={disabled}
          className={getInputClasses()}
          {...props}
        />
      </div>
      
      {error && touched && (
        <div className="form-error flex items-center">
          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </div>
      )}
    </div>
  );
};

export default Input;
