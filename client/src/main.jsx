import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router } from 'react-router-dom';
import Auth from './components/Auth/Auth'
import { LoadingProvider } from './context/LoadingContext';
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Router>
      <LoadingProvider>
        <Auth />
      </LoadingProvider>
    </Router>
  </StrictMode>
);
