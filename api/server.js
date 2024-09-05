import 'dotenv/config';
import express from 'express';
import SpotifyWebApi from 'spotify-web-api-node';
import cors from 'cors';
import bodyParser from 'body-parser';

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Create a SpotifyWebApi instance and configure it with your client credentials
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  redirectUri: process.env.SPOTIFY_REDIRECT_URI,
});

app.post('/refresh', (req, res) => {
  const refreshToken = req.body.refreshToken;

  spotifyApi.setRefreshToken(refreshToken); // Set the refresh token

  spotifyApi.refreshAccessToken()
    .then((data) => {
      res.json({
        accessToken: data.body.access_token,
        expiresIn: data.body.expires_in,
      });
    })
    .catch(err => {
      console.log(err);
      res.sendStatus(400);
    });
});

app.post('/login', (req, res) => {
  const code = req.body.code;

  spotifyApi.authorizationCodeGrant(code)
    .then(data => {
      res.json({
        accessToken: data.body.access_token,
        refreshToken: data.body.refresh_token,
        expiresIn: data.body.expires_in,
      });
    })
    .catch((err) => {
      console.log(err);
      res.sendStatus(400);
    });
});

app.get('/api/userSubscriptionLevel', async (req, res) => {
  const token = req.headers.authorization.split(' ')[1];

  spotifyApi.setAccessToken(token);

  try {
    const response = await spotifyApi.getMe();
    const product = response.body.product;
    res.json({ product });
  } catch (error) {
    console.error('Error fetching user subscription level:', error);
    res.status(500).json({ error: 'Failed to fetch user subscription level' });
  }
});

app.get('/api/search', async (req, res) => {
  const { term, offset = 0, limit = 20 } = req.query;
  const token = req.headers.authorization.split(' ')[1];

  spotifyApi.setAccessToken(token);

  try {
    const response = await spotifyApi.searchTracks(term, { offset, limit });
    res.json(response.body);
  } catch (error) {
    console.error('Error searching Spotify tracks:', error);  // Log the detailed error
    res.status(500).json({ error: error.message || 'Failed to search tracks' });
  }
});

app.listen(3001, () => {
  console.log('Server is running on port 3001');
});
