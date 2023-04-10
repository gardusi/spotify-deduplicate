import React from 'react'

const Home = () => (
  <div id="loggedin">
    <div id="user-profile">
    </div>
    <div id="oauth">
    </div>
    <button class="btn btn-default" id="obtain-new-token">Obtain new token using the refresh token</button>
    <button class="btn btn-default" id="get-music-list">Search Song Duplicates</button>
    <div id="music-list">
    </div>
  </div>
)

export default Home
