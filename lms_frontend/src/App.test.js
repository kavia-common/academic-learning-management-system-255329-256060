import { render, screen } from '@testing-library/react';
import App from './App';

test('renders sign in link', () => {
  render(<App />);
  const signIn = screen.getAllByText(/sign in/i)[0];
  expect(signIn).toBeInTheDocument();
});
