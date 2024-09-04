import { useState, useEffect } from 'react'
import axios from "axios";

const API_URL = 'http://localhost:3001';

export default function useAuth(code, setLoading) {
  const [accessToken, setAccessToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);
  const [expiresIn, setExpiresIn] = useState(null);

  useEffect(() => {
    console.log('starting auth hook');
    console.log(`${API_URL}/login`);
    console.log('Authorization code:', code);

    if (!code) {
      console.log('No authorization code found, redirecting to login...');
      setLoading(false);
      // window.location.href = '/login'; // or any route that serves your login page
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        console.log('Sending POST request to /login with code:', code);

        const response = await axios.post(`${API_URL}/login`, {
          code,
        });
          console.log('Login response:', response.data);
          setAccessToken(response.data.accessToken);
          setRefreshToken(response.data.refreshToken);
          setExpiresIn(response.data.expiresIn);

          console.log('Access Token:', response.data.accessToken);
          console.log('Refresh Token:', response.data.refreshToken);
          console.log('Expires In:', response.data.expiresIn);

          window.history.replaceState({}, null, '/');
      } catch (error) {
          console.log('Error during Spotify login:', error);
      } finally {
          setLoading(false);
      }
    };

    if (code) {
      fetchData();
    }
  }, [code, setLoading]);

  useEffect(() => {
    if (!refreshToken ||!expiresIn) return;

    // Log before setting up the refresh interval
    console.log('Setting up refresh token interval');
    console.log('Refresh Token:', refreshToken);
    console.log('Expires In:', expiresIn);

    const interval = setInterval(() => {

      axios.post(`${API_URL}/refresh`, {
        refreshToken,
      }).then(res => {
        console.log('Refresh response', res.data);
        setAccessToken(res.data.accessToken);
        setExpiresIn(res.data.expiresIn);

        // Log the new access token and expiry time after refresh
        console.log('New Access Token:', res.data.accessToken);
        console.log('New Expires In:', res.data.expiresIn);
      }).catch(err => {
        console.error('Error refreshing token', err);
        window.location = '/';
      })
    }, (expiresIn - 60) * 1000)

    return () => clearInterval(interval);
  }, [refreshToken, expiresIn])


  return accessToken;
}
