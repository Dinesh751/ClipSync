// Utility functions for form validation

export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password) => {
  // At least 8 characters, contains at least one letter and one number
  return password.length >= 8 && /[A-Za-z]/.test(password) && /\d/.test(password);
};

export const validateRequired = (value) => {
  return value !== null && value !== undefined && value.toString().trim().length > 0;
};

export const validateFileSize = (file, maxSizeInMB = 100) => {
  if (!file) return false;
  const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
  return file.size <= maxSizeInBytes;
};

export const validateVideoFile = (file) => {
  if (!file) return false;
  const allowedTypes = ['video/mp4', 'video/avi', 'video/mov', 'video/wmv', 'video/webm'];
  return allowedTypes.includes(file.type);
};

// Validate individual fields
export const validateField = (fieldName, value, formData = {}) => {
  switch (fieldName) {
    case 'email':
      if (!validateRequired(value)) {
        return 'Email is required';
      }
      if (!validateEmail(value)) {
        return 'Please enter a valid email address';
      }
      return null;

    case 'password':
      if (!validateRequired(value)) {
        return 'Password is required';
      }
      if (!validatePassword(value)) {
        return 'Password must be at least 8 characters with letters and numbers';
      }
      return null;

    case 'confirmPassword':
      if (!validateRequired(value)) {
        return 'Please confirm your password';
      }
      if (value !== formData.password) {
        return 'Passwords do not match';
      }
      return null;

    case 'firstName':
      if (!validateRequired(value)) {
        return 'First name is required';
      }
      if (value.trim().length < 2) {
        return 'First name must be at least 2 characters';
      }
      return null;

    case 'lastName':
      if (!validateRequired(value)) {
        return 'Last name is required';
      }
      if (value.trim().length < 2) {
        return 'Last name must be at least 2 characters';
      }
      return null;

    case 'agreeToTerms':
      if (!value) {
        return 'You must agree to the terms and conditions';
      }
      return null;

    default:
      return null;
  }
};

// Validate login form
export const validateLoginForm = (formData) => {
  const errors = {};
  
  // Validate email
  const emailError = validateField('email', formData.email, formData);
  if (emailError) errors.email = emailError;
  
  // Validate password
  const passwordError = validateField('password', formData.password, formData);
  if (passwordError) errors.password = passwordError;
  
  return {
    errors,
    isValid: Object.keys(errors).length === 0
  };
};

// Validate signup form
export const validateSignupForm = (formData) => {
  const errors = {};
  
  // Validate first name
  const firstNameError = validateField('firstName', formData.firstName, formData);
  if (firstNameError) errors.firstName = firstNameError;
  
  // Validate last name
  const lastNameError = validateField('lastName', formData.lastName, formData);
  if (lastNameError) errors.lastName = lastNameError;
  
  // Validate email
  const emailError = validateField('email', formData.email, formData);
  if (emailError) errors.email = emailError;
  
  // Validate password
  const passwordError = validateField('password', formData.password, formData);
  if (passwordError) errors.password = passwordError;
  
  // Validate confirm password
  const confirmPasswordError = validateField('confirmPassword', formData.confirmPassword, formData);
  if (confirmPasswordError) errors.confirmPassword = confirmPasswordError;
  
  // Validate terms agreement
  const termsError = validateField('agreeToTerms', formData.agreeToTerms, formData);
  if (termsError) errors.agreeToTerms = termsError;
  
  return {
    errors,
    isValid: Object.keys(errors).length === 0
  };
};

// Get password strength
export const getPasswordStrength = (password) => {
  if (!password) {
    return { strength: 0, text: '', color: 'gray' };
  }
  
  let score = 0;
  let feedback = [];
  
  // Length check
  if (password.length >= 8) score += 25;
  else feedback.push('at least 8 characters');
  
  // Lowercase check
  if (/[a-z]/.test(password)) score += 25;
  else feedback.push('lowercase letters');
  
  // Uppercase check
  if (/[A-Z]/.test(password)) score += 25;
  else feedback.push('uppercase letters');
  
  // Number check
  if (/\d/.test(password)) score += 25;
  else feedback.push('numbers');
  
  // Special character bonus
  if (/[^A-Za-z0-9]/.test(password)) score += 10;
  
  // Length bonus
  if (password.length >= 12) score += 10;
  
  // Determine strength level and color
  let text, color;
  if (score < 25) {
    text = 'Very Weak';
    color = 'red';
  } else if (score < 50) {
    text = 'Weak';
    color = 'red';
  } else if (score < 75) {
    text = 'Fair';
    color = 'yellow';
  } else if (score < 100) {
    text = 'Good';
    color = 'blue';
  } else {
    text = 'Excellent';
    color = 'green';
  }
  
  return {
    strength: Math.min(score, 100),
    text,
    color,
    feedback: feedback.length > 0 ? `Add ${feedback.join(', ')}` : 'Strong password!'
  };
};

// Default export for backward compatibility
const validationUtils = {
  validateEmail,
  validatePassword,
  validateRequired,
  validateFileSize,
  validateVideoFile,
  validateField,
  validateLoginForm,
  validateSignupForm,
  getPasswordStrength
};

export default validationUtils;
