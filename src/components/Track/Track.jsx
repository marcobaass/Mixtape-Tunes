import styles from './Track.module.scss';
import PropTypes from 'prop-types';

export default function Track({ track, handleAddToPlaylist, handlePlay }) {

  return (
    <div className="bg-neon-purple p-4 m-1 rounded-lg shadow-lg flex items-start space-x-4 max-w-sm">
      <div className="flex-shrink-0">
        <img
          className="w-24 h-24 object-cover border-4 border-neon-pink rounded-lg"
          src={track.image || "#"}
          alt={track.name || 'Track Image'}
        />
      </div>
      <div className="flex-1">
        <p className="text-sm font-bold text-bright-cyan truncate">{track.artist || 'Artist Name'}</p>
        <p className="text-xs text-electric-blue truncate">{track.name || 'Song Title'}</p>
        <p className="text-xs text-electric-blue truncate">{track.album || 'Album Title'}</p>
        <button
          className="ml-4 px-2 py-1 bg-green-500 text-white rounded-full hover:bg-green-600 transition-all"
          onClick={handlePlay}
        >
          Play
        </button>
        <button
          onClick={() => handleAddToPlaylist(track)}
          className="mt-2 px-2 py-1 bg-lime-green text-black font-semibold rounded-lg hover:bg-vivid-yellow transition-colors duration-300 text-xs"
        >
          Add
        </button>
      </div>
    </div>
  );
}

Track.propTypes = {
  track: PropTypes.shape({
    image: PropTypes.string,
    artist: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    album: PropTypes.string.isRequired,
    uri: PropTypes.string.isRequired,
    preview_url: PropTypes.string, // Add preview_url to propTypes
  }).isRequired,
  handleAddToPlaylist: PropTypes.func.isRequired,
  handlePlay: PropTypes.func.isRequired,
  Spotify: PropTypes.shape({
    getAccessToken: PropTypes.func.isRequired,
    search: PropTypes.func.isRequired,
    getUserId: PropTypes.func.isRequired,
    savePlaylist: PropTypes.func.isRequired,
    playTrack: PropTypes.func.isRequired,
    getUserSubscriptionLevel: PropTypes.func.isRequired, // Include this method
  }).isRequired,
};
