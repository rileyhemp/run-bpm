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
	"playlist-modify-private",
	"user-read-playback-state",
	"user-read-currently-playing",
	"user-modify-playback-state",
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
	spotifyApi.getMe().then(data => {
		let userData = data.body
		spotifyApi.getUserPlaylists(userData.id).then(data => {
			let userPlaylists = data.body
			spotifyApi.getMyDevices().then(data => {
				let userDevices = data.body
				res.send({
					userData: userData,
					userPlaylists: userPlaylists,
					userDevices: userDevices
				})
			}).catch(err => res.send(err.message))
		}).catch(err => res.send(err.message))
	}).catch(err => res.send(err.message))
})

// app.get("/get-user-data", function (req, res) {
// 	let userData
// 	let userPlaylists
// 	spotifyApi.getMe().then(data => {
// 		userData = data.body
// 	}).then(() => {
// 		spotifyApi.getUserPlaylists(userData.id).then(data => {
// 			userPlaylists = data.body
// 			res.send({
// 				userData: userData,
// 				userPlaylists: userPlaylists
// 			})
// 		})
// 	}).catch(err => {
// 		res.send(err)
// 	})
// })

app.get("/playlists", function (req, res) {
	const db = new UserDB(DatabasePath)
	let userID = req.query.id
	//Fetch user playlists if they exist
	db.getCreatedPlaylists(userID).then(response => {
		res.send(response)
	}).catch(err => res.send(err))
})

app.post('/playlists', (req, res) => {
	let request = req.body.data
	createPlaylist(request.userID, request.name, request.trackIDs, request.metadata).then(response => {
		res.status(201).send(response)
	}).catch(err => res.send("Something went wrong. Error: " + err))
})

app.delete('/playlists', (req, res) => {
	const db = new UserDB(DatabasePath)
	//Unfollow the playlist on spotify
	spotifyApi.unfollowPlaylist(req.query.id).then(() => {
		//Delete the playlist from the db
		db.deletePlaylist(req.query.id).then(response => {
			res.status(204).send()
		}).catch(err => res.send(err))
	}).catch(err => res.send(err))
})

app.post('/analyze-tracks', (req, res) => {
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
		Promise.all(trackDetails).then(response => {
			res.send(_.flatten(response)) //used to have 'deets ?' taking out, see if it breaks anything. 
		}).catch(err => res.send(err))
	})
})

app.get('/analyze-tracks', (req, res) => {
	spotifyApi.getAudioFeaturesForTrack(req.query.id).then(response => {
		res.send(response.body)
	}).catch(err => res.send(err))
})

app.put('/player', (req, res) => {
	const action = req.query.action
	const options = req.body.data
	switch (action) {
		case 'play':
			spotifyApi.play(options)
				.then(response => res.status(response.statusCode).send())
				.catch(error => res.status(error.statusCode).send())
			break;
		case 'pause':
			spotifyApi.pause(options)
				.then(response => res.status(response.statusCode).send())
				.catch(error => res.status(error.statusCode).send())
			break;
		case 'next':
			spotifyApi.skipToNext()
				.then(response => res.status(response.statusCode).send())
				.catch(error => res.status(error.statusCode).send())
			break;
		case 'previous':
			spotifyApi.skipToPrevious()
				.then(response => res.status(response.statusCode).send())
				.catch(error => res.status(error.statusCode).send())
			break;
	}

})

app.get('/player', (req, res) => {
	const query = req.query.q
	spotifyApi.getMyCurrentPlayingTrack().then(response => {
		res.send(response.body)
	}).catch(err => {
		res.send(err)
	})
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






