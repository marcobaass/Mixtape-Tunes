import { useState, useEffect } from 'react';
import styles from './App.module.scss';
import SearchBar from '../SearchBar/SearchBar';
import SearchResults from '../SearchResults/SearchResults';
import Tracklist from '../Tracklist/Tracklist';
import Playlist from '../Playlist/Playlist';
import Spotify from '../../services/Spotify';

function App() {
  useEffect(() => {
    Spotify.getAccessToken();
  }, []);

  const [text, setText] = useState("");
  const [tracks, setTracks] = useState([]);
  const [query, setQuery] = useState("");
  const [playlistTracks, setPlaylistTracks] = useState([]);
  const [playlistName, setPlaylistName] = useState("Your Playlist");
  const [uriOfPlaylistTracks, setUriOfPlaylistTracks] = useState([]);
  const [isEditing, setIsEditing] = useState(true);




  const handleSearch = (query) => {
    Spotify.search(query).then((tracks) => {
      setTracks(tracks);
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setQuery(text);
    handleSearch(text);
  }

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

  const handleSaveToSpotify = (playlistTracks) => {
    const uriArray = playlistTracks.map(track => track.uri);
    setUriOfPlaylistTracks(uriArray);
    uriArray.forEach(element => console.log(element));
    setPlaylistTracks([]);
    setPlaylistName("Your Playlist");
    setIsEditing(true);
  }

  return (
    <div className="flex flex-col h-screen">
      <header className="p-4 bg-blue-500 text-white text-center">
        <h1 className="text-6xl">WALKIFY</h1>
      </header>
      <div className="flex flex-1">
        <aside className="w-1/4 p-4 border-r border-gray-300">
          <Playlist
            playlistTracks={playlistTracks}
            handleRemoveFromPlaylist={handleRemoveFromPlaylist}
            playlistName={playlistName}
            setPlaylistName={setPlaylistName}
            handleSaveToSpotify={handleSaveToSpotify}
            isEditing={isEditing}
            setIsEditing={setIsEditing}
          />
        </aside>
        <main className="w-3/4 p-4">
          <div className="flex justify-center mb-4">
            <SearchBar text={text} setText={setText} onSubmit={handleSubmit} />
          </div>
          {query && <SearchResults query={query} />}
          {tracks.length > 0 && <Tracklist tracks={tracks} handleAddToPlaylist={handleAddToPlaylist} />}
        </main>
      </div>
    </div>
  );
}

export default App;
