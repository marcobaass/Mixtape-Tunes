import React from 'react'
const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
const redirectUri = import.meta.env.VITE_REDIRECT_URI;


const AUTH_URL = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=code&redirect_uri=${redirectUri}&scope=streaming%20user-read-email%20user-read-private%20user-library-read%20user-library-read%20user-library-modify%20user-read-playback-state%20user-modify-playback-state`;
console.log(AUTH_URL);


export default function Login() {
  return (
    <button>
      <a href={AUTH_URL}>Login with Spotify</a>
    </button>
  )
}
