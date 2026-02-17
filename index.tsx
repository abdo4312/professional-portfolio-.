import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const originalFetch = window.fetch;
window.fetch = (input: any, init?: any) => {
  try {
    const url = typeof input === 'string' ? input : (input?.url || input?.href || '');
    if (typeof url === 'string' && url.startsWith('http://localhost:5000')) {
      return Promise.reject(new Error('Blocked localhost request'));
    }
  } catch {}
  return originalFetch(input as any, init as any);
};

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
    <ToastContainer
      position="top-right"
      autoClose={3000}
      hideProgressBar={false}
      newestOnTop
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="light"
    />
  </React.StrictMode>
);
