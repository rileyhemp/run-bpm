const express = require("express");
const app = express();
const SpotifyWebApi = require("spotify-web-api-node");
const jwt = require("jsonwebtoken");
const _ = require("lodash")
const sqlite3 = require('sqlite3').verbose()

// open the database
// let db = new sqlite3.Database('./db/sample.db');

// let languages = ['c++', 'python', 'js']
// let placeholders = languages.map((language) =>
// 	'(?)').join(',')

// let sql = 'INSERT INTO langs(name) VALUES ' + placeholders


// db.run(sql, languages, function (err) {
// 	if (err) {
// 		return console.error(err.message)
// 	}
// 	console.log('Rows inserted' + this.changes)
// })

// let db = new sqlite3.Database('./db/sample.db');

// let data = ['habba', 'Ansi C'];

// let sql = `UPDATE langs
//             SET name = ?
//             WHERE name = ?`;

// db.run(sql, data, function (err) {
// 	if (err) {
// 		return console.error(err.message);
// 	}
// 	console.log(`Row(s) updated: ${this.changes}`);

// });


// let db = new sqlite3.Database('./db/sample.db', (err) => {
// 	if (err) {
// 		console.error(err.message);
// 	}
// });

// let id = 'habba';
// // delete a row based on id
// db.run(`DELETE FROM langs WHERE name=?`, id, function (err) {
// 	if (err) {
// 		return console.error(err.message);
// 	}
// 	console.log(`Row(s) deleted ${this.changes}`);
// });

// // close the database connection
// db.close((err) => {
// 	if (err) {
// 		return console.error(err.message);
// 	}
// });

function getSavedPlaylists(userID) {
	let db = new sqlite3.Database('./db/users.db')
	let selectPlaylists = `SELECT DISTINCT (user_playlists) FROM users WHERE user_id = ?`
	db.serialize(() => {
		db.all(selectPlaylists, [userID], (err, rows) => {
			if (err) {
				throw err;
			}
			if (rows.length) {
				return rows;
			} else {
				return 'no user exists'
			}
		});
	})
}

//Add user
// let sql = `INSERT INTO users(user_id, user_playlists) VALUES('abc123', 'mycoolplaylist');`
// db.run(sql, [], function (err) {
// 	if (err) {
// 		return console.log(err.message)
// 	}
// 	console.log(`A row has been inserted with the user id of ${this.lastID}`)
// })


// close the database connection



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





