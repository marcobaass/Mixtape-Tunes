import 'dotenv/config';
import SpotifyWebApi from 'spotify-web-api-node';

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  redirectUri: process.env.SPOTIFY_REDIRECT_URI,
});

export const handler = async (event) => {
  console.log('refresh function gets called ...');

  const { refreshToken } = JSON.parse(event.body);

  spotifyApi.setRefreshToken(refreshToken);

  try {
    const data = await spotifyApi.refreshAccessToken();
    return {
      statusCode: 200,
      body: JSON.stringify({
        accessToken: data.body.access_token,
        expiresIn: data.body.expires_in,
      }),
    };
  } catch (err) {
    console.error(err);
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Failed to refresh access token' }),
    };
  }
};
