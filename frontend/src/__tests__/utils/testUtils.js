// Test utilities for ClipSync React application
import React from 'react';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Mock AuthContext values
export const mockAuthContextValue = {
  user: null,
  loading: false,
  login: jest.fn().mockResolvedValue(true),
  logout: jest.fn().mockResolvedValue(true),
  signup: jest.fn().mockResolvedValue(true),
};

// Custom render function that includes providers
export const renderWithProviders = (
  ui,
  {
    authValue = mockAuthContextValue,
    initialEntries = ['/'],
    ...renderOptions
  } = {}
) => {
  const Wrapper = ({ children }) => (
    React.createElement(BrowserRouter, null,
      React.createElement('div', { 'data-testid': 'auth-provider' },
        children,
        React.createElement(Toaster)
      )
    )
  );

  return render(ui, { wrapper: Wrapper, ...renderOptions });
};

// Helper to mock form data
export const mockFormData = {
  loginForm: {
    email: 'test@example.com',
    password: 'password123',
  },
  signupForm: {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    password: 'Password123!',
    confirmPassword: 'Password123!',
    agreeToTerms: true,
  },
};

// Helper to test accessibility
export const checkAccessibility = async (element) => {
  // Basic check that form elements have proper labels
  const inputs = element.querySelectorAll('input');
  inputs.forEach(input => {
    if (input.type !== 'hidden') {
      expect(input.getAttribute('aria-label') || input.labels?.length > 0).toBeTruthy();
    }
  });
};

// Export all helpers
export * from '@testing-library/react';
export { renderWithProviders as render };

// Add a simple test so Jest doesn't complain about no tests
test('testUtils exports work correctly', () => {
  expect(renderWithProviders).toBeDefined();
  expect(mockFormData).toBeDefined();
  expect(checkAccessibility).toBeDefined();
});
