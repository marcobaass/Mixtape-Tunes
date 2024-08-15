import PropTypes from 'prop-types';
import Track from'../Track/Track'
import styles from './Tracklist.module.scss'

export default function Tracklist({ tracks, handleAddToPlaylist }) {
  return (
    <div className="bg-black p-8 rounded-lg shadow-xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 justify-center border-4 border-neon-purple">
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
      name: PropTypes.string.isRequired,
      album: PropTypes.string.isRequired
    })
  ).isRequired,
  handleAddToPlaylist: PropTypes.func.isRequired
};