import 'dotenv/config';
import express from 'express';
import SpotifyWebApi from 'spotify-web-api-node';
import cors from 'cors';
import bodyParser from 'body-parser';

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.post('/refresh', (req, res) => {
  const refreshToken = req.body.refreshToken;
  console.log('Hi');
  const spotifyApi = new SpotifyWebApi({
    // clientId: 'd95043c9d49a45989c686b197cdd3e2a',
    // clientSecret: 'a7796fc3365e424e88240240b71a413c',
    // redirectUri: 'http://localhost:5173/callback',
    clientId: process.env.SPOTIFY_CLIENT_ID,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
    redirectUri: process.env.SPOTIFY_REDIRECT_URI,
    refreshToken
    })

    spotifyApi.refreshAccessToken()
    .then((data) => {
        res.json({
          accessToken: data.body.access_token,
          expiresIn: data.body.expires_in,
        })
      }).catch(err => {
        console.log(err);
        res.sendStatus(400)
      })
});

app.post('/login', (req, res) => {
  console.log('Login request received from useAuth hook');
  console.log('Client ID:', process.env.SPOTIFY_CLIENT_ID);

  const code = req.body.code;
  const spotifyApi = new SpotifyWebApi({
    // clientId: 'd95043c9d49a45989c686b197cdd3e2a',
    // clientSecret: 'a7796fc3365e424e88240240b71a413c',
    // redirectUri: 'http://localhost:5173/callback'
    clientId: process.env.SPOTIFY_CLIENT_ID,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
    redirectUri: process.env.SPOTIFY_REDIRECT_URI
  })

  spotifyApi.authorizationCodeGrant(code).then(data => {
    res.json({
      accessToken: data.body.access_token,
      refreshToken: data.body.refresh_token,
      expires_in: data.body.expires_in
    })
  }).catch((err) => {
    console.log(err);
    res.sendStatus(400)
  });
});

app.get('/api/userSubscriptionLevel', async (req, res) => {
  console.log('Route: /api/userSubscriptionLevel arrived');
  console.log('Authorization Header:', req.headers.authorization);

  try {
    const token = req.headers.authorization.split(' ')[1];
    spotifyApi.setAccessToken(token);
    const response = await spotifyApi.getMe();
    const product = response.body.product;
    res.json({ product });
  } catch (error) {
    console.error('Error fetching user subscription level:', error);
    res.status(500).json({ error: 'Failed to fetch user subscription level' });
  }
});

app.listen(3001)
