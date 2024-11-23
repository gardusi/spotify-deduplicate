import React from 'react'

const Home = () => {

  const doLogin = () => {

  }

  const doSearch = () => {

  }

  return (
    <div>
      <div id="user-profile">
      </div>
      <div id="oauth">
      </div>
      <button onClick={doLogin} className="button-primary">Log in with Spotify</button>
      <button onClick={doSearch} className="button-primary">Search Song Duplicates</button>
      <div id="music-list">
      </div>
    </div>
  )
}
  

export default Home
