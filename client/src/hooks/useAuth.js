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

    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.post(`${API_URL}/login`, {
          code,
        });
          setAccessToken(response.data.accessToken);
          setRefreshToken(response.data.refreshToken);
          setExpiresIn(response.data.expiresIn);
          window.history.pushState({}, null, '/');
      } catch (error) {
          console.log('Error during Spotify login:', error);
      } finally {
          setLoading(false);
      }
    };

    fetchData();
  }, [code, setLoading]);

  useEffect(() => {
    if (!refreshToken ||!expiresIn) return;
    const interval = setInterval(() => {

      axios.post(`${API_URL}/refresh`, {
        refreshToken,
      }).then(res => {
        setAccessToken(res.data.accessToken);
        setExpiresIn(res.data.expiresIn);
      }).catch(() => {
        window.location = '/';
      })
    }, (expiresIn - 60) * 1000)

    return () => clearInterval(interval);
  }, [refreshToken, expiresIn])


  return accessToken;
}
