import React from 'react';

const Button = ({
  children,
  type = 'button',
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  icon: Icon,
  iconPosition = 'left',
  className = '',
  onClick,
  ...props
}) => {
  const getButtonClasses = () => {
    let classes = 'btn';
    
    // Variant styles
    if (variant === 'primary') {
      classes += ' btn-primary';
    } else if (variant === 'outline') {
      classes += ' btn-outline';
    } else if (variant === 'secondary') {
      classes += ' btn-outline';
    } else if (variant === 'ghost') {
      classes += ' btn-outline';
    }
    
    // Size styles
    if (size === 'sm') {
      classes += ' btn-sm';
    }
    
    // Full width
    if (className.includes('w-full')) {
      classes += ' btn-w-full';
    }
    
    return classes + ' ' + className;
  };

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={getButtonClasses()}
      {...props}
    >
      {loading ? (
        <>
          <div className="spinner" style={{marginRight: '0.5rem', width: '1rem', height: '1rem'}}></div>
          Loading...
        </>
      ) : (
        <>
          {Icon && iconPosition === 'left' && (
            <Icon className={children ? 'mr-2' : ''} style={{width: '1.25rem', height: '1.25rem'}} />
          )}
          {children}
          {Icon && iconPosition === 'right' && (
            <Icon className={children ? 'ml-2' : ''} style={{width: '1.25rem', height: '1.25rem'}} />
          )}
        </>
      )}
    </button>
  );
};

export default Button;
