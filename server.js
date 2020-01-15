const express = require('express')
const app = express()
const SpotifyWebApi = require('spotify-web-api-node');

const credentials = {
	clientId: 'dd71362980ad40bb9820af4e02f5c39e',
	clientSecret: '515a0f00287745c19c006ce63af4d7b6',
	redirectUri: 'http://172.17.32.47:3000/authorization'
}
const scopes = [
	'user-read-private',
	'user-read-email'
]

const spotifyApi = new SpotifyWebApi(credentials)

const authorizeURL = spotifyApi.createAuthorizeURL(scopes)
console.log(authorizeURL)

app.get('/authorization', function(req, res) {
	res.send('authorized')
	spotifyApi.authorizationCodeGrant(req.query.code).then(
		function(data) {
			spotifyApi.setAccessToken(data.body['access_token']);
			spotifyApi.setRefreshToken(data.body['refresh_token']);
		}
	)
})
 
app.listen(3000, function () {
  console.log('Listening on port 3000')
})