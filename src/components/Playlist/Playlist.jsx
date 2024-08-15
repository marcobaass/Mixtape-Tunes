import styles from './Playlist.module.scss'
import PropTypes from 'prop-types'

export default function Playlist({ playlistTracks, handleRemoveFromPlaylist, playlistName, setPlaylistName, handleSaveToSpotify, isEditing, setIsEditing }) {
  const handlePlaylistnameSubmit = (e) => {
    e.preventDefault();
    setIsEditing(false);
  }

  return (
    <div className="bg-black p-8 rounded-lg shadow-xl border-4 border-neon-purple max-w-md mx-auto">

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

      <div className="space-y-4">
        {playlistTracks.map((track, index) => (
          <div
            key={index}
            className="flex items-center bg-black p-2 rounded-lg shadow-md border-2 border-neon-blue text-white"
          >
            <img
              className="w-12 h-12 rounded-md"
              src={track.image || "#"}
              alt={track.name || 'Track Image'}
            />
            <div className="ml-4 flex-1">
              <p className="text-neon-pink font-bold">{track.artist || 'Artist Name'}</p>
              <p className="text-neon-green">{track.name || 'Song Title'}</p>
              <p className="text-neon-yellow">{track.album || 'Album Title'}</p>
            </div>
            <button
              className="ml-4 px-2 py-1 bg-neon-pink text-white rounded-full hover:bg-neon-blue transition-all"
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
