import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Auth from './components/Auth/Auth'
import { LoadingProvider } from './context/LoadingContext';
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <LoadingProvider>
      <Auth />
    </LoadingProvider>
  </StrictMode>
);
