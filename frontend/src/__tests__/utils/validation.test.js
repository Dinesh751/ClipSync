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
    test('returns true for valid email addresses', () => {
      expect(validateEmail('test@example.com')).toBe(true);
      expect(validateEmail('user.name@domain.co.uk')).toBe(true);
      expect(validateEmail('user+tag@example.org')).toBe(true);
    });

    test('returns false for invalid email addresses', () => {
      expect(validateEmail('invalid-email')).toBe(false);
      expect(validateEmail('@example.com')).toBe(false);
      expect(validateEmail('test@')).toBe(false);
      expect(validateEmail('test.example.com')).toBe(false);
    });
  });

  describe('validatePassword', () => {
    test('returns true for valid passwords', () => {
      expect(validatePassword('password123')).toBe(true);
      expect(validatePassword('MySecure1Pass')).toBe(true);
      expect(validatePassword('abc12345')).toBe(true);
    });

    test('returns false for invalid passwords', () => {
      expect(validatePassword('short1')).toBe(false); // too short
      expect(validatePassword('onlyletters')).toBe(false); // no numbers
      expect(validatePassword('12345678')).toBe(false); // no letters
      expect(validatePassword('')).toBe(false); // empty
    });
  });

  describe('validateRequired', () => {
    test('returns true for non-empty strings', () => {
      expect(validateRequired('hello')).toBe(true);
      expect(validateRequired('a')).toBe(true);
      expect(validateRequired('  text  ')).toBe(true);
    });

    test('returns false for empty or whitespace-only strings', () => {
      expect(validateRequired('')).toBe(false);
      expect(validateRequired('   ')).toBe(false);
      expect(validateRequired(null)).toBe(false);
      expect(validateRequired(undefined)).toBe(false);
    });
  });

  describe('validateFileSize', () => {
    test('returns true for files within size limit', () => {
      const smallFile = { size: 1024 * 1024 }; // 1MB
      expect(validateFileSize(smallFile, 100)).toBe(true);
      
      const mediumFile = { size: 50 * 1024 * 1024 }; // 50MB
      expect(validateFileSize(mediumFile, 100)).toBe(true);
    });

    test('returns false for files exceeding size limit', () => {
      const largeFile = { size: 200 * 1024 * 1024 }; // 200MB
      expect(validateFileSize(largeFile, 100)).toBe(false);
    });

    test('returns false for null/undefined files', () => {
      expect(validateFileSize(null)).toBe(false);
      expect(validateFileSize(undefined)).toBe(false);
    });
  });

  describe('validateVideoFile', () => {
    test('returns true for valid video file types', () => {
      expect(validateVideoFile({ type: 'video/mp4' })).toBe(true);
      expect(validateVideoFile({ type: 'video/avi' })).toBe(true);
      expect(validateVideoFile({ type: 'video/mov' })).toBe(true);
      expect(validateVideoFile({ type: 'video/webm' })).toBe(true);
    });

    test('returns false for invalid file types', () => {
      expect(validateVideoFile({ type: 'image/jpeg' })).toBe(false);
      expect(validateVideoFile({ type: 'text/plain' })).toBe(false);
      expect(validateVideoFile({ type: 'application/pdf' })).toBe(false);
    });

    test('returns false for null/undefined files', () => {
      expect(validateVideoFile(null)).toBe(false);
      expect(validateVideoFile(undefined)).toBe(false);
    });
  });

  describe('validateField', () => {
    test('validates email field correctly', () => {
      expect(validateField('email', 'test@example.com')).toBeNull();
      expect(validateField('email', 'invalid-email')).toBe('Please enter a valid email address');
      expect(validateField('email', '')).toBe('Email is required');
    });

    test('validates password field correctly', () => {
      expect(validateField('password', 'password123')).toBeNull();
      expect(validateField('password', 'short')).toBe('Password must be at least 8 characters with letters and numbers');
      expect(validateField('password', '')).toBe('Password is required');
    });

    test('validates confirmPassword field correctly', () => {
      const formData = { password: 'password123' };
      expect(validateField('confirmPassword', 'password123', formData)).toBeNull();
      expect(validateField('confirmPassword', 'different', formData)).toBe('Passwords do not match');
      expect(validateField('confirmPassword', '', formData)).toBe('Please confirm your password');
    });

    test('validates firstName field correctly', () => {
      expect(validateField('firstName', 'John')).toBeNull();
      expect(validateField('firstName', 'J')).toBe('First name must be at least 2 characters');
      expect(validateField('firstName', '')).toBe('First name is required');
    });

    test('validates agreeToTerms field correctly', () => {
      expect(validateField('agreeToTerms', true)).toBeNull();
      expect(validateField('agreeToTerms', false)).toBe('You must agree to the terms and conditions');
    });
  });

  describe('validateLoginForm', () => {
    test('returns valid for correct login data', () => {
      const formData = {
        email: 'test@example.com',
        password: 'password123'
      };
      const result = validateLoginForm(formData);
      expect(result.isValid).toBe(true);
      expect(Object.keys(result.errors)).toHaveLength(0);
    });

    test('returns errors for invalid login data', () => {
      const formData = {
        email: 'invalid-email',
        password: 'short'
      };
      const result = validateLoginForm(formData);
      expect(result.isValid).toBe(false);
      expect(result.errors.email).toBe('Please enter a valid email address');
      expect(result.errors.password).toBe('Password must be at least 8 characters with letters and numbers');
    });
  });

  describe('validateSignupForm', () => {
    test('returns valid for correct signup data', () => {
      const formData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: 'password123',
        confirmPassword: 'password123',
        agreeToTerms: true
      };
      const result = validateSignupForm(formData);
      expect(result.isValid).toBe(true);
      expect(Object.keys(result.errors)).toHaveLength(0);
    });

    test('returns errors for invalid signup data', () => {
      const formData = {
        firstName: '',
        lastName: 'D',
        email: 'invalid-email',
        password: 'short',
        confirmPassword: 'different',
        agreeToTerms: false
      };
      const result = validateSignupForm(formData);
      expect(result.isValid).toBe(false);
      expect(result.errors.firstName).toBe('First name is required');
      expect(result.errors.lastName).toBe('Last name must be at least 2 characters');
      expect(result.errors.email).toBe('Please enter a valid email address');
      expect(result.errors.password).toBe('Password must be at least 8 characters with letters and numbers');
      expect(result.errors.confirmPassword).toBe('Passwords do not match');
      expect(result.errors.agreeToTerms).toBe('You must agree to the terms and conditions');
    });
  });

  describe('getPasswordStrength', () => {
    test('returns correct strength for various passwords', () => {
      expect(getPasswordStrength('').strength).toBe(0);
      expect(getPasswordStrength('weak').color).toBe('red');
      expect(getPasswordStrength('password123').color).toBe('blue');
      expect(getPasswordStrength('StrongPass123!').color).toBe('green');
    });

    test('provides helpful feedback', () => {
      const result = getPasswordStrength('short');
      expect(result.feedback).toContain('at least 8 characters');
    });
  });
});
