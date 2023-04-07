const express = require('express') // Express web server framework
const runQuery = require('./query')
const { filterByDuplicates } = require('./duplicates')

const router = express.Router()

const findPlaylists = async (accessToken, limit, offset) => {
  const options = {
    url: 'https://api.spotify.com/v1/me/playlists?limit=' + limit + '&offset=' + offset,
    headers: { 'Authorization': 'Bearer ' + accessToken },
    json: true,
  }

  const response = await runQuery(options, "Failed to find playlists")

  return response.total > (offset + limit)
    ? [...response.items, ...await findPlaylists(accessToken, limit, offset + limit)]
    : response.items
}

const findSongs = async (accessToken, href, limit, offset) => {
  const options = {
    url: href + '?limit=' + limit + '&offset=' + offset,
    headers: { 'Authorization': 'Bearer ' + accessToken },
    json: true,
  }

  const response = await runQuery(options, "Failed to find tracks")

  return response.total > (offset + limit)
    ? [...response.items, ...await findSongs(accessToken, href, limit, offset + limit)]
    : response.items
}

const songName = (song) => song.track.name + ' (' + song.track.id + ')'

router.get('/playlists', async (req, res) => {
  console.log('Route is here ok')
  const playlists = await findPlaylists(req.headers.access_token, 50, 0)
    .catch((err) => {
      res.statusCode(err.statusCode)
      res.send(err.message)
    })

  const promises = playlists.map((playlist) =>
    findSongs(req.headers.access_token, playlist.tracks.href, 100, 0)
      .catch((err) => {
        res.statusCode(err.statusCode)
        res.send(err.message)
      })
      .then((songs) => [playlist.name, songs.map(songName)]),
  )

  const songs = await Promise.all(promises)

  const songOccurrences = {}
  songs.forEach(([playlist, songNames]) => {
    for (const songName of songNames) {
      songOccurrences[songName] = [...(songOccurrences[songName] || []), playlist]
    }
  })

  res.send({
    duplicates: filterByDuplicates(songOccurrences),
    songOccurrences,
  })
})

module.exports = router
