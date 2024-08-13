import { useState } from 'react';
import styles from './App.module.scss';
import SearchBar from '../SearchBar/SearchBar';
import SearchResults from '../SearchResults/SearchResults';
import Tracklist from '../Tracklist/Tracklist';
import Playlist from '../Playlist/Playlist';

function App() {
  const [text, setText] = useState("");
  const [tracks, setTracks] = useState([]);
  const [query, setQuery] = useState("");
  const [playlistTracks, setPlaylistTracks] = useState([]);

  const handleSearch = (query) => {
    setTracks([
      {
        image: 'https://via.placeholder.com/150',
        artist: 'Artist Name',
        title: 'Song Title',
        album: 'Album Title'
      }
    ]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setQuery(text);
    handleSearch(text);
  }

  const handleAddToPlaylist = (track) => {
    setPlaylistTracks(prevTracks => [...prevTracks, track])
  }

  return (
    <>
      <h1 className={`${styles.heading} flex items-center justify-center`}>WALKIFY</h1>
      <div className="flex items-center justify-center">
        <SearchBar text={text} setText={setText} onSubmit={handleSubmit}/>
      </div>
      {query && <SearchResults query={query} />}
      {tracks.length > 0 && <Tracklist tracks={tracks} handleAddToPlaylist={handleAddToPlaylist} />}
      <div className="playlist">
        <Playlist playlistTracks={playlistTracks}/>
      </div>
    </>
  );
}

export default App;
