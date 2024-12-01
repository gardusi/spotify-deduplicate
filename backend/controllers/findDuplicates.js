const { spotifyApiClient } = require('../clients/spotify/api')
const { filterByDuplicates } = require('../duplicates')
const { createPlaylistService } = require('../../backend/services/playlist')

const songName = (song) => song.track.name + ' (' + song.track.id + ')'

const findDuplicatesController = async (req, res) => {
  const profileClient = spotifyApiClient(req.session)
  const playlistService = createPlaylistService(profileClient)

  try {
    const result = await playlistService.findAll()
    const playlists = result.filter((playlist) => playlist && playlist?.name !== "")
    
    const promises = playlists.map(async (playlist) => {
      const tracks = await playlistService.findTracks(playlist.tracks.href)
      return [playlist.name, (tracks || []).map(songName)]
    })
  
    const tracks = await Promise.all(promises)
  
    const songOccurrences = {}
    tracks.forEach(([playlist, songNames]) => {
      for (const songName of songNames) {
        songOccurrences[songName] = [...(songOccurrences[songName] || []), playlist]
      }
    })
  
    res.send({
      duplicates: filterByDuplicates(songOccurrences),
      songOccurrences,
    })
  } catch (err) {
    console.log(err)
    res.status(err.statusCode || 500)
    res.send(err.message)
  }
}

module.exports = { findDuplicatesController }
