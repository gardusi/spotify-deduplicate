const express = require('express') // Express web server framework
const { httpClient } = require('../clients/http')
const { spotifyProfileClient } = require('../clients/spotify/profile')
const { filterByDuplicates } = require('../duplicates')

const router = express.Router()

const findPlaylists = async (session, limit, offset) => {
  // const options = {
  //   url: 'https://api.spotify.com/v1/me/playlists?limit=' + limit + '&offset=' + offset,
  //   headers: { 'Authorization': 'Bearer ' + accessToken },
  //   json: true,
  // }

  // const response = await httpClient.get(options, "Failed to find playlists")

  const response = await spotifyProfileClient(session).findPlaylists({ limit, offset })

  return response.total > (offset + limit)
    ? [...response.items, ...await findPlaylists(session, limit, offset + limit)]
    : response.items
}

const findSongs = async (session, href, limit, offset) => {
  const options = {
    url: href + '?limit=' + limit + '&offset=' + offset,
    headers: { 'Authorization': session.getBearerAuth() },
    json: true,
  }

  const response = await httpClient.get(options, "Failed to find tracks")

  return response.total > (offset + limit)
    ? [...response.items, ...await findSongs(session, href, limit, offset + limit)]
    : response.items
}

const songName = (song) => song.track.name + ' (' + song.track.id + ')'

router.get('/playlists', async (req, res) => {
  const playlists = await findPlaylists(req.session, 50, 0)
    .catch((err) => {
      res.statusCode(err.statusCode)
      res.send(err.message)
    })

  const promises = playlists.map((playlist) =>
    findSongs(req.session, playlist.tracks.href, 100, 0)
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

module.exports = { playlistRouter: router }
