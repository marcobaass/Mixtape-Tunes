import React, { useState, useEffect } from 'react';
import Login from '../Login/Login';
import App from '../App/App';
import useAuth from '../../hooks/useAuth';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';

export default function Auth() {
  const code = new URLSearchParams(window.location.search).get('code');
  const [isLoading, setLoading] = useState(!!code);
  const [accessToken, setAccessToken] = useState(localStorage.getItem('spotify_access_token'));

  const fetchedAccessToken = useAuth(code, setLoading);

  useEffect(() => {
    if (fetchedAccessToken && !accessToken) {
      setAccessToken(fetchedAccessToken);
    }
  }, [fetchedAccessToken, accessToken]);

  // If there's no code and no accessToken, show the login page
  if (!code && !accessToken) {
    return <Login />;
  }

  // Show the loading spinner while loading
  if (accessToken) {
    return <App accessToken={accessToken} />;
  }

  if (isLoading) {
    return (
      <div className="flex flex-1 h-screen justify-center items-center">
        <LoadingSpinner />
      </div>
    );
  }

  // If we have an access token, show the app

  return <Login />; // Default fallback in case of unexpected issues
}
