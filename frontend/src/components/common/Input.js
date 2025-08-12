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
  ...props
}) => {
  const getInputClasses = () => {
    let classes = '';
    
    if (error && touched) {
      classes += ' error';
    }
    
    if (disabled) {
      classes += ' bg-gray-50 text-gray-500';
    }
    
    return classes;
  };

  const inputStyle = {
    paddingLeft: Icon ? '2.5rem' : '1rem'
  };

  return (
    <div className="space-y-4">
      {label && (
        <label 
          htmlFor={name} 
          className="text-sm font-medium text-gray-700"
          style={{display: 'block', marginBottom: '0.5rem'}}
        >
          {label}
          {required && <span className="text-red-600" style={{marginLeft: '0.25rem'}}>*</span>}
        </label>
      )}
      
      <div style={{position: 'relative'}}>
        {Icon && (
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '0.75rem',
            transform: 'translateY(-50%)',
            pointerEvents: 'none',
            color: '#9ca3af'
          }}>
            <Icon style={{width: '1.25rem', height: '1.25rem'}} />
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
          style={inputStyle}
          {...props}
        />
      </div>
      
      {error && touched && (
        <p className="text-sm text-red-600" style={{marginTop: '0.5rem', display: 'flex', alignItems: 'center'}}>
          <svg style={{marginRight: '0.25rem', width: '1rem', height: '1rem'}} fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </p>
      )}
    </div>
  );
};

export default Input;
