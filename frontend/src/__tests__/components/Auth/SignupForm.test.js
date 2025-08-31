import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import SignupForm from '../../../components/Auth/SignupForm';

// Mock AuthContext
jest.mock('../../../context/AuthContext', () => ({
  useAuth: () => ({
    signup: jest.fn(),
    loading: false,
    error: null
  })
}));

describe('SignupForm Component', () => {
  test('renders signup form', () => {
    render(<SignupForm />);
    // Just test that the component renders without crashing
    expect(document.body).toBeDefined();
  });

  test('basic form structure exists', () => {
    render(<SignupForm />);
    // Test for basic form elements that should exist
    const form = document.querySelector('form');
    expect(form).toBeTruthy();
  });
});
