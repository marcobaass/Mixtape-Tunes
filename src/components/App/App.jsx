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
  const [isEditing, setIsEditing] = useState(true);
  const [offset, setOffset] = useState(0);
  const [totalResults, setTotalResults] = useState(0);




  const handleSearch = (searchTerm, newSearch = false) => {
    if(!searchTerm.trim()) {
      console.warn("Search term is empty. Skipping API request.");
      return;
    }

    const searchOffset = newSearch ? 0 : offset;
    Spotify.search(searchTerm, searchOffset).then(({ tracks, total, nextOffset }) => {
      setTracks((prevTracks) => newSearch ? tracks : [...prevTracks, ...tracks]);
      setOffset(nextOffset);
      setTotalResults(total);
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setQuery(text);
    handleSearch(text, true);
  };

  const handleLoadMore = () => {
    handleSearch(query);
  };

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
    Spotify.savePlaylist(playlistName, uriArray)
    .then(() => {
      setPlaylistTracks([]);
      setPlaylistName("Your Playlist");
      setIsEditing(true);
    })
    .catch(error => {
      console.error("Error saving playlist:", error);
    });
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
          {tracks.length > 0 && (
            <>
              <Tracklist tracks={tracks} handleAddToPlaylist={handleAddToPlaylist} />
              {offset < totalResults && (
                <button onClick={handleLoadMore} className="text-white bg-neon-pink rounded-2xl px-3 py-0.5 h-min mt-2">Load More</button>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;