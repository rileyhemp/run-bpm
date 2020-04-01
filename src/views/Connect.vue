<template>
	<v-container class="fill-height d-flex text-center flex-column justify-center align-center px-10 home-page">
		<p class="subtitle-1 app-description">
			Create killer running playlists in seconds. Filter your music by tempo, energy level, danceability and more.
		</p>
		<spotify-login />
		<p class="caption">Requires Premium</p>
	</v-container>
</template>

<script>
// @ is an alias to /src
import SpotifyLogin from "../components/SpotifyLogin.vue";

export default {
	name: "Connect",
	components: {
		"spotify-login": SpotifyLogin
	},
	mounted: function() {
		if (window.location.search.length > 0) {
			this.$http
				.get(`https://d2ob92q3jfbd5e.cloudfront.net/authorize?${window.location.search.split("?")[1]}`)
				.then(res => {
					const credentials = {
						accessToken: res.data.body["access_token"],
						refreshToken: res.data.body["refresh_token"],
						expiresAt: new Date().getTime() + 3000000
					};
					localStorage.RunBPM = JSON.stringify(credentials);
					this.$router.push("/");
				})
				.catch(err => console.log(err));
		}
	}
};
</script>

<style>
.home-page {
	background-image: url("../assets/runbpm-logo.png");
	background-size: contain;
	background-color: black;
	background-position-y: 30%;
	width: 100%;
	margin: auto;
	background-position-x: 52%;
}
.app-description {
	max-width: 500px;
}
@media screen and (min-width: 768px) {
	.home-page {
		background-image: url("../assets/runbpm-logo-desktop.png");
		background-position-y: 40%;
		background-size: 800px;
		flex-wrap: nowrap !important;
	}
	.app-description {
		padding-top: 250px;
	}
}
</style>

<style>
.theme--dark.v-application {
	background: black !important;
}
</style>
