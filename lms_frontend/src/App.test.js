import { render, screen } from '@testing-library/react';
import App from './App';
import { AuthProvider } from './context/AuthContext';
import { BrowserRouter } from 'react-router-dom';

test('renders sign in link without AuthContext error', () => {
  render(
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  );
  // Assert that "Sign in" link in Layout is present, indicating Layout rendered under provider
  const signIn = screen.getAllByText(/sign in/i)[0];
  expect(signIn).toBeInTheDocument();
});
