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
const scopes = [
	"user-read-private",
	"user-read-email",
	"playlist-read-private",
	"playlist-modify-public",
	"playlist-modify-private"
];

const spotifyApi = new SpotifyWebApi(credentials);

const allowCrossDomain = function (req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Methods", "*");
	res.header("Access-Control-Allow-Headers", "*");
	next();
};

app.use(allowCrossDomain);

app.get("/get-auth-url", function (req, res) {
	let authURL = spotifyApi.createAuthorizeURL(scopes)
	res.send(authURL)
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

app.get("/get-user-data", function (req, res) {
	let userData
	let userPlaylists
	spotifyApi.getMe().then(data => {
		userData = data.body
	}).then(() => {
		spotifyApi.getUserPlaylists(userData.id).then(data => {
			userPlaylists = data.body
			res.send({
				userData: userData,
				userPlaylists: userPlaylists
			})
		})
	}).catch(err => {
		res.send(err)
	})
})


app.get('/initialize-create-page', (req, res) => {
	let playlists = [
		'1NTVwBdECVO40r5wiOErrq',
	]
	let trackIDs = []
	getAudioFeaturesFromSelection().then(data => res.send(data))
	getPlaylistDetails(playlists).then(details => {
		getAudioFeaturesFromSelection(req.query.userID, getTrackURIs(details), getTrackIDs(details)).then(data => {
			res.send(data)
		}).catch(err => console.log(err))
	}).catch(err => console.log(err))
})


function getAudioFeaturesFromSelection(userID, trackURIs, trackIDs) {
	let playlistName = new Date().getTime()
	return new Promise((resolve, reject) => {
		spotifyApi.createPlaylist(userID, playlistName).then(data => {
			spotifyApi.addTracksToPlaylist(data.body.id, trackURIs).then(data => {
				spotifyApi.getAudioFeaturesForTracks(trackIDs).then(data => {
					resolve(data)
				}).catch(err => reject(err))
			}).catch(err => reject(err))
		}).catch(err => reject(err))
	})
}

function getPlaylistDetails(playlists) {
	const playlistDetails = []

	return new Promise((resolve, reject) => {

		for (let i = 0; i < playlists.length; i++) {
			playlistDetails.push(new Promise((resolve, reject) => {
				spotifyApi.getPlaylistTracks(playlists[i]).then(function (data) {
					resolve(data.body.items)
				}).catch(err => reject(err))
			}))
		}

		Promise.all(playlistDetails).then(data => {
			resolve(_.flatten(data))
		}).catch(err => reject(err))
	})
}

function getTrackIDs(details) {
	const trackIDs = []
	details.forEach(track => {
		trackIDs.push(track.track.id)
	})
	return trackIDs
}

function getTrackURIs(details) {
	const trackURIs = []
	details.forEach(track => {
		trackURIs.push(track.track.uri)
	})
	return trackURIs
}


// app.get("/get-track-ids", function (req, res) {
// 	let playlists = [
// 		'1NTVwBdECVO40r5wiOErrq',
// 		'0kLOv8Jr3ZgyMPxzWIjJHY',
// 		'0ALMWejRHRzrdWRabpujpP'
// 	]

// 	const playlistDetails = []
// 	const trackIDs = []

// 	for (let i = 0; i < playlists.length; i++) {
// 		playlistDetails.push(new Promise((resolve, reject) => {
// 			spotifyApi.getPlaylistTracks(playlists[i]).then(function (data) {
// 				resolve(data.body.items)
// 			}).catch(function (err) { reject(err) })
// 		}))
// 	}

// 	Promise.all(playlistDetails).then((data) => {
// 		_.flatten(data).forEach(track => {
// 			trackIDs.push(track.track.id)
// 		})
// 		res.send(trackIDs)
// 	})
// })

// app.get('/create-playlist', function (req, res) {
// 	let playlistID = new Date().getTime()
// 	spotifyApi.createPlaylist(req.query.user, playlistID, { public: false }).then(data => {
// 		console.log(data)
// 	}).catch(err => {
// 		console.log(err)
// 	})
// 	res.send(req.query.tracks)
// })

// app.get('/get-audio-features', function (req, res) {
// 	res.send(req.query)
// })

app.listen(3000, function () {
	console.log("Listening on port 3000");
});





