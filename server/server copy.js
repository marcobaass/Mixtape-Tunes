import 'dotenv/config';
import express from 'express';
import SpotifyWebApi from 'spotify-web-api-node';
import cors from 'cors';
import bodyParser from 'body-parser';
import session from 'express-session';

const app = express();
const port = 3001;

const corsOptions = {
  origin: 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));
app.use(bodyParser.json());

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: false,
    httpOnly: true,
    sameSite: 'None',
  }
}));

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  redirectUri: process.env.REDIRECT_URI,
});

// Unprotected route for login
app.post('/login', async (req, res) => {
  console.log('Received authorization code:', code);
  const code = req.body.code;
  try {
    const data = await spotifyApi.authorizationCodeGrant(code);
    console.log('Token data:', data.body);
    req.session.accessToken = data.body.access_token;
    req.session.refreshToken = data.body.refresh_token;
    req.session.tokenExpirationTimestampMs = Date.now() + (data.body.expires_in * 1000);

    res.json({
      accessToken: req.session.accessToken,
      refreshToken: req.session.refreshToken,
      expiresIn: data.body.expires_in,
    });
  } catch (err) {
    console.error('Spotify authorization error:', err);
    res.status(401).json({ error: 'Unauthorized. Please log in again.' });
  }
});

// Middleware to check authentication for protected routes
const authenticate = async (req, res, next) => {
  if (!req.session.accessToken || req.session.tokenExpirationTimestampMs <= Date.now()) {
    if (req.session.refreshToken) {
      spotifyApi.setRefreshToken(req.session.refreshToken);
      try {
        const data = await spotifyApi.refreshAccessToken();
        req.session.accessToken = data.body['access_token'];
        req.session.tokenExpirationTimestampMs = Date.now() + (data.body['expires_in'] * 1000);
        spotifyApi.setAccessToken(req.session.accessToken);
        next();
      } catch (err) {
        console.error('Could not refresh access token', err);
        return res.status(401).json({ error: 'Unauthorized. Please log in again.' });
      }
    } else {
      return res.status(401).json({ error: 'Unauthorized. Please log in again.' });
    }
  } else {
    spotifyApi.setAccessToken(req.session.accessToken);
    next();
  }
};

// Protected routes
app.post('/refresh', authenticate, async (req, res) => {
  const refreshToken = req.body.refreshToken;

  try {
    spotifyApi.setRefreshToken(refreshToken);
    const data = await spotifyApi.refreshAccessToken();

    req.session.accessToken = data.body.access_token;
    req.session.tokenExpirationTimestampMs = Date.now() + (data.body.expires_in * 1000);

    res.json({
      accessToken: data.body.access_token,
      expiresIn: data.body.expires_in,
    });
  } catch (err) {
    console.error('Error in /refresh', err);
    res.status(400).json({ error: 'Failed to refresh token. Please log in again.' });
  }
});

app.get('/api/userSubscriptionLevel', authenticate, async (req, res) => {
  try {
    const user = await spotifyApi.getMe();
    const product = user.body.product || 'free';
    res.json({ product });
  } catch (error) {
    console.error('Error in /api/userSubscriptionLevel:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/api/getAccessToken', authenticate, async (req, res) => {
  try {
    const accessToken = spotifyApi.getAccessToken();
    res.json({ accessToken });
  } catch (error) {
    console.error('Error in /api/getAccessToken', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.use(express.static('public')); // If serving static files

app.use((req, res, next) => {
  res.setHeader("Content-Security-Policy", "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:;");
  next();
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
