const express = require("express");
const app = express();
const SpotifyWebApi = require("spotify-web-api-node");
const jwt = require("jsonwebtoken");
const _ = require("lodash");
const UserDB = require("./sql");
const axios = require("axios");
const DatabasePath = __dirname + "/db/new.db";

const credentials = {
	clientId: "dd71362980ad40bb9820af4e02f5c39e",
	clientSecret: "515a0f00287745c19c006ce63af4d7b6",
	redirectUri: "http://localhost:8080/connect"
};

const scopes = [
	"user-read-private",
	"user-read-email",
	"playlist-read-private",
	"playlist-modify-public",
	"playlist-modify-private",
	"user-read-playback-state",
	"user-read-currently-playing",
	"user-modify-playback-state"
];

const spotifyApi = new SpotifyWebApi(credentials);

const allowCrossDomain = function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Methods", "*");
	res.header("Access-Control-Allow-Headers", "*");
	next();
};

app.use(allowCrossDomain);
app.use(express.json());

//Generates an authorization URL on Spotify which redirects back to the redirect URI
//Returns an authorization code
app.get("/get-auth-url", function(req, res) {
	let authURL = spotifyApi.createAuthorizeURL(scopes);
	res.send(authURL);
});

//Uses the authorization code to get access and refresh tokens
app.get("/authorize", function(req, res) {
	spotifyApi
		.authorizationCodeGrant(req.query.code)
		.then(function(data) {
			res.send(data);
		})
		.catch(function(err) {
			res.status(401).send(error);
		});
});

//Helper functions to get and set access tokens for each api call.
function accessToken(user) {
	return new Promise((resolve, reject) => {
		user = JSON.parse(user);
		const api = new SpotifyWebApi(credentials);
		//Check if token is expired
		if (user.expiresAt - new Date().getTime() > 0) {
			resolve(user.accessToken);
		} else {
			//token is expired
			api.setAccessToken(user.accessToken);
			api.setRefreshToken(user.refreshToken);
			api.refreshAccessToken()
				.then(data => {
					resolve(data.body["access_token"]);
				})
				.catch(err => reject("Could not refresh access token", err));
		}
	});
}
function spotifyApiWithToken(token) {
	const api = new SpotifyWebApi(credentials);
	api.setAccessToken(token);
	return api;
}

//Get user profile information, playlists, and connected devices.
//This endpoint also validates the access token.
app.get("/get-user-data", async function(req, res) {
	const token = await accessToken(req.query.credentials);
	const api = spotifyApiWithToken(token);
	//Get basic account information
	api.getMe()
		.then(data => {
			let userData = data.body;
			//Use account information to get playlists
			api.getUserPlaylists(userData.id)
				.then(data => {
					let userPlaylists = data.body;
					//Get a list of active devices
					api.getMyDevices()
						.then(data => {
							let userDevices = data.body;
							//Return data to front end, including current access token
							res.send({
								userData: userData,
								userPlaylists: userPlaylists,
								userDevices: userDevices,
								userCredentials: {
									token: token,
									//Access tokens technically expire after one hour, but we'll request a new one early just to be safe.
									expiresAt: new Date().getTime() + 3000000
								}
							});
						})
						.catch(err => res.status(err.statusCode).send(err));
				})
				.catch(err => res.status(err.statusCode).send(err));
		})
		.catch(async err => {
			//If error, force reset of access token
			let credentials = JSON.parse(req.query.credentials);
			credentials.expiresAt = 0;
			let newToken = await accessToken(JSON.stringify(credentials));
			//Return new access token
			res.status(err.statusCode).send(newToken);
		});
});

//Get playlists user created with Run BPM
app.get("/playlists", function(req, res) {
	const db = new UserDB(DatabasePath);
	let userID = req.query.id;
	db.getCreatedPlaylists(userID)
		.then(response => {
			res.send(response);
		})
		.catch(err => res.send(err));
});

//Add a new playlist to Run BPM's database
app.post("/playlists", async (req, res) => {
	const token = await accessToken(req.body.data.credentials);
	const api = spotifyApiWithToken(token);
	let request = req.body.data;
	createPlaylist(request.userID, request.name, request.trackIDs, request.metadata, api, request.image)
		.then(response => {
			res.status(201).send(response);
		})
		.catch(err => res.send("Something went wrong. Error: " + err));
});

//Delete a playlist
app.delete("/playlists", async (req, res) => {
	const token = await accessToken(req.query.credentials);
	const api = spotifyApiWithToken(token);
	const db = new UserDB(DatabasePath);
	//Unfollow the playlist on spotify
	api.unfollowPlaylist(req.query.id)
		.then(() => {
			//Delete the playlist from the db
			db.deletePlaylist(req.query.id)
				.then(response => {
					res.status(204).send();
				})
				.catch(err => res.send(err));
		})
		.catch(err => res.send(err));
});

//Get audio features for many tracks
app.post("/analyze-tracks", async (req, res) => {
	const token = await accessToken(req.body.data.credentials);
	const api = spotifyApiWithToken(token);
	getPlaylistTracks(req.body.data.playlists, api)
		.then(response => {
			const playlistDetails = response;
			const trackDetails = [];
			const trackIDs = _.chunk(getIDsFromTracks(response), 100);
			for (let i = 0; i < trackIDs.length; i++) {
				trackDetails.push(
					new Promise((resolve, reject) => {
						api.getAudioFeaturesForTracks(trackIDs[i])
							.then(data => {
								resolve(data.body.audio_features);
							})
							.catch(err => reject(err));
					})
				);
			}
			Promise.all(trackDetails)
				.then(response => {
					res.send({
						playlistDetails: playlistDetails,
						audioFeatures: _.flatten(response)
					}); //used to have 'deets ?' taking out, see if it breaks anything.
				})
				.catch(err => res.send(err));
		})
		.catch(err => res.send(err));
});

//Get audio features for indevidual tracks
app.get("/analyze-tracks", async (req, res) => {
	const token = await accessToken(req.query.credentials);
	const api = spotifyApiWithToken(token);
	api.getAudioFeaturesForTrack(req.query.id)
		.then(response => {
			res.send(response.body);
		})
		.catch(err => res.send(err));
});

//Control playback
app.put("/player", async (req, res) => {
	const token = await accessToken(req.query.credentials);
	const api = spotifyApiWithToken(token);
	const action = req.query.action;
	const options = req.body.data;
	switch (action) {
		case "play":
			api.play(options)
				.then(response => res.status(response.statusCode).send())
				.catch(error => res.status(error.statusCode).send(error));
			break;
		case "pause":
			api.pause(options)
				.then(response => res.status(response.statusCode).send())
				.catch(error => res.status(error.statusCode).send(error));
			break;
		case "next":
			api.skipToNext()
				.then(response => res.status(response.statusCode).send())
				.catch(error => res.status(error.statusCode).send(error));
			break;
		case "previous":
			api.skipToPrevious()
				.then(response => res.status(response.statusCode).send())
				.catch(error => res.status(error.statusCode).send(error));
			break;
	}
});

//Get the currently playing track
app.get("/player", async (req, res) => {
	const token = await accessToken(req.query.credentials);
	const api = spotifyApiWithToken(token);
	const query = req.query.q;
	api.getMyCurrentPlayingTrack()
		.then(response => {
			res.send(response.body);
		})
		.catch(err => {
			res.send(err);
		});
});

function createPlaylist(userID, playlistName, trackIDs, metadata, api, image) {
	return new Promise((resolve, reject) => {
		//Create the playlist
		api.createPlaylist(userID, playlistName)
			.then(response => {
				//Add tracks to the playlist
				const playlistID = response.body.id;
				api.addTracksToPlaylist(playlistID, getURIsFromIDs(trackIDs))
					.then(response => {
						//Save the playlist to apps database
						const db = new UserDB(DatabasePath);
						db.savePlaylist(playlistID, userID, trackIDs, metadata)
							.then(response => {
								if (image) {
									console.log("uploading image");
									console.log(typeof image.split("base64,")[1]);
									console.log(typeof playlistID);
									uploadCoverImage(playlistID, image.split("base64,")[1])
										.then(res => {
											console.log("upload successful", res);
											resolve();
										})
										.catch(err => {
											console.log(err);
											reject(err);
										});
								} else resolve();
							})
							.catch(err => reject(err.message));
					})
					.catch(err => reject(err.message));
			})
			.catch(err => reject(err.message));
	});
}

function getPlaylistTracks(playlists, api) {
	const playlistDetails = [];
	return new Promise((resolve, reject) => {
		for (let i = 0; i < playlists.length; i++) {
			playlistDetails.push(
				new Promise((resolve, reject) => {
					api.getPlaylistTracks(playlists[i])
						.then(function(data) {
							resolve(data.body.items);
						})
						.catch(err => reject(err));
				})
			);
		}
		Promise.all(playlistDetails)
			.then(data => {
				resolve(_.flatten(data));
			})
			.catch(err => reject(err));
	});
}

function getIDsFromTracks(details) {
	const trackIDs = [];
	details.forEach(track => {
		trackIDs.push(track.track.id);
	});
	return trackIDs;
}

function getURIsFromIDs(IDs) {
	const trackURIs = [];
	IDs.forEach(ID => {
		trackURIs.push("spotify:track:" + ID);
	});
	return trackURIs;
}

app.listen(3000, function() {
	console.log("Listening on port 3000");
});
