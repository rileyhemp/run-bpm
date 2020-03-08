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
				.get(`http://localhost:3000/authorize?${window.location.search.split("?")[1]}`)
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
}
.app-description {
	margin-top: 50%;
	max-width: 500px;
}
</style>
