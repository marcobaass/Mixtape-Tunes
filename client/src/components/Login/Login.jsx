import React from 'react'
const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
const redirectUri = import.meta.env.VITE_REDIRECT_URI;


const AUTH_URL = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=code&redirect_uri=${redirectUri}&scope=streaming%20user-read-email%20user-read-private%20user-library-read%20user-library-read%20user-library-modify%20user-read-playback-state%20user-modify-playback-state&prompt=login`;

export default function Login() {
  return (
    <div className='flex flex-1 h-screen justify-center items-center '>
        <button className="text-white bg-neon-pink rounded-2xl px-3 py-0.5 h-min mt-2 hover:bg-neon-purple transition-colors duration-300 text-sm font-bold">
          <a href={AUTH_URL} >Login With Spotify</a>
        </button>
    </div>
  )
}
