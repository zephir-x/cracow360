import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';

// Mount root React 19 application in StrictMode
const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Root DOM element #root not found.');
}

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>
);
