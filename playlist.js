const express = require('express'); // Express web server framework
const runQuery = require('./query');
const { filterByFeelings, filterByGenres, fuzzyFilter } = require('./filters');

const router = express.Router();

const findPlaylists = async (accessToken, limit, offset) => {
  const options = {
    url: 'https://api.spotify.com/v1/me/playlists?limit=' + limit + '&offset=' + offset,
    headers: { 'Authorization': 'Bearer ' + accessToken },
    json: true,
  };

  const response = await runQuery(options, "Failed to find playlists");

  return response.total > (offset + limit)
    ? [...response.items, ...await findPlaylists(accessToken, limit, offset + limit)]
    : response.items;
};

const findSongs = async (accessToken, href, limit, offset) => {
  const options = {
    url: href + '?limit=' + limit + '&offset=' + offset,
    headers: { 'Authorization': 'Bearer ' + accessToken },
    json: true,
  };

  const response = await runQuery(options, "Failed to find tracks");

  return response.total > (offset + limit)
    ? [...response.items, ...await findSongs(accessToken, href, limit, offset + limit)]
    : response.items;
};

const songName = (song) => ({
  name: song.track.name,
  id: song.track.id,
});

const appendSongs = (playlist, songs) => ({
  name: playlist.name,
  songs: songs.map(songName),
});

const registerOccurrences = (songOccurrences, playlist) => {
  playlist.songs.forEach((song) => {
    if (songOccurrences[song.id] === undefined) {
      songOccurrences[song.id] = {
        name: song.name,
        playlists: [playlist.name],
      };

      return;
    }
    songOccurrences[song.id].playlists = [...songOccurrences[song.id].playlists, playlist.name];
  });

  return songOccurrences;
}

router.get('/playlists', async (req, res) => {
  const playlistMetadata = await findPlaylists(req.headers.access_token, 50, 0)
    .catch((err) => {
      res.status(err.statusCode);
      res.send(err.message);
    });

  const playlistPromises = playlistMetadata.map((playlist) =>
    findSongs(req.headers.access_token, playlist.tracks.href, 100, 0)
      .catch((err) => {
        res.status(err.statusCode);
        res.send(err.message);
      })
      .then((songs) => appendSongs(playlist, songs)),
  );

  const songOccurrences = (await Promise.all(playlistPromises))
    .reduce(registerOccurrences, {});

  res.send({
    feelingDuplicates: filterByFeelings(songOccurrences),
    genreDuplicates: filterByGenres(songOccurrences),
    songOccurrences,
  });
});

module.exports = router;
