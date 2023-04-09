const { spotifyApiClient } = require('../clients/spotify/api')
const { filterByDuplicates } = require('../duplicates')
const { createPlaylistService } = require('../services/playlist')

const songName = (song) => song.track.name + ' (' + song.track.id + ')'

const findDuplicatesController = async (req, res) => {
  const profileClient = spotifyApiClient(req.session)
  const playlistService = createPlaylistService(profileClient)

  const playlists = await playlistService.findAll()
    .catch((err) => {
      console.log(err)
      res.statusCode(err.statusCode)
      res.send(err.message)
    })

  const promises = playlists.map((playlist) =>
    playlistService.findTracks(playlist.tracks.href)
      .catch((err) => {
        res.statusCode(err.statusCode)
        res.send(err.message)
      })
      .then((tracks) => [playlist.name, tracks.map(songName)]),
  )

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
}

module.exports = { findDuplicatesController }
