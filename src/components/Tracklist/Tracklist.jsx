import PropTypes from 'prop-types';
import Track from '../Track/Track';
import styles from './Tracklist.module.scss';

export default function Tracklist({ tracks, handleAddToPlaylist, Spotify, handlePlay, isPlaying, currentTrack }) {
  return (
    <div className={`${styles.tracklistContainer} bg-black p-8 rounded-lg shadow-xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 justify-center border-4 border-neon-purple`}>
      {tracks.map((track) => (
        <Track
          key={track.uri} // Using `track.uri` as a unique key
          track={track}
          handleAddToPlaylist={handleAddToPlaylist}
          Spotify={Spotify}
          handlePlay={() => handlePlay(track)}
          isPlaying={currentTrack && currentTrack.uri === track.uri && isPlaying}
          currentTrack={currentTrack}
        />
      ))}
    </div>
  );
}

Tracklist.propTypes = {
  tracks: PropTypes.arrayOf(
    PropTypes.shape({
      image: PropTypes.string,
      artist: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      album: PropTypes.string.isRequired,
      uri: PropTypes.string.isRequired,
      preview_url: PropTypes.string,
    })
  ).isRequired,
  handleAddToPlaylist: PropTypes.func.isRequired,
  handlePlay: PropTypes.func.isRequired,
  Spotify: PropTypes.shape({
    getAccessToken: PropTypes.func.isRequired,
    search: PropTypes.func.isRequired,
    getUserId: PropTypes.func.isRequired,
    savePlaylist: PropTypes.func.isRequired,
    playTrack: PropTypes.func,
  }).isRequired,
  isPlaying: PropTypes.bool.isRequired,
  currentTrack: PropTypes.object, // currentTrack is optional
};
