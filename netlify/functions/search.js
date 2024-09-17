import 'dotenv/config';
import SpotifyWebApi from 'spotify-web-api-node';

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  redirectUri: process.env.SPOTIFY_REDIRECT_URI,
});

export const handler = async (event) => {
  const { term, offset = 0, limit = 20 } = event.queryStringParameters;
  const token = event.headers.authorization.split(' ')[1];

  spotifyApi.setAccessToken(token);

  try {
    const response = await spotifyApi.searchTracks(term, { offset, limit });
    return {
      statusCode: 200,
      body: JSON.stringify(response.body),
    };
  } catch (error) {
    console.error('Error searching Spotify tracks:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message || 'Failed to search tracks' }),
    };
  }
};
