import { render, screen } from '@testing-library/react';
import App from './App';
import { AuthProvider } from './context/AuthContext';
import { BrowserRouter } from 'react-router-dom';

test('renders sign in link without AuthContext error', () => {
  render(
    <AuthProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </AuthProvider>
  );
  const signIn = screen.getAllByText(/sign in/i)[0];
  expect(signIn).toBeInTheDocument();
});
