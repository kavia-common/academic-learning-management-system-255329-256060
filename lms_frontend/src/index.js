import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { NoAuthProvider } from './context/AuthContext';
import { BrowserRouter } from 'react-router-dom';

const root = ReactDOM.createRoot(document.getElementById('root'));
/**
 * TEMPORARY: Auth disabled — use NoAuthProvider to provide safe defaults.
 * TODO(auth): Replace NoAuthProvider with AuthProvider when authentication is re-enabled.
 */
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <NoAuthProvider>
        <App />
      </NoAuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
