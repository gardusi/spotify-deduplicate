const FEELINGS = process.env.FEELINGS
const GENRES = process.env.GENRES.split(',')

const filterByDuplicates = (songOccurrences) => {
  let duplicates = []

  Object.entries(songOccurrences).forEach(([name, playlists]) => {
    const feelingsCount = playlists.reduce((count, name) => count + FEELINGS.includes(name), 0)

    if (feelingsCount >= 2) {
      console.log(name, playlists)
      duplicates.push([feelingsCount + ' Feelings: ', name, playlists.join(', ')])
    }

    const genresCount = playlists.reduce((count, name) => count + GENRES.some((genre) => name.includes(genre)), 0)

    if (genresCount >= 2) {
      duplicates.push([genresCount + ' Genres: ', name, playlists.join(', ')])
    }
  })

  return duplicates
}

module.exports = {
  filterByDuplicates,
}
