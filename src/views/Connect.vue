<template>
	<v-container v-if="!this.redirect" class="fill-height d-flex text-center flex-column justify-center align-center px-10">
		<div class="hero-image"></div>
		<div class="home">
			<p class="subtitle-1 app-description">
				Create killer running playlists in seconds. Filter your own music by tempo, energy level, danceability and more.
			</p>

			<spotify-login source="/" />
			<guest-login />
			<v-dialog v-model="dialog" max-width="500">
				<template v-slot:activator="{ on }">
					<v-btn text v-on="on" width="230" @click="slide = 1" rounded class="px-6 mb-4">take a tour</v-btn>
				</template>
				<walkthrough />
			</v-dialog>
		</div>
	</v-container>
</template>

<script>
// @ is an alias to /src
import SpotifyLogin from "../components/SpotifyLogin.vue";
import GuestLogin from "../components/GuestLogin.vue";
import Walkthrough from "../components/Walkthrough.vue";

export default {
	name: "Connect",
	components: {
		"spotify-login": SpotifyLogin,
		"guest-login": GuestLogin,
		walkthrough: Walkthrough,
	},
	data() {
		return {
			dialog: false,
			redirect: false,
		};
	},
	mounted: function() {
		console.log(this.$root);
		if (window.location.search.length > 0) {
			//If redirect is true, the template doesn't render
			this.redirect = true;
			//Get access token and navigat to page designated as the login source on document.cookie
			this.$http
				.get(`http://localhost:3000/authorize?${window.location.search.split("?")[1]}`)
				.then((res) => {
					const credentials = {
						accessToken: res.data.body["access_token"],
						refreshToken: res.data.body["refresh_token"],
						expiresAt: new Date().getTime() + 3000000,
						isGuest: false,
					};
					localStorage.RunBPM = JSON.stringify(credentials);
					this.redirect = false;
					//Storing source of login in cookie
					this.$router.push(document.cookie || "/");
				})
				.catch((err) => console.log(err));
		}
	},
};
</script>

<style lang="scss">
.hero-image {
	background-image: url("../assets/runbpm-logo.png");
	background-size: contain;
	background-color: black;
	width: 100%;
	margin: auto;
	background-position-x: 50%;
	height: 90vh;
	max-height: 650px;
	display: flex;
	flex-direction: column;
	align-items: center;
	position: relative;
	background-position-y: 10%;
	position: absolute;
	top: 0;
}
.app-description {
	max-width: 500px;
	/* padding-top: 50%; */
}
.home {
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	position: absolute;
	bottom: 10%;
	@media screen and (min-height: 600px) {
		bottom: 25%;
	}
}

@media screen and (min-width: 768px) {
	.hero-image {
		background-image: url("../assets/runbpm-logo-desktop.png");
		flex-wrap: nowrap !important;
		background-size: 100vh;
	}
}
</style>

<style>
.theme--dark.v-application {
	background: black !important;
}
</style>
