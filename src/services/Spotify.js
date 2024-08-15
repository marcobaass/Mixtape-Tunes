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
      }));

      return {
        tracks,
        total: jsonResponse.tracks.total,
        nextOffset: offset + limit,
      };
    });
  },

  async getUserId() {
    const accessToken = Spotify.getAccessToken();
    const response = await fetch('https://api.spotify.com/v1/me', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const userData = await response.json();
    return userData.id;
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
  }
};

export default Spotify;
