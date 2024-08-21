import styles from './Playlist.module.scss'
import PropTypes from 'prop-types'

export default function Playlist({ playlistTracks, handleRemoveFromPlaylist, playlistName, setPlaylistName, handleSaveToSpotify, isEditing, setIsEditing, getRecommendations }) {
  const handlePlaylistnameSubmit = (e) => {
    e.preventDefault();
    setIsEditing(false);
  }

  return (
    <div className="bg-black p-8 rounded-lg shadow-xl border-4 border-neon-purple max-w-md mx-auto space-y-2">

      {isEditing ? (
        // editmode for Playlistname
        <form onSubmit={handlePlaylistnameSubmit} className='flex gap-1 justify-center'>
        <input onChange={(e) => setPlaylistName(e.target.value)}className="rounded-tl-xl rounded-bl-xl tracking-wider placeholder-center text-center" type="text" placeholder={playlistName} />
        <button type="submit" onClick={() => setIsEditing(false)} className="text-white bg-neon-pink rounded-tr-xl rounded-br-xl py-0.2 px-2">
        save
        </button>
        </form>
        ) : (
        // Playlist ready to Save
        <div className='flex gap-1 justify-center items-center'>
          <div>
            <h2 className="text-white m-0 mr-2 text-2xl">{playlistName}</h2>
          </div>
          <button onClick={() => setIsEditing(true)} className="text-white bg-neon-pink rounded-2xl px-3 py-0.5 h-min inline-block">
            edit
          </button>
        </div>
        )
      }

      <div className="-space-y-1">
        {playlistTracks.map((track, index) => (
          <div
            key={index}
            className={`${styles.playlist} flex items-center p-1 rounded-lg shadow-md text-white`}
          >
            <img
              className="w-8 h-8 rounded-md mb-1 ml-1"
              src={track.image || "#"}
              alt={track.name || 'Track Image'}
            />
            <div className="ml-4 flex-1 mb-1">
              <h2 className="text-hot-magenta font-bold">{track.artist || 'Artist Name'}</h2>
              <h2 className="text-electric-blue">{track.name || 'Song Title'}</h2>
            </div>
            <button
              className="mb-1 mr-2 px-2 py-0 align-middle
               bg-neon-pink text-white rounded-lg font-bold hover:bg-neon-blue transition-all"
              onClick={() => handleRemoveFromPlaylist(track)}
            >
              X
            </button>
          </div>
        ))}
      </div>
      {playlistTracks.length > 0 && !isEditing && (
        <button onClick={() => handleSaveToSpotify(playlistTracks)} className="text-white bg-neon-pink rounded-2xl px-3 py-0.5 h-min mt-2">
          Save to Spotify
        </button>
      )}

      {playlistTracks.length > 0 && (
        <button onClick={() => getRecommendations(playlistTracks)} className="text-white bg-neon-pink rounded-2xl px-3 py-0.5 h-min mt-2">
          Get recommendations
        </button>
      )}
    </div>
  );
}


Playlist.propTypes = {
  playlistTracks: PropTypes.array.isRequired,
  handleRemoveFromPlaylist: PropTypes.func.isRequired,
  playlistName: PropTypes.string.isRequired,
  setPlaylistName: PropTypes.func.isRequired,
  handleSaveToSpotify: PropTypes.func.isRequired,
  isEditing: PropTypes.bool.isRequired,
  setIsEditing: PropTypes.func.isRequired
}
