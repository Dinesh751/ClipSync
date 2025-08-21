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
    let classes = '';
    
    // Variant styles
    switch (variant) {
      case 'primary':
        classes += 'btn-primary';
        break;
      case 'secondary':
        classes += 'btn-secondary';
        break;
      case 'outline':
        classes += 'btn-secondary';
        break;
      case 'ghost':
        classes += 'btn-ghost';
        break;
      case 'danger':
        classes += 'btn-danger';
        break;
      default:
        classes += 'btn-primary';
    }
    
    // Size variations
    if (size === 'sm') {
      classes += ' py-2 px-4 text-sm';
    } else if (size === 'lg') {
      classes += ' py-4 px-8 text-lg';
    }
    
    // Disabled state
    if (disabled || loading) {
      classes += ' opacity-50 cursor-not-allowed';
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
        <div className="flex items-center justify-center">
          <div className="spinner mr-2"></div>
          {typeof children === 'string' ? children.replace(/^(Sign in|Create account|Upload)/, '$1ing').replace(/Sign ining/, 'Signing in') : 'Loading...'}
        </div>
      ) : (
        <div className="flex items-center justify-center">
          {Icon && iconPosition === 'left' && (
            <Icon className={children ? 'mr-2 w-4 h-4' : 'w-4 h-4'} />
          )}
          {children}
          {Icon && iconPosition === 'right' && (
            <Icon className={children ? 'ml-2 w-4 h-4' : 'w-4 h-4'} />
          )}
        </div>
      )}
    </button>
  );
};

export default Button;
