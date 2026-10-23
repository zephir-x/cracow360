import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import { I18nProvider } from './i18n/I18nContext';

// Mount root React 19 application in StrictMode wrapped with i18n localization provider
const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Root DOM element #root not found.');
}

createRoot(rootElement).render(
  <StrictMode>
    <I18nProvider>
      <App />
    </I18nProvider>
  </StrictMode>
);
