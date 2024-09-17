import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';

export default function Callback({ setAccessToken }) {
  const code = new URLSearchParams(window.location.search).get('code');
  const [isLoading, setLoading] = useState(true);
  const { accessToken, loginRef } = useAuth(code, setLoading);
  const navigate = useNavigate();

  // When the accessToken is fetched, store it and redirect to the homepage
  useEffect(() => {
    if (accessToken) {
      localStorage.setItem('spotify_access_token', accessToken);
      setAccessToken(accessToken);
      navigate('/');  // Redirect to home after login
    }
  }, [accessToken, navigate, setAccessToken]);

  if (isLoading) {
    return (
      <div className="flex flex-1 h-screen justify-center items-center">
        <LoadingSpinner />
      </div>
    );
  }

  return <div>Logging you in...</div>;
}
