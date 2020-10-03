# Spotify Duplicates Identifier
Reads the user's songs and finds songs contained whithin different groups, such as different feelings or genres. This is a fairly simple client, which consist only of an Express server and a HTML page with embedded scripts for sorting and filtering playlists.

## How to Use

1. Clone the project and run `npm i` on the root folder

2. Get your Spotify credentials at the [Register Your App](https://developer.spotify.com/documentation/general/guides/app-settings/#register-your-app) tutorial

3. Rename .env.example to .env and replace the configurations with your credentials and target playlists (pay attention to spaces!)

4. Get the server up by running `node app.js`

5. Access the server at `localhost:8888`. Spotify will guide you to log into the application

6. Click the *Search Song Duplicates* button whenever you want to run the search for duplicates. Enjoy!
