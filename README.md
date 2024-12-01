# Spotify Duplicates Identifier
Reads the user's songs and finds songs contained whithin different groups, such as different feelings or genres.

## How to Use

1. Clone the project and run `yarn` on the root folder

2. Get your Spotify credentials at the [Register Your App](https://developer.spotify.com/documentation/general/guides/app-settings/#register-your-app) tutorial

3. Rename .env.example to .env and replace the configurations with your credentials and target playlists (pay attention to spaces!)

4. Get frontend and backend up by running `yarn start:frontend` and `yarn start:backend`

6. Click *login*. Spotify will assist on obtaining an access code and tokens
   
8. Click the *Search Song Duplicates* button whenever you want to run the search for duplicates. Enjoy!

* Tip: if you have many subgenres, just write the name of the parent genre, the genre match is not exact
