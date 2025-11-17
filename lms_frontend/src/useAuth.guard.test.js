import React from 'react';
import { render } from '@testing-library/react';
import Dashboard from './pages/Dashboard';
import Sidebar from './components/Sidebar';
import { AuthProvider } from './context/AuthContext';

describe('useAuth guard clarity', () => {
  it('throws a clear error when a consumer is rendered without AuthProvider', () => {
    const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => render(<Sidebar />)).toThrow(/useAuth must be used within <AuthProvider \/>/i);
    expect(() => render(<Dashboard />)).toThrow(/useAuth must be used within <AuthProvider \/>/i);
    consoleError.mockRestore();
  });

  it('renders fine when wrapped with AuthProvider', () => {
    const { unmount } = render(
      <AuthProvider>
        <Sidebar />
      </AuthProvider>
    );
    unmount();
  });
});
