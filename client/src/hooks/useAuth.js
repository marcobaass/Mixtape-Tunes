import { useState, useEffect } from 'react'
import axios from "axios";

const API_URL = 'http://localhost:3001';

export default function useAuth(code) {
  const [accessToken, setAccessToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);
  const [expiresIn, setExpiresIn] = useState(null);

  useEffect(() => {
    console.log('starting auth hook');
    console.log(`${API_URL}/login`);

    axios.post(`${API_URL}/login`, {
      code,
    }).then(res => {
      setAccessToken(res.data.accessToken);
      setRefreshToken(res.data.refreshToken);
      setExpiresIn(res.data.expiresIn);
      window.history.pushState({}, null, '/');
    }).catch(() => {
      // window.location = '/';
    })
  }, [code]);

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
