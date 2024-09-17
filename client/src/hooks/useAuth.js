import { useState, useEffect, useRef } from 'react';
import axios from 'axios';

// const API_URL = 'http://localhost:3001';
// const API_URL = import.meta.env.VITE_API_URL
const API_URL = '/.netlify/functions';

export default function useAuth(code, setLoading) {
  const [accessToken, setAccessToken] = useState(localStorage.getItem('accessToken') || null);
  const [refreshToken, setRefreshToken] = useState(localStorage.getItem('refreshToken') || null);
  const [expiresIn, setExpiresIn] = useState(localStorage.getItem('expiresIn') || null);
  const loginRef = useRef(false);

  useEffect(() => {
    // Only attempt login when code is present (initial login)
    console.log('Initial login code: ', code);
    if (code && !accessToken && !loginRef.current) {
      console.log('Attempting login with code...');
      loginRef.current = true;
      const login = async () => {
        console.log('sending Login Request to server');

        try {
          setLoading(true);
          console.log('Authorization code:', code);
          const response = await axios.post(`${API_URL}/login`, { code });
          console.log('Login response:', response.data);
          const { accessToken, refreshToken, expiresIn } = response.data;
          console.log('Access token:', accessToken);

          setAccessToken(accessToken);
          setRefreshToken(refreshToken);
          setExpiresIn(expiresIn);

          // Store tokens in localStorage
          localStorage.setItem('accessToken', accessToken);
          localStorage.setItem('refreshToken', refreshToken);
          localStorage.setItem('expiresIn', expiresIn);

          window.history.replaceState({}, null, '/');  // Remove the code from the URL
        } catch (error) {
          console.error('Error during login:', error);
        } finally {
          setLoading(false);
        }
      };
      login();
    }
  }, [code, accessToken, setLoading]);

  // Refresh token logic (this runs independently of the code logic)
  useEffect(() => {
    if (!refreshToken || !expiresIn) return;

    const refreshAccessToken = async () => {
      try {
        const response = await axios.post(`${API_URL}/refresh`, { refreshToken });
        const { accessToken, expiresIn } = response.data;

        setAccessToken(accessToken);
        setExpiresIn(expiresIn);

        // Update localStorage
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('expiresIn', expiresIn);

        console.log('Access token refreshed');
      } catch (error) {
        console.error('Error refreshing token:', error);
        window.location = '/';  // Redirect to login if refresh fails
      }
    };

    // Calculate the expiration time (in milliseconds)
    const expirationTime = Date.now() + expiresIn * 1000;  // Calculate when the token expires

    // Set up an interval to check token expiration every 60 seconds
    const interval = setInterval(() => {
      const timeRemaining = expirationTime - Date.now(); // Calculate remaining time

      if (timeRemaining <= 60000) {  // If less than 60 seconds before expiration, refresh token
        refreshAccessToken();
      }
    }, 60000);  // Check every minute

    return () => clearInterval(interval);  // Cleanup on component unmount
  }, [refreshToken, expiresIn]);

  return { accessToken, loginRef };
}
