import React from 'react'
import Login from '../Login/Login'
import App from '../App/App';
import useAuth from '../../hooks/useAuth';

export default function Auth() {
  const code = new URLSearchParams(window.location.search).get('code');
  const accessToken = useAuth(code);

  return accessToken ? <App accessToken={accessToken} /> : <Login />;
}
