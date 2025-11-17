import React from 'react';
import { render } from '@testing-library/react';
import Dashboard from './pages/Dashboard';
import Sidebar from './components/Sidebar';
import { NoAuthProvider } from './context/AuthContext';

describe('useAuth temporary no-op behavior', () => {
  it('does not throw when rendering consumers without explicit provider (auth disabled)', () => {
    // Should not throw due to safe default
    render(<Sidebar />);
    render(<Dashboard />);
  });

  it('renders fine when wrapped with NoAuthProvider', () => {
    const { unmount } = render(
      <NoAuthProvider>
        <Sidebar />
      </NoAuthProvider>
    );
    unmount();
  });
});
