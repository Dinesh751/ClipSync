import React from 'react';

export const BrowserRouter = ({ children }) => React.createElement('div', { 'data-testid': 'router' }, children);
export const Routes = ({ children }) => React.createElement('div', { 'data-testid': 'routes' }, children);
export const Route = ({ children }) => React.createElement('div', { 'data-testid': 'route' }, children);
export const useNavigate = () => jest.fn();
export const Link = ({ children, to, ...props }) => React.createElement('a', { href: to, ...props }, children);
export const Navigate = ({ to }) => React.createElement('div', { 'data-testid': 'navigate', 'data-to': to });

export default {
  BrowserRouter,
  Routes,
  Route,
  useNavigate,
  Link,
  Navigate
};
