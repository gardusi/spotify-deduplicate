import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [duplicates, setDuplicates] = useState([]);
  const [songOccurrences, setSongOccurrences] = useState({});

  useEffect(() => {
    if (!localStorage.getItem("spotifyToken")) {
      navigate("/login");
    }
  }, []);

  const handleSearchDuplicates = () => {
    console.log("Searching for duplicates...");
    setIsLoading(true);
    fetch("http://localhost:8888/find-duplicates", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        access_token: localStorage.getItem("spotifyToken"),
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setDuplicates(data.duplicates);
        setSongOccurrences(data.songOccurrences);
        setIsLoading(false);
      });
  };

  return (
    <div>
      <button className="button-primary" onClick={handleSearchDuplicates}>
        Search for duplicates
      </button>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <>
          {duplicates.length > 0 ? (
            <div>
              <h2>Duplicates</h2>
              <ul>
                {duplicates.map((duplicate) => (
                  <li key={duplicate}>{duplicate}</li>
                ))}
              </ul>
            </div>
          ) : (
            <p>No duplicates found</p>
          )}
          {songOccurrences && Object.keys(songOccurrences).length > 0 && (
            <div>
              <h2>Song occurrences</h2>
              <ul>
                {Object.entries(songOccurrences).map(([song, playlists]) => (
                  <li key={song}>
                    {song}: {playlists.join(", ")}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Home;
