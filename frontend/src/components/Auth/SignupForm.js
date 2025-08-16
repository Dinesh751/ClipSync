import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useForm } from '../../hooks/useForm';
import { validateSignupForm } from '../../utils/validation';
import Input from '../common/Input';
import Button from '../common/Button';
import Alert from '../common/Alert';

// Icons
const UserIcon = () => (
  <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" style={{width: '1.25rem', height: '1.25rem'}}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
  </svg>
);

const EmailIcon = () => (
  <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" style={{width: '1.25rem', height: '1.25rem'}}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
  </svg>
);

const LockIcon = () => (
  <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" style={{width: '1.25rem', height: '1.25rem'}}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
  </svg>
);

const SignupForm = () => {
  const navigate = useNavigate();
  const { signup, isLoading, error, clearError, isAuthenticated } = useAuth();
  const [showAlert, setShowAlert] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit
  } = useForm(
    { name: '', email: '', password: '', confirmPassword: '' },
    validateSignupForm
  );

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  // Show error alert
  useEffect(() => {
    if (error) {
      setShowAlert(true);
    }
  }, [error]);

  const onSubmit = async (formData) => {
    const result = await signup(formData.name, formData.email, formData.password);
    if (result.success) {
      setSuccessMessage('Account created successfully! Redirecting...');
      setTimeout(() => {
        navigate('/');
      }, 2000);
    }
  };

  const handleCloseAlert = () => {
    setShowAlert(false);
    clearError();
  };

  return (
    <div className="min-h-screen gradient-bg flex items-center justify-center py-6 px-4">
      <div className="max-w-md w-full space-y-6">
        {/* Header */}
        <div className="text-center">
          <div style={{
            margin: '0 auto 1.5rem',
            height: '4rem',
            width: '4rem',
            background: 'linear-gradient(to right, #9333ea, #3b82f6)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <svg style={{height: '2rem', width: '2rem', color: 'white'}} fill="currentColor" viewBox="0 0 20 20">
              <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white mb-4">
            Create your account
          </h2>
          <p className="text-white" style={{opacity: 0.9}}>
            Join ClipSync and start sharing your videos
          </p>
        </div>

        {/* Success Alert */}
        {successMessage && (
          <Alert
            type="success"
            message={successMessage}
            className="mb-4"
          />
        )}

        {/* Error Alert */}
        {showAlert && error && (
          <Alert
            type="error"
            message={error}
            onClose={handleCloseAlert}
            className="mb-4"
          />
        )}

        {/* Form */}
        <div className="glass-card">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <Input
              label="Full name"
              type="text"
              name="name"
              value={values.name}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.name}
              touched={touched.name}
              placeholder="Enter your full name"
              icon={UserIcon}
              required
              autoComplete="name"
            />

            <Input
              label="Email address"
              type="email"
              name="email"
              value={values.email}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.email}
              touched={touched.email}
              placeholder="Enter your email"
              icon={EmailIcon}
              required
              autoComplete="email"
            />

            <Input
              label="Password"
              type="password"
              name="password"
              value={values.password}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.password}
              touched={touched.password}
              placeholder="Create a password"
              icon={LockIcon}
              required
              autoComplete="new-password"
            />

            <Input
              label="Confirm password"
              type="password"
              name="confirmPassword"
              value={values.confirmPassword}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.confirmPassword}
              touched={touched.confirmPassword}
              placeholder="Confirm your password"
              icon={LockIcon}
              required
              autoComplete="new-password"
            />

            {/* Terms and Privacy */}
            <div style={{display: 'flex', alignItems: 'flex-start'}}>
              <div style={{display: 'flex', alignItems: 'center', height: '1.25rem'}}>
                <input
                  id="terms"
                  name="terms"
                  type="checkbox"
                  required
                  style={{
                    height: '1rem',
                    width: '1rem',
                    accentColor: '#3b82f6',
                    borderRadius: '0.25rem'
                  }}
                />
              </div>
              <div style={{marginLeft: '0.75rem', fontSize: '0.875rem'}}>
                <label htmlFor="terms" className="text-gray-600">
                  I agree to the{' '}
                  <Link 
                    to="/terms" 
                    className="font-medium text-blue-600"
                    style={{textDecoration: 'none'}}
                  >
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link 
                    to="/privacy" 
                    className="font-medium text-blue-600"
                    style={{textDecoration: 'none'}}
                  >
                    Privacy Policy
                  </Link>
                </label>
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="md"
              loading={isLoading}
              disabled={isLoading}
              className="w-full"
              style={{background: 'linear-gradient(to right, #9333ea, #3b82f6)'}}
            >
              {isLoading ? 'Creating account...' : 'Create account'}
            </Button>
          </form>

          {/* Divider */}
          <div style={{marginTop: '1.5rem'}}>
            <div style={{position: 'relative'}}>
              <div style={{
                position: 'absolute',
                top: '50%',
                left: 0,
                right: 0,
                height: '1px',
                backgroundColor: '#d1d5db'
              }}></div>
              <div style={{position: 'relative', textAlign: 'center'}}>
                <span style={{
                  padding: '0 0.5rem',
                  backgroundColor: 'white',
                  color: '#6b7280',
                  fontSize: '0.875rem'
                }}>Or sign up with</span>
              </div>
            </div>

            {/* Social Signup */}
            <div style={{marginTop: '1.5rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem'}}>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => {/* Handle Google signup */}}
              >
                <svg style={{width: '1.25rem', height: '1.25rem', marginRight: '0.5rem'}} viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Google
              </Button>

              <Button
                variant="outline"
                className="w-full"
                onClick={() => {/* Handle GitHub signup */}}
              >
                <svg style={{width: '1.25rem', height: '1.25rem', marginRight: '0.5rem'}} fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                GitHub
              </Button>
            </div>
          </div>

          {/* Sign in link */}
          <div style={{marginTop: '1.5rem', textAlign: 'center'}}>
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link
                to="/login"
                className="font-medium text-blue-600"
                style={{textDecoration: 'none'}}
              >
                Sign in here
              </Link>
            </p>
          </div>
        </div>

        {/* Security note */}
        <div style={{textAlign: 'center'}}>
          <p style={{fontSize: '0.75rem', color: '#6b7280'}}>
            By creating an account, your data is protected with enterprise-grade security
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupForm;
