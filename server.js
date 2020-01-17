const express = require("express");
const app = express();
const SpotifyWebApi = require("spotify-web-api-node");
const jwt = require("jsonwebtoken");

const credentials = {
	clientId: "dd71362980ad40bb9820af4e02f5c39e",
	clientSecret: "515a0f00287745c19c006ce63af4d7b6",
	redirectUri: "http://localhost:8080/redirect"
};
const scopes = ["user-read-private", "user-read-email"];

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
		registerUserForSession(data.body)
		res.send(jwt.sign(data.body, credentials.clientSecret))
	}).catch(function (err) {
		res.send(err)
	})
});

app.get("/validate-user", function (req, res) {
	let token = jwt.verify(req.originalUrl.split('?')[1], credentials.clientSecret)
	registerUserForSession(token)
	res.send('ok')
})

app.get("/api", function (req, res) {
	let
		method = req.query.method,
		query = req.query.query,
		options = req.query.options

	spotifyApi[method](query, JSON.parse(options)).then(function (data) {
		res.send(data.body)
	})
})






app.listen(3000, function () {
	console.log("Listening on port 3000");
});

function registerUserForSession(data) {
	spotifyApi.setAccessToken(data["access_token"]);
	spotifyApi.setRefreshToken(data["refresh_token"]);
};



