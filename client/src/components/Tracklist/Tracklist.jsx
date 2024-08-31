import { useEffect } from 'react';
import PropTypes from 'prop-types';
import Track from '../Track/Track';
import styles from './Tracklist.module.scss';

export default function Tracklist({ tracks, handleAddToPlaylist, Spotify, handlePlay, isPlaying, currentTrack, isPremium }) {

  useEffect(() => {
    console.log("Tracks in Tracklist: ", tracks);
  }, [tracks]);

  return (
    <div className={`${styles.tracklistContainer} flex flex-nowrap md:flex-wrap gap-6 justify-start md:justify-center`}>
      {tracks.length === 0 ? (
        <p>No tracks available.</p>
      ) : (
        tracks.map((track) => (
          <Track
            key={track.uri} // Ensure URI is unique for each track
            track={track}
            handleAddToPlaylist={handleAddToPlaylist}
            Spotify={Spotify}
            handlePlay={() => handlePlay(track)}
            isPlaying={currentTrack && currentTrack.uri === track.uri && isPlaying}
            currentTrack={currentTrack}
            isPremium={isPremium}
          />
        ))
      )}
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
    savePlaylist: PropTypes.func.isRequired,
    playTrack: PropTypes.func,
  }).isRequired,
  isPlaying: PropTypes.bool.isRequired,
  currentTrack: PropTypes.object,
  isPremium: PropTypes.bool.isRequired
};
