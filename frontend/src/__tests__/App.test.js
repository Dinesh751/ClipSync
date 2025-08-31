
import React from 'react';
import { render, screen } from '@testing-library/react';
import App from '../App';

// Mock AuthContext
jest.mock('../context/AuthContext', () => ({
  AuthProvider: ({ children }) => <div data-testid="auth-provider">{children}</div>
}));

describe('App Component', () => {
  test('renders without crashing', () => {
    render(<App />);
    expect(document.body).toBeDefined();
  });

  test('renders main structure', () => {
    render(<App />);
    // Since we have global mocks, we can test that the app renders without errors
    expect(document.body).toBeInTheDocument();

// Simple smoke test for the test environment
describe('Frontend Test Environment', () => {
  test('test environment is working', () => {
    expect(1 + 1).toBe(2);
  });

  test('React is available', () => {
    const React = require('react');
    expect(React).toBeDefined();
  });

  test('can import and use basic functions', () => {
    const sum = (a, b) => a + b;
    expect(sum(2, 3)).toBe(5);

  });
});
