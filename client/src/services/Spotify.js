const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

let accessToken;

const Spotify = {
  async initializePlayer() {
    return new Promise((resolve, reject) => {
      window.onSpotifyWebPlaybackSDKReady = () => {
        this.getAccessToken()
          .then(token => {
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
          })
          .catch(error => {
            console.error('Error getting access token:', error);
            reject(error);
          });
      };

      const loadSpotifySDK = () => {
        if (!document.getElementById('spotify-sdk')) {
          const script = document.createElement('script');
          script.id = 'spotify-sdk';
          script.src = 'https://sdk.scdn.co/spotify-player.js';
          script.async = true;
          document.body.appendChild(script);
        }
      };

      loadSpotifySDK();
    });
  },

  async logout() {
    // Clear local and session storage
    window.localStorage.removeItem('spotify_access_token');
    window.sessionStorage.removeItem('spotify_access_token');
    window.location.href = 'https://www.spotify.com/fr/logout';

    // // Redirect to Spotify's OAuth page
    // const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
    // const redirectUri = import.meta.env.VITE_REDIRECT_URI; // Your redirect URI
    // const scopes = 'user-read-private user-read-email streaming user-library-read user-library-modify user-read-playback-state'; // Add the necessary scopes
    // const authEndpoint = 'https://accounts.spotify.com/authorize';

    // const spotifyAuthUrl = `${authEndpoint}?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scopes)}&response_type=code`;

    window.location.href = spotifyAuthUrl;
  },

  async search(term, offset = 0, limit = 20, accessToken) {
    try {
      const response = await fetch(`${API_URL}/api/search?term=${encodeURIComponent(term)}&offset=${offset}&limit=${limit}`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,  // Include the access token
        },
      });

      const data = await response.json();

      if (!data.tracks) {
        return { tracks: [], total: 0 };
      }

      const tracks = data.tracks.items.map((track) => ({
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
        total: data.tracks.total,
        nextOffset: offset + limit,
      };
    } catch (error) {
      console.error('Error searching tracks:', error);
      return { tracks: [], total: 0 };
    }
  },

  async getSuggestions(query, accessToken) {
    if (!query) {
      return [];
    }

    try {
      const response = await fetch(`https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track,artist&limit=5`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error('Error fetching suggestions');
      }

      const data = await response.json();

      const trackSuggestions = data.tracks.items.map(track => track.name) || [];
      const artistSuggestions = data.artists.items.map(artist => artist.name) || [];

      return [...trackSuggestions, ...artistSuggestions];
    } catch (error) {
      console.error('Error fetching suggestions', error);
      return [];
    }
  },

  async getUserSubscriptionLevel() {
    try {
      const token = accessToken;  // Ensure accessToken is retrieved from state or context
      if (!token) {
        throw new Error('No access token available');
      }

      console.log('Using access token:', token);

      const response = await fetch(`${API_URL}/api/userSubscriptionLevel`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Error fetching user subscription level');
      }

      const data = await response.json();
      return data.product; // 'premium' or 'free'
    } catch (error) {
      console.error('Error fetching subscription level:', error);
      throw error;
    }
  },

  async savePlaylist(playlistName, uriOfPlaylistTracks) {
    if (!playlistName || !uriOfPlaylistTracks.length) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/savePlaylist`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          playlistName,
          uriOfPlaylistTracks,
        }),
      });

      const result = await response.json();
      if (result.success) {
        alert('Playlist saved successfully!');
      } else {
        throw new Error(result.message || 'Failed to save playlist');
      }
    } catch (error) {
      console.error('Error saving playlist:', error);
    }
  },

  async playTrack(uri) {
    try {
      const { device_id } = await this.initializePlayer();
      const response = await fetch(`${API_URL}/api/playTrack`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ uri, device_id }),
      });

      if (response.ok) {
        console.log('Playback started');
      } else {
        throw new Error('Failed to start playback');
      }
    } catch (error) {
      console.error('Error playing track:', error);
    }
  },

  async getRecommendations(playlistTracks, offset = 0, limit = 20) {
    if (!playlistTracks || playlistTracks.length === 0) {
      return { tracks: [], total: 0 };
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

    try {
      const response = await fetch(`${API_URL}/api/recommendations?seed_tracks=${seedTracks}&limit=${limit}&offset=${offset}`);
      if (!response.ok) {
        throw new Error('Error fetching recommendations');
      }
      const data = await response.json();

      const newTracks = data.tracks.map(track => ({
        id: track.id,
        name: track.name,
        artist: track.artists[0].name,
        album: track.album.name,
        uri: track.uri,
        image: track.album.images[0]?.url,
        preview_url: track.preview_url,
      }));

      return {
        tracks: newTracks,
        total: offset + newTracks.length < limit ? offset + newTracks.length : offset + newTracks.length + limit,
        nextOffset: offset + newTracks.length
      };
    } catch (error) {
      console.error('Error fetching recommendations:', error);
      return { tracks: [], total: 0 };
    }
  }
};

export default Spotify;
