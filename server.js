const express = require("express");
const app = express();
const SpotifyWebApi = require("spotify-web-api-node");
const jwt = require("jsonwebtoken");
const _ = require("lodash")

const credentials = {
	clientId: "dd71362980ad40bb9820af4e02f5c39e",
	clientSecret: "515a0f00287745c19c006ce63af4d7b6",
	redirectUri: "http://localhost:8080/redirect"
};
const scopes = ["user-read-private", "user-read-email", "playlist-read-private"];

const spotifyApi = new SpotifyWebApi(credentials);

const authorizeURL = spotifyApi.createAuthorizeURL(scopes);

const allowCrossDomain = function (req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Methods", "*");
	res.header("Access-Control-Allow-Headers", "*");
	next();
};

app.use(allowCrossDomain);

app.get("/get-auth-url", function (req, res) {
	res.send(authorizeURL);
});

app.get("/authorize", function (req, res) {
	spotifyApi.authorizationCodeGrant(req.query.code).then(function (data) {
		spotifyApi.setAccessToken(data["access_token"]);
		spotifyApi.setRefreshToken(data["refresh_token"]);
		res.send(jwt.sign(data.body, credentials.clientSecret))
	}).catch(function (err) {
		res.send(err)
	})
});

app.get("/validate-user", function (req, res) {
	let token = jwt.verify(req.originalUrl.split('?')[1], credentials.clientSecret)
	spotifyApi.setAccessToken(token["access_token"]);
	spotifyApi.setRefreshToken(token["refresh_token"]);
	spotifyApi.refreshAccessToken().then(function (data) {
		spotifyApi.setAccessToken(data.body['access_token'])
		res.send('ok')
	}).catch(function (err) {
		res.send(err)
	})
})

app.get("/api", function (req, res) {
	let
		method = req.query.method,
		query = req.query.query || null,
		options = req.query.options || null

	spotifyApi[method](query, JSON.parse(options)).then(function (data) {
		res.send(data.body)
	}).catch(function (err) {
		res.send(err)
	})
})

app.get("/get-audio-features", async function (req, res) {
	let playlists = [
		'1NTVwBdECVO40r5wiOErrq',
		'0kLOv8Jr3ZgyMPxzWIjJHY',
		'0ALMWejRHRzrdWRabpujpP'
	]

	const playlistDetails = []
	const trackIDs = []

	for (let i = 0; i < playlists.length; i++) {
		playlistDetails.push(new Promise((resolve, reject) => {
			spotifyApi.getPlaylistTracks(playlists[i]).then(function (data) {
				resolve(data.body.items)
			}).catch(function (err) { reject(err) })
		}))
	}

	Promise.all(playlistDetails).then((data) => {

		_.flatten(data).forEach(track => {
			trackIDs.IDs.push(track.track.id)
		})
		console.log(trackIDs)
	})
})




app.listen(3000, function () {
	console.log("Listening on port 3000");
});





