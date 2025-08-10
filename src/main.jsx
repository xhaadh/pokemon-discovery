import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import './index.css';
import App from './App.jsx';
import { Toaster } from 'react-hot-toast';

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')).render(
  <QueryClientProvider client={queryClient}>
    <App />
    <Toaster
      position="top-right"
      toastOptions={{
        success: {
          style: {
            background: '#4ade80',
            color: '#fff',
          },
        },
        error: {
          style: {
            background: '#f87171',
            color: '#fff',
          },
        },
      }}
    />
  </QueryClientProvider>
);