import styles from './Playlist.module.scss'
import PropTypes from 'prop-types'

export default function Playlist({playlistTracks, handleRemoveFromPlaylist}) {
  return (
    <>
      {playlistTracks.map((track, index) => (
        <div key={index}>
          <img src={track.image || "#"} alt={track.title || 'Track Image'} />
          <p>{track.artist || 'Artist Name'}</p>
          <p>{track.title || 'Song Title'}</p>
          <p>{track.album || 'Album Title'}</p>
          <button onClick={() => handleRemoveFromPlaylist(track)}>X</button>
        </div>
      ))}
    </>
	)
}

Playlist.propTypes = {
  playlistTracks: PropTypes.array.isRequired,
  handleRemoveFromPlaylist: PropTypes.func.isRequired
}
