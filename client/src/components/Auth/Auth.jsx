import React, { useState } from 'react';
import Login from '../Login/Login'
import App from '../App/App';
import useAuth from '../../hooks/useAuth';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';

export default function Auth() {
  const [isLoading, setLoading] = useState(true);
  const code = new URLSearchParams(window.location.search).get('code');
  const accessToken = useAuth(code, setLoading);

  if (isLoading) {
    return (
      <div className="flex flex-1 h-screen justify-center items-center">
        <LoadingSpinner /> {/* Show the loading spinner */}
      </div>
    );
  }

  return accessToken ? <App accessToken={accessToken} /> : <Login />;
}
