const CATEGORIES = ['feeling', 'genre']

/**
 * Finds tracks present in two or more playlists of the same category
 * @param {Array<{ playlist: object, category: string, tracks: object[] }>} classifiedTracks
 * @return {Array<{ category: string, track: object, playlists: string[] }>}
 */
const findDuplicates = (classifiedTracks) => {
  const occurrences = {}

  classifiedTracks.forEach(({ playlist, category, tracks }) => {
    tracks.forEach((track) => {
      const key = `${category}:${track.id}`
      occurrences[key] ??= { category, track, playlists: new Set() }
      occurrences[key].playlists.add(playlist.name)
    })
  })

  return Object.values(occurrences)
    .filter(({ playlists }) => playlists.size >= 2)
    .map(({ category, track, playlists }) => ({ category, track, playlists: [...playlists] }))
    .sort((a, b) => b.playlists.length - a.playlists.length || a.track.name.localeCompare(b.track.name))
}

module.exports = {
  CATEGORIES,
  findDuplicates,
}
