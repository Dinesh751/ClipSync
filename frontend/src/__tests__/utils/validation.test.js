import {
  validateEmail,
  validatePassword,
  validateRequired,
  validateFileSize,
  validateVideoFile,
  validateField,
  validateLoginForm,
  validateSignupForm,
  getPasswordStrength
} from '../../utils/validation';

describe('Validation Utilities', () => {
  
  describe('validateEmail', () => {
    test('should return error for empty email', () => {
      expect(validateEmail('')).toBe('Email is required');
      expect(validateEmail(null)).toBe('Email is required');
      expect(validateEmail(undefined)).toBe('Email is required');
    });

    test('should return error for invalid email format', () => {
      expect(validateEmail('invalid-email')).toBe('Please enter a valid email address');
      expect(validateEmail('test@')).toBe('Please enter a valid email address');
      expect(validateEmail('@domain.com')).toBe('Please enter a valid email address');
      expect(validateEmail('test.domain.com')).toBe('Please enter a valid email address');
    });

    test('should return null for valid email', () => {
      expect(validateEmail('test@example.com')).toBeNull();
      expect(validateEmail('user.name@domain.co.uk')).toBeNull();
      expect(validateEmail('test123@gmail.com')).toBeNull();
    });
  });

  describe('validatePassword', () => {
    test('should return error for empty password', () => {
      expect(validatePassword('')).toBe('Password is required');
      expect(validatePassword(null)).toBe('Password is required');
      expect(validatePassword(undefined)).toBe('Password is required');
    });

    test('should return error for short password', () => {
      expect(validatePassword('123')).toBe('Password must be at least 8 characters long');
      expect(validatePassword('abc')).toBe('Password must be at least 8 characters long');
    });

    test('should return error for password without lowercase', () => {
      expect(validatePassword('PASSWORD123')).toBe('Password must contain at least one lowercase letter');
    });

    test('should return error for password without uppercase', () => {
      expect(validatePassword('password123')).toBe('Password must contain at least one uppercase letter');
    });

    test('should return error for password without number', () => {
      expect(validatePassword('Password')).toBe('Password must contain at least one number');
    });

    test('should return null for valid password', () => {
      expect(validatePassword('Password123')).toBeNull();
      expect(validatePassword('StrongPass1')).toBeNull();
      expect(validatePassword('MySecure2024')).toBeNull();
    });
  });

  describe('validateRequired', () => {
    test('should return false for empty values', () => {
      expect(validateRequired('')).toBe(false);
      expect(validateRequired('   ')).toBe(false);
      expect(validateRequired(null)).toBe(false);
      expect(validateRequired(undefined)).toBe(false);
    });

    test('should return true for non-empty values', () => {
      expect(validateRequired('test')).toBe(true);
      expect(validateRequired('0')).toBe(true);
      expect(validateRequired(0)).toBe(true);
      expect(validateRequired(false)).toBe(true);
    });
  });

  describe('validateFileSize', () => {
    test('should return false for null file', () => {
      expect(validateFileSize(null)).toBe(false);
      expect(validateFileSize(undefined)).toBe(false);
    });

    test('should validate file size correctly', () => {
      const smallFile = { size: 50 * 1024 * 1024 }; // 50MB
      const largeFile = { size: 150 * 1024 * 1024 }; // 150MB
      
      expect(validateFileSize(smallFile, 100)).toBe(true);
      expect(validateFileSize(largeFile, 100)).toBe(false);
    });
  });

  describe('validateVideoFile', () => {
    test('should return false for null file', () => {
      expect(validateVideoFile(null)).toBe(false);
      expect(validateVideoFile(undefined)).toBe(false);
    });

    test('should validate video file types', () => {
      const mp4File = { type: 'video/mp4' };
      const aviFile = { type: 'video/avi' };
      const txtFile = { type: 'text/plain' };
      const jpegFile = { type: 'image/jpeg' };
      
      expect(validateVideoFile(mp4File)).toBe(true);
      expect(validateVideoFile(aviFile)).toBe(true);
      expect(validateVideoFile(txtFile)).toBe(false);
      expect(validateVideoFile(jpegFile)).toBe(false);
    });
  });

  describe('validateField', () => {
    test('should validate email field', () => {
      expect(validateField('email', '')).toBe('Email is required');
      expect(validateField('email', 'invalid')).toBe('Please enter a valid email address');
      expect(validateField('email', 'test@example.com')).toBeNull();
    });

    test('should validate password field', () => {
      expect(validateField('password', '')).toBe('Password is required');
      expect(validateField('password', '123')).toBe('Password must be at least 8 characters long');
      expect(validateField('password', 'Password123')).toBeNull();
    });

    test('should validate confirm password', () => {
      const formData = { password: 'Password123' };
      expect(validateField('confirmPassword', '', formData)).toBe('Please confirm your password');
      expect(validateField('confirmPassword', 'DifferentPass', formData)).toBe('Passwords do not match');
      expect(validateField('confirmPassword', 'Password123', formData)).toBeNull();
    });

    test('should validate first and last name', () => {
      expect(validateField('firstName', '')).toBe('First name is required');
      expect(validateField('firstName', 'A')).toBe('First name must be at least 2 characters');
      expect(validateField('firstName', 'John')).toBeNull();
      
      expect(validateField('lastName', '')).toBe('Last name is required');
      expect(validateField('lastName', 'B')).toBe('Last name must be at least 2 characters');
      expect(validateField('lastName', 'Doe')).toBeNull();
    });

    test('should validate terms agreement', () => {
      expect(validateField('agreeToTerms', false)).toBe('You must agree to the terms and conditions');
      expect(validateField('agreeToTerms', true)).toBeNull();
    });
  });

  describe('validateLoginForm', () => {
    test('should return errors for empty form', () => {
      const result = validateLoginForm({ email: '', password: '' });
      expect(result.isValid).toBe(false);
      expect(result.errors.email).toBe('Email is required');
      expect(result.errors.password).toBe('Password is required');
    });

    test('should return errors for invalid email', () => {
      const result = validateLoginForm({ email: 'invalid', password: 'Password123' });
      expect(result.isValid).toBe(false);
      expect(result.errors.email).toBe('Please enter a valid email address');
    });

    test('should return valid for correct login form', () => {
      const result = validateLoginForm({ email: 'test@example.com', password: 'password' });
      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual({});
    });
  });

  describe('validateSignupForm', () => {
    test('should return errors for empty form', () => {
      const formData = {
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        agreeToTerms: false
      };
      
      const result = validateSignupForm(formData);
      expect(result.isValid).toBe(false);
      expect(result.errors.firstName).toBe('First name is required');
      expect(result.errors.lastName).toBe('Last name is required');
      expect(result.errors.email).toBe('Email is required');
      expect(result.errors.password).toBe('Password is required');
      expect(result.errors.confirmPassword).toBe('Please confirm your password');
      expect(result.errors.agreeToTerms).toBe('You must agree to the terms and conditions');
    });

    test('should return valid for correct signup form', () => {
      const formData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: 'Password123',
        confirmPassword: 'Password123',
        agreeToTerms: true
      };
      
      const result = validateSignupForm(formData);
      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual({});
    });
  });

  describe('getPasswordStrength', () => {
    test('should return zero strength for empty password', () => {
      const result = getPasswordStrength('');
      expect(result.strength).toBe(0);
      expect(result.text).toBe('No password');
      expect(result.color).toBe('gray');
    });

    test('should return weak for simple password', () => {
      const result = getPasswordStrength('123');
      expect(result.strength).toBe(25);
      expect(result.text).toBe('Weak');
      expect(result.color).toBe('red');
      expect(result.feedback).toContain('at least 8 characters');
    });

    test('should return excellent for strong password', () => {
      const result = getPasswordStrength('StrongPassword123!');
      expect(result.strength).toBe(100);
      expect(result.text).toBe('Excellent');
      expect(result.color).toBe('green');
      expect(result.feedback).toBe('Strong password!');
    });
  });
});
