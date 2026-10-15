import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { fetchPlaylists, findDuplicates, UnauthorizedError } from "../api";
import useCategories from "../hooks/useCategories";

const CATEGORIES = [
  { id: "feeling", label: "Feeling" },
  { id: "genre", label: "Genre" },
  { id: "compilation", label: "Compilation" },
];

// Only these are checked for duplicates; compilations may overlap freely
const CHECKED = [
  { id: "feeling", title: "Same song in more than one feeling" },
  { id: "genre", title: "Same song in more than one genre" },
];

const CategoryPicker = ({ value, disabled, onChange }) => (
  <div className="segmented" role="group">
    {CATEGORIES.map((category) => (
      <button
        key={category.id}
        className={value === category.id ? `active ${category.id}` : ""}
        disabled={disabled}
        aria-pressed={value === category.id}
        onClick={() => onChange(value === category.id ? null : category.id)}
      >
        {category.label}
      </button>
    ))}
  </div>
);

const Home = () => {
  const navigate = useNavigate();
  const [categories, assign] = useCategories();

  const [playlists, setPlaylists] = useState([]);
  const [isLoadingPlaylists, setIsLoadingPlaylists] = useState(true);
  const [filter, setFilter] = useState("");
  const [onlyUnassigned, setOnlyUnassigned] = useState(false);

  const [isSearching, setIsSearching] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleError = (err) => {
    if (err instanceof UnauthorizedError) {
      navigate("/login");
      return;
    }
    setError(err.message);
  };

  useEffect(() => {
    if (!localStorage.getItem("spotifyToken")) {
      navigate("/login");
      return;
    }
    fetchPlaylists()
      .then((data) => setPlaylists(data.playlists))
      .catch(handleError)
      .finally(() => setIsLoadingPlaylists(false));
  }, []);

  const visible = useMemo(() => {
    const term = filter.trim().toLowerCase();
    return playlists.filter(
      (playlist) =>
        playlist.readable &&
        (!term || playlist.name.toLowerCase().includes(term)) &&
        (!onlyUnassigned || !categories[playlist.id])
    );
  }, [playlists, filter, onlyUnassigned, categories]);

  const unreadable = playlists.filter((playlist) => !playlist.readable);

  const counts = useMemo(() => {
    const ids = new Set(playlists.map((playlist) => playlist.id));
    return Object.entries(categories).reduce((acc, [id, category]) => {
      if (ids.has(id)) acc[category] = (acc[category] || 0) + 1;
      return acc;
    }, {});
  }, [playlists, categories]);

  const canSearch = CHECKED.some(({ id }) => (counts[id] || 0) >= 2);

  const handleSearchDuplicates = () => {
    setIsSearching(true);
    setError(null);
    findDuplicates(categories)
      .then(setResult)
      .catch(handleError)
      .finally(() => setIsSearching(false));
  };

  const handleLogout = () => {
    localStorage.removeItem("spotifyToken");
    localStorage.removeItem("spotifyRefreshToken");
    navigate("/login");
  };

  return (
    <div className="home">
      <header className="topbar">
        <h1>Spotify Deduplicate</h1>
        <button className="button-link" onClick={handleLogout}>
          Log out
        </button>
      </header>

      {error && <p className="error">{error}</p>}

      <section className="card">
        <div className="card-header">
          <div>
            <h2>1. Classify your playlists</h2>
            <p className="muted">
              Mark each playlist as a feeling or a genre. Compilations and unmarked
              playlists are not checked. Your choices are remembered in this browser.
            </p>
          </div>
          <div className="counts">
            {CATEGORIES.map(({ id, label }) => (
              <span key={id} className={`chip ${id}`}>
                {label}: {counts[id] || 0}
              </span>
            ))}
          </div>
        </div>

        {isLoadingPlaylists ? (
          <p className="muted">Loading playlists...</p>
        ) : (
          <>
            <div className="toolbar">
              <input
                type="search"
                placeholder="Filter by name"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              />
              <label className="toggle">
                <input
                  type="checkbox"
                  checked={onlyUnassigned}
                  onChange={(e) => setOnlyUnassigned(e.target.checked)}
                />
                Only unassigned
              </label>
            </div>

            {visible.length > 1 && (
              <div className="bulk">
                <span className="muted">Set all {visible.length} shown to:</span>
                {CATEGORIES.map(({ id, label }) => (
                  <button
                    key={id}
                    className="button-small"
                    onClick={() => assign(visible.map((p) => p.id), id)}
                  >
                    {label}
                  </button>
                ))}
                <button
                  className="button-small"
                  onClick={() => assign(visible.map((p) => p.id), null)}
                >
                  Clear
                </button>
              </div>
            )}

            <ul className="playlist-list">
              {visible.map((playlist) => (
                <li key={playlist.id}>
                  <div className="playlist-info">
                    <span className="playlist-name">{playlist.name}</span>
                    <span className="muted">{playlist.total} songs</span>
                  </div>
                  <CategoryPicker
                    value={categories[playlist.id]}
                    onChange={(category) => assign([playlist.id], category)}
                  />
                </li>
              ))}
              {visible.length === 0 && <li className="muted">No playlists match.</li>}
            </ul>

            {unreadable.length > 0 && (
              <details className="muted">
                <summary>
                  {unreadable.length} followed playlists can't be checked
                </summary>
                <p>
                  Spotify only shares the songs of playlists you own or collaborate on.
                </p>
                <ul>
                  {unreadable.map((playlist) => (
                    <li key={playlist.id}>
                      {playlist.name} {playlist.owner && `· ${playlist.owner}`}
                    </li>
                  ))}
                </ul>
              </details>
            )}
          </>
        )}
      </section>

      <section className="card">
        <div className="card-header">
          <h2>2. Find duplicates</h2>
          <button
            className="button-primary"
            disabled={!canSearch || isSearching}
            onClick={handleSearchDuplicates}
          >
            {isSearching ? "Searching..." : "Search for duplicates"}
          </button>
        </div>
        {!canSearch && !isLoadingPlaylists && (
          <p className="muted">Classify at least two feelings or two genres to search.</p>
        )}

        {result && !isSearching && (
          <>
            <p className="muted">Scanned {result.scannedPlaylists} playlists.</p>
            {CHECKED.map(({ id, title }) => {
              const found = result.duplicates.filter((d) => d.category === id);
              return (
                <div key={id} className="result-group">
                  <h3>
                    {title} <span className={`chip ${id}`}>{found.length}</span>
                  </h3>
                  {found.length === 0 ? (
                    <p className="muted">None found.</p>
                  ) : (
                    <ul className="duplicate-list">
                      {found.map(({ track, playlists }) => (
                        <li key={track.id}>
                          <div>
                            <span className="track-name">{track.name}</span>
                            <span className="muted"> · {track.artists.join(", ")}</span>
                          </div>
                          <div className="chips">
                            {playlists.map((name) => (
                              <span key={name} className="chip">
                                {name}
                              </span>
                            ))}
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              );
            })}
          </>
        )}
      </section>
    </div>
  );
};

export default Home;
