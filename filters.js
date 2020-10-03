const FEELINGS = process.env.FEELINGS;
const GENRES = process.env.GENRES;

const filterByFeelings = (songOccurrences) => {
  return Object.entries(songOccurrences).reduce((duplicates, [id, song]) => {
    const feelingsCount = song.playlists.reduce((count, name) => count + FEELINGS.includes(name), 0);

    if (feelingsCount >= 2) {
      duplicates.push([feelingsCount + " Feelings", song.name + '(' + id + ')', song.playlists.join(", ")]);
    }

    return duplicates;
  }, []);
};

const filterByGenres = (songOccurrences) => {
  return Object.entries(songOccurrences).reduce((duplicates, [id, song]) => {
    const genresCount = song.playlists.reduce((count, name) => count + GENRES.includes(name), 0);

    if (genresCount >= 2) {
      duplicates.push([genresCount + " Genres", song.name + '(' + id + ')', song.playlists.join(", ")]);
    }

    return duplicates;
  }, []);
};


const getBigrams = (str) => {
  const s = str.toLowerCase();
  const v = s.split('');
  for (let i = 0; i < v.length; i++) {
    v[i] = s.slice(i, i + 2);
  }
  return v;
}

const stringSimilarity = (str1, str2) => {
  if (str1.length > 0 && str2.length > 0) {
    const pairs1 = getBigrams(str1);
    const pairs2 = getBigrams(str2);
    const union = pairs1.length + pairs2.length;
    let hits = 0;
    for (let x = 0; x < pairs1.length; x++) {
      for (let y = 0; y < pairs2.length; y++) {
        if (pairs1[x] == pairs2[y]) {
          hits++;
        }
      }
    }
    if(hits > 0) {
      return ((2.0 * hits) / union);
    }
  }
  return 0.0;
}

const excludeOutliers = (str) => {
  const outliers = [" - ", "Radio Edit", "feat", "Soundtrack", "Theme", "Single Version", "Original Mix", "Remastered", "Remaster"];

  return outliers.reduce((res, outlier) => res.replace(outlier, ""), str);
}

const fuzzyFilter = (songOccurrences) => {
  const songs = Object.entries(songOccurrences)
    .filter(([_, song]) => {
      const hasFeeling = song.playlists.some((playlist) => FEELINGS.includes(playlist));
      const hasGenre = song.playlists.some((playlist) => GENRES.includes(playlist));

      return hasFeeling || hasGenre;
    });

  const songNames = songs.map((occurence) => occurence[1].name);

  for (let i = 0; i < songNames.length - 1; i++) {
    for (let j = i + 1; j < songNames.length; j++) {
      const result = stringSimilarity(
        excludeOutliers(songNames[i]),
        excludeOutliers(songNames[j]),
      );
      if (result > 0.7) {
        console.log("Possible Match!");
        console.log([songNames[i] + '(' + songs[i][0] + ')', songs[i][1].playlists.join(", ")]);
        console.log([songNames[j] + '(' + songs[j][0] + ')', songs[j][1].playlists.join(", ")]);
        console.log(result.toFixed(2));
      }
    }
  }
};

module.exports = {
  filterByFeelings,
  filterByGenres,
  fuzzyFilter,
};
