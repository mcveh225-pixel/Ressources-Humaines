import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import { ErrorBoundary } from './components/ErrorBoundary';
import './index.css';

// Global error handler to help diagnose issues
window.onerror = function(message, source, lineno, colno, error) {
  console.error("GLOBAL ERROR CAPTURED:", message, "at", source, ":", lineno);
  return false;
};

window.onunhandledrejection = function(event) {
  console.error("UNHANDLED REJECTION:", event.reason);
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
);
