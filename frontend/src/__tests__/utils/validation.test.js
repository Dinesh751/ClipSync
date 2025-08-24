import {
  validateEmail,
  validatePassword,
  validateRequired,
  validateFileSize,
  validateVideoFile
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
});
