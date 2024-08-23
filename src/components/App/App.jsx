import { useState, useEffect, useRef } from 'react';
import usePlaylist from '../../hooks/usePlaylist';
import styles from './App.module.scss';
import SearchBar from '../SearchBar/SearchBar';
import SearchResults from '../SearchResults/SearchResults';
import Tracklist from '../Tracklist/Tracklist';
import Playlist from '../Playlist/Playlist';
import Spotify from '../../services/Spotify';
import { useLoading } from '../../context/LoadingContext';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';


function App() {
  useEffect(() => {
    Spotify.getAccessToken();
  }, []);

  const { isLoading, setLoading } = useLoading();
  const [text, setText] = useState("");
  const [tracks, setTracks] = useState([]);
  const [query, setQuery] = useState("");
  const [searchOffset, setSearchOffset] = useState(0);
  const [totalResults, setTotalResults] = useState(0);
  const [isPremium, setIsPremium] = useState(false);
  const [currentAudio, setCurrentAudio] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [recommendedTracks, setRecommendedTracks] = useState([]);
  const [recommendationOffset, setRecommendationOffset] = useState(0);
  const [totalRecommendations, setTotalRecommendations] = useState(0);

  const inputRef = useRef(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    console.log('Recommendation Offset:', recommendationOffset);
    console.log('Total Recommendations:', totalRecommendations);
    console.log('Search Offset:', searchOffset);
    console.log('Total Results:', totalResults);
  }, [recommendationOffset, totalRecommendations, searchOffset, totalResults]);

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

  const handleSearch = async (searchTerm, newSearch = false) => {
    if (!searchTerm.trim()) {
      console.warn("Search term is empty. Skipping API request.");
      return;
    }

    const offset = newSearch ? 0 : searchOffset;

    try {
      setLoading(true); // Set loading to true
      const { tracks, total, nextOffset } = await Spotify.search(searchTerm, offset);
      setTracks((prevTracks) => newSearch ? tracks : [...prevTracks, ...tracks]);
      setSearchOffset(nextOffset);
      setTotalResults(total);
    } catch (error) {
      console.error("Error during search:", error);
    } finally {
      setLoading(false); // Set loading to false
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSuggestions([]);
    setRecommendedTracks([]);
    setQuery(text);
    handleSearch(text, true);
  };

  const handleLoadMore = async () => {
    try {
      setLoading(true); // Set loading to true
      if (recommendedTracks.length > 0) {
        // Load more recommendations and append to the existing list
        const { tracks, total, nextOffset } = await Spotify.getRecommendations(playlistTracks, recommendationOffset);
        setRecommendedTracks((prevTracks) => [...prevTracks, ...tracks]);
        setRecommendationOffset(nextOffset);
        setTotalRecommendations(total);
      } else {
        // Load more search results
        await handleSearch(query);
      }
    } catch (error) {
      console.error("Error loading more:", error);
    } finally {
      setLoading(false); // Set loading to false
    }
  };

  const handleSuggestions = async (inputValue) => {
    if (!inputValue) {
      setSuggestions([]);
      return;
    }

    try {
      setLoading(true); // Set loading to true
      const fetchedSuggestions = await Spotify.getSuggestions(inputValue);
      setSuggestions(fetchedSuggestions);
    } catch (error) {
      console.error("Error fetching suggestions:", error);
    } finally {
      setLoading(false); // Set loading to false
    }
  };

  useEffect(() => {
    const checkSubscription = async () => {
      try {
        setLoading(true); // Set loading to true
        const subscription = await Spotify.getUserSubscriptionLevel();
        console.log("Subscription level:", subscription);
        setIsPremium(subscription === 'premium');
      } catch (error) {
        console.error("Error checking subscription level:", error);
        setIsPremium(false);
      } finally {
        setLoading(false); // Set loading to false
      }
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

  const getRecommendations = async (playlistTracks) => {
    try {
      setLoading(true); // Set loading to true
      setRecommendationOffset(0); // Reset offset when fetching recommendations
      const { tracks, total, nextOffset } = await Spotify.getRecommendations(playlistTracks);

      if (tracks && tracks.length > 0) {
        if (currentAudio) {
          currentAudio.pause();
        }
        setTracks([]); // Clear the previous search results
        setRecommendedTracks(tracks);
        setRecommendationOffset(nextOffset);
        setTotalRecommendations(total);
        setCurrentAudio(null);
        setIsPlaying(false);
      } else {
        console.log("No recommendations found or something went wrong.");
      }
    } catch (error) {
      console.error("Error fetching recommendations:", error);
    } finally {
      setLoading(false); // Set loading to false
    }
  };

  const handleLogout = () => {
    console.log("Log out button clicked");
    Spotify.logout();

    // Clear any other application state or UI updates
    setTracks([]);
    setQuery("");
    setSearchOffset(0);
    setTotalResults(0);
    setIsPremium(false);
    setCurrentAudio(null);
    setSuggestions([]);
    setIsPlaying(false);
    setRecommendedTracks([]);
  };

  const handleOnBlur = (e, dropdownRef) => {
    if (dropdownRef.current && dropdownRef.current.contains(e.relatedTarget)) {
      return;
    }
    setSuggestions([]);
  }

  return (
    <div className="screen flex flex-col h-screen md:overflow-hidden l-sm:overflow-auto">
      <header className="p-4 bg-hot-magenta text-white text-center">
        <h1 className="text-5xl md:text-7xl lg:text-8xl">WALKIFY</h1>
        <button onClick={handleLogout} className="rounded-full bg-neon-green px-4 py-1 mt-6 hover:bg-lime-green transition-colors duration-300 text-base font-bold">
          Log Out
        </button>
      </header>

      <div className="flex md:flex-1 flex-col-reverse md:flex-row md:overflow-hidden l-md:overflow-auto">

        <aside className="lg:w-1/3 md:w-2/5 w-full p-4 border-r border-gray-300 flex flex-col l-sm:overflow-auto bg-electric-blue">
          <div className="flex-1">
            <Playlist
              playlistTracks={playlistTracks}
              handleRemoveFromPlaylist={handleRemoveFromPlaylist}
              playlistName={playlistName}
              setPlaylistName={setPlaylistName}
              handleSaveToSpotify={handleSaveToSpotify}
              isEditing={isEditing}
              setIsEditing={setIsEditing}
              getRecommendations={getRecommendations}
            />
          </div>
        </aside>

        <main className="lg:w-2/3 md:w-3/5 w-full p-4 flex flex-col bg-vivid-yellow">
          <div className="flex justify-center mb-4">
            <SearchBar
              text={text}
              setText={setText}
              onSubmit={handleSubmit}
              onBlur={handleOnBlur}
              handleSuggestions={handleSuggestions}
              suggestions={suggestions}
              inputRef={inputRef}
              dropdownRef={dropdownRef}
            />
          </div>
          {query && <SearchResults query={query} />}
          <div className="flex-1 overflow-y-auto">
            {isLoading && <LoadingSpinner />}
            {(recommendedTracks.length > 0 || tracks.length > 0) && (
              <>
                <Tracklist
                  tracks={recommendedTracks.length > 0 ? recommendedTracks : tracks}
                  handleAddToPlaylist={handleAddToPlaylist}
                  Spotify={Spotify}
                  handlePlay={handlePlay}
                  isPlaying={isPlaying}
                  currentTrack={
                    currentAudio
                      ? (recommendedTracks.length > 0
                          ? recommendedTracks.find(track => track.preview_url === currentAudio.src)
                          : tracks.find(track => track.preview_url === currentAudio.src))
                      : null
                  }
                  isPremium={isPremium}
                />
                <div className="hidden md:flex justify-center">
                  {((recommendedTracks.length > 0 && recommendationOffset < totalRecommendations) ||
                    (tracks.length > 0 && searchOffset < totalResults)) && (
                    <button onClick={handleLoadMore} className="text-white bg-neon-pink rounded-2xl px-3 py-0.5 h-min mt-2 hover:bg-neon-purple transition-colors duration-300 text-sm font-bold">
                      Load More
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
