# Spotify Duplicates Identifier
Reads the user's songs and finds songs contained whithin different groups, such as different feelings or genres.

## How to Use

1. Make sure you have Node.js 22.22+ (24 LTS recommended) installed, then clone the project and run `yarn` on the root folder (it installs both backend and frontend)

2. Get your Spotify credentials at the [Register Your App](https://developer.spotify.com/documentation/general/guides/app-settings/#register-your-app) tutorial, using `http://127.0.0.1:3000/callback/` as the redirect URI

3. Rename .env.example to .env and replace the configurations with your credentials and target playlists (pay attention to spaces!)

4. Get frontend and backend up by running `yarn start:frontend` and `yarn start:backend`

6. Click *login*. Spotify will assist on obtaining an access code and tokens
   
8. Click the *Search Song Duplicates* button whenever you want to run the search for duplicates. Enjoy!

* Tip: if you have many subgenres, just write the name of the parent genre, the genre match is not exact
