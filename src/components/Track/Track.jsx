import styles from './Track.module.scss';
import PropTypes from 'prop-types';

export default function Track({ track, handleAddToPlaylist, handlePlay, isPlaying, currentTrack, isPremium }) {

  const isCurrentTrackPlaying = currentTrack && currentTrack.uri === track.uri && isPlaying;

  return (
    <div className={`${styles.tape} m-1 rounded-lg shadow-lg max-w-sm`}>

      <img
        className={`${styles.gridImg} object-cover rounded-xl p-2`}
        src={track.image || "default-image-url.jpg"} // Use a meaningful default image URL
        alt={track.name || 'Track Image'}
      />


      <h2 className={`${styles.gridArtist} font-bold text-black`}>{track.artist || 'Artist Name'}</h2>
      <h2 className={`${styles.gridSong} text-black`}>{track.name || 'Song Title'}</h2>
      <h2 className={`${styles.gridAlbum} text-white`}>{track.album || 'Album Title'}</h2>


      {/* Playbutton */}
      <div className={`${styles.gridPlay} relative`}>
        {(track.preview_url && !isPremium) || isPremium ? (
          <button
            className="mt-2 px-2 py-1 bg-lime-green text-black font-semibold rounded-lg shadow-lg hover:bg-vivid-yellow transition-colors duration-300 text-xs"
            onClick={() => handlePlay(track)}
          >
            {isCurrentTrackPlaying ? 'Stop' : 'Play'}
          </button>
        ) : (
          <button
            className="px-3 py-0.5 bg-gray-400 text-white rounded-full"
          >
            Play
          </button>
        )}

        {/* Tooltip */}
        {!isPremium && !track.preview_url && (
          <div className="absolute bottom-full mb-2 hidden group-hover:block">
            <span>
              <p className="bg-gray-800 text-white text-xs rounded py-1 px-2 shadow-lg">No preview available for free users</p>
            </span>
          </div>
        )}
      </div>



        {/* Add Button */}
        <button
          onClick={() => handleAddToPlaylist(track)}
          className={`${styles.gridAdd} px-2 py-1 bg-lime-green text-black font-semibold rounded-lg hover:bg-vivid-yellow transition-colors duration-300 text-xs`}
        >
          Add
        </button>
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
  isPlaying: PropTypes.bool.isRequired,
  currentTrack: PropTypes.object, // Allow currentTrack to be null
  isPremium: PropTypes.bool.isRequired
};
