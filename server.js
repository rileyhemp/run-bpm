const express = require("express");
const app = express();
const SpotifyWebApi = require("spotify-web-api-node");
const jwt = require("jsonwebtoken");
const _ = require("lodash")
const sqlite3 = require('sqlite3').verbose()

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
// let db = new sqlite3.Database('./db/users.db')
// let sql = `CREATE TABLE users (
//     user_id TEXT NOT NULL,
//     user_playlists TEXT NOT NULL
// );`

// db.run(sql)

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


app.post('/analyze-selected', (req, res) => {
	getPlaylistDetails(req.body.data.playlists).then(details => {
		const trackIDs = _.chunk(getIDsFromDetails(details), 100)
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
	createPlaylist(request.user, request.name, request.tracks).then(response => {
		res.send(response)
	}).catch(err => res.send(err))
})

app.get("/get-saved-playlists", function (req, res) {
	let userID = req.query.id
	getSavedPlaylists(userID).then((response => {
		console.log(response)
		res.send(response)
	}))
})

app.post("/save-playlists", (req, res) => {
	let user = req.body.data.user
	let playlists = req.body.data.playlists
	console.log(playlists)
	console.log(user)
	if (getSavedPlaylists() == false) {
		console.log('I should do this')
		createUser(user, playlists).then(response => {
			res.send(response)
		}).catch(err => res.send(err))
	} else {
		console.log('I should do this')
		updatePlaylists(user, playlists).then(response => {
			res.send(response)
		}).catch(err => res.send(err))
	}
})

//SQLite functions

function getSavedPlaylists(userID) {
	let db = new sqlite3.Database('./db/users.db')
	let sql = `SELECT DISTINCT (user_playlists) FROM users WHERE user_id = ?`
	return new Promise((resolve, reject) => {
		db.all(sql, [userID], (err, rows) => {
			if (err) {
				reject(err);
			}
			if (rows.length) {
				resolve(rows);
			} else {
				resolve(false)
			}
		});
		db.close()
	})
}

function createUser(userID, userPlaylists) {
	let db = new sqlite3.Database('./db/users.db')
	let sql = `INSERT INTO users(user_id, user_playlists) VALUES(${userID}, ${userPlaylists});`
	return new Promise((resolve, reject) => {
		db.run(sql, [], function (err) {
			if (err) {
				reject(err.message)
			} else {
				resolve('Done')
			}
		})
		db.close()
	})
}

function updatePlaylists(userID, userPlaylists) {
	let db = new sqlite3.Database('./db/users.db')
	let sql = `UPDATE users
			SET user_playlists = ${userPlaylists}
			WHERE user_id = ${userID}`;
	return new Promise((resolve, reject) => {
		db.run(sql, [], function (err) {
			if (err) {
				reject(err.message)
			} else {
				resolve('Done')
			}
		})
		db.close()
	})
}

function createPlaylist(user, playlistName, tracks) {
	return new Promise((resolve, reject) => {
		spotifyApi.createPlaylist(user, playlistName).then(response => {
			const playlistID = response.body.id
			spotifyApi.addTracksToPlaylist(playlistID, getURIsFromIDs(tracks)).then(response => {
				resolve({ playlistID: playlistID })
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

function getIDsFromDetails(details) {
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






