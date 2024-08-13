import styles from './Track.module.scss'
import PropTypes from 'prop-types'

export default function Track({track, handleAddToPlaylist}) {
  return (
    <div>
      <img src={track.image || "#"} alt={track.title || 'Track Image'} />
      <p>{track.artist || 'Artist Name'}</p>
      <p>{track.title || 'Song Title'}</p>
      <p>{track.album || 'Album Title'}</p>
      <button onClick={() => handleAddToPlaylist(track)}>Add to Playlist</button>
    </div>
  )
}

Track.propTypes = {
  track: PropTypes.shape({
    image: PropTypes.string,
    artist: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    album: PropTypes.string.isRequired
  }).isRequired,
  handleAddToPlaylist: PropTypes.func.isRequired
};
