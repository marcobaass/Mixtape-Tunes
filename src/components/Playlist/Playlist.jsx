import styles from './Playlist.module.scss'
import PropTypes from 'prop-types'

export default function Playlist({ playlistTracks, handleRemoveFromPlaylist, playlistName, setPlaylistName, handleSaveToSpotify, isEditing, setIsEditing, getRecommendations }) {
  const handlePlaylistnameSubmit = (e) => {
    e.preventDefault();
    setIsEditing(false);
  }

  return (
    <div className="p-4 max-w-md mx-auto space-y-2 ">

      {isEditing ? (
        // editmode for Playlistname
        <div className={`${styles.walkman} relative`}>
          <form onSubmit={handlePlaylistnameSubmit} className={`${styles.gridInput} flex gap-0.5 p-0.5 rounded-full bg-deep-black max-w-[95%]`}>
            <input onChange={(e) => setPlaylistName(e.target.value)} className="rounded-tl-xl rounded-bl-xl placeholder-center text-center grow" type="text" maxLength={25} placeholder={playlistName} />
            <button type="submit" onClick={() => setIsEditing(false)} className="text-white bg-neon-pink rounded-tr-xl rounded-br-xl py-0.2 px-2 hover:bg-neon-purple transition-colors duration-300 text-sm font-bold">
            save
            </button>
          </form>
        </div>
        ) : (
        // Playlist ready to Save
        <div className={`${styles.walkman} justify-center items-center`}>
          <div className={`${styles.gridName} justify-self-center w-full max-w-[90%] text-center`}>
            <h2 className="text-deep-black text-2xl text-wrap truncate">{playlistName}</h2>
          </div>
          <button onClick={() => setIsEditing(true)} className={`${styles.gridEdit} justify-self-center text-white bg-neon-pink rounded-2xl px-3 py-0.5 hover:bg-neon-purple transition-colors duration-300 text-sm font-bold`}>
            edit
          </button>
        </div>
        )
      }

      <div className="overflow-y-auto max-h-[40vh] -space-y-1">
        <div className="-space-y-1" >
          {playlistTracks.map((track, index) => (
            <div
              key={index}
              className={`${styles.playlist}`}
            >
              <img
                className={`${styles.gridImg} w-9 h-9 rounded-md`}
                src={track.image || "#"}
                alt={track.name || 'Track Image'}
              />
              <h2 className={`${styles.gridArtist} text-hot-magenta font-bold truncate w-full max-w-[95%] text-center`}>{track.artist || 'Artist Name'}</h2>
              <h2 className={`${styles.gridSong} text-electric-blue truncate w-full max-w-[95%] text-center`}>{track.name || 'Song Title'}</h2>
              <button
                className={`${styles.gridRemove} px-2 py-0 align-middle
                 bg-neon-pink text-white rounded-lg font-bold hover:bg-neon-purple transition-colors duration-300 text-base`}
                onClick={() => handleRemoveFromPlaylist(track)}
              >
                X
              </button>
            </div>
          ))}
        </div>
        {playlistTracks.length > 0 && !isEditing && (
          <button onClick={() => handleSaveToSpotify(playlistTracks)} className="text-white bg-neon-pink rounded-2xl px-3 py-0.5 h-min mt-2 mr-2 hover:bg-neon-purple transition-colors duration-300 text-sm font-bold">
            Save to Spotify
          </button>
        )}
        {playlistTracks.length > 0 && (
          <button onClick={() => getRecommendations(playlistTracks)} className="text-white bg-neon-pink rounded-2xl px-3 py-0.5 h-min mt-2 hover:bg-neon-purple transition-colors duration-300 text-sm font-bold">
            Get recommendations
          </button>
        )}
            </div>
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
