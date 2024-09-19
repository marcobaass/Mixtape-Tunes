import 'dotenv/config';
import SpotifyWebApi from 'spotify-web-api-node';

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  redirectUri: process.env.SPOTIFY_REDIRECT_URI,
});

export const handler = async (event) => {

  const { code } = JSON.parse(event.body);

  try {
    const data = await spotifyApi.authorizationCodeGrant(code);
    return {
      statusCode: 200,
      body: JSON.stringify({
        accessToken: data.body.access_token,
        refreshToken: data.body.refresh_token,
        expiresIn: data.body.expires_in,
      }),
    };
  } catch (err) {
    console.error(err);
    console.error('Spotify authorization error:', err); // Log error for debugging
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Failed to authenticate user' }),
    };
  }
};
