import PropTypes from 'prop-types';
import Track from'../Track/Track'
import styles from './Tracklist.module.scss'

export default function Tracklist({ tracks, handleAddToPlaylist }) {
  return (
    <div>
      {tracks.map((track, index) => (
        <Track key={index} track={track} handleAddToPlaylist={handleAddToPlaylist} />
      ))}
    </div>
  );
}

Tracklist.propTypes = {
  tracks: PropTypes.arrayOf(
    PropTypes.shape({
      image: PropTypes.string,
      artist: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      album: PropTypes.string.isRequired
    })
  ).isRequired,
  handleAddToPlaylist: PropTypes.func.isRequired
};
