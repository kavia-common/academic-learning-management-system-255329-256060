import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { AuthProvider } from './context/AuthContext';
import { BrowserRouter } from 'react-router-dom';

const root = ReactDOM.createRoot(document.getElementById('root'));
/**
 * Render tree order:
 * <BrowserRouter>
 *   <AuthProvider>
 *     <App />
 *   </AuthProvider>
 * </BrowserRouter>
 * This ensures any useAuth consumers (including Layout within App) are under AuthProvider.
 */
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
