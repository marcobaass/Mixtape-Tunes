import { useState } from 'react';
import Spotify from '../services/Spotify';

export default function usePlaylist() {
  const [playlistTracks, setPlaylistTracks] = useState([]);
  const [playlistName, setPlaylistName] = useState("Your Playlist");
  const [isEditing, setIsEditing] = useState(true);

  const handleAddToPlaylist = (track) => {
    setPlaylistTracks(prevTracks => {
      const isTrackAlreadyAdded = prevTracks.some (
        (prevTrack) => prevTrack.name === track.name && prevTrack.artist === track.artist
      );

      if (isTrackAlreadyAdded) {
        return prevTracks;
      }

      return [...prevTracks, track];
    })
  }

  const handleRemoveFromPlaylist = (trackToRemove) => {
      setPlaylistTracks(prevTracks => prevTracks.filter(track => track !== trackToRemove)
    );
  };

  const handleSaveToSpotify = (playlistTracks, accessToken) => {
    const uriArray = playlistTracks.map(track => track.uri);
    console.log('Access token in handleSaveToSpotify:', accessToken);

    Spotify.savePlaylist(playlistName, uriArray, accessToken)
    .then(() => {
      setPlaylistTracks([]);
      setPlaylistName("Your Playlist");
      setIsEditing(true);
    })
    .catch(error => {
      console.error("Error saving playlist:", error);
    });
  }

  return {
    playlistTracks,
    playlistName,
    isEditing,
    setPlaylistName,
    setIsEditing,
    handleAddToPlaylist,
    handleRemoveFromPlaylist,
    handleSaveToSpotify,
  };
}
