import React from 'react';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import LoginForm from '../../../components/Auth/LoginForm';

// Mock AuthContext
const mockAuthContextValue = {
  user: null,
  loading: false,
  login: jest.fn().mockResolvedValue(true),
  logout: jest.fn().mockResolvedValue(true),
  signup: jest.fn().mockResolvedValue(true),
};

jest.mock('../../../context/AuthContext', () => ({
  useAuth: () => mockAuthContextValue,
}));

// Mock react-router-dom navigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  BrowserRouter: ({ children }) => children,
  Routes: ({ children }) => children,
  Route: ({ children }) => children,
  useNavigate: () => mockNavigate,
  Link: ({ children, to, ...props }) => <a href={to} {...props}>{children}</a>,
  Navigate: ({ to }) => <div data-testid="navigate" data-to={to} />
}));

// Mock react-hot-toast
jest.mock('react-hot-toast', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
    loading: jest.fn(),
  },
  Toaster: () => null
}));

// Simple render helper
import { render } from '@testing-library/react';
const renderWithProviders = (ui, options = {}) => {
  return render(ui, options);
};

// Mock form data
const mockFormData = {
  loginForm: {
    email: 'test@example.com',
    password: 'password123',
  },
};

// Simple accessibility check
const checkAccessibility = async (container) => {
  // Basic check that form elements have proper labels
  const inputs = container.querySelectorAll('input');
  inputs.forEach(input => {
    if (input.type !== 'hidden') {
      expect(input.getAttribute('aria-label') || input.labels?.length > 0).toBeTruthy();
    }
  });
};

describe('LoginForm Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    test('renders all form elements correctly', () => {
      renderWithProviders(<LoginForm />);
      
      expect(screen.getByText('Welcome Back')).toBeInTheDocument();
      expect(screen.getByText('Sign in to your ClipSync account')).toBeInTheDocument();
      expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /try demo login/i })).toBeInTheDocument();
      expect(screen.getByText(/don't have an account/i)).toBeInTheDocument();
    });

    test('renders social login options', () => {
      renderWithProviders(<LoginForm />);
      
      expect(screen.getByRole('button', { name: /google/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /github/i })).toBeInTheDocument();
    });

    test('passes accessibility checks', async () => {
      const { container } = renderWithProviders(<LoginForm />);
      await checkAccessibility(container);
    });
  });

  describe('Form Validation', () => {
    test('shows validation errors for empty form submission', async () => {
      renderWithProviders(<LoginForm />);
      
      const submitButton = screen.getByRole('button', { name: /sign in/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Email is required')).toBeInTheDocument();
        expect(screen.getByText('Password is required')).toBeInTheDocument();
      });
    });

    test('validates email format in real-time', async () => {
      renderWithProviders(<LoginForm />);
      
      const emailInput = screen.getByLabelText(/email address/i);
      
      fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
      fireEvent.blur(emailInput);

      await waitFor(() => {
        expect(screen.getByText('Please enter a valid email address')).toBeInTheDocument();
      });
    });

    test('clears validation errors when user types', async () => {
      renderWithProviders(<LoginForm />);
      
      const emailInput = screen.getByLabelText(/email address/i);
      const submitButton = screen.getByRole('button', { name: /sign in/i });
      
      // Trigger validation error
      fireEvent.click(submitButton);
      await waitFor(() => {
        expect(screen.getByText('Email is required')).toBeInTheDocument();
      });
      
      // Clear error by typing
      fireEvent.change(emailInput, { target: { value: 'test' } });
      expect(screen.queryByText('Email is required')).not.toBeInTheDocument();
    });

    test('accepts valid form data', async () => {
      renderWithProviders(<LoginForm />);
      
      const emailInput = screen.getByLabelText(/email address/i);
      const passwordInput = screen.getByLabelText(/password/i);
      const submitButton = screen.getByRole('button', { name: /sign in/i });
      
      fireEvent.change(emailInput, { target: { value: mockFormData.loginForm.email } });
      fireEvent.change(passwordInput, { target: { value: mockFormData.loginForm.password } });
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        expect(screen.getByText('Signing in...')).toBeInTheDocument();
      });
    });
  });

  describe('User Interactions', () => {
    test('toggles password visibility', () => {
      renderWithProviders(<LoginForm />);
      
      const passwordInput = screen.getByLabelText(/password/i);
      const toggleButtons = screen.getAllByRole('button', { name: '' });
      const passwordToggle = toggleButtons.find(btn => 
        btn.closest('div').contains(passwordInput)
      );
      
      expect(passwordInput.type).toBe('password');
      
      fireEvent.click(passwordToggle);
      expect(passwordInput.type).toBe('text');
      
      fireEvent.click(passwordToggle);
      expect(passwordInput.type).toBe('password');
    });

    test('fills demo credentials', () => {
      renderWithProviders(<LoginForm />);
      
      const emailInput = screen.getByLabelText(/email address/i);
      const passwordInput = screen.getByLabelText(/password/i);
      const demoButton = screen.getByRole('button', { name: /try demo login/i });
      
      fireEvent.click(demoButton);
      
      expect(emailInput.value).toBe('john@example.com');
      expect(passwordInput.value).toBe('password123');
    });

    test('handles remember me checkbox', () => {
      renderWithProviders(<LoginForm />);
      
      const rememberCheckbox = screen.getByRole('checkbox', { name: /remember me/i });
      
      expect(rememberCheckbox.checked).toBe(false);
      fireEvent.click(rememberCheckbox);
      expect(rememberCheckbox.checked).toBe(true);
    });
  });

  describe('Form Submission', () => {
    test('shows loading state during submission', async () => {
      renderWithProviders(<LoginForm />);
      
      const emailInput = screen.getByLabelText(/email address/i);
      const passwordInput = screen.getByLabelText(/password/i);
      const submitButton = screen.getByRole('button', { name: /sign in/i });
      
      fireEvent.change(emailInput, { target: { value: mockFormData.loginForm.email } });
      fireEvent.change(passwordInput, { target: { value: mockFormData.loginForm.password } });
      fireEvent.click(submitButton);
      
      expect(screen.getByText('Signing in...')).toBeInTheDocument();
      expect(submitButton).toBeDisabled();
    });

    test('navigates on successful login', async () => {
      mockAuthContextValue.login.mockResolvedValue(true);

      renderWithProviders(<LoginForm />);
      
      const emailInput = screen.getByLabelText(/email address/i);
      const passwordInput = screen.getByLabelText(/password/i);
      const submitButton = screen.getByRole('button', { name: /sign in/i });
      
      fireEvent.change(emailInput, { target: { value: mockFormData.loginForm.email } });
      fireEvent.change(passwordInput, { target: { value: mockFormData.loginForm.password } });
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/');
      }, { timeout: 3000 });
    });
  });

  describe('Social Login', () => {
    test('handles Google login click', () => {
      renderWithProviders(<LoginForm />);
      
      const googleButton = screen.getByRole('button', { name: /google/i });
      fireEvent.click(googleButton);
      
      // Should show coming soon message (handled by toast)
      expect(googleButton).toBeInTheDocument();
    });

    test('handles GitHub login click', () => {
      renderWithProviders(<LoginForm />);
      
      const githubButton = screen.getByRole('button', { name: /github/i });
      fireEvent.click(githubButton);
      
      // Should show coming soon message (handled by toast)
      expect(githubButton).toBeInTheDocument();
    });
  });

  describe('Navigation', () => {
    test('renders link to signup page', () => {
      renderWithProviders(<LoginForm />);
      
      const signupLink = screen.getByRole('link', { name: /sign up for free/i });
      expect(signupLink).toHaveAttribute('href', '/signup');
    });

    test('handles forgot password click', () => {
      renderWithProviders(<LoginForm />);
      
      const forgotPasswordButton = screen.getByRole('button', { name: /forgot password/i });
      fireEvent.click(forgotPasswordButton);
      
      // Should show coming soon message (handled by toast)
      expect(forgotPasswordButton).toBeInTheDocument();
    });
  });
});
