# Spotify Duplicates Identifier
Reads the user's songs and finds songs contained whithin different groups, such as different feelings or genres.

## How to Use

1. Make sure you have Node.js 22.22+ (24 LTS recommended) installed, then clone the project and run `yarn` on the root folder (it installs both backend and frontend)

2. Get your Spotify credentials at the [Register Your App](https://developer.spotify.com/documentation/general/guides/app-settings/#register-your-app) tutorial, using `http://127.0.0.1:3000/callback/` as the redirect URI

3. Rename .env.example to .env and replace the configurations with your credentials

4. Get frontend and backend up by running `yarn start` (or separately with `yarn start:frontend` and `yarn start:backend`)

5. Click *login*. Spotify will assist on obtaining an access code and tokens
   
6. Classify your playlists as *Feeling*, *Genre* or *Compilation*. Use the filter and the bulk buttons to classify many at once. Your choices are remembered in the browser

7. Click *Search for duplicates* to list songs found in two or more feelings, or in two or more genres. Compilations and unclassified playlists are never checked. Enjoy!

* Spotify's Web API doesn't expose playlist folders, so the classification has to be done in the app
* Spotify only returns the songs of playlists you own or collaborate on. Followed playlists are listed but can't be checked
