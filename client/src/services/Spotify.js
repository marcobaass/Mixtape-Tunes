const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

let accessToken;

const Spotify = {
  async initializePlayer(accessToken) {
    return new Promise((resolve, reject) => {
        window.onSpotifyWebPlaybackSDKReady = () => {
            const player = new window.Spotify.Player({
                name: 'Your App Name',
                getOAuthToken: cb => { cb(accessToken); }
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
                console.log('Ready with Device ID', device_id);
                resolve({ player, device_id });
            });

            // Not Ready
            player.addListener('not_ready', ({ device_id }) => {
                console.log('Device ID has gone offline', device_id);
                reject(new Error('Spotify Player not ready'));
            });

            player.connect();
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
      console.log('Requesting suggestions with token:', accessToken);

      const response = await fetch(`https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track,artist&limit=5`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error(`Error fetching suggestions: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Received data:', data);

      const trackSuggestions = data.tracks.items.map(track => track.name) || [];
      const artistSuggestions = data.artists.items.map(artist => artist.name) || [];

      return [...trackSuggestions, ...artistSuggestions];
    } catch (error) {
      console.error('Error fetching suggestions', error);
      return [];
    }
  },

  async getUserSubscriptionLevel(accessToken) {
    try {
      const token = accessToken;  // Ensure accessToken is retrieved from state or context
      if (!token) {
        throw new Error('No access token available');
      }

      console.log('Using access token:', token);

      const response = await fetch(`https://api.spotify.com/v1/me`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
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

  async playTrack(uri, accessToken) {
    try {
        // Initialize the Spotify Player
        const player = new window.Spotify.Player({
            name: 'Walkify',
            getOAuthToken: cb => { cb(accessToken); },
            volume: 0.5
        });

        player.addListener('ready', ({ device_id }) => {
            console.log('Ready with Device ID', device_id);

            // Use Spotify's API to transfer playback to the Web Playback SDK's device
            fetch(`https://api.spotify.com/v1/me/player/play?device_id=${device_id}`, {
                method: 'PUT',
                body: JSON.stringify({ uris: [uri] }),
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                },
            }).then(response => {
                if (response.ok) {
                    console.log('Playback started');
                } else {
                    console.error('Failed to start playback:', response);
                }
            }).catch(error => {
                console.error('Error starting playback:', error);
            });
        });

        player.addListener('not_ready', ({ device_id }) => {
            console.log('Device ID has gone offline', device_id);
        });

        // Error handling
        player.addListener('initialization_error', ({ message }) => { console.error('Initialization Error:', message); });
        player.addListener('authentication_error', ({ message }) => { console.error('Authentication Error:', message); });
        player.addListener('account_error', ({ message }) => { console.error('Account Error:', message); });
        player.addListener('playback_error', ({ message }) => { console.error('Playback Error:', message); });

        // Connect to the player!
        player.connect();

    } catch (error) {
        console.error('Error playing track:', error);
    }
  },

  async getRecommendations(playlistTracks, offset = 0, limit = 20, accessToken) {
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
      const response = await fetch(`https://api.spotify.com/v1/recommendations?limit=20&seed_tracks=${seedTracks}`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });

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
