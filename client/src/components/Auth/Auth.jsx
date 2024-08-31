import React from 'react'
import Login from '../Login/Login'
import App from '../App/App';

const code = new URLSearchParams(window.location.search).get('code');

export default function Auth() {
  return code ? <App code={code} /> : <Login />
}
