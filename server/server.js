const express = require("express");
const app = express();
const SpotifyWebApi = require("spotify-web-api-node");
const jwt = require("jsonwebtoken");
const _ = require("lodash")
const UserDB = require('./sql')
const DatabasePath = './server/db/new.db'

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
app.use(express.json())

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

app.get("/get-saved-playlists", function (req, res) {
	const db = new UserDB(DatabasePath)
	let userID = req.query.id
	//Fetch user playlists if they exist
	db.getSavedPlaylists(userID).then(response => {
		res.send(response)
	}).catch(err => res.send(err))
})

app.post('/analyze-selected', (req, res) => {
	getPlaylistTracks(req.body.data.playlists).then(details => {
		const trackIDs = _.chunk(getIDsFromTracks(details), 100)
		const trackDetails = []
		for (let i = 0; i < trackIDs.length; i++) {
			trackDetails.push(new Promise((resolve, reject) => {
				spotifyApi.getAudioFeaturesForTracks(trackIDs[i]).then(data => {
					resolve(data.body.audio_features)
				}).catch(err => reject(err))
			}))
		}
		Promise.all(trackDetails).then(data => {
			res.send(_.flatten(data), deets)
		}).catch(err => res.send(err))
	})
})

app.post('/create-playlist', (req, res) => {
	let request = req.body.data
	createPlaylist(request.userID, request.name, request.trackIDs, request.metadata).then(response => {
		res.statusCode = 201; res.send(response)
	}).catch(err => res.send("Something went wrong. Error: " + err))
})

function createPlaylist(userID, playlistName, trackIDs, metadata) {
	return new Promise((resolve, reject) => {
		//Create the playlist
		spotifyApi.createPlaylist(userID, playlistName).then(response => {
			//Add tracks to the playlist
			const playlistID = response.body.id
			spotifyApi.addTracksToPlaylist(playlistID, getURIsFromIDs(trackIDs)).then(response => {
				//Save the playlist to apps database
				const db = new UserDB(DatabasePath)
				db.savePlaylist(playlistID, userID, trackIDs, metadata).then(response => {
					resolve("Playlist added")
				}).catch(err => reject(err.message))
			}).catch(err => reject(err.message))
		}).catch(err => reject(err.message))
	})
}

function getPlaylistTracks(playlists) {
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

function getIDsFromTracks(details) {
	const trackIDs = []
	details.forEach(track => {
		trackIDs.push(track.track.id)
	})
	return trackIDs
}

function getURIsFromIDs(IDs) {
	const trackURIs = []
	IDs.forEach(ID => {
		trackURIs.push('spotify:track:' + ID)
	})
	return trackURIs
}


app.listen(3000, function () {
	console.log("Listening on port 3000");
});






