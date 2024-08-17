import { useState, useEffect } from 'react';
import usePlaylist from '../../hooks/usePlaylist';
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
  const [offset, setOffset] = useState(0);
  const [totalResults, setTotalResults] = useState(0);
  const [isPremium, setIsPremium] = useState(false);
  const [currentAudio, setCurrentAudio] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);

  const {
    playlistTracks,
    playlistName,
    isEditing,
    setPlaylistName,
    setIsEditing,
    handleAddToPlaylist,
    handleRemoveFromPlaylist,
    handleSaveToSpotify,
  } = usePlaylist();

  const handleSearch = (searchTerm, newSearch = false) => {
    if (!searchTerm.trim()) {
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

  const handleSuggestions = async (inputValue) => {
    if (!inputValue) {
      setSuggestions([]);
      return;
    }
    const fetchedSuggestions = await Spotify.getSuggestions(inputValue);
    setSuggestions(fetchedSuggestions);
  };

  useEffect(() => {
    const checkSubscription = async () => {
      const subscription = await Spotify.getUserSubscriptionLevel();
      setIsPremium(subscription === 'premium');
    };

    checkSubscription();
  }, []);

  const handlePlay = async (track) => {
    // If the same track is playing, pause it
    if (currentAudio && isPlaying && currentAudio.src === track.preview_url) {
      currentAudio.pause();
      setIsPlaying(false);
      setCurrentAudio(null);
      return;
    }

    // Stop current audio if it exists
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
      setIsPlaying(false);
    }

    if (isPremium) {
      // Play full track if the user is a Premium subscriber
      await Spotify.playTrack(track.uri);
      setCurrentAudio(null); // Reset currentAudio since the full track is managed by Spotify
      setIsPlaying(true); // Assume track is playing
    } else if (track.preview_url) {
      // Play 30-second preview if the user is a Free user
      const audio = new Audio(track.preview_url);
      setCurrentAudio(audio);
      setIsPlaying(true);
      audio.play();
      audio.onended = () => {
        setIsPlaying(false);
        setCurrentAudio(null);
      };
    } else {
      alert('No preview available for this track.');
    }
  };

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
            <SearchBar
              text={text}
              setText={setText}
              onSubmit={handleSubmit}
              handleSuggestions={handleSuggestions}
              suggestions={suggestions}
            />
          </div>
          {query && <SearchResults query={query} />}
          {tracks.length > 0 && (
            <>
              <Tracklist
                tracks={tracks}
                handleAddToPlaylist={handleAddToPlaylist}
                Spotify={Spotify}
                handlePlay={handlePlay}
                isPlaying={isPlaying}
                currentTrack={currentAudio ? tracks.find(track => track.preview_url === currentAudio.src) : null}
              />
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
