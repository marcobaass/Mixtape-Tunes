const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
const redirectUri = import.meta.env.VITE_REDIRECT_URI;

let accessToken;
let expiresIn;

const Spotify = {
  getAccessToken() {
    if (accessToken) {
      return accessToken;
    }

    const tokenMatch = window.location.href.match(/access_token=([^&]*)/);
    const expiresInMatch = window.location.href.match(/expires_in=([^&]*)/);

    if (tokenMatch && expiresInMatch) {
      accessToken = tokenMatch[1];
      expiresIn = Number(expiresInMatch[1]);

      window.setTimeout(() => (accessToken = ''), expiresIn * 1000);
      window.history.pushState('Access Token', null, '/');

      return accessToken;
    } else {
      const accessUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectUri}`;
      window.location = accessUrl;
    }
  },

  logout() {
    // Open a popup window to the Spotify logout URL
    const logoutUrl = 'https://www.spotify.com/logout/';
    const popup = window.open(logoutUrl, 'Spotify Logout', 'width=700,height=500,top=40,left=40');

    // Wait for a short period to ensure the popup has enough time to complete the logout
    setTimeout(() => {
      // Clear local and session storage
      window.localStorage.removeItem('spotify_access_token');
      window.sessionStorage.removeItem('spotify_access_token');

      // Redirect to home or login page
      window.location.href = '/';

      // Close the popup if it is still open
      if (popup) {
        popup.close();
      }
    }, 2000); // Adjust the delay if necessary
  },

  search(term, offset = 0, limit = 50) {
    const accessToken = Spotify.getAccessToken();
    const endpoint = `https://api.spotify.com/v1/search?type=track&q=${encodeURIComponent(term)}&limit=${limit}&offset=${offset}`;

    return fetch(endpoint, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    .then((response) => response.json())
    .then((jsonResponse) => {
      if (!jsonResponse.tracks) {
        return { tracks: [], total: 0 };
      }

      const tracks = jsonResponse.tracks.items.map((track) => ({
        id: track.id,
        name: track.name,
        artist: track.artists[0].name,
        album: track.album.name,
        uri: track.uri,
        image: track.album.images[0]?.url,
        preview_url: track.preview_url,
      }));

      return {
        tracks,
        total: jsonResponse.tracks.total,
        nextOffset: offset + limit,
      };
    });
  },

  async getSuggestions(query) {
    if (!query) {
      return [];
    }

    const accessToken = Spotify.getAccessToken();
    const endpoint = `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track,artist&limit=5`;

    try {
      const response = await fetch(endpoint, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        }
      });

      const data = await response.json();
      const trackSuggestions = data.tracks?.items.map(track => track.name) || [];
      const artistSuggestions = data.artists?.items.map(artist => artist.name) || [];

      return [...trackSuggestions, ...artistSuggestions]

    } catch (error) {
      console.error('Error fetching suggestions', error);
      return [];
    }
  },

  async getUserSubscriptionLevel() {
    const accessToken = Spotify.getAccessToken();
    const response = await fetch('https://api.spotify.com/v1/me', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const userData = await response.json();
    return userData.product;  // 'premium' or 'free'
  },

  async savePlaylist(playlistName, uriOfPlaylistTracks) {
    if (!playlistName || !uriOfPlaylistTracks.length) {
      return;
    }

    const accessToken = Spotify.getAccessToken();
    const headers = {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    };

    try {
      const response = await fetch('https://api.spotify.com/v1/me', { headers });
      const userData = await response.json();
      const userId = userData.id;

      const createPlaylistResponse = await fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          name: playlistName,
          description: 'New playlist created with Walkify',
          public: true,
        }),
      });

      const playlistData = await createPlaylistResponse.json();
      const playlistId = playlistData.id;

      await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          uris: uriOfPlaylistTracks,
        }),
      });

      alert('Playlist saved successfully!');
    } catch (error) {
      console.error('Error saving playlist:', error);
    }
  },

  initializePlayer() {
    return new Promise((resolve, reject) => {
      window.onSpotifyWebPlaybackSDKReady = () => {
        const token = Spotify.getAccessToken();
        const player = new window.Spotify.Player({
          name: 'Your App Name',
          getOAuthToken: cb => { cb(token); }
        });

        // Error handling
        player.addListener('initialization_error', ({ message }) => { console.error(message); });
        player.addListener('authentication_error', ({ message }) => { console.error(message); });
        player.addListener('account_error', ({ message }) => { console.error(message); });
        player.addListener('playback_error', ({ message }) => { console.error(message); });

        // Playback status updates
        player.addListener('player_state_changed', state => {
          console.log(state);
        });

        // Ready
        player.addListener('ready', ({ device_id }) => {
          console.log('Ready to play on device', device_id);
          resolve({ player, device_id });
        });

        // Not Ready
        player.addListener('not_ready', ({ device_id }) => {
          console.log('Device ID has gone offline', device_id);
          reject(new Error('Spotify Player not ready'));
        });

        // Connect to the player!
        player.connect();
      };

      const loadSpotifySDK = () => {
        const script = document.createElement('script');
        script.src = 'https://sdk.scdn.co/spotify-player.js';
        script.async = true;
        document.body.appendChild(script);
      };

      loadSpotifySDK();
    });
  },

  async playTrack(uri) {
    try {
      // Initialize player and get device_id
      const { device_id } = await Spotify.initializePlayer();

      // Check if access token is available
      const token = Spotify.getAccessToken();
      if (!token) {
        throw new Error('Access token is not available');
      }

      // Make the API request to play the track
      await fetch(`https://api.spotify.com/v1/me/player/play?device_id=${device_id}`, {
        method: 'PUT',
        body: JSON.stringify({ uris: [uri] }),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      console.log('Playback started');
    } catch (error) {
      console.error('Error playing track:', error);
    }
  },

  async getRecommendations(playlistTracks) {
    if (!playlistTracks || playlistTracks.length === 0) {
      return [];
    }

    const randomTracks = [];

    const trackCount = Math.min(playlistTracks.length, 5);

    while (randomTracks.length < trackCount) {
        const rndIndex = Math.floor(Math.random() * playlistTracks.length);
        const selectedTrack = playlistTracks[rndIndex];

        if (!randomTracks.includes(selectedTrack)) {
            randomTracks.push(selectedTrack);
        }
    }

    const seedTracks = randomTracks.map(track => track.id).join(',');

    const accessToken = Spotify.getAccessToken();
    const endpoint = `https://api.spotify.com/v1/recommendations?seed_tracks=${seedTracks}`;
    console.log("URL: " + endpoint);

    try {
      const response = await fetch(endpoint, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        }
      });

      const data = await response.json();
      console.log("Data: " + data);


      return data.tracks.map(track => ({
        id: track.id,
        name: track.name,
        artist: track.artists[0].name,
        album: track.album.name,
        uri: track.uri,
        image: track.album.images[0]?.url,
        preview_url: track.preview_url,
      }));

    } catch (error) {
      console.error('Error fetching recommendations', error);
      return [];
    }
  }
};

export default Spotify;
