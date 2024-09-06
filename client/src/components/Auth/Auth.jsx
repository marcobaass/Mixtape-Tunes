import React, { useState, useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';  // Import Route and Routes
import Login from '../Login/Login';
import App from '../App/App';
import useAuth from '../../hooks/useAuth';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';

export default function Auth() {
  const code = new URLSearchParams(window.location.search).get('code');
  const [isLoading, setLoading] = useState(!!code);
  const [accessToken, setAccessToken] = useState(localStorage.getItem('spotify_access_token'));

  const { accessToken: fetchedAccessToken, loginRef } = useAuth(code, setLoading);  // Extract loginRef from useAuth

  useEffect(() => {
    if (fetchedAccessToken && !accessToken) {
      setAccessToken(fetchedAccessToken);
    }
  }, [fetchedAccessToken, accessToken]);

  if (isLoading) {
    return (
      <div className="flex flex-1 h-screen justify-center items-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/" element={accessToken ? <App accessToken={accessToken} loginRef={loginRef} /> : <Login />} />
      <Route path="/callback" element={<CallbackHandler />} />  {/* Define a callback route */}
    </Routes>
  );
}

function CallbackHandler() {
  const code = new URLSearchParams(window.location.search).get('code');
  const { accessToken } = useAuth(code);  // Reuse the useAuth hook to exchange code for access token

  useEffect(() => {
    if (accessToken) {
      window.location.href = '/';  // Redirect back to the main app
    }
  }, [accessToken]);

  return <div>Logging you in...</div>;  // You can add a spinner or loading message here
}
