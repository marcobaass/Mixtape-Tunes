import 'dotenv/config';
import SpotifyWebApi from 'spotify-web-api-node';

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  redirectUri: process.env.SPOTIFY_REDIRECT_URI,
});

export const handler = async (event) => {
  const token = event.headers.authorization.split(' ')[1];

  spotifyApi.setAccessToken(token);

  try {
    const response = await spotifyApi.getMe();
    return {
      statusCode: 200,
      body: JSON.stringify({ product: response.body.product }),
    };
  } catch (error) {
    console.error('Error fetching user subscription level:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to fetch user subscription level' }),
    };
  }
};
