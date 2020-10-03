/**
 * This is an example of a basic node.js script that performs
 * the Authorization Code oAuth2 flow to authenticate against
 * the Spotify Accounts.
 *
 * For more information, read
 * https://developer.spotify.com/web-api/authorization-guide/#authorization_code_flow
 */

require('dotenv').config();

const express = require('express'); // Express web server framework
const cors = require('cors');
const cookieParser = require('cookie-parser');

var app = express();

app.use(express.static(__dirname + '/'))
   .use(cors())
   .use(cookieParser());

app.use(express.static(__dirname + '/'), require('./auth'));
app.use(express.static(__dirname + '/'), require('./playlist'));

console.log('Listening on 8888');
app.listen(8888);
