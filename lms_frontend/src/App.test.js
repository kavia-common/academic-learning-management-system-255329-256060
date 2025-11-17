import { render, screen } from '@testing-library/react';
import App from './App';
import { NoAuthProvider } from './context/AuthContext';
import { BrowserRouter } from 'react-router-dom';

test('renders sign in link without AuthContext error (auth disabled)', () => {
  render(
    <BrowserRouter>
      <NoAuthProvider>
        <App />
      </NoAuthProvider>
    </BrowserRouter>
  );
  const signIn = screen.getAllByText(/sign in/i)[0];
  expect(signIn).toBeInTheDocument();
});
